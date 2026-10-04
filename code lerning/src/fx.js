/* =====================================================================
   هوشیکا · موتور حرکت
   ذرات، ظهور تدریجی، حباب سه‌بعدی، تیلت کارت‌ها، کانفتی و شمارنده‌ها
   ===================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var still = false;
  try { still = localStorage.getItem('hsk.still') === '1'; } catch (e) { }

  function motionOn() { return !still && !reduced; }
  /* جلوه‌های تعاملی (هاور/تیلت) حتی با prefers-reduced-motion کار می‌کنند؛
     فقط حالت آرام دستی آن‌ها را خاموش می‌کند. */
  function interactive() { return !still; }

  /* ------------------------------------------------------- ذرات پس‌زمینه */
  var canvas, ctx, dots = [], raf = null, W = 0, H = 0;

  function initCanvas() {
    canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    var count = Math.max(26, Math.min(70, Math.round(window.innerWidth / 26)));
    dots = [];
    for (var i = 0; i < count; i++) {
      dots.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00028,
        vy: (Math.random() - 0.5) * 0.00028,
        r: 0.8 + Math.random() * 1.9,
        hue: Math.random() > 0.62 ? '155,255,122' : (Math.random() > 0.5 ? '139,125,255' : '77,226,255')
      });
    }
    window.addEventListener('resize', resize);
    if (motionOn()) loop();
  }
  function resize() {
    if (!canvas) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.width = Math.floor(window.innerWidth * dpr);
    H = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function loop() {
    if (raf) cancelAnimationFrame(raf);
    var w = window.innerWidth, h = window.innerHeight;
    (function frame() {
      if (!motionOn()) { raf = null; return; }
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > 1) d.vx *= -1;
        if (d.y < 0 || d.y > 1) d.vy *= -1;
        var x = d.x * w, y = d.y * h;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + d.hue + ',0.5)';
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
        for (var j = i + 1; j < dots.length; j++) {
          var e = dots[j], ex = e.x * w, ey = e.y * h;
          var dx = x - ex, dy = y - ey, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 148) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(77,226,255,' + (0.1 * (1 - dist / 148)).toFixed(3) + ')';
            ctx.lineWidth = 0.7;
            ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    })();
  }

  /* موج انفجار ذرات روی کلیک (بدون مانع کلیک) */
  function burst(x, y, color) {
    if (!motionOn() || !canvas) return;
    var parts = [], n = 16;
    for (var i = 0; i < n; i++) {
      var a = (Math.PI * 2 * i) / n + Math.random();
      parts.push({ x: x, y: y, vx: Math.cos(a) * (1.6 + Math.random() * 2.4), vy: Math.sin(a) * (1.6 + Math.random() * 2.4), life: 1 });
    }
    var c = canvas.getContext('2d');
    (function tick() {
      var alive = false;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.03; p.life -= 0.026;
        c.beginPath();
        c.fillStyle = color || 'rgba(77,226,255,' + Math.max(0, p.life).toFixed(2) + ')';
        c.arc(p.x, p.y, 2.4 * p.life + 0.6, 0, Math.PI * 2);
        c.fill();
      }
      if (alive) requestAnimationFrame(tick);
    })();
  }

  /* --------------------------------------------------- ظهور هنگام اسکرول */
  var io = null;
  function observer() {
    if (!window.IntersectionObserver) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }
  function reveal(scope) {
    var root = scope || document;
    var list = root.querySelectorAll('.rv:not(.is-in)');
    if (!io || !motionOn()) {
      Array.prototype.forEach.call(list, function (el) { el.classList.add('is-in'); });
      return;
    }
    Array.prototype.forEach.call(list, function (el, i) {
      el.style.transitionDelay = Math.min(i * 45, 320) + 'ms';
      io.observe(el);
    });
  }

  /* ------------------------------------------------ حباب سه‌بعدی (تراشه‌ها) */
  function bubbles(scope) {
    var root = scope || document;
    var list = root.querySelectorAll('.chip, .fx-bubble');
    Array.prototype.forEach.call(list, function (el) {
      if (el._hskBub) return;
      el._hskBub = true;
      el.addEventListener('mousemove', function (ev) {
        if (!interactive()) return;
        var r = el.getBoundingClientRect();
        var mx = (ev.clientX - r.left) / r.width;
        var my = (ev.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (mx * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (my * 100).toFixed(1) + '%');
        el.style.setProperty('--rx', ((0.5 - my) * 14).toFixed(2) + 'deg');
        el.style.setProperty('--ry', ((mx - 0.5) * 16).toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '40%');
      });
    });
  }

  /* ------------------------------------------------------- تیلت کارت‌ها */
  function tilt(scope) {
    var root = scope || document;
    var list = root.querySelectorAll('.tilt:not([data-tilt-bound])');
    Array.prototype.forEach.call(list, function (el) {
      el.setAttribute('data-tilt-bound', '1');
      el.addEventListener('mousemove', function (ev) {
        if (!interactive()) return;
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
        el.style.setProperty('--rx', ((0.5 - py) * 9).toFixed(2) + 'deg');
        el.style.setProperty('--ry', ((px - 0.5) * 11).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* --------------------------------------------------------- شمارنده‌ها */
  function counters(scope) {
    var root = scope || document;
    var list = root.querySelectorAll('[data-count]:not([data-count-done])');
    Array.prototype.forEach.call(list, function (el) {
      var to = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (!motionOn()) { el.textContent = HSK.util.faNum(to) + suffix; el.setAttribute('data-count-done', '1'); return; }
      var from = 0, t0 = performance.now(), dur = 900;
      el.setAttribute('data-count-done', '1');
      (function step(now) {
        var p = Math.min(1, (now - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = HSK.util.faNum(from + (to - from) * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }

  /* -------------------------------------------------------------- کانفتی */
  function confetti(x, y, n) {
    if (!motionOn()) return;
    var colors = ['#4de2ff', '#8b7dff', '#9bff7a', '#ffc94d', '#ff7bb0'];
    var box = document.createElement('div');
    box.className = 'fx-confetti';
    document.body.appendChild(box);
    var total = n || 26;
    for (var i = 0; i < total; i++) {
      var p = document.createElement('i');
      var a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 170;
      p.style.setProperty('--tx', Math.cos(a) * d + 'px');
      p.style.setProperty('--ty', (Math.sin(a) * d - 40) + 'px');
      p.style.background = colors[i % colors.length];
      p.style.left = (x || window.innerWidth / 2) + 'px';
      p.style.top = (y || window.innerHeight / 3) + 'px';
      p.style.animationDelay = (Math.random() * 120).toFixed(0) + 'ms';
      p.style.width = (5 + Math.random() * 6).toFixed(0) + 'px';
      p.style.height = (7 + Math.random() * 8).toFixed(0) + 'px';
      box.appendChild(p);
    }
    setTimeout(function () { box.remove(); }, 1500);
  }

  /* ------------------------------------------------------- نوار پیشرفت */
  function scrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'fx-progress';
    document.body.appendChild(bar);
    var scroller = document.getElementById('hsk-app');
    function update() {
      var el = scroller && scroller.scrollHeight > scroller.clientHeight + 4 ? scroller : document.documentElement;
      var top = el.scrollTop || window.scrollY || 0;
      var max = (el.scrollHeight - el.clientHeight) || 1;
      bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, top / max)) + ')';
    }
    ['scroll', 'resize'].forEach(function (ev) {
      (scroller || window).addEventListener(ev, update, { passive: true });
      if (scroller) window.addEventListener(ev, update, { passive: true });
    });
    update();
    return update;
  }

  /* ------------------------------------------------------- درخشش نشانگر */
  function cursorGlow() {
    if (!motionOn() || window.matchMedia('(hover: none)').matches) return;
    var g = document.createElement('div');
    g.className = 'fx-glow';
    document.body.appendChild(g);
    var tx = window.innerWidth / 2, ty = window.innerHeight / 3, cx = tx, cy = ty;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function tick() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      g.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      requestAnimationFrame(tick);
    })();
  }

  /* ---------------------------------------------------------- فعال‌سازی */
  function boot() {
    document.documentElement.classList.toggle('still', still);
    initCanvas();
    observer();
    scrollProgress();
    cursorGlow();
    document.addEventListener('click', function (e) {
      var bubble = e.target.closest && e.target.closest('.chip, .btn, .nav-link');
      if (bubble) burst(e.clientX, e.clientY, 'rgba(155,255,122,0.75)');
    });
    refresh(document);
  }
  function refresh(scope) {
    reveal(scope); bubbles(scope); tilt(scope); counters(scope);
  }
  function setStill(on) {
    still = !!on;
    try { localStorage.setItem('hsk.still', still ? '1' : '0'); } catch (e) { }
    document.documentElement.classList.toggle('still', still);
    if (still) { if (raf) cancelAnimationFrame(raf); raf = null; if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    else if (!raf) loop();
  }
  function getStill() { return still; }

  window.HSKFX = {
    boot: boot, refresh: refresh, burst: burst, confetti: confetti,
    setStill: setStill, getStill: getStill, motionOn: motionOn, interactive: interactive
  };
})();
