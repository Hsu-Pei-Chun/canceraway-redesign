// Where each item of the old site's main menu lives in the redesign
const nav = require('./data/nav.json');
const MAP = {
  癌症預防: { 蔬果彩虹579: 'prevention/579.html', 規律運動: 'prevention/exercise.html', 體重控制: 'prevention/weight.html', 遠離菸檳: 'prevention/smoke-free.html', 定期篩檢: 'prevention/screening.html', _: 'prevention/' },
  '癌症e學苑(癌友服務)': { 抗癌鬥士: 'care/warriors.html', 線上諮詢: 'contact.html', 癌友關懷教育中心: 'care/center.html', _: 'care/' },
  癌友權益促進: { _: 'rights/' },
  捐款與支持: { 志工招募: 'give/volunteer.html', 企業參與: 'give/corporate.html', _: 'give/' },
  台癌圖書館: { _: 'library/' },
  關於基金會: { 服務項目: 'about/services.html', 最新消息: 'news/', 榮耀共享: 'about/honor.html', _: 'about/' },
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
module.exports = (cancers) => {
  const seen = new Set();
  return nav.out.filter(g => { if (seen.has(g.top) || !(g.top in MAP || g.top === '台灣常見癌症')) return false; seen.add(g.top); return true; }).map(g => {
    const rows = g.subs.map(s => {
      const [name, href] = s.split(' | ');
      if (href === '#') return '';
      let to;
      if (g.top === '台灣常見癌症') { const c = cancers.find(c => c.name === name); to = c ? `cancer/${c.slug}.html` : 'cancer/'; }
      else to = MAP[g.top][name] || MAP[g.top]._;
      const old = href.startsWith('http') ? href : 'https://www.canceraway.org.tw/' + href;
      const short = old.replace(/^https:\/\/(www\.)?/, '').replace('canceraway.org.tw/', '').replace(/(\?id=)[^&]+/, '$1…');
      return `<li><a href="${to}">${esc(name)}</a><span class="old">原：${esc(short)}</span></li>`;
    }).join('');
    return `<div><h2>${esc(g.top.replace('(癌友服務)', ''))}</h2><ul>${rows}</ul></div>`;
  }).join('');
};
