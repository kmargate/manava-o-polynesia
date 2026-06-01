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

  /* ─── NUMBER COUNTERS ─── */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function animateCounter(el) {
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix || '';
      var duration = 1400;
      var start = performance.now();
      (function step(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }(start));
    }

    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-n[data-count]').forEach(function (el) {
      cObs.observe(el);
    });
  }());

  /* ─── HERO PARALLAX ─── */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var pat = document.querySelector('.hero-pat');
    var hero = document.querySelector('.hero');
    if (!pat || !hero) return;

    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled <= hero.offsetHeight) {
        pat.style.transform = 'translateY(' + (scrolled * 0.35) + 'px)';
      }
    }, { passive: true });
  }());

  /* ─── DONATE MODAL ─── */
  (function () {
    var modal;
    var selectedFreq = 'once';
    var selectedAmt = 50;

    function init() {
      modal = document.getElementById('donate-modal');
    }

    window.openDonateModal = function () {
      if (!modal) init();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    window.closeDonateModal = function () {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    window.dmOverlayClick = function (e) {
      if (e.target === modal) closeDonateModal();
    };

    window.dmSetFreq = function (btn) {
      modal.querySelectorAll('.dm-tab').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedFreq = btn.dataset.freq;
    };

    window.dmSelectAmt = function (btn) {
      modal.querySelectorAll('.dm-amt').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var other = document.getElementById('dm-other-wrap');
      if (btn.dataset.amount === 'other') {
        selectedAmt = 'other';
        other.style.display = 'block';
        document.getElementById('dm-custom-amt').focus();
      } else {
        selectedAmt = parseInt(btn.dataset.amount, 10);
        other.style.display = 'none';
      }
    };

    window.dmSubmit = function () {
      var amt = selectedAmt === 'other'
        ? parseFloat(document.getElementById('dm-custom-amt').value)
        : selectedAmt;
      if (!amt || amt <= 0) {
        document.getElementById('dm-custom-amt').focus();
        return;
      }
      // TODO: replace with real payment processor URL
      // e.g. window.open('https://donate.stripe.com/...?amount=' + Math.round(amt * 100), '_blank');
      alert('Donation flow coming soon!\nAmount: $' + amt + ' (' + selectedFreq + ')');
    };

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeDonateModal();
    });
  }());
