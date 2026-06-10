// TOP APP GAMES — easter eggs: coin logo, pixel confetti, RPG team cards
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ shared: achievement toast ============ */
  var toastEl = null, toastTimer = null;
  function achievement(title) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'egg-toast';
      toastEl.innerHTML = '<span class="egg-star">★</span><span class="egg-toast-tx"><b>ACHIEVEMENT UNLOCKED</b><span></span></span>';
      document.body.appendChild(toastEl);
    }
    toastEl.querySelector('.egg-toast-tx span').textContent = title;
    requestAnimationFrame(function () { toastEl.classList.add('on'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, 3200);
  }

  /* ============ 1. coin click on logo ============ */
  var credits = 0;
  try { credits = parseInt(localStorage.getItem('tag-credits') || '0', 10) || 0; } catch (e) {}
  var unlocked = {};
  try { unlocked = JSON.parse(localStorage.getItem('tag-achievements') || '{}') || {}; } catch (e) {}

  var actx = null;
  function coinSound() {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      var t = actx.currentTime;
      var o = actx.createOscillator();
      var g = actx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(987.77, t);          // B5
      o.frequency.setValueAtTime(1318.51, t + 0.08);  // E6
      g.gain.setValueAtTime(0.045, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g); g.connect(actx.destination);
      o.start(t); o.stop(t + 0.45);
    } catch (e) {}
  }

  var pill = null, pillTimer = null;
  function showCredits() {
    if (!pill) {
      pill = document.createElement('div');
      pill.className = 'egg-credits';
      document.body.appendChild(pill);
    }
    pill.innerHTML = '<span class="egg-coin-ic"></span>CREDITS &times; ' + String(credits).padStart(2, '0');
    requestAnimationFrame(function () { pill.classList.add('on'); });
    clearTimeout(pillTimer);
    pillTimer = setTimeout(function () { pill.classList.remove('on'); }, 1500);
  }

  function flyCoin(x, y) {
    if (reduced) return;
    var c = document.createElement('div');
    c.className = 'egg-coin';
    c.style.left = (x - 8) + 'px';
    c.style.top = (y - 8) + 'px';
    document.body.appendChild(c);
    var dx = (Math.random() - 0.5) * 30;
    c.animate([
      { transform: 'translate(0,0) rotateY(0deg)', opacity: 1 },
      { transform: 'translate(' + dx + 'px,-54px) rotateY(540deg)', opacity: 1, offset: 0.65 },
      { transform: 'translate(' + dx + 'px,-70px) rotateY(720deg)', opacity: 0 }
    ], { duration: 650, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = function () { c.remove(); };
  }

  function award(key, title) {
    if (unlocked[key]) return;
    unlocked[key] = 1;
    try { localStorage.setItem('tag-achievements', JSON.stringify(unlocked)); } catch (e) {}
    setTimeout(function () { achievement(title); }, 350);
  }

  var logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.addEventListener('click', function (e) {
      credits++;
      try { localStorage.setItem('tag-credits', String(credits)); } catch (err) {}
      var r = logo.getBoundingClientRect();
      flyCoin(r.left + r.width / 2, r.top + r.height / 2);
      coinSound();
      showCredits();
      if (credits >= 10) award('coins10', 'Coin Collector — 10 credits');
      if (credits >= 25) award('coins25', 'Pay Day — 25 credits');
      if (credits >= 50) award('coins50', 'Whale Spotted — 50 credits');
    });
  }

  /* ============ 2. pixel confetti on form sent ============ */
  function burst(x, y) {
    var colors = ['#C68A1F', '#E5AC3F', '#E8A33D', '#F2F1ED', '#9A978F'];
    var n = reduced ? 0 : 44;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('div');
      p.className = 'egg-px';
      var s = 4 + Math.random() * 6;
      p.style.cssText = 'width:' + s + 'px;height:' + s + 'px;background:' + colors[i % colors.length] + ';left:' + x + 'px;top:' + y + 'px;';
      document.body.appendChild(p);
      var ang = Math.random() * Math.PI * 2;
      var dist = 50 + Math.random() * 170;
      var dx = Math.cos(ang) * dist;
      var dy = Math.sin(ang) * dist * 0.7 - 130;
      (function (el, dx, dy) {
        el.animate([
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + dx + 'px,' + (dy + 230) + 'px) rotate(' + (Math.random() * 720 - 360) + 'deg)', opacity: 0 }
        ], { duration: 950 + Math.random() * 650, easing: 'cubic-bezier(.15,.55,.45,1)' }).onfinish = function () { el.remove(); };
      })(p, dx, dy);
    }
  }

  var form = document.querySelector('.form');
  if (form && window.MutationObserver) {
    var fired = false;
    new MutationObserver(function () {
      if (fired || !form.classList.contains('sent')) return;
      fired = true;
      var r = form.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height * 0.45);
      award('quest', 'Quest Complete — message sent');
    }).observe(form, { attributes: true, attributeFilter: ['class'] });
  }

  /* ============ 3. RPG cards on team hover ============ */
  var RPG = [
    ['Vladimir Markov',    21, 'Founder',       [['LDR', 20], ['VIS', 19], ['STR', 16]]],
    ['Vladimir Nikolskiy', 20, 'Founder',       [['INT', 20], ['BIZ', 19], ['LDR', 18]]],
    ['Evgeni Shishkin',    18, 'Strategist',    [['INT', 18], ['WIS', 17], ['DEX', 16]]],
    ['Diana Korkina',      17, 'Diplomat',      [['CHA', 20], ['INT', 17], ['LCK', 15]]],
    ['Kirill Altunin',     19, 'Code Archmage', [['INT', 20], ['MP', 19], ['STR', 14]]],
    ['Denis Kuklyushkin',  18, 'Illusionist',   [['CRE', 20], ['DEX', 18], ['WIS', 15]]],
    ['Nikita Kharlamov',   28, 'Bard',          [['CHA', 21], ['HYPE', 20], ['LCK', 19]]],
    ['George Notyag',      15, 'Geomancer',     [['3D', 20], ['STR', 17], ['INT', 16]]]
  ];

  function buildCard(d) {
    var c = document.createElement('div');
    c.className = 'rpg-card';
    var html = '<div class="rpg-top">LVL ' + d[1] + ' · ' + d[2].toUpperCase() + '</div>';
    d[3].forEach(function (s) {
      var pct = Math.round(s[1] / 22 * 100);
      html += '<div class="rpg-stat"><span>' + s[0] + '</span><i><b style="width:' + pct + '%"></b></i><em>' + s[1] + '</em></div>';
    });
    c.innerHTML = html;
    return c;
  }

  var hoverable = window.matchMedia('(hover: hover)').matches;
  document.querySelectorAll('.tm').forEach(function (tm) {
    var nameEl = tm.querySelector('.tm-name');
    if (!nameEl) return;
    var name = nameEl.textContent.trim();
    var d = null;
    for (var i = 0; i < RPG.length; i++) { if (RPG[i][0] === name) { d = RPG[i]; break; } }
    if (!d) return;
    var card = null, timer = null;
    function show() {
      if (!card) { card = buildCard(d); tm.appendChild(card); }
      requestAnimationFrame(function () { requestAnimationFrame(function () { card.classList.add('on'); }); });
    }
    function hide() { clearTimeout(timer); if (card) card.classList.remove('on'); }
    if (hoverable) {
      tm.addEventListener('mouseenter', function () { timer = setTimeout(show, 300); });
      tm.addEventListener('mouseleave', hide);
    }
    nameEl.addEventListener('click', function () {
      if (card && card.classList.contains('on')) hide(); else { show(); award('inspect', 'Inspect Mode — stats revealed'); }
    });
  });

  /* expose tiny API for other egg modules */
  window.__tagEggs = { burst: burst, award: award, achievement: achievement, reduced: reduced };
})();
