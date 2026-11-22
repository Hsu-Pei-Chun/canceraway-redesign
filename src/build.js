// 台灣癌症基金會 改版提案 — static site generator
// Usage: node src/build.js   → writes the whole site into ./docs
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs');
const OLD = 'https://www.canceraway.org.tw/';
const EL = 'https://elearning.canceraway.org.tw/';
const data = require('./data/content.json');

/* ---------------------------------------------------------- reference data */
const SLUG = {
  腦瘤: 'brain-tumor', 喉癌: 'laryngeal', 鼻咽癌: 'nasopharyngeal', 口腔癌: 'oral', 食道癌: 'esophageal', 甲狀腺癌: 'thyroid',
  肺癌: 'lung', 乳癌: 'breast', 胃癌: 'gastric', 腸胃道間質瘤: 'gist', 肝癌: 'liver', 膽囊膽管癌: 'gallbladder-bile-duct',
  胰臟癌: 'pancreatic', 大腸直腸癌: 'colorectal', 攝護腺癌: 'prostate', 卵巢癌: 'ovarian', 輸卵管癌: 'fallopian-tube',
  子宮內膜癌: 'endometrial', 子宮頸癌: 'cervical', 陰道癌: 'vaginal', 腎臟癌: 'kidney', 膀胱癌: 'bladder', 皮膚癌: 'skin',
  多發性骨髓瘤: 'multiple-myeloma', 淋巴癌: 'lymphoma', 急性骨髓性白血病: 'aml', 慢性骨髓性白血病: 'cml',
  急性淋巴性白血病: 'all', 慢性淋巴性白血病: 'cll', 骨癌: 'bone',
};
const EN_FIX = {
  鼻咽癌: 'Nasopharyngeal Carcinoma', 肝癌: 'Hepatocellular Carcinoma', 胰臟癌: 'Pancreatic Cancer',
  輸卵管癌: 'Primary Fallopian Tube Carcinoma', 子宮內膜癌: 'Endometrial Cancer', 腎臟癌: 'Renal Cell Carcinoma',
  慢性骨髓性白血病: 'Chronic Myeloid Leukemia', 慢性淋巴性白血病: 'Chronic Lymphocytic Leukemia', 骨癌: 'Bone Cancer',
};
const SYSTEMS = [
  ['head', '頭頸部', ['腦瘤', '喉癌', '鼻咽癌', '口腔癌', '甲狀腺癌']],
  ['chest', '胸腔・乳房', ['肺癌', '乳癌']],
  ['digest', '消化道', ['食道癌', '胃癌', '腸胃道間質瘤', '肝癌', '膽囊膽管癌', '胰臟癌', '大腸直腸癌']],
  ['uro', '泌尿・男性', ['攝護腺癌', '腎臟癌', '膀胱癌']],
  ['gyn', '婦科', ['卵巢癌', '輸卵管癌', '子宮內膜癌', '子宮頸癌', '陰道癌']],
  ['blood', '血液・淋巴', ['多發性骨髓瘤', '淋巴癌', '急性骨髓性白血病', '慢性骨髓性白血病', '急性淋巴性白血病', '慢性淋巴性白血病']],
  ['skin', '皮膚・骨骼', ['皮膚癌', '骨癌']],
];
const sysOf = name => SYSTEMS.find(s => s[2].includes(name));
const cancers = data.cancers.map(c => ({ ...c, slug: SLUG[c.name], en: EN_FIX[c.name] || c.en.replace(/,.*$/, ''), sys: sysOf(c.name) }));
const byOldId = {};
cancers.forEach(c => { byOldId[new URL(c.srcUrl).searchParams.get('id').toLowerCase()] = c; });

const HABITS = [
  { key: 'p579', slug: '579', c: 1, title: '蔬果彩虹579', short: '兒童每天 5 份、女性 7 份、男性 9 份蔬果，吃進不同顏色的植化素。' },
  { key: 'exercise', slug: 'exercise', c: 2, title: '規律運動', short: '每週至少 150 分鐘中等強度運動，從居家微運動開始也可以。' },
  { key: 'weight', slug: 'weight', c: 3, title: '體重控制', short: '肥胖與多種癌症相關，吃得聰明、動得規律，把體重維持在健康範圍。' },
  { key: 'smoke', slug: 'smoke-free', c: 4, title: '遠離菸檳', short: '菸品與檳榔是口腔癌、肺癌等多種癌症的主要危險因子。' },
  { key: 'screening', slug: 'screening', c: 5, title: '定期篩檢', short: '政府提供免費五癌篩檢，早期發現，治療效果更好。' },
];

const NEWS_DATE = { 5274: '2026-11-02', 5271: '2026-11-02', 4586: '' };
const news = data.news.map(n => {
  const m = n.title.match(/^【([^】]+)】\s*(.*)$/);
  return { ...n, date: n.date || NEWS_DATE[n.id] || '', tag: m ? m[1] : '消息', short: m ? m[2] : n.title, pinned: n.id === '4586' };
});

const CARE = {
  selfcare: [['醫療新知', EL + 'pagelist.php?keyid=239'], ['癌症照護', EL + 'pagelist.php?keyid=240'], ['癌症營養', EL + 'catalog.php?keyid=241'], ['心理支持', EL + 'catalog.php?keyid=242'], ['復健運動', EL + 'pagelist.php?keyid=81'], ['免疫治療', EL + 'pagelist.php?keyid=280']],
  courses: [['北部身心靈康復課程', OLD + 'classlist.php?keyid=95'], ['南部身心靈康復課程', OLD + 'classlist.php?keyid=96'], ['跨院際巡迴講座', OLD + 'classlist.php?keyid=126'], ['數位教學平台', EL + 'catalog.php?keyid=198'], ['直播小教室', EL + 'videolist.php?keyid=232']],
  groups: [['肺腑之癌聯誼會', EL + 'pagelist.php?keyid=45', '肺癌病友'], ['腸相挺聯誼會', EL + 'pagelist.php?keyid=44', '大腸直腸癌病友'], ['笑癌逐開社', EL + 'pagelist.php?keyid=46', '頭頸癌病友'], ['悅聲合唱團', EL + 'pagelist.php?keyid=47', '以歌聲相伴'], ['愛．Care之友', EL + 'pagelist.php?keyid=41', '乳癌病友'], ['午茶話聊聚會', EL + 'pagelist.php?keyid=102', '輕鬆交流']],
  aid: [['營養品補助', EL + 'pagelist.php?keyid=233'], ['經濟補助', EL + 'pagelist.php?keyid=97'], ['交通補助', EL + 'pagelist.php?keyid=101'], ['居家喘息', EL + 'pagelist.php?keyid=234'], ['心理諮商', EL + 'pagelist.php?keyid=98'], ['癌症保險諮詢', EL + 'pagelist.php?keyid=278'], ['假髮租借', EL + 'pagelist.php?keyid=99'], ['專業諮詢服務', EL + 'pagelist.php?keyid=281'], ['安心窩・遠距就醫服務', EL + 'pagelist.php?keyid=295']],
};
const LIBRARY = [
  ['圖書出版', OLD + 'publish.php?keyid=29', '基金會出版的抗癌、營養與照護書籍'],
  ['其他出版', OLD + 'publish.php?keyid=31', '手冊、光碟與合作出版品'],
  ['會訊下載', OLD + 'doclist.php?keyid=32', '歷期《台灣癌症基金會會訊》PDF'],
  ['各項專業調查', OLD + 'doclist.php?keyid=35', '癌友生活、治療可近性等調查報告'],
  ['衛教手冊&懶人包', OLD + 'doclist.php?keyid=294', '各癌別衛教手冊、一頁懶人包'],
  ['年度報告', OLD + 'doclist.php?keyid=125', '年度工作與財務報告'],
];

/* ---------------------------------------------------------- helpers */
const esc = s => String(s ?? '').replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const ext = (href, text) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;

// tidy the cleaned HTML from the old site and point links at the new pages
function tidy(html, prefix) {
  let h = html
    .replace(/<a [^>]*(addbookmark|print\.php|printcancer)[^>]*>[\s\S]*?<\/a>/g, '')
    .replace(/<a [^>]*>\s*<\/a>/g, '')
    .replace(/【點擊圖片連結網站】|友善列印|收藏文章/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/href="https:\/\/www\.canceraway\.org\.tw\/cancerinfo\.php\?id=([^"&]+)"[^>]*>/gi, (m, id) => {
      const c = byOldId[id.toLowerCase()];
      return c ? `href="${prefix}cancer/${c.slug}.html">` : m;
    });
  // wrap loose text lines in <p>
  h = h.split('\n').map(l => l.trim()).filter(Boolean)
    .map(l => (/^</.test(l) && !/^<(strong|a|em)\b/.test(l)) ? l : `<p>${l}</p>`).join('\n');
  return h;
}

const NAV = [
  { href: 'cancer/', label: '認識癌症', sub: [['30 種常見癌症', 'cancer/'], ...cancers.filter(c => c.top10).map(c => [c.name, `cancer/${c.slug}.html`]).slice(0, 6)] },
  { href: 'prevention/', label: '癌症預防', sub: [['預防總覽', 'prevention/'], ...HABITS.map(h => [h.title, `prevention/${h.slug}.html`])] },
  { href: 'care/', label: '癌友服務', sub: [['服務總覽', 'care/'], ['補助申請', 'care/#aid'], ['康復課程', 'care/#courses'], ['病友團體', 'care/#groups'], ['癌友關懷教育中心', 'care/center.html'], ['抗癌鬥士', 'care/warriors.html']] },
  { href: 'rights/', label: '癌友權益', sub: [['TmCDF 新藥支持基金', 'rights/'], ['研究成果', 'rights/#research']] },
  { href: 'library/', label: '台癌圖書館', sub: LIBRARY.map(l => [l[0], 'library/']).slice(0, 1).concat([['出版與下載', 'library/']]) },
  { href: 'news/', label: '最新消息', sub: [] },
  { href: 'about/', label: '關於我們', sub: [['基金會緣起', 'about/'], ['服務項目', 'about/services.html'], ['榮耀共享', 'about/honor.html'], ['聯絡我們', 'contact.html']] },
];
NAV[4].sub = [['出版與下載', 'library/']];

const brandMark = `<svg class="brand-mark" viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="20" fill="var(--brand)"/><g fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M13 27c2.5-6 13.5-6 16 0"/><path d="M21 12v9"/><path d="M16.5 16.5h9"/></g></svg>`;

function layout({ title, desc, prefix, current, body }) {
  const nav = NAV.map(n => {
    const cur = current === n.href ? ' aria-current="page"' : '';
    const sub = n.sub.length > 1 ? `<div class="sub">${n.sub.map(s => `<a href="${prefix}${s[1]}">${esc(s[0])}</a>`).join('')}</div>` : '';
    return `<div><a href="${prefix}${n.href}"${cur}>${n.label}</a>${sub}</div>`;
  }).join('');
  return `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc || '台灣癌症基金會：癌症衛教、預防、癌友服務與補助資訊。')}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@500;600&family=Huninn&family=Noto+Sans+TC:wght@400;500;700&display=swap">
<link rel="stylesheet" href="${prefix}assets/style.css">
<link rel="icon" href="${prefix}assets/favicon.svg" type="image/svg+xml">
</head>
<body data-root="${prefix}">
<a class="skip" href="#main">跳到主要內容</a>
<div class="proposal"><div class="wrap"><span>這是台灣癌症基金會網站的<b>改版設計提案</b>，不是官方網站。</span><a href="${OLD}" target="_blank" rel="noopener">前往目前官網 ↗</a></div></div>
<div class="helpline"><div class="wrap">
  <span class="muted">癌友諮詢專線</span><strong>02-8787-3881</strong><span class="muted">週一至週五 09:00–17:30</span>
  <span class="right"><a href="${prefix}care/#aid">補助申請</a><a href="${prefix}care/#courses">課程報名</a><a href="${prefix}contact.html">聯絡我們</a></span>
</div></div>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="${prefix}index.html">${brandMark}<span class="brand-name"><b>台灣癌症基金會</b><small>FORMOSA CANCER FOUNDATION</small></span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mainnav" aria-label="選單"><span class="tg-icon" aria-hidden="true">☰</span><span class="tg-label">選單</span></button>
    <nav class="mainnav" id="mainnav" aria-label="主選單">${nav}</nav>
    <a class="btn btn-donate" href="${prefix}give/" aria-label="捐款支持"><span class="long">捐款支持</span><span class="short" aria-hidden="true">捐款</span></a>
  </div>
  <div class="band579" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
</header>
<div class="alert" role="note"><div class="wrap">反詐騙提醒：基金會不會以電話要求您操作 ATM 或提供卡號。看到 +886 開頭的陌生來電請提高警覺，可撥 165 反詐騙專線查證。</div></div>
<main id="main">
${body}
</main>
<footer class="site-footer"><div class="wrap">
  <div class="foot-grid">
    <div>
      <a class="brand" href="${prefix}index.html">${brandMark}<span class="brand-name"><b>台灣癌症基金會</b><small>FORMOSA CANCER FOUNDATION</small></span></a>
      <p style="margin-top:12px">訂閱電子報，每月收到最新癌症資訊與活動。</p>
      <form class="subscribe" id="subscribe" novalidate>
        <label class="sr-only" for="sub-email">電子郵件</label>
        <input id="sub-email" type="email" placeholder="you@example.com" required>
        <button class="btn btn-calm" type="submit">訂閱</button>
        <output id="sub-msg" aria-live="polite"></output>
      </form>
    </div>
    <div><h2>認識與預防</h2><ul><li><a href="${prefix}cancer/">30 種常見癌症</a></li><li><a href="${prefix}prevention/">五大防癌習慣</a></li><li><a href="${prefix}prevention/screening.html">免費五癌篩檢</a></li></ul></div>
    <div><h2>癌友服務</h2><ul><li><a href="${prefix}care/#aid">補助申請</a></li><li><a href="${prefix}care/#courses">康復課程</a></li><li><a href="${prefix}care/#groups">病友團體</a></li><li><a href="${prefix}rights/">癌友權益</a></li></ul></div>
    <div><h2>支持我們</h2><ul><li><a href="${prefix}give/">捐款方式</a></li><li><a href="${prefix}give/volunteer.html">加入志工</a></li><li><a href="${prefix}give/corporate.html">企業合作</a></li></ul></div>
    <div><h2>基金會</h2><ul><li><a href="${prefix}about/">關於我們</a></li><li><a href="${prefix}news/">最新消息</a></li><li><a href="${prefix}library/">台癌圖書館</a></li><li><a href="${prefix}sitemap.html">網站地圖</a></li></ul></div>
  </div>
  <div class="legal">
    <span>© 財團法人台灣癌症基金會</span><span>衛生署醫字第 86033641 號</span><span>勸募許可：衛部救字第 1141364436 號</span>
    <a href="${prefix}privacy.html">隱私政策</a><a href="${prefix}sitemap.html">網站地圖</a>
  </div>
</div></footer>
<script src="${prefix}assets/main.js"></script>
</body>
</html>
`;
}

function pageHead({ prefix, crumbs, title, en, sub, meta }) {
  const cr = [`<a href="${prefix}index.html">首頁</a>`, ...crumbs.map(([t, h]) => h ? `<span><a href="${prefix}${h}">${esc(t)}</a></span>` : `<span>${esc(t)}</span>`)].join('');
  return `<section class="page-head"><div class="wrap">
  <nav class="crumbs" aria-label="麵包屑">${cr}</nav>
  <h1>${esc(title)}</h1>${en ? `<p class="en">${esc(en)}</p>` : ''}${sub ? `<p class="sub">${sub}</p>` : ''}${meta ? `<div class="meta">${meta}</div>` : ''}
</div></section>`;
}
const helpCard = `<div class="help"><span class="eyebrow">需要協助？</span><b class="num">02-8787-3881</b><span>護理師、營養師、社工師免費諮詢</span></div>`;
const sideNav = (title, items, here) => `<div><h2>${title}</h2><nav>${items.map(([t, h]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ''}>${esc(t)}</a>`).join('')}</nav></div>`;

/* ---------------------------------------------------------- writers */
const pagesOut = [];
function write(rel, html, title) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
  pagesOut.push({ rel, title });
}

/* home */
function home() {
  const p = '';
  const cancerCards = cancers.map(c => `<a class="cancer" href="cancer/${c.slug}.html" data-sys="${c.sys[0]}" data-top="${c.top10 ? 1 : 0}" data-q="${esc(c.name + ' ' + c.en)}"><b>${esc(c.name)}</b><small>${esc(c.en)}</small>${c.top10 ? '<span class="rank">十大癌症</span>' : ''}</a>`).join('');
  const body = `
<section class="hero"><div class="wrap">
  <div>
    <p class="eyebrow">台灣癌症基金會 · 1997 年成立</p>
    <h1>癌症可以預防，<span>你也不必<wbr>一個人面對。</span></h1>
    <p class="lede">從防癌飲食、免費篩檢，到治療期間的營養、補助與心理支持，我們把可靠的資訊和實際的幫忙放在同一個地方。</p>
    <form class="hero-search" action="search.html" role="search">
      <label class="sr-only" for="q">搜尋</label>
      <input id="q" name="q" type="search" placeholder="搜尋癌症名稱、症狀或補助，例如：肺癌、營養品補助">
      <button class="btn btn-calm" type="submit">搜尋</button>
    </form>
    <div class="quick"><span>常被搜尋：</span><a href="cancer/lung.html">肺癌</a><a href="cancer/breast.html">乳癌</a><a href="prevention/screening.html">免費篩檢</a><a href="care/#aid">經濟補助</a><a href="care/#aid">假髮租借</a></div>
  </div>
  <aside class="call-card" aria-label="癌友諮詢專線">
    <span class="eyebrow">剛確診、不知道從哪開始？</span>
    <a class="phone" href="tel:0287873881">02-8787-3881</a>
    <ul><li>護理師說明治療與副作用</li><li>營養師協助治療期飲食</li><li>社工師協助補助與資源申請</li></ul>
    <p style="font-size:var(--s-sm);color:var(--ink-2)">週一至週五 09:00–17:30，或下載「台癌e照護」App 線上諮詢。</p>
  </aside>
</div></section>

<section class="wrap paths" aria-labelledby="paths-h">
  <h2 id="paths-h">你今天想做什麼？</h2>
  <div class="paths-grid">
    <a class="path p-prevent" href="prevention/"><span class="who">給關心健康的你</span><h3>預防癌症</h3><ul><li>蔬果彩虹 579 怎麼吃</li><li>符合資格的免費五癌篩檢</li><li>戒菸、戒檳榔資源</li></ul><span class="go">看五大防癌習慣 →</span></a>
    <a class="path p-care" href="care/"><span class="who">給癌友與家屬</span><h3>治療與照顧</h3><ul><li>營養品、交通、經濟補助</li><li>身心靈康復課程</li><li>同癌別病友團體</li></ul><span class="go">看癌友服務 →</span></a>
    <a class="path p-give" href="give/"><span class="who">給想幫忙的你</span><h3>一起支持</h3><ul><li>線上、超商、行動支付捐款</li><li>定期定額陪伴癌友家庭</li><li>成為志工或企業夥伴</li></ul><span class="go">看支持方式 →</span></a>
  </div>
</section>

<section class="section" aria-labelledby="finder-h"><div class="wrap">
  <div class="section-head"><div><h2 id="finder-h">認識 30 種常見癌症</h2><p>每種癌症都整理了成因、症狀、檢查、分期與治療方式，由醫療專業人員審閱。</p></div><a class="more" href="cancer/">全部癌症 →</a></div>
  ${finderControls('home')}
  <div class="cancer-grid" id="cancer-grid">${cancerCards}</div>
  <p class="finder-empty" id="finder-empty" hidden>找不到符合的癌症，試試其他關鍵字，或撥打 02-8787-3881 詢問。</p>
</div></section>

<section class="section tint" aria-labelledby="habits-h"><div class="wrap">
  <div class="section-head"><div><h2 id="habits-h">五個習慣，降低罹癌風險</h2><p>基金會推廣多年的防癌生活準則。上方的五色線條，就是這五個習慣的代表色。</p></div><a class="more" href="prevention/">預防總覽 →</a></div>
  <div class="habits">${HABITS.map((h, i) => `<a class="habit h${h.c}c" href="prevention/${h.slug}.html"><span class="n">習慣 ${i + 1}</span><h3>${h.title}</h3><p>${h.short}</p></a>`).join('')}</div>
</div></section>

<section class="section" aria-labelledby="svc-h"><div class="wrap">
  <div class="section-head"><div><h2 id="svc-h">治療期間，我們能幫上的忙</h2><p>多數服務免費，部分補助需要經過社工評估。不確定自己符不符合，先打電話問就好。</p></div><a class="more" href="care/">所有服務 →</a></div>
  <div class="svc">
    ${svcCol('補助申請', CARE.aid.slice(0, 6))}
    ${svcCol('自我照護', CARE.selfcare)}
    ${svcCol('課程講座', CARE.courses)}
    ${svcCol('病友團體', CARE.groups.map(g => [g[0], g[1]]))}
  </div>
</div></section>

<section class="section tint" aria-labelledby="news-h"><div class="wrap">
  <div class="section-head"><h2 id="news-h">最新消息</h2><a class="more" href="news/">更多消息 →</a></div>
  <div class="news">${news.filter(n => !n.pinned).slice(0, 8).map(n => newsRow(n, '')).join('')}</div>
</div></section>

<section class="give" aria-labelledby="give-h"><div class="wrap">
  <div><h2 id="give-h">每月 500 元，陪一個癌症家庭走過治療</h2><p>你的捐款會用在癌友營養品、交通與經濟補助、心理諮商，以及全民防癌教育。捐款可列舉扣除所得稅。</p></div>
  <div class="give-ways">
    <a href="${OLD}donateform.php" target="_blank" rel="noopener"><b>信用卡線上捐款 ↗</b><small>單筆或定期定額</small></a>
    <a href="give/#mobile"><b>行動支付</b><small>LINE Pay、全支付、街口、台灣Pay</small></a>
    <a href="give/#store"><b>超商捐款</b><small>7-ELEVEN、萊爾富、OK</small></a>
    <a href="give/#invoice"><b>發票愛心碼 1799</b><small>結帳時說一聲就好</small></a>
  </div>
</div></section>`;
  write('index.html', layout({ title: '台灣癌症基金會', prefix: p, current: '', body }), '首頁');
}
function svcCol(title, items) {
  return `<div class="svc-col"><h3>${title}</h3><ul>${items.map(([t, h]) => `<li><a href="${h}"${h.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(t)}</a></li>`).join('')}</ul></div>`;
}
function newsRow(n, prefix) {
  return `<a href="${prefix}news/${n.id}.html"><time class="num" datetime="${n.date}">${n.date || '置頂'}</time><h3><span class="tag">${esc(n.tag)}</span>${esc(n.short)}</h3></a>`;
}
function finderControls(id) {
  return `<div class="finder-filter">
    <label class="sr-only" for="finder-q-${id}">篩選癌症</label>
    <input id="finder-q-${id}" class="finder-q" type="search" placeholder="輸入癌症名稱，例如：肝、Lung">
    <div class="chips" role="group" aria-label="依部位篩選">
      <button class="chip" type="button" data-f="all" aria-pressed="true">全部</button>
      <button class="chip" type="button" data-f="top" aria-pressed="false">十大癌症</button>
      ${SYSTEMS.map(s => `<button class="chip" type="button" data-f="${s[0]}" aria-pressed="false">${s[1]}</button>`).join('')}
    </div>
  </div>`;
}

/* cancers */
function cancerPages() {
  const p = '../';
  const grouped = SYSTEMS.map(s => `<div><h2 style="font-size:var(--s-lg);margin-bottom:12px">${s[1]}</h2><div class="cancer-grid">${cancers.filter(c => c.sys[0] === s[0]).map(c => `<a class="cancer" href="${c.slug}.html" data-sys="${c.sys[0]}" data-top="${c.top10 ? 1 : 0}" data-q="${esc(c.name + ' ' + c.en)}"><b>${esc(c.name)}</b><small>${esc(c.en)}</small>${c.top10 ? '<span class="rank">十大癌症</span>' : ''}</a>`).join('')}</div></div>`).join('');
  const idx = pageHead({ prefix: p, crumbs: [['認識癌症']], title: '認識癌症', sub: '依身體部位整理的 30 種常見癌症。每一頁都包含背景成因、臨床症狀、相關檢查、癌症分期與治療方式。' }) +
    `<div class="wrap section" style="display:grid;gap:36px">${finderControls('idx')}<div id="cancer-grid" style="display:grid;gap:36px">${grouped}</div><p class="finder-empty" id="finder-empty" hidden>找不到符合的癌症，試試其他關鍵字。</p>
    <p class="note">這些內容是衛教參考，不能取代醫師的診斷。治療決定請和你的醫療團隊討論；有疑問可撥 02-8787-3881。</p></div>`;
  write('cancer/index.html', layout({ title: '認識癌症｜台灣癌症基金會', prefix: p, current: 'cancer/', body: idx }), '認識癌症');

  for (const c of cancers) {
    const sections = c.sections.map((s, i) => ({ ...s, id: 's' + (i + 1) }));
    const toc = `<nav class="toc" aria-label="本頁段落">${sections.map(s => `<a href="#${s.id}">${esc(s.title)}</a>`).join('')}</nav>`;
    const same = cancers.filter(x => x.sys[0] === c.sys[0]).map(x => [x.name, `${x.slug}.html`]);
    const body = pageHead({
      prefix: p, crumbs: [['認識癌症', 'cancer/'], [c.sys[1]]], title: c.zh, en: c.en,
      meta: `<span>部位：${c.sys[1]}</span>${c.top10 ? '<span>台灣十大癌症</span>' : ''}${c.updated ? `<span>內容更新：<span class="num">${c.updated}</span></span>` : ''}`,
    }) + `<div class="wrap layout">
  <aside class="side">${sideNav('同部位癌症', same, `${c.slug}.html`)}${helpCard}<div><h2>其他部位</h2><nav>${SYSTEMS.filter(s => s[0] !== c.sys[0]).map(s => `<a href="index.html">${s[1]}</a>`).join('')}</nav></div></aside>
  <article class="prose">
    ${toc}
    ${c.intro ? `<div class="prose">${tidy(c.intro, p)}</div>` : ''}
    ${sections.map(s => `<h2 id="${s.id}">${esc(s.title)}</h2>\n${tidy(s.html, p)}`).join('\n')}
    <p class="note">本頁內容由台灣癌症基金會整理，僅供衛教參考，不能取代醫師診斷。原始頁面：${ext(c.srcUrl, '台灣癌症基金會・' + esc(c.name))}</p>
  </article>
</div>`;
    write(`cancer/${c.slug}.html`, layout({ title: `${c.zh}｜台灣癌症基金會`, desc: `${c.zh}的成因、症狀、檢查、分期與治療方式。`, prefix: p, current: 'cancer/', body }), c.zh);
  }
}

/* prevention */
function prevention() {
  const p = '../';
  const side = here => `<aside class="side">${sideNav('五大防癌習慣', [['預防總覽', 'index.html'], ...HABITS.map(h => [h.title, `${h.slug}.html`])], here)}${helpCard}</aside>`;
  const idx = pageHead({ prefix: p, crumbs: [['癌症預防']], title: '癌症預防', sub: '多數癌症和生活習慣有關。從今天開始調整這五件事，就是最實際的防癌。' }) +
    `<div class="wrap section"><div class="habits">${HABITS.map((h, i) => `<a class="habit h${h.c}c" href="${h.slug}.html"><span class="n">習慣 ${i + 1}</span><h3>${h.title}</h3><p>${h.short}</p></a>`).join('')}</div>
    <div class="section-head" style="margin-top:48px"><h2>更多預防資源</h2></div>
    <div class="cards">
      <a class="card" href="${OLD}pagelist.php?keyid=292" target="_blank" rel="noopener"><h3>防癌小博士</h3><p>給孩子的防癌知識與教材</p><span class="ext">原網站 ↗</span></a>
      <a class="card" href="${OLD}pagelist.php?keyid=55" target="_blank" rel="noopener"><h3>防癌小常識</h3><p>常見的防癌迷思與正確觀念</p><span class="ext">原網站 ↗</span></a>
      <a class="card" href="${OLD}catalink.php?keyid=21" target="_blank" rel="noopener"><h3>預防活動資訊</h3><p>各地防癌講座與篩檢活動</p><span class="ext">原網站 ↗</span></a>
      <a class="card" href="https://canceraway579.canceraway.org.tw/index" target="_blank" rel="noopener"><h3>蔬果彩虹579 網站</h3><p>從兒童到銀髮族的蔬果飲食工具</p><span class="ext">外部網站 ↗</span></a>
    </div></div>`;
  write('prevention/index.html', layout({ title: '癌症預防｜台灣癌症基金會', prefix: p, current: 'prevention/', body: idx }), '癌症預防');
  for (const [i, h] of HABITS.entries()) {
    const pg = data.pages[h.key];
    let extra = '';
    if (h.key === 'screening') { const fi = (data.pages.freeScreen.items || []).filter(x => /page\.php/.test(x.href)); const u = [...new Map(fi.map(x => [x.href, x])).values()].slice(0, 10); extra = `<h2>免費五癌篩檢：相關文章</h2><ul>${u.map(x => `<li>${ext(x.href, esc(x.text))}</li>`).join('')}</ul><p>${ext(data.pages.freeScreen.srcUrl, '看全部篩檢文章（原網站）↗')}</p>`; }
    if (h.key === 'p579') extra = `<p>${ext('https://canceraway579.canceraway.org.tw/index', '前往「蔬果彩虹579」專屬網站 ↗')}</p>`;
    const subs = (pg.items || []).filter(x => /pagelist\.php\?keyid=/.test(x.href)).slice(0, 8);
    const subList = subs.length ? `<h2>延伸閱讀</h2><ul>${subs.map(s => `<li>${ext(s.href, esc(s.text))}</li>`).join('')}</ul>` : '';
    const body = pageHead({ prefix: p, crumbs: [['癌症預防', 'prevention/'], [h.title]], title: h.title, sub: h.short, meta: `<span class="h${h.c}c" style="display:inline-flex;align-items:center;gap:6px;font-weight:600;color:var(--ink-2)"><span class="dot" aria-hidden="true"></span>防癌習慣 ${i + 1} / 5</span>` }) +
      `<div class="wrap layout">${side(`${h.slug}.html`)}<article class="prose">${tidy(pg.html, p)}${extra}${subList}<p class="note">原始頁面：${ext(pg.srcUrl, '台灣癌症基金會・' + h.title)}</p></article></div>`;
    write(`prevention/${h.slug}.html`, layout({ title: `${h.title}｜台灣癌症基金會`, prefix: p, current: 'prevention/', body }), h.title);
  }
}

/* care */
function care() {
  const p = '../';
  const cards = (items, note) => `<div class="cards">${items.map(it => `<a class="card" href="${it[1]}" target="_blank" rel="noopener"><h3>${esc(it[0])}</h3>${it[2] ? `<p>${esc(it[2])}</p>` : ''}<span class="ext">${note} ↗</span></a>`).join('')}</div>`;
  const body = pageHead({ prefix: p, crumbs: [['癌友服務']], title: '癌友服務', sub: '治療期間的補助、課程、病友團體和線上諮詢。大多數服務免費，名額有限的會在頁面上說明。' }) +
    `<div class="wrap section" style="display:grid;gap:56px">
  <div class="note" style="max-width:none;display:flex;flex-wrap:wrap;gap:8px 24px;align-items:center"><b>不知道該申請哪一項？</b><span>撥打 <b class="num">02-8787-3881</b>，社工師會依你的狀況建議適合的資源。也可以下載「台癌e照護」App：${ext('https://canceraway.pse.is/ecaring_ios', 'iOS')}・${ext('https://canceraway.pse.is/ecaring_android', 'Android')}</span></div>
  <section id="aid"><div class="section-head"><div><h2>補助申請</h2><p>經濟、營養、交通等實際負擔的支持。各項補助的資格與申請方式，請見各頁說明。</p></div></div>${cards(CARE.aid, '癌症e學苑')}</section>
  <section id="selfcare"><div class="section-head"><div><h2>自我照護</h2><p>治療期間的飲食、副作用照顧、心理調適與復健運動。</p></div></div>${cards(CARE.selfcare, '癌症e學苑')}</section>
  <section id="courses"><div class="section-head"><div><h2>康復課程與講座</h2><p>北部、南部固定開課，另有跨院際巡迴講座與線上直播。</p></div></div>${cards(CARE.courses, '報名資訊')}</section>
  <section id="groups"><div class="section-head"><div><h2>病友支持團體</h2><p>和走過相同路的人聊聊。各團體定期聚會，新朋友隨時可以加入。</p></div></div>${cards(CARE.groups, '團體介紹')}</section>
  <section><div class="section-head"><h2>更多資源</h2></div><div class="cards">
    <a class="card" href="center.html"><h3>癌友關懷教育中心</h3><p>基金會的實體服務據點與服務內容</p></a>
    <a class="card" href="warriors.html"><h3>抗癌鬥士</h3><p>每年表揚的抗癌鬥士與他們的故事</p></a>
    <a class="card" href="https://www.taiwanclinicaltrials.tw/tw/news" target="_blank" rel="noopener"><h3>台灣藥物臨床試驗資訊</h3><p>查詢正在招募的臨床試驗</p><span class="ext">外部網站 ↗</span></a>
  </div></section>
</div>`;
  write('care/index.html', layout({ title: '癌友服務｜台灣癌症基金會', prefix: p, current: 'care/', body }), '癌友服務');
  const simple = (file, key, title, crumb) => {
    const pg = data.pages[key];
    const b = pageHead({ prefix: p, crumbs: [[crumb[0], crumb[1]], [title]], title }) +
      `<div class="wrap layout"><aside class="side">${sideNav('癌友服務', [['服務總覽', 'index.html'], ['癌友關懷教育中心', 'center.html'], ['抗癌鬥士', 'warriors.html']], file)}${helpCard}</aside><article class="prose">${tidy(pg.html, p)}<p class="note">原始頁面：${ext(pg.srcUrl, '台灣癌症基金會・' + title)}</p></article></div>`;
    write(`care/${file}`, layout({ title: `${title}｜台灣癌症基金會`, prefix: p, current: 'care/', body: b }), title);
  };
  simple('center.html', 'careCenter', '癌友關懷教育中心', ['癌友服務', 'care/']);
  simple('warriors.html', 'warrior', '抗癌鬥士', ['癌友服務', 'care/']);
}

/* rights */
function rights() {
  const p = '../';
  const body = pageHead({ prefix: p, crumbs: [['癌友權益']], title: '癌友權益促進', sub: '推動癌症新藥可近性與病友權益，讓經濟條件不再決定治療選擇。' }) +
    `<div class="wrap layout"><aside class="side">${sideNav('癌友權益', [['介紹 TmCDF', '#tmcdf'], ['研究成果', '#research'], ['權益相關消息', `${OLD}pagelist.php?keyid=305`], ['病友心聲', `${OLD}pagelist.php?keyid=308`]], '')}${helpCard}</aside>
    <article class="prose"><h2 id="tmcdf">${esc(data.pages.tmcdf.title)}</h2>${tidy(data.pages.tmcdf.html, p)}<h2 id="research">${esc(data.pages.tmcdfResearch.title)}</h2>${tidy(data.pages.tmcdfResearch.html, p)}</article></div>`;
  write('rights/index.html', layout({ title: '癌友權益促進｜台灣癌症基金會', prefix: p, current: 'rights/', body }), '癌友權益促進');
}

/* give */
function give() {
  const p = '../';
  const way = (id, title, lines) => `<section id="${id}"><h2>${title}</h2>${lines}</section>`;
  const body = pageHead({ prefix: p, crumbs: [['捐款支持']], title: '捐款支持', sub: '每一筆捐款都會用在癌友補助、心理支持與全民防癌教育。以下整理所有捐款方式，選一個你最方便的就好。', meta: '<span>勸募許可：衛部救字第 1141364436 號</span><span>捐款收據可用於列舉扣除</span>' }) +
    `<div class="wrap layout"><aside class="side">${sideNav('捐款方式', [['信用卡線上捐款', '#online'], ['行動支付', '#mobile'], ['超商捐款', '#store'], ['定期定額', '#monthly'], ['郵政劃撥 / ATM', '#bank'], ['手機語音捐款', '#phone'], ['發票愛心碼', '#invoice'], ['遺產與保單捐贈', '#legacy']], '')}
      <div><h2>也可以這樣支持</h2><nav><a href="volunteer.html">加入志工</a><a href="corporate.html">企業合作</a><a href="${OLD}pagelist.php?keyid=94" target="_blank" rel="noopener">捐款芳名錄 ↗</a><a href="${OLD}publish.php?keyid=93" target="_blank" rel="noopener">愛心義賣 ↗</a></nav></div>
      <div class="help"><span class="eyebrow">捐款服務</span><b class="num">02-8787-9907</b><span>收據、姓名公開等問題</span></div></aside>
    <article class="prose">
      ${way('online', '信用卡線上捐款（推薦）', `<p>採用 SSL 256 bit 加密金流。填寫線上捐款資料後選擇刷卡，輸入卡號即可完成，可選單筆或定期定額。</p><p><a class="btn btn-donate" href="${OLD}donateform.php" target="_blank" rel="noopener">前往線上捐款 ↗</a></p>`)}
      ${way('mobile', '行動支付', `<div class="table-scroll"><table><thead><tr><th>方式</th><th>怎麼做</th></tr></thead><tbody>
        <tr><td>LINE Pay</td><td>在線上捐款頁選擇 LINE Pay，用手機 LINE 掃描 QR Code 完成。</td></tr>
        <tr><td>全支付</td><td>在線上捐款頁選擇全支付；電腦版掃 QR Code，手機版會自動跳轉。</td></tr>
        <tr><td>街口支付</td><td>App 首頁「公益捐款」→「特殊醫病」→ 財團法人台灣癌症基金會 → 我要捐款。</td></tr>
        <tr><td>Pi 拍錢包</td><td>iOS 掃描台癌專屬 QR 碼；Android 由「公益捐款」選擇台灣癌症基金會。</td></tr>
        <tr><td>台灣Pay</td><td>掃描台癌專屬 QR 碼，輸入金額與姓名電話。若未顯示姓名欄位，請完成後 Email 告知以開立收據。</td></tr>
      </tbody></table></div>`)}
      ${way('store', '超商捐款', `<ul><li><strong>7-ELEVEN：</strong>ibon「儲值/繳費」→「慈善捐款」→「健康關懷類」→ 台灣癌症基金會；或 OPENPOINT App「服務」→「愛心公益」。</li><li><strong>萊爾富 Life-ET：</strong>繳費・代收 → 愛心捐款 → 台灣癌症基金會。</li><li><strong>OK・go：</strong>繳費 → 愛心捐贈 → 其他社福 → 台灣癌症基金會。</li></ul><p>請保留「代收繳款證明單」，方便日後查詢捐款紀錄。</p>`)}
      ${way('monthly', '定期定額', `<p>每月固定扣款，要停止只需一通電話。可用信用卡傳真授權（傳真 02-8787-5222）、郵局轉帳授權書或銀行 ACH 授權書，填妥後掛號寄回。</p><p>${ext(`${OLD}donate.php`, '下載授權書（原網站）↗')}</p>`)}
      ${way('bank', '郵政劃撥・ATM', `<div class="table-scroll"><table><tbody><tr><th>劃撥帳號</th><td class="num">1909-6916</td></tr><tr><th>戶名</th><td>財團法人台灣癌症基金會</td></tr><tr><th>ATM</th><td>持任何金融卡至台新、中國信託提款機選擇「捐款服務」；該兩行晶片卡免手續費。</td></tr></tbody></table></div>`)}
      ${way('phone', '手機語音捐款', `<ul><li>台灣大哥大：直撥 <b class="num">5180</b> 再按 <b class="num">62</b></li><li>中華電信：直撥 <b class="num">51162</b></li></ul><p>語音捐款專線不收通話費，可線上索取收據。</p>`)}
      ${way('invoice', '發票愛心碼 1799', `<p>在開立電子發票的店家結帳時說出愛心碼 <b class="num">1799</b>，就能把發票捐給基金會。</p>`)}
      ${way('legacy', '遺產與保單捐贈', `<p>可透過遺囑指定將部分或全部遺產捐贈給基金會，或在壽險保單中將「財團法人台灣癌症基金會」列為受益人之一。歡迎來電討論。</p>`)}
      <h2>關於捐款人姓名公開</h2><p>依《財團法人法》第 25 條，基金會須公開前一年度捐贈者的姓名與金額。若不同意公開，請在線上捐款頁勾選「不同意捐款姓名公開揭露」，或致電 02-8787-9907 由專人協助。</p>
    </article></div>`;
  write('give/index.html', layout({ title: '捐款支持｜台灣癌症基金會', prefix: p, current: 'give/', body }), '捐款支持');
  for (const [file, key, title] of [['volunteer.html', 'volunteer', '加入志工'], ['corporate.html', 'corporate', '企業合作']]) {
    const pg = data.pages[key];
    const b = pageHead({ prefix: p, crumbs: [['捐款支持', 'give/'], [title]], title }) +
      `<div class="wrap layout"><aside class="side">${sideNav('支持我們', [['捐款方式', 'index.html'], ['加入志工', 'volunteer.html'], ['企業合作', 'corporate.html']], file)}${helpCard}</aside><article class="prose">${tidy(pg.html, p)}<p class="note">原始頁面：${ext(pg.srcUrl, '台灣癌症基金會・' + title)}</p></article></div>`;
    write(`give/${file}`, layout({ title: `${title}｜台灣癌症基金會`, prefix: p, current: 'give/', body: b }), title);
  }
}

/* library */
function library() {
  const p = '../';
  const body = pageHead({ prefix: p, crumbs: [['台癌圖書館']], title: '台癌圖書館', sub: '基金會出版的書籍、會訊、調查報告與衛教手冊。檔案目前仍存放在原網站。' }) +
    `<div class="wrap section"><div class="cards">${LIBRARY.map(l => `<a class="card" href="${l[1]}" target="_blank" rel="noopener"><h3>${esc(l[0])}</h3><p>${esc(l[2])}</p><span class="ext">原網站 ↗</span></a>`).join('')}</div></div>`;
  write('library/index.html', layout({ title: '台癌圖書館｜台灣癌症基金會', prefix: p, current: 'library/', body }), '台癌圖書館');
}

/* news */
function newsPages() {
  const p = '../';
  const idx = pageHead({ prefix: p, crumbs: [['最新消息']], title: '最新消息', sub: '活動、補助計畫與基金會公告。' }) +
    `<div class="wrap section"><div class="list-rows">${news.map(n => `<a href="${n.id}.html"><time datetime="${n.date}">${n.date || '置頂公告'}</time><div><b><span class="tag">${esc(n.tag)}</span>${esc(n.short)}</b></div></a>`).join('')}</div>
    <p style="margin-top:24px">${ext(`${OLD}pagelist.php?keyid=1`, '查看更早的消息（原網站）↗')}</p></div>`;
  write('news/index.html', layout({ title: '最新消息｜台灣癌症基金會', prefix: p, current: 'news/', body: idx }), '最新消息');
  for (const n of news) {
    const body = pageHead({ prefix: p, crumbs: [['最新消息', 'news/'], [n.tag]], title: n.short, meta: `<span class="tag">${esc(n.tag)}</span>${n.date ? `<time class="num" datetime="${n.date}">${n.date}</time>` : ''}` }) +
      `<div class="wrap layout"><aside class="side">${sideNav('其他消息', news.filter(x => x.id !== n.id).slice(0, 6).map(x => [x.short.slice(0, 26) + (x.short.length > 26 ? '…' : ''), `${x.id}.html`]), '')}${helpCard}</aside><article class="prose">${tidy(n.html, p)}<p class="note">原始頁面：${ext(n.srcUrl, '台灣癌症基金會')}</p></article></div>`;
    write(`news/${n.id}.html`, layout({ title: `${n.short}｜台灣癌症基金會`, prefix: p, current: 'news/', body }), n.short);
  }
}

/* about */
function about() {
  const p = '../';
  const side = here => `<aside class="side">${sideNav('關於我們', [['基金會緣起', 'index.html'], ['服務項目', 'services.html'], ['榮耀共享', 'honor.html'], ['組織架構', `${OLD}pagelist.php?keyid=23`], ['年度報告', `${OLD}doclist.php?keyid=125`], ['媒體報導', `${OLD}pagelist.php?keyid=2`]], here)}${helpCard}</aside>`;
  const body = pageHead({ prefix: p, crumbs: [['關於我們']], title: '構築全民無癌希望工程', sub: '「癌症不是絕症」、「癌症可以預防」。台灣癌症基金會於民國 86 年 12 月成立，推動防癌教育、癌症研究與癌友關懷。' }) +
    `<div class="wrap layout">${side('index.html')}<article class="prose">
      <h2>我們的五個目標</h2><ul><li>推廣全民防癌教育</li><li>促進癌症研究發展</li><li>推動癌症防治相關政策</li><li>提高癌症治療水準</li><li>落實癌友關懷服務</li></ul>
      <h2>基金會緣起</h2>${tidy(data.pages.origin.html.split('25 年來')[0], p)}
      <p>25 年來，基金會在社會各界的支持下，秉持初衷，朝著目標邁進。感謝每一位志工與捐款人，讓我們能繼續打造無癌希望工程。</p>
      <p class="note">原始頁面：${ext(data.pages.origin.srcUrl, '基金會緣起')}・${ext(data.pages.mission.srcUrl, '宗旨與目標')}</p>
    </article></div>`;
  write('about/index.html', layout({ title: '關於我們｜台灣癌症基金會', prefix: p, current: 'about/', body }), '關於我們');
  for (const [file, key, title] of [['services.html', 'services', '服務項目'], ['honor.html', 'honor', '榮耀共享']]) {
    const pg = data.pages[key];
    const b = pageHead({ prefix: p, crumbs: [['關於我們', 'about/'], [title]], title }) +
      `<div class="wrap layout">${side(file)}<article class="prose">${tidy(pg.html, p)}<p class="note">原始頁面：${ext(pg.srcUrl, '台灣癌症基金會・' + title)}</p></article></div>`;
    write(`about/${file}`, layout({ title: `${title}｜台灣癌症基金會`, prefix: p, current: 'about/', body: b }), title);
  }
}

/* single pages at root */
function misc() {
  const p = '';
  const contact = pageHead({ prefix: p, crumbs: [['聯絡我們']], title: '聯絡我們', sub: '有任何癌症相關問題，都可以先打電話或用 App 問我們。' }) +
    `<div class="wrap section"><div class="cards">
      <div class="card"><span class="eyebrow">癌友諮詢專線</span><h3 class="num">02-8787-3881</h3><p>護理師、營養師、社工師免費諮詢。週一至週五 09:00–17:30。</p></div>
      <div class="card"><span class="eyebrow">捐款服務</span><h3 class="num">02-8787-9907</h3><p>捐款收據、姓名公開與定期定額異動。傳真：02-8787-5222</p></div>
      <div class="card"><span class="eyebrow">線上諮詢</span><h3>台癌e照護 App</h3><p>線上諮詢服務已移到 App。${ext('https://canceraway.pse.is/ecaring_ios', 'iOS 下載')}・${ext('https://canceraway.pse.is/ecaring_android', 'Android 下載')}</p></div>
      <div class="card"><span class="eyebrow">Email</span><h3>5aday@canceraway.org.tw</h3><p>捐款收據資料或一般詢問。</p></div>
    </div></div>`;
  write('contact.html', layout({ title: '聯絡我們｜台灣癌症基金會', prefix: p, current: 'about/', body: contact }), '聯絡我們');
  const pv = data.pages.privacy;
  write('privacy.html', layout({ title: '隱私政策｜台灣癌症基金會', prefix: p, current: '', body: pageHead({ prefix: p, crumbs: [['隱私政策']], title: '隱私政策' }) + `<div class="wrap section"><article class="prose">${tidy(pv.html, p)}</article></div>` }), '隱私政策');
  write('search.html', layout({ title: '搜尋｜台灣癌症基金會', prefix: p, current: '', body: pageHead({ prefix: p, crumbs: [['搜尋']], title: '搜尋' }) + `<div class="wrap section"><form class="hero-search" action="search.html" role="search" style="margin:0 0 24px"><label class="sr-only" for="q2">搜尋</label><input id="q2" name="q" type="search" placeholder="輸入關鍵字"><button class="btn btn-calm" type="submit">搜尋</button></form><p id="search-status" class="meta"></p><div class="list-rows" id="search-results"></div></div>` }), '搜尋');
}

/* sitemap page: new IA + where each old section went */
function sitemapPage(oldMap) {
  const p = '';
  const groups = {};
  for (const pg of pagesOut) {
    const top = pg.rel.includes('/') ? pg.rel.split('/')[0] : '_';
    (groups[top] = groups[top] || []).push(pg);
  }
  const names = { _: '主要頁面', cancer: '認識癌症', prevention: '癌症預防', care: '癌友服務', rights: '癌友權益', give: '捐款支持', library: '台癌圖書館', news: '最新消息', about: '關於我們' };
  const body = pageHead({ prefix: p, crumbs: [['網站地圖']], title: '網站地圖', sub: `新版網站共 ${pagesOut.length + 1} 頁。下方另列出原網站各區塊在新版的位置。` }) +
    `<div class="wrap section" style="display:grid;gap:48px"><div class="smap">${Object.entries(groups).map(([k, list]) => `<div><h2>${names[k] || k}</h2><ul>${list.map(x => `<li><a href="${x.rel}">${esc(x.title)}</a></li>`).join('')}</ul></div>`).join('')}</div>
    <div><div class="section-head"><div><h2>原網站對照</h2><p>原網站選單上的每個項目，在新版中的位置。</p></div></div><div class="smap">${oldMap}</div></div></div>`;
  write('sitemap.html', layout({ title: '網站地圖｜台灣癌症基金會', prefix: p, current: '', body }), '網站地圖');
}

/* search index for the client-side search */
function searchIndex() {
  const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const idx = [
    ...cancers.map(c => ({ t: c.zh, u: `cancer/${c.slug}.html`, k: '癌症', x: (c.en + ' ' + strip(c.intro) + ' ' + c.sections.map(s => strip(s.html)).join(' ')).slice(0, 1500) })),
    ...HABITS.map(h => ({ t: h.title, u: `prevention/${h.slug}.html`, k: '預防', x: h.short + ' ' + strip(data.pages[h.key].html).slice(0, 800) })),
    ...CARE.aid.map(a => ({ t: a[0], u: 'care/#aid', k: '補助', x: '癌友 補助 申請 ' + a[0] })),
    ...CARE.courses.map(a => ({ t: a[0], u: 'care/#courses', k: '課程', x: '課程 講座 報名' })),
    ...CARE.groups.map(a => ({ t: a[0], u: 'care/#groups', k: '病友團體', x: a[2] })),
    ...news.map(n => ({ t: n.short, u: `news/${n.id}.html`, k: '消息', x: strip(n.html).slice(0, 600) })),
    { t: '捐款支持', u: 'give/', k: '支持', x: '捐款 信用卡 LINE Pay 超商 劃撥 1909-6916 發票 1799 定期定額' },
    { t: '加入志工', u: 'give/volunteer.html', k: '支持', x: '志工 招募' },
    { t: '癌友權益促進', u: 'rights/', k: '權益', x: 'TmCDF 新藥 基金 ' + strip(data.pages.tmcdf.html).slice(0, 400) },
    { t: '聯絡我們', u: 'contact.html', k: '聯絡', x: '電話 諮詢 02-8787-3881 App e照護' },
  ];
  fs.writeFileSync(path.join(OUT, 'assets', 'search-index.json'), JSON.stringify(idx));
}

/* ---------------------------------------------------------- run */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
for (const f of ['style.css', 'main.js', 'favicon.svg']) fs.copyFileSync(path.join(__dirname, 'assets', f), path.join(OUT, 'assets', f));
home(); cancerPages(); prevention(); care(); rights(); give(); library(); newsPages(); about(); misc(); searchIndex();
const oldMap = require('./old-map.js')(cancers);
sitemapPage(oldMap);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
console.log(`Built ${pagesOut.length} pages into docs/`);
