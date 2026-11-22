// Integration / layout QA against the live site (or BASE env)
// Usage: node tools/qa.js   (needs playwright installed)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE || 'https://hsu-pei-chun.github.io/canceraway-redesign/';
const OUT = process.env.OUT || path.join(__dirname, 'qa-out');
fs.mkdirSync(OUT, { recursive: true });
const pages = [];
(function walk(dir, rel) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'assets') walk(p, rel + f + '/'); }
    else if (f.endsWith('.html')) pages.push(rel + f);
  }
})(path.join(__dirname, '..', 'docs'), '');

// [name, width, height, colour scheme, Chrome default font size (px)]
// 16 = Chrome「中」(default), 20 =「大」, 24 =「特大」
const VIEWPORTS = [
  ['desktop', 1366, 900], ['tablet', 768, 1024], ['mobile', 390, 844], ['small', 360, 740],
  ['desktop-dark', 1366, 900, 'dark'], ['mobile-dark', 390, 844, 'dark'],
  ['desktop-font20', 1366, 900, 'light', 20], ['laptop-font20', 1180, 800, 'light', 20],
  ['mobile-font20', 393, 852, 'light', 20], ['mobile-font24', 393, 852, 'light', 24],
];
const os = require('os');
// A real Chrome profile whose 「字型大小」 preference is set, like changing it in chrome://settings.
// Runs in its own headless browser, so it never touches the user's own Chrome window.
async function makeContext(browser, { width, height, scheme = 'light', font = 16 }) {
  const opts = { viewport: { width, height }, isMobile: width < 600, hasTouch: width < 600, colorScheme: scheme };
  if (font === 16) return browser.newContext(opts);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-font-'));
  fs.mkdirSync(path.join(dir, 'Default'));
  fs.writeFileSync(path.join(dir, 'Default', 'Preferences'), JSON.stringify({ webkit: { webprefs: { default_font_size: font } } }));
  const ctx = await chromium.launchPersistentContext(dir, { channel: 'chromium', ...opts });
  const check = await ctx.newPage();
  await check.setContent('<p>x</p>');
  const got = await check.evaluate(() => getComputedStyle(document.documentElement).fontSize);
  await check.close();
  if (got !== font + 'px') throw new Error(`字型大小設定沒有生效：要 ${font}px，實際 ${got}`);
  return ctx;
}

// runs in page: find layout problems
const INSPECT = () => {
  const W = document.documentElement.clientWidth;
  const issues = [];
  const name = el => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    if (el.className && typeof el.className === 'string') s += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    const txt = (el.innerText || '').trim().slice(0, 30).replace(/\s+/g, ' ');
    return s + (txt ? ` 「${txt}」` : '');
  };
  if (document.documentElement.scrollWidth > W + 1) issues.push({ type: 'page-hscroll', detail: `頁面寬 ${document.documentElement.scrollWidth}px > 螢幕 ${W}px` });
  const inScroller = el => { for (let p = el.parentElement; p; p = p.parentElement) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll') return true; } return false; };
  const all = [...document.querySelectorAll('body *')].filter(el => el.offsetParent !== null || getComputedStyle(el).position === 'fixed');
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    // sticks out past the right/left edge of the viewport
    if ((r.right > W + 1 || r.left < -1) && !inScroller(el) && cs.position !== 'fixed' && !el.classList.contains('skip') && !el.closest('.sr-only'))
      issues.push({ type: 'overflow-x', detail: `${name(el)} 超出螢幕 (left ${Math.round(r.left)}, right ${Math.round(r.right)})` });
    // text clipped inside its own box
    // visually-hidden screen-reader text (1×1px, clipped) is intentional, not clipped content
    const srOnly = r.width <= 1 && r.height <= 1;
    if (!srOnly && (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 2 && el.innerText && !el.closest('.sr-only') && !el.classList.contains('band579'))
      issues.push({ type: 'clipped', detail: `${name(el)} 文字被裁切 (${el.scrollWidth} > ${el.clientWidth})` });
  }
  // overlapping interactive elements (buttons/links on top of each other)
  const hits = [...document.querySelectorAll('header a, header button, .chip, .btn, .toc a, .quick a')].filter(e => e.offsetParent).map(e => [e, e.getBoundingClientRect()]);
  for (let i = 0; i < hits.length; i++) for (let j = i + 1; j < hits.length; j++) {
    const [a, ra] = hits[i], [b, rb] = hits[j];
    if (a.contains(b) || b.contains(a)) continue;
    const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
    if (ox > 4 && oy > 4) issues.push({ type: 'overlap', detail: `${name(a)} 與 ${name(b)} 重疊` });
  }
  // tap targets too small on touch widths
  if (W < 600) for (const el of document.querySelectorAll('header a, header button, .chip, .btn, nav.toc a')) {
    if (!el.offsetParent) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 32) issues.push({ type: 'tap-target', detail: `${name(el)} 點擊區太小 (高 ${Math.round(r.height)}px)` });
  }
  // text contrast (WCAG: 4.5 normal text, 3 for large/bold text)
  const parse = s => { const m = (s || '').match(/[\d.]+/g); if (!m) return null; return [+m[0], +m[1], +m[2], m[3] === undefined ? 1 : +m[3]]; };
  const lum = c => { const [r, g, b] = c.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
  const bgOf = el => { const layers = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } } let base = [255, 255, 255]; const rootBg = parse(getComputedStyle(document.body).backgroundColor); if (rootBg) base = rootBg.slice(0, 3); for (const c of layers.reverse()) base = base.map((v, i) => c[i] * c[3] + v * (1 - c[3])); return base; };
  const seenTxt = new Set();
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,a,span,li,b,strong,small,time,button,td,th,label,output')) {
    if (!el.offsetParent || el.closest('.sr-only')) continue;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own) continue;
    const cs = getComputedStyle(el); const fg = parse(cs.color); if (!fg) continue;
    const bg = bgOf(el); const fgc = fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3]));
    const L1 = lum(fgc), L2 = lum(bg); const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
    const size = parseFloat(cs.fontSize), bold = +cs.fontWeight >= 600;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    if (ratio < need) { const k = el.tagName + el.className + cs.color; if (seenTxt.has(k)) continue; seenTxt.add(k); issues.push({ type: 'contrast', detail: `${name(el)} 對比 ${ratio.toFixed(2)}（需要 ${need}）` }); }
  }
  // short labels (buttons, menu items) squeezed onto several lines
  document.querySelectorAll('.site-header a, .site-header button, .btn, .chip, .toc a, .quick a, .brand-name b').forEach(el => {
    if (!el.offsetParent) return;
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
    const h = el.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const t = el.innerText.trim();
    if (t && t.length <= 12 && h > lh * 1.5) issues.push({ type: 'wrapped', detail: `${name(el)} 被擠成 ${Math.round(h / lh)} 行` });
  });
  // header: either full menu on one row, or logo + donate + menu button on one row
  const nav = document.getElementById('mainnav'), tog = document.querySelector('.menu-toggle'), bar = document.querySelector('.site-header .bar');
  if (nav && tog && bar) {
    const navShown = getComputedStyle(nav).display !== 'none', togShown = getComputedStyle(tog).display !== 'none';
    if (navShown && togShown && !nav.classList.contains('open')) issues.push({ type: 'header', detail: '完整選單和「選單」按鈕同時出現' });
    if (!navShown && !togShown) issues.push({ type: 'header', detail: '主選單和「選單」按鈕都看不到' });
    const row = [bar.querySelector('.brand'), bar.querySelector('.btn-donate'), togShown ? tog : nav].filter(Boolean).map(e => { const r = e.getBoundingClientRect(); return r.top + r.height / 2; });
    if (Math.max(...row) - Math.min(...row) > 8) issues.push({ type: 'header', detail: togShown ? 'Logo、捐款、選單按鈕沒有在同一排' : '完整選單折成兩排' });
  }
  // fonts
  const fontsOk = document.fonts.check('16px "Noto Sans TC"');
  if (!fontsOk) issues.push({ type: 'font', detail: 'Noto Sans TC 沒載入' });
  const links = [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => h.startsWith(location.origin));
  return { issues, links };
};

(async () => {
  const browser = await chromium.launch();
  const report = { base: BASE, pages: pages.length, results: [], links: {}, interactions: [] };
  const allLinks = new Set();
  for (const [vp, w, h, scheme, font] of VIEWPORTS) {
    const ctx = await makeContext(browser, { width: w, height: h, scheme, font });
    let i = 0;
    const queue = [...pages];
    await Promise.all([0, 1, 2, 3, 4, 5].map(async () => {
      while (queue.length) {
        const rel = queue.shift();
        const p = await ctx.newPage();
        const errors = [];
        p.on('pageerror', e => errors.push('JS 錯誤: ' + e.message));
        p.on('console', m => { if (m.type() === 'error') errors.push('Console: ' + m.text().slice(0, 160)); });
        p.on('requestfailed', r => errors.push('載入失敗: ' + r.url()));
        const resp = await p.goto(BASE + rel, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => null);
        await p.evaluate(() => document.fonts.ready);
        const r = await p.evaluate(INSPECT);
        r.links.forEach(l => allLinks.add(l.split('#')[0]));
        const issues = [...r.issues, ...errors.map(e => ({ type: 'error', detail: e }))];
        if (!resp || resp.status() !== 200) issues.push({ type: 'http', detail: `狀態碼 ${resp && resp.status()}` });
        if (issues.length) {
          const shot = `${vp}-${rel.replace(/[\/.]/g, '_')}.png`;
          await p.screenshot({ path: path.join(OUT, shot), fullPage: true }).catch(() => p.screenshot({ path: path.join(OUT, shot) })).catch(() => {});
          report.results.push({ vp, page: rel, issues, shot });
        }
        await p.close();
        i++;
      }
    }));
    console.log(`${vp} (${w}px): ${pages.length} 頁檢查完，${report.results.filter(x => x.vp === vp).length} 頁有問題`);
    await ctx.close();
  }

  // width sweep: every 20px from 320 to 1600, at four Chrome font-size settings.
  // Catches layouts that only break between the fixed viewports above, and
  // short labels (buttons, menu items) squeezed onto several lines.
  const SWEEP_PAGES = ['index.html', 'cancer/lung.html', 'give/index.html', 'news/5274.html', 'prevention/screening.html', 'sitemap.html'];
  const FONT_SIZES = [16, 18, 20, 24];
  report.sweep = [];
  for (const fsz of FONT_SIZES) {
  const sctx = await makeContext(browser, { width: 1366, height: 900, font: fsz });
  for (const rel of SWEEP_PAGES) {
    const p = await sctx.newPage();
    await p.goto(BASE + rel, { waitUntil: 'networkidle', timeout: 60000 });
    for (let w = 320; w <= 1600; w += 20) {
      await p.setViewportSize({ width: w, height: 900 });
      // measure what the reader sees: after the browser has run resize handlers and painted
      await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      const r = await p.evaluate(INSPECT);
      const probs = r.issues.filter(i => ['page-hscroll', 'overflow-x', 'wrapped', 'header', 'clipped', 'overlap'].includes(i.type)).map(i => i.detail);
      probs.forEach(d => report.sweep.push({ page: rel, font: fsz, width: w, detail: d }));
    }
    await p.close();
  }
  await sctx.close();
  }
  // group consecutive widths for a readable summary
  const grouped = {};
  report.sweep.forEach(s => { const k = `${s.page} 字型${s.font}px：${s.detail}`; (grouped[k] = grouped[k] || []).push(s.width); });
  console.log(`寬度掃描（${SWEEP_PAGES.length} 頁 × ${FONT_SIZES.length} 種字型 × 65 種寬度）：${Object.keys(grouped).length ? '' : '0 個問題'}`);
  Object.entries(grouped).forEach(([k, ws]) => console.log(`  ✗ ${k}（寬 ${Math.min(...ws)}–${Math.max(...ws)}px）`));

  // internal link check
  const rq = await browser.newContext();
  for (const l of allLinks) {
    const res = await rq.request.get(l).catch(() => null);
    if (!res || res.status() !== 200) report.links[l] = res ? res.status() : 'fail';
  }
  await rq.close();
  console.log(`站內連結 ${allLinks.size} 個，壞掉 ${Object.keys(report.links).length} 個`);

  // interactions
  const it = async (label, fn) => { try { await fn(); report.interactions.push([label, 'PASS']); } catch (e) { report.interactions.push([label, 'FAIL: ' + e.message.split('\n')[0]]); } };
  const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const m = await ctxM.newPage();
  await m.goto(BASE, { waitUntil: 'networkidle' });
  await it('手機：選單按鈕打開主選單', async () => {
    if (await m.isVisible('#mainnav')) throw new Error('選單一開始就是打開的');
    await m.tap('.menu-toggle');
    if (!(await m.isVisible('#mainnav'))) throw new Error('點了沒打開');
    const r = await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
    if (!r) throw new Error('打開後畫面變寬');
    await m.screenshot({ path: path.join(OUT, 'interaction-mobile-menu.png') });
    await m.tap('.menu-toggle');
    if (await m.isVisible('#mainnav')) throw new Error('再點一次沒關起來');
  });
  // count what is actually visible on screen, not what the script marked hidden
  const visibleCards = pg => pg.$$eval('#cancer-grid .cancer', els => els.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }).map(e => ({ name: e.querySelector('b').textContent, sys: e.dataset.sys, top: e.dataset.top })));
  for (const [label, url] of [['首頁', ''], ['認識癌症頁', 'cancer/index.html']]) {
    for (const [vpName, vp] of [['手機', { width: 390, height: 844 }], ['電腦', { width: 1366, height: 900 }]]) {
      await it(`${vpName}・${label}：每個部位篩選按鈕都只顯示該部位的癌症`, async () => {
        const c = await browser.newContext({ viewport: vp, isMobile: vp.width < 600, hasTouch: vp.width < 600 });
        const pg = await c.newPage();
        await pg.goto(BASE + url, { waitUntil: 'networkidle' });
        const all = await visibleCards(pg);
        if (all.length !== 30) throw new Error(`一開始顯示 ${all.length} 種，應該是 30`);
        const chips = await pg.$$eval('.chip', cs => cs.map(c => ({ f: c.dataset.f, t: c.textContent.trim() })));
        const bad = [];
        for (const ch of chips) {
          await pg.click(`.chip[data-f="${ch.f}"]`);
          await pg.waitForTimeout(150);
          const vis = await visibleCards(pg);
          const expect = ch.f === 'all' ? all : all.filter(x => ch.f === 'top' ? x.top === '1' : x.sys === ch.f);
          const wrong = vis.filter(x => !expect.some(e => e.name === x.name));
          if (vis.length !== expect.length || wrong.length) bad.push(`「${ch.t}」顯示 ${vis.length} 種（應為 ${expect.length}）${wrong.length ? '，多出：' + wrong.slice(0, 3).map(w => w.name).join('、') : ''}`);
          const pressed = await pg.getAttribute(`.chip[data-f="${ch.f}"]`, 'aria-pressed');
          if (pressed !== 'true') bad.push(`「${ch.t}」點了沒有變成選取狀態`);
        }
        await pg.click('.chip[data-f="skin"]');
        await pg.screenshot({ path: path.join(OUT, `interaction-filter-${url ? 'cancer' : 'home'}-${vp.width}.png`) });
        await c.close();
        if (bad.length) throw new Error(bad.join('；'));
      });
    }
  }
  await it('手機：篩選輸入「肝」只看得到肝癌', async () => {
    await m.click('.chip[data-f="all"]');
    await m.fill('.finder-q', '肝');
    const names = (await visibleCards(m)).map(x => x.name);
    if (names.length !== 1 || names[0] !== '肝癌') throw new Error('畫面上看到：' + names.join(','));
    await m.fill('.finder-q', 'zzzz');
    if ((await visibleCards(m)).length) throw new Error('沒結果時還看得到卡片');
    if (!(await m.isVisible('#finder-empty'))) throw new Error('沒結果時沒顯示提示');
    await m.fill('.finder-q', '');
  });
  await it('手機：首頁搜尋「營養」有結果', async () => {
    await m.fill('#q', '營養');
    await Promise.all([m.waitForNavigation(), m.press('#q', 'Enter')]);
    await m.waitForSelector('#search-results a', { timeout: 8000 });
    const n = await m.$$eval('#search-results a', a => a.length);
    await m.screenshot({ path: path.join(OUT, 'interaction-search.png'), fullPage: false });
    if (!n) throw new Error('沒有結果');
  });
  await it('電子報：空白送出會提示錯誤、填好會顯示訊息', async () => {
    await m.goto(BASE, { waitUntil: 'networkidle' });
    await m.click('#subscribe button');
    const t1 = await m.textContent('#sub-msg');
    if (!t1.includes('正確')) throw new Error('空白送出沒有錯誤提示');
    await m.fill('#sub-email', 'test@example.com');
    await m.click('#subscribe button');
    const t2 = await m.textContent('#sub-msg');
    if (!t2.includes('設計提案')) throw new Error('填好後訊息不對：' + t2);
    if (!m.url().startsWith(BASE)) throw new Error('表單跳頁了');
  });
  await it('癌症內頁：段落按鈕可跳到「治療方式」', async () => {
    await m.goto(BASE + 'cancer/lung.html', { waitUntil: 'networkidle' });
    const href = await m.$$eval('.toc a', as => as.find(a => a.textContent.includes('治療')).getAttribute('href'));
    await m.tap(`.toc a[href="${href}"]`);
    await m.waitForTimeout(800);
    const top = await m.$eval(href, el => el.getBoundingClientRect().top);
    if (top < 0 || top > 300) throw new Error(`跳完後標題位置 ${Math.round(top)}px`);
  });
  await it('深色模式：首頁沒有看不見的文字', async () => {
    const c = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
    const d = await c.newPage();
    await d.goto(BASE, { waitUntil: 'networkidle' });
    const bad = await d.evaluate(() => {
      const lum = s => { const m = s.match(/\d+(\.\d+)?/g); if (!m) return null; const [r, g, b] = m.slice(0, 3).map(Number).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
      // effective background: blend semi-transparent layers over their parents
      const parse = s => { const m = (s || '').match(/[\d.]+/g); if (!m) return null; return [+m[0], +m[1], +m[2], m[3] === undefined ? 1 : +m[3]]; };
      const bgOf = el => {
        const layers = [];
        for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { layers.push(c); if (c[3] >= 1) break; } }
        let base = [18, 26, 25];
        for (const c of layers.reverse()) base = base.map((v, i) => c[i] * c[3] + v * (1 - c[3]));
        return `rgb(${base.join(',')})`;
      };
      const out = [];
      document.querySelectorAll('h1,h2,h3,p,a,span,li,b,small,time,button').forEach(el => {
        if (!el.offsetParent || !el.textContent.trim()) return;
        const L1 = lum(getComputedStyle(el).color), L2 = lum(bgOf(el));
        if (L1 == null || L2 == null) return;
        const ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
        if (ratio < 3) out.push(`${el.tagName}「${el.textContent.trim().slice(0, 20)}」對比 ${ratio.toFixed(2)}`);
      });
      return out;
    });
    await d.screenshot({ path: path.join(OUT, 'interaction-dark.png'), fullPage: true });
    await c.close();
    if (bad.length) throw new Error(bad.slice(0, 6).join('；'));
  });
  await ctxM.close();
  report.interactions.forEach(([l, r]) => console.log(`${r === 'PASS' ? '✓' : '✗'} ${l}${r === 'PASS' ? '' : ' — ' + r}`));

  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
  await browser.close();
})();
