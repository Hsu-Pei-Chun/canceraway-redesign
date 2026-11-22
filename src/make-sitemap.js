// Turn the raw crawl (pages.json) into SITEMAP.md + data/crawl-index.json
// Usage: node src/make-sitemap.js <path-to-pages.json>
const fs = require('fs');
const path = require('path');
const src = process.argv[2];
const raw = JSON.parse(fs.readFileSync(src, 'utf8'));
const nav = require('./data/nav.json');

const canon = u => { const x = new URL(u); x.pathname = x.pathname.replace(/\/{2,}/g, '/'); x.hash = ''; return x.toString(); };
const DUP = /^\/(print|printcancer|addbookmark|member-login|member-QA)\.php$/i;
const byUrl = new Map();
for (const p of raw.pages) {
  if (p.error) continue;
  const u = canon(p.url);
  const x = new URL(u);
  if (DUP.test(x.pathname) || /\.asp$/.test(x.pathname)) continue;
  if (!byUrl.has(u)) byUrl.set(u, p);
}
const t = s => (s || '').replace(/^H\d: /, '').trim();
const titleOf = p => t((p.headings || []).find(h => /^H2: /.test(h)) || (p.headings || [])[0]) || p.title;
const pages = [...byUrl.entries()].map(([u, p]) => {
  const x = new URL(u);
  return { url: u, path: x.pathname, keyid: x.searchParams.get('keyid'), offset: x.searchParams.get('offset'), id: x.searchParams.get('IDno'), title: titleOf(p), date: ((p.text || '').match(/(20\d\d-\d\d-\d\d)/) || [])[1] || '' };
});

const kind = p => ({
  '/': '首頁', '/cancerinfo.php': '癌症資訊頁', '/catalog.php': '分類目錄頁', '/pagelist.php': p.offset ? '列表分頁' : '單元頁 / 文章列表',
  '/page.php': '文章頁', '/doclist.php': p.offset ? '列表分頁' : '文件下載列表', '/publish.php': p.offset ? '列表分頁' : '出版品列表',
  '/classlist.php': p.offset ? '列表分頁' : '課程列表',
}[p.path] || '其他功能頁');
const counts = {};
pages.forEach(p => { const k = kind(p); counts[k] = (counts[k] || 0) + 1; });

// section pages (pagelist without offset) with their titles
const sections = pages.filter(p => p.path === '/pagelist.php' && !p.offset).sort((a, b) => +a.keyid - +b.keyid);
const catalogs = pages.filter(p => p.path === '/catalog.php').sort((a, b) => +a.keyid - +b.keyid);
const others = pages.filter(p => kind(p) === '其他功能頁' || ['/doclist.php', '/publish.php', '/classlist.php', '/catalink.php'].includes(p.path) && !p.offset);
const articles = pages.filter(p => p.path === '/page.php').sort((a, b) => +b.id - +a.id);
const years = {};
articles.forEach(a => { const y = a.date ? a.date.slice(0, 4) : '未標日期'; years[y] = (years[y] || 0) + 1; });

let md = `# 台灣癌症基金會 網站地圖（爬取結果）

> 來源：https://www.canceraway.org.tw/ ・ 以無頭瀏覽器（Playwright + Chromium）從首頁開始逐頁點擊爬取 ・ 爬取日期：2026-11-22
> 原網站沒有提供 sitemap.xml（回應 404），以下是實際爬過每一頁後整理出來的結構。

## 總覽

- 實際瀏覽的不重複頁面：**${pages.length} 頁**（已排除「友善列印」、「加入收藏」、舊版 .asp 轉址、網址多斜線等重複頁）
- 文件下載連結（PDF / Word 等）：${raw.files.length} 個
- 另有子網站 **癌症e學苑** https://elearning.canceraway.org.tw/（癌友服務大多連過去），本次只爬主站，子網站列於選單結構中

| 頁面類型 | 頁數 |
|---|---:|
${Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`).join('\n')}

## 一、主選單結構（原網站）

`;
const seen = new Set();
for (const g of nav.out) {
  if (seen.has(g.top) || ['自我照護管理', '身心靈康復課程', '病友支持團體', '癌症病友補助'].includes(g.top)) continue;
  seen.add(g.top);
  md += `### ${g.top}\n\n`;
  for (const s of g.subs) {
    const [name, href] = s.split(' | ');
    if (href === '#') { md += `- **${name}**\n`; continue; }
    const full = href.startsWith('http') ? href : 'https://www.canceraway.org.tw/' + href;
    md += `- [${name}](${full})\n`;
  }
  md += '\n';
}
md += `### 頁尾\n\n- 首頁、關於基金會、網站服務條款（pagelist.php?keyid=235）、線上聯絡（QA-index.php）、訂閱電子報\n\n`;

md += `## 二、分類目錄頁（catalog.php，${catalogs.length} 頁）\n\n| keyid | 標題 | 網址 |\n|---:|---|---|\n${catalogs.map(p => `| ${p.keyid} | ${p.title} | ${p.url} |`).join('\n')}\n\n`;
md += `## 三、單元頁與文章列表（pagelist.php，${sections.length} 個單元）\n\n| keyid | 標題 | 網址 |\n|---:|---|---|\n${sections.map(p => `| ${p.keyid} | ${p.title} | ${p.url} |`).join('\n')}\n\n`;
md += `## 四、其他功能頁\n\n| 頁面 | 標題 | 網址 |\n|---|---|---|\n${others.map(p => `| ${p.path} | ${p.title} | ${p.url} |`).join('\n')}\n\n`;
md += `## 五、文章頁（page.php，共 ${articles.length} 篇）\n\n文章編號（IDno）範圍：${articles[articles.length - 1].id} – ${articles[0].id}。多數舊文章頁面上沒有顯示發布日期，所以不做年份統計。\n\n完整文章清單（標題、日期、網址）在 [\`src/data/crawl-index.json\`](src/data/crawl-index.json)。最新 30 篇：\n\n| IDno | 日期 | 標題 |\n|---:|---|---|\n${articles.slice(0, 30).map(a => `| ${a.id} | ${a.date} | [${a.title.replace(/\|/g, '｜')}](${a.url}) |`).join('\n')}\n`;

fs.writeFileSync(path.join(__dirname, '..', 'SITEMAP.md'), md);
fs.writeFileSync(path.join(__dirname, 'data', 'crawl-index.json'), JSON.stringify({ crawledAt: '2026-11-22', total: pages.length, files: raw.files, pages }, null, 0));
console.log('unique pages', pages.length, counts);
