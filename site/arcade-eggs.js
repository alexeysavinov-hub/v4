// TOP APP GAMES — arcade eggs: Konami code, XP bar, loot drop, tab pause
(function () {
  'use strict';
  var E = window.__tagEggs || { burst: function () {}, award: function () {}, achievement: function () {}, reduced: false };
  var reduced = E.reduced;

  /* ============ 1. Konami code ============ */
  var SEQ = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
  var pos = 0;
  function feed(token) {
    if (token === SEQ[pos]) {
      pos++;
      if (pos === SEQ.length) { pos = 0; konami(); }
    } else {
      pos = token === SEQ[0] ? 1 : 0;
    }
  }
  function konami() {
    E.award('konami', 'Konami Code — 30 lives granted');
    if (reduced) { E.achievement('Konami Code — 30 lives granted'); return; }
    var w = window.innerWidth, h = window.innerHeight;
    for (var i = 0; i < 5; i++) {
      (function (i) {
        setTimeout(function () {
          E.burst(w * (0.2 + Math.random() * 0.6), h * (0.2 + Math.random() * 0.45));
        }, i * 260);
      })(i);
    }
  }
  var KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', b: 'b', B: 'b', a: 'a', A: 'a' };
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    var token = KEYMAP[e.key];
    if (token) feed(token);
  });
  // mobile: swipes for arrows, taps stand in for B/A
  var ts = null;
  document.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) ts = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (!ts) return;
    var dx = e.changedTouches[0].clientX - ts.x;
    var dy = e.changedTouches[0].clientY - ts.y;
    var dt = Date.now() - ts.t;
    ts = null;
    var adx = Math.abs(dx), ady = Math.abs(dy);
    if (adx < 12 && ady < 12) {
      if (dt < 350 && (SEQ[pos] === 'b' || SEQ[pos] === 'a')) feed(SEQ[pos]);
      return;
    }
    if (Math.max(adx, ady) < 36) return;
    feed(adx > ady ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }, { passive: true });

  /* ============ 4. XP bar + level up ============ */
  var xpBar = document.createElement('div');
  xpBar.className = 'xp-bar';
  document.body.appendChild(xpBar);
  var xpChip = document.createElement('div');
  xpChip.className = 'xp-chip';
  document.body.appendChild(xpChip);
  var chipTimer = null;
  function chip(text) {
    xpChip.textContent = text;
    requestAnimationFrame(function () { xpChip.classList.add('on'); });
    clearTimeout(chipTimer);
    chipTimer = setTimeout(function () { xpChip.classList.remove('on'); }, 1400);
  }
  var leveled = false, xpTick = false;
  function xp() {
    xpTick = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    xpBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (p >= 0.99 && !leveled) {
      leveled = true;
      chip('LEVEL UP!');
      E.award('lvlup', 'Level Up — page 100% explored');
    }
  }
  window.addEventListener('scroll', function () {
    if (!xpTick) { xpTick = true; requestAnimationFrame(xp); }
  }, { passive: true });
  xp();
  var seen = {};
  var xpObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting && !seen[en.target.id]) {
        seen[en.target.id] = 1;
        if (en.target.id !== 'ludus') chip('+25 XP');
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('section[id]').forEach(function (s) { xpObs.observe(s); });

  /* ============ 5. legendary loot drop at footer ============ */
  var lootShown = false;
  function pixelDiv(map, colors, px) {
    var shadows = [];
    map.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var c = colors[row[x]];
        if (c) shadows.push((x * px) + 'px ' + (y * px) + 'px 0 0 ' + c);
      }
    });
    var d = document.createElement('div');
    d.style.cssText = 'width:' + px + 'px;height:' + px + 'px;box-shadow:' + shadows.join(',') + ';';
    return d;
  }
  var CHEST = [
    '.GGGGGGGG.',
    'GBBBBBBBBG',
    'GBBBGGBBBG',
    'GGGGGGGGGG',
    'GBBBGGBBBG',
    'GBBBGGBBBG',
    'GBBBBBBBBG',
    '.GGGGGGGG.'
  ];
  var CHEST_COLORS = { G: '#D9822F', B: '#6B4A22' };
  function lootDrop() {
    lootShown = true;
    var wrap = document.createElement('div');
    wrap.className = 'egg-loot';
    var beam = document.createElement('div');
    beam.className = 'egg-beam';
    var chest = document.createElement('button');
    chest.className = 'egg-chest';
    chest.setAttribute('aria-label', 'Open legendary chest');
    chest.appendChild(pixelDiv(CHEST, CHEST_COLORS, 4));
    wrap.appendChild(beam);
    wrap.appendChild(chest);
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add('on'); });
    var gone = false;
    function open() {
      if (gone) return;
      gone = true;
      var r = chest.getBoundingClientRect();
      E.burst(r.left + r.width / 2, r.top + r.height / 2);
      E.award('loot', 'Legendary Drop — GG WP');
      wrap.classList.remove('on');
      setTimeout(function () { wrap.remove(); }, 500);
    }
    chest.addEventListener('click', open);
    setTimeout(function () { if (!gone) { wrap.classList.remove('on'); setTimeout(function () { wrap.remove(); }, 500); lootShown = false; } }, 9000);
  }
  var foot = document.querySelector('footer');
  if (foot) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !lootShown && Math.random() < 0.05) lootDrop();
      });
    }, { threshold: 0.6 }).observe(foot);
  }

  /* ============ 10. tab pause / resume ============ */
  var baseTitle = document.title;
  var titleTimer = null;
  document.addEventListener('visibilitychange', function () {
    clearTimeout(titleTimer);
    if (document.hidden) {
      document.title = '\u23F8 Game paused \u2014 TOP APP GAMES';
    } else {
      document.title = '\u25B6 Game resumed!';
      titleTimer = setTimeout(function () { document.title = baseTitle; }, 1600);
    }
  });
})();
