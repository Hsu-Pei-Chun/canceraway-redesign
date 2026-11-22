// Structured content extraction for the redesign (cancer pages, key pages, latest news)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = 'https://www.canceraway.org.tw/';
const nav = require('./nav.json');

// runs in the page: clean a node's HTML down to semantic tags
const CLEAN = () => {
  window.__clean = (root) => {
    const ALLOW = new Set(['P', 'UL', 'OL', 'LI', 'STRONG', 'B', 'EM', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TD', 'TH', 'H3', 'H4', 'H5', 'A', 'BR', 'BLOCKQUOTE']);
    const walk = (n) => {
      if (n.nodeType === 3) return n.textContent.replace(/ /g, ' ');
      if (n.nodeType !== 1) return '';
      const tag = n.tagName;
      if (['SCRIPT', 'STYLE', 'IFRAME', 'BUTTON', 'IMG', 'FORM', 'INPUT', 'SELECT', 'NOSCRIPT'].includes(tag)) return '';
      const inner = [...n.childNodes].map(walk).join('');
      if (!ALLOW.has(tag)) return tag === 'DIV' || tag === 'SECTION' ? inner + '\n' : inner;
      if (tag === 'BR') return '<br>';
      if (tag === 'A') {
        const h = n.getAttribute('href') || '';
        if (!h || h.startsWith('javascript') || h.startsWith('#')) return inner;
        return `<a href="${new URL(h, location.href).href}" target="_blank" rel="noopener">${inner}</a>`;
      }
      const t = tag === 'B' ? 'strong' : tag === 'H5' ? 'h4' : tag.toLowerCase();
      if (t === 'td' || t === 'th') {
        const cs = n.getAttribute('colspan'), rs = n.getAttribute('rowspan');
        return `<${t}${cs ? ` colspan="${cs}"` : ''}${rs ? ` rowspan="${rs}"` : ''}>${inner.trim()}</${t}>`;
      }
      if (['p', 'li', 'h3', 'h4', 'strong', 'em'].includes(t) && !inner.replace(/<br>/g, '').trim()) return '';
      return `<${t}>${inner}</${t}>`;
    };
    let html = walk(root)
      .replace(/<p>\s*l\s+/g, '<p>• ')
      .replace(/<strong><\/strong>/g, '')
      .replace(/(<br>\s*){3,}/g, '<br><br>')
      .replace(/\n{2,}/g, '\n').trim();
    html = html.replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>');
    return html;
  };
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  await ctx.addInitScript(CLEAN);
  const out = { cancers: [], pages: {}, news: [] };
  const go = async (url) => { const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); return p; };

  // 1) cancers, in menu order
  const cancerMenu = nav.out[0].subs.map(s => { const [name, href] = s.split(' | '); return { name, url: BASE + href }; });
  const top10 = ['大腸直腸癌', '肺癌', '乳癌', '肝癌', '口腔癌', '攝護腺癌', '胃癌', '皮膚癌', '甲狀腺癌', '食道癌'];
  const pool = [...cancerMenu];
  async function cancerWorker() {
    while (pool.length) {
      const c = pool.shift();
      const p = await go(c.url);
      const d = await p.evaluate(() => {
        const t = s => (s || '').replace(/\s+/g, ' ').trim();
        const col = document.querySelector('.col-md-9');
        const h2 = col.querySelector('h2');
        const updated = t((col.innerText.match(/更新日期[：:]\s*([0-9/]+)/) || [])[1]);
        const intro = [];
        let el = h2.nextElementSibling;
        while (el && !el.classList.contains('sidebar')) { if (el.tagName === 'P' && !/更新日期/.test(el.innerText)) intro.push(__clean(el)); el = el.nextElementSibling; }
        const sections = [...col.querySelectorAll('.sidebar .widget h3.widget-title')].map(h => {
          let body = h.nextElementSibling; while (body && !body.classList.contains('text-widget')) body = body.nextElementSibling;
          return { title: t(h.innerText), html: body ? __clean(body) : '' };
        }).filter(s => s.title !== '目錄' && s.html);
        return { title: t(h2.innerText), updated, intro: intro.join('\n'), sections };
      });
      const [zh, en] = d.title.split(/\s*-\s*/);
      out.cancers.push({ name: c.name, zh: zh || c.name, en: en || '', top10: top10.indexOf(c.name) + 1, srcUrl: c.url, ...d });
      console.log('cancer', c.name, d.sections.length);
      await p.close();
    }
  }
  await Promise.all([1, 2, 3, 4, 5, 6].map(cancerWorker));
  out.cancers.sort((a, b) => cancerMenu.findIndex(x => x.name === a.name) - cancerMenu.findIndex(x => x.name === b.name));

  // 2) key content pages
  const keys = {
    origin: 'pagelist.php?keyid=18', mission: 'pagelist.php?keyid=22', services: 'pagelist.php?keyid=6', org: 'pagelist.php?keyid=23',
    p579: 'catalog.php?keyid=50', exercise: 'catalog.php?keyid=51', weight: 'catalog.php?keyid=52', smoke: 'catalog.php?keyid=53', screening: 'catalog.php?keyid=54',
    freeScreen: 'pagelist.php?keyid=289', donate: 'donate.php', volunteer: 'pagelist.php?keyid=89', corporate: 'pagelist.php?keyid=88',
    tmcdf: 'pagelist.php?keyid=306', tmcdfResearch: 'pagelist.php?keyid=307', warrior: 'pagelist.php?keyid=103', privacy: 'pagelist.php?keyid=235',
    qa: 'QA-index.php', careCenter: 'catalog.php?keyid=12', honor: 'pagelist.php?keyid=26',
  };
  for (const [k, rel] of Object.entries(keys)) {
    const p = await go(BASE + rel);
    out.pages[k] = await p.evaluate(() => {
      const t = s => (s || '').replace(/\s+/g, ' ').trim();
      const col = document.querySelector('.col-md-9') || document.querySelector('#content');
      const c = col.cloneNode(true);
      c.querySelectorAll('.addthis_inline_share_toolbox, .breadcrumb, .pagination, .sidebar').forEach(x => x.remove());
      const h2 = c.querySelector('h2'); const title = h2 ? t(h2.innerText) : document.title; if (h2) h2.remove();
      const items = [...col.querySelectorAll('a[href*="page.php"], a[href*="pagelist.php"]')].map(a => ({ text: t(a.innerText), href: a.href })).filter(x => x.text.length > 3).slice(0, 40);
      return { title, html: __clean(c), items };
    });
    out.pages[k].srcUrl = BASE + rel;
    console.log('page', k, out.pages[k].title, out.pages[k].html.length);
    await p.close();
  }

  // 3) latest news (最新消息 list → first 12 articles)
  const lp = await go(BASE + 'pagelist.php?keyid=1');
  const list = await lp.evaluate(() => [...document.querySelectorAll('a[href*="page.php?IDno"]')].map(a => ({ href: a.href, text: a.innerText.replace(/\s+/g, ' ').trim() })).filter(x => x.text.length > 6));
  await lp.close();
  const uniq = []; const seenH = new Set(); for (const l of list) if (!seenH.has(l.href)) { seenH.add(l.href); uniq.push(l); }
  for (const l of uniq.slice(0, 12)) {
    const p = await go(l.href);
    const d = await p.evaluate(() => {
      const t = s => (s || '').replace(/\s+/g, ' ').trim();
      const col = document.querySelector('.col-md-9');
      const c = col.cloneNode(true);
      c.querySelectorAll('.addthis_inline_share_toolbox, .breadcrumb, .pagination').forEach(x => x.remove());
      const h2 = c.querySelector('h2'); const title = h2 ? t(h2.innerText) : ''; if (h2) h2.remove();
      const date = (col.innerText.match(/(20\d\d[-/.]\d\d[-/.]\d\d)/) || [])[1] || '';
      return { title, date, html: __clean(c) };
    });
    const id = new URL(l.href).searchParams.get('IDno');
    out.news.push({ id, srcUrl: l.href, ...d });
    console.log('news', id, d.date, d.title);
    await p.close();
  }

  fs.writeFileSync(path.join(__dirname, 'content.json'), JSON.stringify(out, null, 1));
  console.log('DONE');
  await browser.close();
})();
