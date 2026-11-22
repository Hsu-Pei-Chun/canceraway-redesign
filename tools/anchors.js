// Anchor-link audit: every link with a #fragment must point at an existing section,
// and after jumping, that section's heading must sit just below the sticky header
// (not hidden under it). Usage: BASE=http://localhost:8811/ node tools/anchors.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BASE = process.env.BASE || 'https://hsu-pei-chun.github.io/canceraway-redesign/';
const DOCS = path.join(__dirname, '..', 'docs');
const OUT = process.env.OUT || path.join(__dirname, 'qa-out');
fs.mkdirSync(OUT, { recursive: true });

// ---- 1) static: read every built page, list its ids and its #links
const pages = {};
(function walk(dir, rel) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'assets') walk(p, rel + f + '/'); continue; }
    if (!f.endsWith('.html')) continue;
    const html = fs.readFileSync(p, 'utf8');
    pages[rel + f] = {
      ids: new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])),
      links: [...html.matchAll(/<a\b[^>]*href="([^"]*#[^"]*)"/g)].map(m => m[1]),
    };
  }
})(DOCS, '');
const pageOf = abs => { let r = abs.replace(BASE, '').split('#')[0]; if (r === '' || r.endsWith('/')) r += 'index.html'; return r; };
const missing = [];
const targets = new Map();      // unique destinations "page#id"
const samePage = {};             // page -> [href] jumps within the same page
let total = 0;
for (const [rel, info] of Object.entries(pages)) {
  for (const href of info.links) {
    const abs = new URL(href, BASE + rel).href;
    if (!abs.startsWith(BASE)) continue;
    const id = decodeURIComponent(abs.split('#')[1] || '');
    if (!id || id === 'main') continue; // skip-link
    total++;
    const tp = pageOf(abs);
    if (!pages[tp] || !pages[tp].ids.has(id)) { missing.push(`${rel} 的「${href}」→ ${tp} 沒有 id="${id}"`); continue; }
    targets.set(tp + '#' + id, abs);
    if (tp === rel) (samePage[rel] = samePage[rel] || new Set()).add(href);
  }
}
console.log(`靜態檢查：${total} 個錨點連結、${targets.size} 個不重複目的地，指到不存在段落的有 ${missing.length} 個`);
missing.slice(0, 20).forEach(m => console.log('  ✗ ' + m));

// ---- 2) + 3) in the browser
// wait until the page has stopped scrolling (smooth scroll can take >1s on long jumps)
const settle = async pg => {
  let last = -1, still = 0;
  for (let i = 0; i < 60 && still < 4; i++) { await pg.waitForTimeout(100); const y = await pg.evaluate(() => scrollY); still = y === last ? still + 1 : 0; last = y; }
};
const MEASURE = () => {
  const id = decodeURIComponent(location.hash.slice(1));
  const el = id && document.getElementById(id);
  if (!el) return { ok: false, why: `找不到 #${id}` };
  const head = document.querySelector('.site-header');
  const hb = head ? head.getBoundingClientRect().bottom : 0;
  const hd = el.matches('h1,h2,h3') ? el : (el.querySelector('h1,h2,h3') || el);
  const r = hd.getBoundingClientRect();
  const atEnd = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
  if (r.top < hb - 2) return { ok: false, why: `標題被標頭蓋住（標題頂 ${Math.round(r.top)}px < 標頭底 ${Math.round(hb)}px）` };
  if (r.top > hb + 120 && !atEnd) return { ok: false, why: `標題離標頭太遠（${Math.round(r.top - hb)}px）` };
  return { ok: true };
};
async function ctxWith(browser, width, font) {
  const opts = { viewport: { width, height: 800 }, isMobile: width < 600, hasTouch: width < 600 };
  if (font === 16) return browser.newContext(opts);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'anc-'));
  fs.mkdirSync(path.join(dir, 'Default'));
  fs.writeFileSync(path.join(dir, 'Default', 'Preferences'), JSON.stringify({ webkit: { webprefs: { default_font_size: font } } }));
  return chromium.launchPersistentContext(dir, { channel: 'chromium', ...opts });
}

(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const [w, font] of [[1366, 16], [390, 16], [1366, 20], [393, 20]]) {
    const ctx = await ctxWith(browser, w, font);
    // run in parallel: a few tabs share the work
    const ready = async pg => { await pg.waitForLoadState('load'); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(150); };
    const pool = async (items, fn, n = 6) => { const q = [...items]; await Promise.all(Array.from({ length: n }, async () => { const pg = await ctx.newPage(); while (q.length) await fn(pg, q.shift()); await pg.close(); })); };
    // arriving from another page
    await pool([...targets], async (pg, [key, abs]) => {
      await pg.goto('about:blank');
      await pg.goto(abs);
      await ready(pg);
      await settle(pg);
      const m = await pg.evaluate(MEASURE);
      if (!m.ok) results.push({ w, font, how: '從別頁進來', link: key, why: m.why });
    });
    // clicking within the same page: load once, click each link in turn
    // Background tabs in full Chromium pause smooth-scroll animations, so clicks
    // are measured one tab at a time (the tab a real reader uses is always in front).
    await pool(Object.entries(samePage), async (pg, [rel, hrefs]) => {
      await pg.bringToFront();
      await pg.goto(BASE + rel);
      await ready(pg);
      for (const href of hrefs) {
        // a reader clicks the link where it is on screen: start from the top each time
        await pg.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; scrollTo(0, 0); document.documentElement.style.scrollBehavior = ''; });
        const loc = pg.locator(`a[href="${href}"]:visible`).first();
        if (!(await loc.count())) continue;
        try { await loc.click({ timeout: 3000 }); } catch { results.push({ w, font, how: '同一頁點擊', link: rel + href, why: '點不到連結' }); continue; }
        await settle(pg);
        const m = await pg.evaluate(MEASURE);
        if (!m.ok) results.push({ w, font, how: '同一頁點擊', link: rel + href, why: m.why });
        const spy = await pg.evaluate(h => {
          const links = [...document.querySelectorAll('.side nav a[data-spy]')];
          if (!links.some(a => a.getAttribute('href') === h)) return null;
          const on = links.filter(a => a.classList.contains('on')).map(a => a.getAttribute('href'));
          return on.length === 1 && on[0] === h ? null : `左側選單沒有標示到這一段（目前標示：${on.join(',') || '無'}）`;
        }, href);
        if (spy) results.push({ w, font, how: '同一頁點擊', link: rel + href, why: spy });
      }
    }, 1);
    await ctx.close();
    console.log(`寬 ${w}px・字型 ${font}px：${results.filter(r => r.w === w && r.font === font).length} 個問題`);
  }
  const grouped = {};
  results.forEach(r => { const k = `${r.link}（${r.how}）：${r.why.replace(/（.*）/, '')}`; (grouped[k] = grouped[k] || []).push(`${r.w}/${r.font}`); });
  Object.entries(grouped).forEach(([k, v]) => console.log(`  ✗ ${k} ← ${[...new Set(v)].join('、')}`));
  fs.writeFileSync(path.join(OUT, 'anchors.json'), JSON.stringify({ total, targets: [...targets.keys()], missing, results }, null, 1));
  await browser.close();
})();
