// Parallel BFS crawl of canceraway.org.tw with headless Chromium
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const START = 'https://www.canceraway.org.tw/';
const HOST = 'www.canceraway.org.tw';
const MAX = parseInt(process.env.MAX || '1500', 10);
const CONC = parseInt(process.env.CONC || '8', 10);
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });

function norm(u) {
  try {
    const x = new URL(u);
    if (x.hostname !== HOST && x.hostname !== 'canceraway.org.tw') return null;
    if (!/^https?:$/.test(x.protocol)) return null;
    x.hash = ''; x.hostname = HOST; x.protocol = 'https:'; x.pathname = x.pathname.replace(/\/{2,}/g, '/');
    if (/\.(pdf|jpe?g|png|gif|zip|docx?|xlsx?|pptx?|mp4|mp3|odt|lsx)$/i.test(x.pathname)) return null;
    if (/^\/(print|printcancer|addbookmark|member-login|member-QA)\.php$/i.test(x.pathname)) return null;
    if (/\.asp$/i.test(x.pathname)) return null;
    if (x.pathname.startsWith('/uploads/') || x.pathname.startsWith('/docs/')) return null;
    return x.toString();
  } catch { return null; }
}

const EXTRACT = () => {
  const t = s => (s || '').replace(/\s+/g, ' ').trim();
  const hs = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName + ': ' + t(h.innerText)).filter(x => x.length > 4).slice(0, 40);
  const links = [...document.querySelectorAll('a[href]')].map(a => ({ href: a.href, text: t(a.innerText).slice(0, 80) }));
  const bc = t((document.querySelector('.breadcrumb, .path, .crumb, [class*=bread]') || {}).innerText || '');
  const main = document.querySelector('main, article, #content, .content, .main') || document.body;
  const imgs = [...document.images].map(i => i.src).filter(Boolean).slice(0, 30);
  return { title: document.title, breadcrumb: bc, headings: hs, links, imgs, text: t(main.innerText).slice(0, 6000) };
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, userAgent: 'Mozilla/5.0 (site-redesign-research crawler)' });
  let queue = [START];
  const seen = new Set([START]);
  let pages = [];
  if (process.env.RESUME) {
    const prev = JSON.parse(fs.readFileSync(path.join(OUT, 'pages.json'), 'utf8'));
    const m = new Map();
    for (const p of prev.pages) { const n = norm(p.url); if (n && !p.error && !m.has(n)) m.set(n, { ...p, url: n }); }
    pages = [...m.values()];
    pages.forEach(p => seen.add(p.url));
    queue = prev.remaining.map(norm).filter(u => u && !seen.has(u));
    queue = [...new Set(queue)]; queue.forEach(u => seen.add(u));
    console.log('resume: kept', pages.length, 'queue', queue.length);
  }
  const files = new Set(process.env.RESUME ? JSON.parse(fs.readFileSync(path.join(OUT, 'pages.backup.json'), 'utf8')).files : []);
  const shotCount = {};
  let shotN = 200, active = 0;
  const save = () => fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify({ pages, remaining: queue, files: [...files] }, null, 1));

  async function visit(url) {
    const page = await ctx.newPage();
    const rec = { url };
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(500);
      rec.status = resp ? resp.status() : null;
      rec.finalUrl = page.url();
      const data = await page.evaluate(EXTRACT);
      Object.assign(rec, data);
      const u = new URL(url);
      const tpl = u.pathname + '?' + (u.searchParams.get('keyid') || '');
      shotCount[tpl] = (shotCount[tpl] || 0) + 1;
      if (shotCount[tpl] <= 2) {
        rec.shot = `shots/${String(++shotN).padStart(3, '0')}.png`;
        await page.screenshot({ path: path.join(OUT, rec.shot) });
      }
      for (const l of data.links) {
        if (/\.(pdf|docx?|xlsx?|pptx?|zip)(\?|$)/i.test(l.href)) files.add(l.href);
        const nu = norm(l.href);
        if (nu && !seen.has(nu)) { seen.add(nu); queue.push(nu); }
      }
      delete rec.links;
      console.log(`[${pages.length + 1}] ${rec.status} ${url} — ${rec.headings[0] || ''}`);
    } catch (e) {
      rec.error = String(e.message).slice(0, 200);
      console.log(`ERR ${url} ${rec.error}`);
    }
    pages.push(rec);
    if (pages.length % 25 === 0) save();
    await page.close().catch(() => {});
  }

  await new Promise(done => {
    const pump = () => {
      while (active < CONC && queue.length && pages.length + active < MAX) {
        active++;
        visit(queue.shift()).finally(() => { active--; pump(); });
      }
      if (!active) done();
    };
    pump();
  });
  save();
  console.log('DONE', pages.length, 'pages; queue left', queue.length, '; files', files.size);
  await browser.close();
})();
