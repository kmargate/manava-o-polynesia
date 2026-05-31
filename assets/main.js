function toggleNav(btn) {
    btn.classList.toggle('open');
    document.querySelector('.nav-links').classList.toggle('open');
  }

  function closeNav() {
    document.querySelector('.nav-toggle').classList.remove('open');
    document.querySelector('.nav-links').classList.remove('open');
  }

  function parseCSV(text) {
    const rows = [];
    const lines = text.split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const fields = [];
      let field = '', inQ = false;
      for (let j = 0; j < line.length; j++) {
        const c = line[j];
        if (c === '"') { inQ = !inQ; }
        else if (c === ',' && !inQ) { fields.push(field); field = ''; }
        else { field += c; }
      }
      fields.push(field);
      rows.push(fields);
    }
    return rows;
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ─── SCROLL-TRIGGERED REVEAL ─── */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    var SOLO = '.eyebrow, .sec-title, .sec-sub, .page-header, .cform, .donate-box';
    var CHILD = '.tile, .tc, .stat, .dark-card, .gold-card, .ev, .gc, .ci';

    function stagger(parent) {
      parent.querySelectorAll(CHILD).forEach(function (el, i) {
        el.classList.add('reveal');
        if (i < 6) el.classList.add('d' + (i + 1));
        observer.observe(el);
      });
    }

    function init() {
      document.querySelectorAll(SOLO).forEach(function (el) {
        if (el.closest('.hero')) return;
        el.classList.add('reveal');
        observer.observe(el);
      });
      var GRIDS = '.tiles, .team-grid, .about-grid, .stats-bar, .ev-list, .gal-grid, .contact-grid, .cinfo';
      document.querySelectorAll(GRIDS).forEach(stagger);
    }

    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', init)
      : init();

    ['ev-list', 'gal-list'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var mo = new MutationObserver(function () { stagger(el); mo.disconnect(); });
      mo.observe(el, { childList: true });
    });
  }());
