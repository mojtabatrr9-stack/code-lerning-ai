/* =====================================================================
   هوشیکا · نما: کارگاه کد زنده
   ===================================================================== */
(function () {
  'use strict';
  var V = (window.HSKVIEWS = window.HSKVIEWS || {});
  var U = HSK.util;
  function A() { return window.HSKAPP; }

  var TEMPLATES = [
    {
      id: 'hello', icon: '👋', title: 'شروع سریع',
      code: '<h1>سلام هوشیکا!</h1>\n<p>این اولین کد زندهٔ تو است.</p>\n<style>\n  body { font-family: Tahoma, sans-serif; }\n  h1 { color: #4de2ff; }\n</style>'
    },
    {
      id: 'card', icon: '🃏', title: 'کارت پروفایل',
      code: '<div class="card">\n  <div class="ava">🤖</div>\n  <h2>سارا</h2>\n  <p>سطح ۳ · برنامه‌نویس</p>\n  <div class="xp">۱۲۴۰ امتیاز</div>\n</div>\n<style>\n  body { margin:0; background:#05091a; display:grid; place-items:center; height:100vh; font-family:Tahoma }\n  .card { width:230px; text-align:center; color:#eaf3ff; padding:22px; border-radius:22px;\n    background:linear-gradient(150deg,#8b7dff22,#4de2ff14); border:1px solid #6f8fd655;\n    box-shadow:0 20px 40px -18px #000, inset 0 1px #ffffff22 }\n  .ava { font-size:40px }\n  .xp { color:#ffc94d }\n</style>'
    },
    {
      id: 'bubble', icon: '🫧', title: 'دکمهٔ حبابی',
      code: '<button class="bubble">من را بزن</button>\n<p id="out">۰ امتیاز</p>\n<style>\n  body{background:#05091a;color:#eaf3ff;font-family:Tahoma;display:grid;place-items:center;gap:16px;height:100vh}\n  .bubble{padding:14px 26px;border-radius:24px;border:1px solid #7fe6ff88;color:#04141c;font-size:18px;\n    background:radial-gradient(120px 90px at 30% 20%,#fff8,transparent 70%),linear-gradient(140deg,#eafcff,#4de2ff);\n    box-shadow:inset 0 1px #fff, 0 14px 30px -14px #4de2ffcc; transition:transform .35s}\n  .bubble:hover{transform:translateY(-6px) scale(1.08)}\n</style>\n<script>\n  let xp = 0;\n  document.querySelector(".bubble").onclick = () => {\n    xp += 10;\n    document.getElementById("out").textContent = xp + " امتیاز";\n  };\n<\/script>'
    },
    {
      id: 'clock', icon: '⏰', title: 'ساعت زنده',
      code: '<div id="clock">۰۰:۰۰:۰۰</div>\n<style>\n  body{margin:0;background:#04091a;display:grid;place-items:center;height:100vh}\n  #clock{font-family:Consolas,monospace;font-size:44px;color:#9bff7a;text-shadow:0 0 22px #9bff7a88}\n</style>\n<script>\n  const pad = (n) => String(n).padStart(2, "0");\n  setInterval(() => {\n    const d = new Date();\n    document.getElementById("clock").textContent =\n      pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());\n  }, 1000);\n<\/script>'
    },
    {
      id: 'guess', icon: '🎲', title: 'بازی حدس عدد',
      code: '<p>یک عدد بین ۱ تا ۱۰ حدس بزن:</p>\n<input id="g" type="number" />\n<button id="b">حدس</button>\n<p id="r"></p>\n<style>\n  body{background:#05091a;color:#eaf3ff;font-family:Tahoma;padding:18px}\n  input,button{padding:8px 12px;border-radius:10px;border:1px solid #6f8fd655;background:#0b1730;color:#fff}\n  button{cursor:pointer;background:linear-gradient(140deg,#eafcff,#4de2ff);color:#04141c}\n</style>\n<script>\n  const answer = Math.floor(Math.random() * 10) + 1;\n  document.getElementById("b").onclick = () => {\n    const v = +document.getElementById("g").value;\n    document.getElementById("r").textContent =\n      v === answer ? "🎉 درست بود!" : (v > answer ? "کمتر ↓" : "بیشتر ↑");\n  };\n<\/script>'
    },
    {
      id: 'snake', icon: '🐍', title: 'شروع بازی دوبعدی',
      code: '<canvas id="c" width="320" height="180"></canvas>\n<style>body{margin:0;background:#04091a;display:grid;place-items:center;height:100vh}\ncanvas{border:1px solid #4de2ff44;border-radius:12px}</style>\n<script>\n  const ctx = document.getElementById("c").getContext("2d");\n  let x = 20, y = 90, dx = 2;\n  setInterval(() => {\n    x += dx;\n    if (x > 300 || x < 0) dx *= -1;\n    ctx.clearRect(0, 0, 320, 180);\n    ctx.fillStyle = "#9bff7a";\n    ctx.fillRect(x, y, 18, 18);\n  }, 16);\n<\/script>'
    }
  ];

  function run(scope) {
    var app = A();
    var ta = app.$('#code-text', scope), frame = app.$('.result iframe', scope);
    if (!ta || !frame) return;
    frame.setAttribute('srcdoc', '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><style>body{font-family:Tahoma,sans-serif;color:#eaf3ff;background:#04101f;padding:14px;margin:0}</style></head><body>' + ta.value + '</body></html>');
    var u = app.state.user;
    var key = 'run-' + U.hash(ta.value);
    if (!u.flags[key]) {
      u.flags[key] = true;
      app.saveUser();
      app.addXp(5, 'lab', 'تمرین زنده');
      app.toast({ icon: '▶', title: 'کد اجرا شد!', text: '+۵ امتیاز برای تمرین زنده' });
    }
  }

  V.lab = function () {
    var app = A(), u = app.state.user;
    var used = TEMPLATES.filter(function (t) { return u.flags['tpl-' + t.id]; }).length;
    return {
      html: '<div class="page"><div class="stack-lg">' +
        '<section class="row between wrap">' +
        '<div><span class="kicker">کارگاه</span><h1 style="margin:6px 0">کد زنده؛ همین‌جا بنویس و اجرا کن</h1>' +
        '<p class="muted" style="margin:0">یک قالب را انتخاب کن یا از صفر بنویس. هر اجرا ۵ امتیاز به مسیر تو اضافه می‌کند و در مأموریت‌های روزانه هم حساب می‌شود.</p></div>' +
        '<div class="panel tight center"><strong style="font-family:var(--font-display);font-size:22px;color:var(--lime)">' +
        U.fa(used) + ' از ' + U.fa(TEMPLATES.length) + '</strong><div class="small muted">قالب امتحان‌شده</div></div>' +
        '</section>' +
        '<section class="panel"><div class="sec-head"><h2 style="font-size:22px">قالب‌های آماده</h2><span class="badge ghost">تمرین زنده</span></div>' +
        '<div class="row wrap">' +
        TEMPLATES.map(function (t) {
          return '<button class="chip bob" data-tpl="' + t.id + '">' + t.icon + ' ' + t.title + '</button>';
        }).join('') + '</div></section>' +
        '<section class="playground">' +
        '<div class="pg-head"><span class="dot lime"></span>' +
        '<strong style="font-family:var(--font-display)">ویرایشگر زندهٔ HTML/CSS/JS</strong>' +
        '<button class="btn primary sm run" type="button">▶ اجرا کن</button>' +
        '<button class="btn ghost sm" data-x="clear" type="button">پاک کردن</button></div>' +
        '<textarea id="code-text" spellcheck="false" aria-label="کد تمرین"></textarea>' +
        '<div class="result"><iframe title="نتیجهٔ اجرا" sandbox="allow-scripts allow-modals"></iframe></div>' +
        '</section>' +
        '<section class="grid g3">' +
        '<div class="card"><div class="card-top"><span class="icon-badge">🎯</span><div><h3 style="margin:0">چالش کارگاه</h3>' +
        '<p class="muted small" style="margin:6px 0 0">یک کارت پروفایل بساز که با ماوس حرکت کند و цветش تغییر کند. اگر ساخته شد، نشان «میکرو‌پروژه» را بگیر.</p></div></div></div>' +
        '<div class="card"><div class="card-top"><span class="icon-badge">💡</span><div><h3 style="margin:0">نکتهٔ هوشیکا</h3>' +
        '<p class="muted small" style="margin:6px 0 0">' + U.pick(HSK.LINES.tip, u.xp + 5) + '</p></div></div></div>' +
        '<div class="card"><div class="card-top"><span class="icon-badge">🧪</span><div><h3 style="margin:0">کد را دوباره بنویس</h3>' +
        '<p class="muted small" style="margin:6px 0 0">تحقیق‌ها می‌گویند بازنویسی کد، یادگیری را دو برابر می‌کند؛ به‌جای کپی، از نو بنویس.</p></div></div></div>' +
        '</section>' +
        '<section class="panel flat">' + HKSAY.svg({ mood: 'happy', size: '170px' }) +
        HKSAY.bubble('هر چیزی اینجا نوشتی، همان لحظه اجرا می‌شود. اگر خراب شد، نترس؛ خطای کد بهترین معلم است.') + '</section>' +
        '</div></div>',
      bind: function (root) {
        var ta = app.$('#code-text', root);
        ta.value = TEMPLATES[0].code;
        setTimeout(function () { run(root); }, 90);
        app.on(root, '.run', 'click', function () { run(root); });
        app.on(root, '[data-x="clear"]', 'click', function () { ta.value = ''; ta.focus(); });
        app.on(root, '[data-tpl]', 'click', function () {
          var id = this.getAttribute('data-tpl');
          var t = TEMPLATES.filter(function (x) { return x.id === id; })[0];
          if (!t) return;
          ta.value = t.code;
          u.flags['tpl-' + id] = true;
          app.saveUser();
          app.toast({ icon: t.icon, title: 'قالب ' + t.title + ' بارگذاری شد', text: 'کد را تغییر بده و اجرا کن.' });
          setTimeout(function () { run(root); }, 60);
          app.checkAchievements();
        });
        ta.addEventListener('keydown', function (e) {
          if (e.key === 'Tab') {
            e.preventDefault();
            var s = this.selectionStart;
            this.value = this.value.slice(0, s) + '  ' + this.value.slice(this.selectionEnd);
            this.selectionStart = this.selectionEnd = s + 2;
          }
        });
        HSKFX.refresh(root);
      }
    };
  };
})();
