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

const VIEWPORTS = [['desktop', 1366, 900], ['tablet', 768, 1024], ['mobile', 390, 844], ['small', 360, 740], ['desktop-dark', 1366, 900, 'dark'], ['mobile-dark', 390, 844, 'dark']];

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
    if ((cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 2 && el.innerText && !el.closest('.sr-only') && !el.classList.contains('band579'))
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
  for (const [vp, w, h, scheme] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 600, hasTouch: w < 600, colorScheme: scheme || 'light' });
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
          await p.screenshot({ path: path.join(OUT, shot), fullPage: true });
          report.results.push({ vp, page: rel, issues, shot });
        }
        await p.close();
        i++;
      }
    }));
    console.log(`${vp} (${w}px): ${pages.length} 頁檢查完，${report.results.filter(x => x.vp === vp).length} 頁有問題`);
    await ctx.close();
  }

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
  await it('手機：點「消化道」只剩 7 種癌症', async () => {
    await m.tap('.chip[data-f="digest"]');
    const n = await m.$$eval('#cancer-grid .cancer', els => els.filter(e => !e.hidden).length);
    if (n !== 7) throw new Error(`顯示 ${n} 個`);
    await m.tap('.chip[data-f="all"]');
  });
  await it('手機：篩選輸入「肝」找到肝癌', async () => {
    await m.fill('.finder-q', '肝');
    const names = await m.$$eval('#cancer-grid .cancer', els => els.filter(e => !e.hidden).map(e => e.querySelector('b').textContent));
    if (!names.includes('肝癌')) throw new Error('結果：' + names.join(','));
    await m.fill('.finder-q', 'zzzz');
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
