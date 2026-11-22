// 台灣癌症基金會 改版提案 — small progressive enhancements
(function () {
  var root = document.body.getAttribute('data-root') || '';

  // mobile menu
  var tog = document.querySelector('.menu-toggle');
  var nav = document.getElementById('mainnav');
  if (tog && nav) tog.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    tog.setAttribute('aria-expanded', open ? 'true' : 'false');
    tog.querySelector('.tg-label').textContent = open ? '關閉' : '選單';
    tog.querySelector('.tg-icon').textContent = open ? '✕' : '☰';
    tog.setAttribute('aria-label', open ? '關閉選單' : '選單');
    if (!open) fitHeader();
  });

  // switch the header to its compact (menu button) form whenever the full menu
  // doesn't fit on one row — this follows font size and zoom, not a fixed width
  var header = document.querySelector('.site-header');
  var bar = header && header.querySelector('.bar');
  function fitHeader() {
    if (!bar || !nav) return;
    if (nav.classList.contains('open')) return;
    header.classList.remove('compact', 'tight', 'tighter', 'tightest');
    var brand = bar.querySelector('.brand'), give = bar.querySelector('.btn-donate');
    var room = function () { var cs = getComputedStyle(bar); return bar.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); };
    var gap = function () { return parseFloat(getComputedStyle(bar).columnGap) || 10; };
    // 1) full menu on one row? otherwise switch to the menu button
    if (getComputedStyle(tog).display === 'none') {
      if (brand.offsetWidth + nav.scrollWidth + give.offsetWidth + gap() * 2 > room()) header.classList.add('compact');
    }
    // 2) compact row (logo + donate + menu button) on one row? otherwise step down:
    //    short donate label → icon-only menu button → logo without its name
    if (getComputedStyle(tog).display !== 'none') {
      var steps = ['tight', 'tighter', 'tightest'];
      for (var i = 0; i < steps.length; i++) {
        if (brand.offsetWidth + give.offsetWidth + tog.offsetWidth + gap() * 2 <= room()) break;
        header.classList.add(steps[i]);
      }
    }
  }
  fitHeader();
  window.addEventListener('resize', fitHeader);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeader);
  if (window.ResizeObserver && bar) new ResizeObserver(function () { fitHeader(); }).observe(document.documentElement);

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
    // arriving as cancer/index.html#digest → show that body system
    var fromHash = function () {
      var h = decodeURIComponent(location.hash.slice(1));
      var chip = h && document.querySelector('.chip[data-f="' + h + '"]');
      if (!chip) return;
      chip.click();
      var target = document.getElementById(h) || grid;
      var go = function () { target.scrollIntoView({ block: 'start', behavior: 'instant' }); };
      go();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(go);
      window.addEventListener('load', go, { once: true });
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
  }

  // keep #anchors clear of the sticky header: expose its height to CSS
  var setHeadH = function () {
    if (header) document.documentElement.style.setProperty('--head-h', header.getBoundingClientRect().height + 'px');
  };
  setHeadH();
  window.addEventListener('resize', setHeadH);
  // Web fonts arrive after the browser's first jump to #section and shift the layout,
  // so re-align to the target once fonts and images have settled.
  var realign = function () {
    setHeadH();
    var id = decodeURIComponent(location.hash.slice(1));
    var t = id && id !== 'main' && document.getElementById(id);
    if (t && !(grid && document.querySelector('.chip[data-f="' + id + '"]'))) t.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  if (location.hash) {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(realign);
    window.addEventListener('load', realign);
    // for the first few seconds, if the header changes height (fonts, compact mode),
    // re-align — unless the reader has already started scrolling on their own
    var userMoved = false, started = Date.now();
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function () { userMoved = true; }, { once: true, passive: true }); });
    if (window.ResizeObserver && header) new ResizeObserver(function () {
      if (!userMoved && Date.now() - started < 3000) realign();
    }).observe(header);
  } else if (document.fonts && document.fonts.ready) document.fonts.ready.then(setHeadH);

  // side menu scroll-spy: mark the section currently being read
  var spyLinks = [].slice.call(document.querySelectorAll('.side nav a[data-spy]'));
  if (spyLinks.length) {
    var spy = function () {
      var line = (header ? header.getBoundingClientRect().bottom : 0) + 40;
      var current = spyLinks[0];
      spyLinks.forEach(function (a) {
        var t = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
        if (t && t.getBoundingClientRect().top <= line) current = a;
      });
      // at the very bottom, the last section is the one being read
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = spyLinks[spyLinks.length - 1];
      spyLinks.forEach(function (a) {
        var on = a === current;
        a.classList.toggle('on', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    spy();
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    window.addEventListener('hashchange', function () { setTimeout(spy, 50); });
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
