/*  GSAP hero prototype — Mānava O Polynesia   (branch: prototype/gsap-hero)
 *  Adds: hero entrance choreography, manta "draw-on" (stroke animation), stats
 *  count-up, and gentle scroll reveals. Uses locally-vendored GSAP (assets/vendor/).
 *
 *  Safety:
 *   - Honors prefers-reduced-motion (renders the natural page, no motion).
 *   - Degrades gracefully if GSAP fails to load (a <head> failsafe reveals everything).
 *   - No-JS visitors are unaffected (the intro gate is only ever added by JS).
 */
(function () {
  'use strict';

  var docEl = document.documentElement;

  // We're running — cancel the <head> failsafe that force-reveals on load failure.
  if (window.__gsapFailsafe) { clearTimeout(window.__gsapFailsafe); window.__gsapFailsafe = null; }

  var reduce = !window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion, or GSAP missing → show the natural page and stop.
  if (reduce || typeof window.gsap === 'undefined') {
    docEl.classList.remove('gsap-intro');
    return;
  }

  var gsap = window.gsap;
  var hasST = typeof window.ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(window.ScrollTrigger);

  /* ---------------- HERO INTRO TIMELINE ---------------- */
  var mainG = document.querySelector('.hero-pat .manta-main');
  var halo  = document.querySelector('.hero-pat .manta-halo');
  var strokes = Array.prototype.slice.call(
    document.querySelectorAll('.hero-pat .manta-main path, .hero-pat .manta-main line')
  );

  // Prime each stroked path/line for a draw-in via stroke-dashoffset.
  strokes.forEach(function (el) {
    var len = 0;
    try { len = el.getTotalLength(); } catch (e) {}
    if (len) gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  });

  var heroBits = ['.hero-content .eyebrow', '.hero-content .hero-title',
                  '.hero-content .hero-body', '.hero-content .hero-cta']
                 .map(function (s) { return document.querySelector(s); })
                 .filter(Boolean);
  var heroRight = document.querySelector('.hero-right');

  var tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: function () { docEl.classList.remove('gsap-intro'); } // resume CSS manta loops
  });

  // Reveal the manta group (strokes still hidden by dashoffset), fade the glow halo up.
  tl.set(mainG, { opacity: 1 }, 0);
  if (halo) tl.fromTo(halo, { opacity: 0 }, { opacity: 0.28, duration: 1.2 }, 0);

  // Draw the ray in.
  if (strokes.length) {
    tl.to(strokes, { strokeDashoffset: 0, duration: 2.1, ease: 'power2.inOut', stagger: 0.084 }, 0);
  }

  // Stagger the hero copy in, part-way through the draw.
  if (heroBits.length) {
    tl.fromTo(heroBits, { opacity: 0, y: 18 },
                        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.55);
  }
  if (heroRight) {
    tl.fromTo(heroRight, { opacity: 0, scale: 0.9 },
                         { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.7);
  }

  /* ---------------- STATS COUNT-UP ---------------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var o = { v: 0 };
    gsap.to(o, {
      v: target, duration: 1.3, ease: 'power1.out',
      onUpdate: function () { el.textContent = Math.round(o.v) + suffix; }
    });
  }
  var stats = Array.prototype.slice.call(
    document.querySelectorAll('.stats-bar .stat-n[data-count]')
  );
  if (stats.length) {
    if (hasST) {
      window.ScrollTrigger.create({
        trigger: '.stats-bar', start: 'top 85%', once: true,
        onEnter: function () { stats.forEach(countUp); }
      });
    } else {
      stats.forEach(countUp);
    }
  }

  /* ---------------- SCROLL REVEALS ---------------- */
  if (hasST) {
    var secHead = document.querySelectorAll('.sec .eyebrow, .sec .sec-title, .sec .sec-sub');
    if (secHead.length) {
      gsap.from(secHead, {
        opacity: 0, y: 20, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.sec', start: 'top 80%', once: true }
      });
    }
    if (document.querySelector('.tiles .tile')) {
      gsap.from('.tiles .tile', {
        opacity: 0, y: 28, duration: 0.7, stagger: 0.14, ease: 'power2.out',
        scrollTrigger: { trigger: '.tiles', start: 'top 82%', once: true }
      });
    }
  }
}());
