// TOP APP GAMES — behavior: menu, scroll reveals, active nav, parallax, form
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- mobile menu ---- */
  var burger = document.querySelector('.nav-burger');
  var menu = document.querySelector('.menu');
  burger.addEventListener('click', function () {
    document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', document.body.classList.contains('menu-open'));
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
  });

  /* ---- hero headline: force final state if CSS animation timelines are frozen ---- */
  setTimeout(function () {
    document.querySelectorAll('.hw').forEach(function (el) { el.classList.add('hw-done'); });
  }, 1400);

  /* ---- nav shrink on scroll ---- */
  var nav = document.querySelector('.nav');
  var onScrollNav = function () { nav.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---- reveal on scroll ---- */
  var rvObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { rvObs.observe(el); });

  /* ---- active section highlight ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-navlink]'));
  var setActive = function (id) {
    links.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  };
  var secObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(function (s) { secObs.observe(s); });

  /* ---- hero parallax (transform-only, rAF-throttled) ---- */
  var plxEls = Array.prototype.slice.call(document.querySelectorAll('[data-plx]'));
  var ticking = false;
  function plx() {
    ticking = false;
    if (reduced || document.documentElement.dataset.motion === 'subtle') return;
    var y = window.scrollY;
    if (y > window.innerHeight * 1.2) return;
    plxEls.forEach(function (el) {
      var f = parseFloat(el.dataset.plx) || 0;
      var extra = el.dataset.plxBase || '';
      el.style.transform = extra + ' translate3d(0,' + (y * f).toFixed(1) + 'px,0)';
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(plx); }
  }, { passive: true });

  /* ---- team collapse toggle ---- */
  var tt = document.querySelector('.team-toggle');
  var tc = document.querySelector('.team-collapse');
  if (tt && tc) {
    tt.addEventListener('click', function () {
      var open = tc.classList.toggle('is-open');
      tt.setAttribute('aria-expanded', open);
      tt.querySelector('.tt-title').textContent = open ? 'Hide the team' : 'Meet the team';
    });
  }

  /* ---- contact form ---- */
  var form = document.querySelector('.form');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var ok = true;
    [['name', function (v) { return v.trim().length > 1; }],
     ['email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }],
     ['message', function (v) { return v.trim().length > 4; }]
    ].forEach(function (pair) {
      var field = form.querySelector('[name="' + pair[0] + '"]');
      var wrap = field.closest('.field');
      var valid = pair[1](field.value);
      wrap.classList.toggle('err', !valid);
      if (!valid) ok = false;
    });
    if (ok) form.classList.add('sent');
  });
  form.querySelectorAll('input, textarea').forEach(function (f) {
    f.addEventListener('input', function () { f.closest('.field').classList.remove('err'); });
  });
})();

/* Title No.3 — looping retro loading bar */
(function () {
  'use strict';
  var bar = document.querySelector('.ld-bar b');
  var pct = document.querySelector('.ld-text i');
  if (!bar || !pct) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bar.style.width = '73%'; pct.textContent = '73%'; return;
  }
  var DUR = 8000, last = -1;
  function frame(t) {
    var ph = (t % DUR) / DUR, p;
    if (ph < 0.5) p = ph / 0.5 * 78;            // quick ramp
    else if (ph < 0.88) p = 78 + (ph - 0.5) / 0.38 * 21; // slow crawl
    else p = 99;                                  // hold at 99%
    p = Math.floor(p);
    if (p !== last) { last = p; bar.style.width = p + '%'; pct.textContent = p + '%'; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
