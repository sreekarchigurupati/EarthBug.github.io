/* sreekar.ch — Research Instrument edition
   - reading progress
   - custom crosshair cursor
   - header auto-hide on scroll-down
   - live clock in hero topline
   - magnetic hover on headline/cta
   - cursor spotlight on .about-card
   - code-block copy buttons
   - ⌘K command palette
*/
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Reading progress bar ---------- */
  function initProgress() {
    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(bar);
    var fill = bar.firstElementChild;
    function tick() {
      var h = document.documentElement;
      var total = (h.scrollHeight - h.clientHeight) || 1;
      var p = Math.min(1, Math.max(0, h.scrollTop / total));
      fill.style.transform = 'scaleX(' + p + ')';
    }
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    tick();
  }

  /* ---------- 2. Custom crosshair cursor ---------- */
  function initCursor() {
    if (reduced) return;
    if (window.matchMedia('(hover: none)').matches) return;
    var ret = document.querySelector('.cursor-reticle');
    if (!ret) return;

    var x = innerWidth / 2, y = innerHeight / 2;
    var tx = x, ty = y;
    var ready = false;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!ready) { ret.classList.add('is-ready'); ready = true; }
    });

    document.addEventListener('mouseleave', function () { ret.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { if (ready) ret.style.opacity = ''; });

    var hoverSel = 'a, button, .cmdk-item, .project-card, .about-card, .post-list > li, .pub-item, .timeline-item, [data-magnetic]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(hoverSel)) ret.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(hoverSel)) ret.classList.remove('is-hover');
    });

    (function loop() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      ret.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 3. Header auto-hide ---------- */
  function initHeaderHide() {
    var h = document.querySelector('.site-header[data-hide-on-scroll]');
    if (!h) return;
    var last = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY || 0;
      if (y < 80) { h.classList.remove('is-hidden'); last = y; return; }
      if (y > last + 6) h.classList.add('is-hidden');
      else if (y < last - 6) h.classList.remove('is-hidden');
      last = y;
    }, { passive: true });
  }

  /* ---------- 4. Local time in hero topline ---------- */
  function initClock() {
    var el = document.getElementById('localTime');
    if (!el) return;
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      var d = new Date();
      var hh = pad(d.getHours());
      var mm = pad(d.getMinutes());
      var ss = pad(d.getSeconds());
      var tz;
      try {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace(/_/g, ' ');
      } catch (e) { tz = 'LOCAL'; }
      el.textContent = hh + ':' + mm + ':' + ss + ' — ' + tz;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 5. Magnetic hover ---------- */
  function initMagnetic() {
    if (reduced) return;
    var targets = document.querySelectorAll('.buttonDownload, .project-links a, .hero-meta a');
    Array.prototype.forEach.call(targets, function (el) {
      var rect;
      el.addEventListener('mouseenter', function () { rect = el.getBoundingClientRect(); });
      el.addEventListener('mousemove', function (e) {
        if (!rect) rect = el.getBoundingClientRect();
        var mx = e.clientX - (rect.left + rect.width / 2);
        var my = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = 'translate(' + mx * 0.18 + 'px,' + my * 0.22 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
        rect = null;
      });
    });
  }

  /* ---------- 6. Cursor spotlight on cards ---------- */
  function initSpotlight() {
    var SEL = '.about-card, .project-card, .gh-card';
    document.addEventListener('mousemove', function (e) {
      var t = e.target.closest ? e.target.closest(SEL) : null;
      if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ---------- 7. Code-block copy buttons ---------- */
  function initCodeCopy() {
    var blocks = document.querySelectorAll('pre');
    Array.prototype.forEach.call(blocks, function (pre) {
      if (pre.querySelector('.copy-btn')) return;
      var original = pre.innerText;
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'Copy';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var done = function (ok) {
          btn.textContent = ok ? 'Copied ✓' : 'Failed';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(original).then(function () { done(true); }, function () { done(false); });
        } else {
          done(false);
        }
      });
      pre.appendChild(btn);
    });
  }

  /* ---------- 8. Command palette (⌘K / Ctrl+K) ---------- */
  var openPalette;
  function initPalette() {
    var entries = [
      { label: 'Home',                 url: '/',              kind: 'Navigate' },
      { label: 'About',                url: '/about/',        kind: 'Navigate' },
      { label: 'Projects',             url: '/projects/',     kind: 'Navigate' },
      { label: 'Publications',         url: '/publications/', kind: 'Navigate' },
      { label: 'News',                 url: '/news/',         kind: 'Navigate' },
      { label: 'Now',                  url: '/now/',          kind: 'Navigate' },
      { label: 'CV',                   url: '/cv/',           kind: 'Navigate' },
      { label: 'Archive',              url: '/archive/',      kind: 'Navigate' },
      { label: 'Talks',                url: '/talks/',        kind: 'Navigate' },
      { label: 'Gallery',              url: '/gallery/',      kind: 'Navigate' },
      { label: 'Contact',              url: '/contact/',      kind: 'Navigate' },
      { label: 'Search posts',         url: '/search/',       kind: 'Action'   },
      { label: 'Download CV (PDF)',    url: '/assets/cv.pdf', kind: 'Action'   },
      { label: 'GitHub',               url: 'https://github.com/sreekarchigurupati', kind: 'External' },
      { label: 'Google Scholar',       url: 'https://scholar.google.com/citations?user=BXjw99IAAAAJ', kind: 'External' },
      { label: 'LinkedIn',             url: 'https://www.linkedin.com/in/sreekar-chigurupati', kind: 'External' },
      { label: 'Instagram',            url: 'https://instagram.com/sreekarchigurupati', kind: 'External' },
      { label: 'Email me',             url: 'mailto:chigurupatisreekar@gmail.com', kind: 'External' }
    ];

    var host = document.createElement('div');
    host.className = 'cmdk';
    host.innerHTML =
      '<div class="cmdk-backdrop"></div>' +
      '<div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Command palette">' +
      '  <div class="cmdk-input-wrap">' +
      '    <span class="cmdk-search-icon" aria-hidden="true">⌕</span>' +
      '    <input class="cmdk-input" type="text" placeholder="Jump to or search…" autocomplete="off" spellcheck="false">' +
      '    <kbd class="cmdk-esc">esc</kbd>' +
      '  </div>' +
      '  <ul class="cmdk-list" role="listbox"></ul>' +
      '  <div class="cmdk-hint">' +
      '    <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>' +
      '    <span><kbd>↵</kbd> select</span>' +
      '    <span><kbd>esc</kbd> close</span>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(host);

    var input = host.querySelector('.cmdk-input');
    var list = host.querySelector('.cmdk-list');
    var backdrop = host.querySelector('.cmdk-backdrop');
    var active = 0;
    var filtered = entries.slice();

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
      });
    }
    function render() {
      if (!filtered.length) {
        list.innerHTML = '<li class="cmdk-empty">No matches</li>';
        return;
      }
      list.innerHTML = filtered.map(function (e, i) {
        return '<li class="cmdk-item ' + (i === active ? 'is-active' : '') +
               '" data-i="' + i + '" role="option">' +
               '<span class="cmdk-label">' + escapeHtml(e.label) + '</span>' +
               '<span class="cmdk-kind">' + e.kind + '</span></li>';
      }).join('');
    }
    function filter() {
      var q = input.value.trim().toLowerCase();
      filtered = q
        ? entries.filter(function (e) { return e.label.toLowerCase().indexOf(q) !== -1; })
        : entries.slice();
      active = 0;
      render();
    }
    function open() {
      host.classList.add('is-open');
      input.value = '';
      filtered = entries.slice();
      active = 0;
      render();
      setTimeout(function () { input.focus(); }, 10);
    }
    function close() { host.classList.remove('is-open'); }
    openPalette = open;

    function pick(i) {
      var e = filtered[i];
      if (!e) return;
      close();
      if (/^https?:|^mailto:/.test(e.url)) window.open(e.url, '_blank');
      else window.location.href = e.url;
    }

    document.addEventListener('keydown', function (ev) {
      var meta = ev.metaKey || ev.ctrlKey;
      if (meta && (ev.key === 'k' || ev.key === 'K')) {
        ev.preventDefault();
        host.classList.contains('is-open') ? close() : open();
        return;
      }
      if (!host.classList.contains('is-open')) return;
      if (ev.key === 'Escape') { ev.preventDefault(); close(); }
      else if (ev.key === 'ArrowDown') { ev.preventDefault(); active = Math.min(filtered.length - 1, active + 1); render(); scrollActive(); }
      else if (ev.key === 'ArrowUp')   { ev.preventDefault(); active = Math.max(0, active - 1); render(); scrollActive(); }
      else if (ev.key === 'Enter')     { ev.preventDefault(); pick(active); }
    });
    function scrollActive() {
      var el = list.querySelector('.cmdk-item.is-active');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('input', filter);
    backdrop.addEventListener('click', close);
    list.addEventListener('click', function (ev) {
      var li = ev.target.closest('.cmdk-item');
      if (li) pick(parseInt(li.getAttribute('data-i'), 10));
    });
    list.addEventListener('mousemove', function (ev) {
      var li = ev.target.closest('.cmdk-item');
      if (!li) return;
      var i = parseInt(li.getAttribute('data-i'), 10);
      if (i !== active) { active = i; render(); }
    });

    /* header nav "⌘K" link opens palette */
    var navBtns = document.querySelectorAll('[data-open-cmdk]');
    Array.prototype.forEach.call(navBtns, function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(); });
    });
  }

  /* ---------- boot ---------- */
  ready(function () {
    initProgress();
    initCursor();
    initHeaderHide();
    initClock();
    initSpotlight();
    initMagnetic();
    initCodeCopy();
    initPalette();
  });
})();
