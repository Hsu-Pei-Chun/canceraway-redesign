// 台灣癌症基金會 改版提案 — small progressive enhancements
(function () {
  var root = document.body.getAttribute('data-root') || '';

  // mobile menu
  var tog = document.querySelector('.menu-toggle');
  var nav = document.getElementById('mainnav');
  if (tog && nav) tog.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    tog.setAttribute('aria-expanded', open ? 'true' : 'false');
    tog.textContent = open ? '關閉' : '選單';
  });

  // cancer finder: text filter + body-system chips
  var grid = document.getElementById('cancer-grid');
  if (grid) {
    var q = document.querySelector('.finder-q');
    var chips = document.querySelectorAll('.chip');
    var empty = document.getElementById('finder-empty');
    var filter = 'all';
    var apply = function () {
      var term = (q && q.value || '').trim().toLowerCase();
      var shown = 0;
      grid.querySelectorAll('.cancer').forEach(function (el) {
        var okF = filter === 'all' || (filter === 'top' ? el.dataset.top === '1' : el.dataset.sys === filter);
        var okQ = !term || el.dataset.q.toLowerCase().indexOf(term) > -1;
        el.hidden = !(okF && okQ);
        if (!el.hidden) shown++;
      });
      // hide empty group blocks on the index page
      grid.querySelectorAll(':scope > div').forEach(function (g) {
        g.hidden = !g.querySelector('.cancer:not([hidden])');
      });
      if (empty) empty.hidden = shown > 0;
    };
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        filter = c.dataset.f;
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        apply();
      });
    });
    if (q) q.addEventListener('input', apply);
  }

  // newsletter (proposal only — not connected)
  var sub = document.getElementById('subscribe');
  if (sub) sub.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('sub-email');
    var msg = document.getElementById('sub-msg');
    if (!input.value || !input.checkValidity()) { msg.textContent = '請輸入正確的電子郵件地址。'; input.focus(); return; }
    msg.textContent = '這是設計提案，訂閱功能尚未串接。正式上線後會寄出確認信。';
  });

  // client-side search
  var results = document.getElementById('search-results');
  if (results) {
    var params = new URLSearchParams(location.search);
    var term = (params.get('q') || '').trim();
    var status = document.getElementById('search-status');
    var box = document.getElementById('q2');
    if (box) box.value = term;
    if (!term) { status.textContent = '輸入癌症名稱、症狀或服務名稱來搜尋。'; return; }
    fetch(root + 'assets/search-index.json').then(function (r) { return r.json(); }).then(function (idx) {
      var t = term.toLowerCase();
      var hits = idx.map(function (it) {
        var s = 0;
        if (it.t.toLowerCase().indexOf(t) > -1) s += 10;
        if (it.x.toLowerCase().indexOf(t) > -1) s += 1;
        return { it: it, s: s };
      }).filter(function (h) { return h.s > 0; }).sort(function (a, b) { return b.s - a.s; });
      status.textContent = hits.length ? '「' + term + '」找到 ' + hits.length + ' 筆結果' : '找不到「' + term + '」的結果。可以換個說法，或撥打 02-8787-3881 詢問。';
      results.innerHTML = '';
      hits.slice(0, 40).forEach(function (h) {
        var a = document.createElement('a');
        a.href = root + h.it.u;
        var k = document.createElement('span'); k.className = 'tag'; k.textContent = h.it.k;
        var tt = document.createElement('div'); var b = document.createElement('b'); b.textContent = h.it.t; tt.appendChild(b);
        var i = h.it.x.toLowerCase().indexOf(t);
        if (i > -1) { var p = document.createElement('p'); p.textContent = '…' + h.it.x.slice(Math.max(0, i - 30), i + 60) + '…'; tt.appendChild(p); }
        a.appendChild(k); a.appendChild(tt);
        results.appendChild(a);
      });
    }).catch(function () { status.textContent = '搜尋暫時無法使用，請稍後再試。'; });
  }
})();
