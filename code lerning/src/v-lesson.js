/* =====================================================================
   هوشیکا · نما: درس (توضیح، کد، کارگاه زنده، تست و امتیاز)
   ===================================================================== */
(function () {
  'use strict';
  var V = (window.HSKVIEWS = window.HSKVIEWS || {});
  var U = HSK.util;
  function A() { return window.HSKAPP; }

  var LIVE_CATS = { web: true, lang: true, game: true };

  function liveDefault(course) {
    if (course.id === 'html') {
      return '<h1>سلام هوشیکا!</h1>\n<p>این کد زنده است؛ تغییرش بده و اجرا کن.</p>\n<ul>\n  <li>درس‌ها</li>\n  <li>امتیاز</li>\n</ul>';
    }
    if (course.id === 'css') {
      return '<div class="bubble">سلام!</div>\n<style>\n  .bubble {\n    font-family: sans-serif;\n    padding: 22px;\n    border-radius: 20px;\n    color: #04141c;\n    background: linear-gradient(140deg, #eafcff, #4de2ff);\n    transition: transform .3s;\n  }\n  .bubble:hover { transform: translateY(-6px) scale(1.05); }\n</style>';
    }
    return '<div id="app">امتیاز: <b>۰</b></div>\n<button class="b">یک درس کامل کن</button>\n<script>\n  let xp = 0;\n  const b = document.querySelector(".b");\n  b.addEventListener("click", () => {\n    xp += 10;\n    document.querySelector("b").textContent = xp;\n  });\n<\/script>';
  }
  function runLive(scope) {
    var app = A();
    var ta = app.$('#code-text', scope), frame = app.$('.result iframe', scope);
    if (!ta || !frame) return;
    frame.setAttribute('srcdoc', '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><style>body{font-family:Tahoma,sans-serif;color:#eaf3ff;background:#04101f;padding:14px;margin:0}</style></head><body>' + ta.value + '</body></html>');
    var flagKey = 'lab-' + U.hash(ta.value);
    var u = app.state.user;
    if (!u.flags[flagKey]) {
      u.flags[flagKey] = true;
      app.saveUser();
      app.addXp(5, 'lab', 'تمرین زنده');
      app.toast({ icon: '▶', title: 'کد اجرا شد!', text: '+۵ امتیاز برای تمرین زنده' });
    }
  }

  function bind(root, params) {
    var app = A();
    var course = HSK.courseById(params.id);
    if (!course) return;
    var idx = parseInt(params.sub || '0', 10);
    var u = app.state.user;
    var body = HSK.lessonBody(course, course.topics[idx], idx);
    var sample = HSK.sampleFor(course.id, idx);
    var isLive = !!LIVE_CATS[course.cat] && ['html', 'css', 'javascript', 'python'].indexOf(course.id) >= 0;

    /* اجرای کد زنده */
    if (isLive) {
      var ta = app.$('#code-text', root);
      if (ta && !ta.value) ta.value = liveDefault(course);
      app.on(root, '.run', 'click', function () { runLive(root); });
      app.on(root, '[data-live]', 'click', function () {
        ta.value = this.getAttribute('data-live-code') || ta.value;
        runLive(root);
      });
      var frame = app.$('.result iframe', root);
      if (frame) setTimeout(function () { runLive(root); }, 80);
    }

    app.on(root, '[data-copy]', 'click', function () {
      var ta2 = app.$('#code-text', root);
      var pre = app.$('#code-sample', root);
      var text = ta2 && ta2.value ? ta2.value : (pre ? pre.textContent : '');
      try { navigator.clipboard.writeText(text); } catch (e) { }
      app.toast({ icon: '📋', title: 'کد کپی شد', text: 'می‌توانی در کارگاه کد اجرا کنی.' });
    });

    app.on(root, '[data-lesson]', 'click', function () {
      app.go('#/lesson/' + course.id + '/' + this.getAttribute('data-lesson'));
    });

    /* تکمیل درس و تست */
    app.on(root, '[data-x="review"]', 'click', function (ev) {
      app.completeLesson(course, idx, ev);
      app.dailyBonus();
      var box = app.$('#quizBox', root);
      if (box) { box.hidden = false; box.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      this.setAttribute('disabled', 'disabled');
      this.textContent = '✓ این درس ثبت شد';
      HKSAY.react('happy', 2200);
      app.render();
    });

    app.on(root, '[data-qopt]', 'click', function () {
      var qi = parseInt(this.getAttribute('data-q'), 10);
      var oi = parseInt(this.getAttribute('data-qopt'), 10);
      var qs = HSK.quizFor(course, course.topics[idx], idx);
      var q = qs[qi];
      if (!q) return;
      var ok = oi === q.ans;
      var block = app.$('[data-qblock="' + qi + '"]', root);
      if (!block || block.getAttribute('data-done') === '1') return;
      block.setAttribute('data-done', '1');
      app.$$('.answer-option', block).forEach(function (b) {
        b.setAttribute('disabled', 'disabled');
        var bi = parseInt(b.getAttribute('data-qopt'), 10);
        if (bi === q.ans) b.setAttribute('data-state', 'right');
        else if (bi === oi) b.setAttribute('data-state', 'wrong');
      });
      u.answered = (u.answered || 0) + 1;
      if (ok) {
        block.setAttribute('data-right', '1');
        u.correct = (u.correct || 0) + 1;
        u.combo = (u.combo || 0) + 1;
        u.bestCombo = Math.max(u.bestCombo || 0, u.combo);
        app.bumpMission('correct', 1);
        app.addXp(5, 'quiz', 'پاسخ درست');
        app.toast({ icon: '✅', title: 'درست بود!', text: q.why, cls: 'win' });
        HKSAY.react('happy', 1600);
      } else {
        u.combo = 0;
        app.toast({ icon: '💡', title: 'جواب درست را دیدی', text: q.why, cls: 'bad' });
        HKSAY.react('think', 1600);
      }
      var mine = app.$('[data-qblock="' + qi + '"] .explain', root);
      if (mine) { mine.hidden = false; mine.className = 'explain ' + (ok ? 'right' : 'wrong'); mine.textContent = q.why; }
      var doneAll = app.$$('[data-qblock]', root).every(function (b) { return b.getAttribute('data-done') === '1'; });
      if (doneAll) {
        app.bumpMission('quiz', 1);
        var rightAll = app.$$('[data-qblock]', root).every(function (b) {
          return b.getAttribute('data-right') === '1';
        });
        if (rightAll) { u.flags.perfectQuiz = true; app.addXp(10, 'quiz', 'تست بی‌نقص'); }
        app.toast({ icon: '🎯', title: 'تست این درس تمام شد', text: 'می‌توانی درس بعدی را شروع کنی.' });
        var nav = app.$('#quizDone', root);
        if (nav) nav.hidden = false;
      }
      app.saveUser();
      app.checkAchievements();
    });
    HSKFX.refresh(root);
  }

  V.lesson = function (params) {
    var app = A();
    var course = HSK.courseById(params.id);
    if (!course) return { html: '<div class="page"><div class="panel">درس پیدا نشد. <a href="#/courses">فهرست دوره‌ها</a></div></div>', bind: function () { } };
    var idx = Math.max(0, Math.min(course.topics.length - 1, parseInt(params.sub || '0', 10)));
    var topic = course.topics[idx];
    var u = app.state.user;
    var done = app.lessonDone(course.id, idx);
    var body = HSK.lessonBody(course, topic, idx);
    var sample = HSK.sampleFor(course.id, idx);
    var quizzes = HSK.quizFor(course, topic, idx);
    var isLive = !!LIVE_CATS[course.cat] && ['html', 'css', 'javascript', 'python'].indexOf(course.id) >= 0;
    var p = app.courseProgress(course);

    var side = HSK.lessonList(course).map(function (l, i) {
      var st = app.lessonDone(course.id, i) ? 'done' : (i === idx ? 'current' : '');
      return '<div class="lesson-row ' + st + '" data-lesson="' + i + '">' +
        '<span class="l-state">' + (app.lessonDone(course.id, i) ? '✓' : U.fa(i + 1)) + '</span>' +
        '<span class="l-title">' + l.title + '</span></div>';
    }).join('');

    return {
      html: '<div class="page"><div class="stack-lg">' +
        '<section class="row wrap between" style="gap:10px">' +
        '<div class="row wrap"><a class="badge ghost" href="#/course/' + course.id + '">← ' + course.title + '</a>' +
        '<span class="badge">ماژول ' + U.fa(Math.floor(idx / 4) + 1) + '</span>' +
        '<span class="badge ghost">درس ' + U.fa(idx + 1) + ' از ' + U.fa(course.topics.length) + '</span>' +
        (done ? '<span class="badge lime">کامل‌شده ✓</span>' : '<span class="badge amber">+' + U.fa(10) + ' امتیاز</span>') + '</div>' +
        '<div class="progress-line" style="max-width:320px"><div class="bar"><i style="width:' + p.pct + '%"></i></div>' +
        '<span>' + U.fa(p.pct) + '٪</span></div></section>' +

        '<section class="lesson-layout">' +
        '<div class="panel">' +
        '<h1 style="margin:0 0 6px">' + topic + '</h1>' +
        '<p class="muted small">درس ' + U.fa(idx + 1) + ' · ' + course.title + '</p>' +
        '<p class="ink2" style="font-size:17px;margin-top:14px">' + body.intro + '</p>' +
        '<div class="callout"><span>❓</span><p><strong>چرا مهم است؟ </strong>' + body.why + '</p></div>' +
        '<h3 style="margin-top:22px">قدم‌به‌قدم یاد بگیر</h3>' +
        '<ol class="step-list">' + body.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +

        (sample
          ? '<h3 style="margin-top:20px">نمونهٔ کد</h3><div class="code-wrap">' +
          '<button class="btn ghost sm copy" data-copy="" data-x="copy">📋 کپی</button>' +
          '<pre class="code" id="code-sample">' + app.esc(sample) + '</pre></div>'
          : '') +

        (isLive
          ? '<h3 style="margin-top:20px">تمرین زنده</h3>' +
          '<p class="muted small">کد را داخل کادر بنویس و اجرا کن؛ نتیجه بلافاصله پایین نشان داده می‌شود.</p>' +
          '<div class="playground">' +
          '<div class="pg-head"><span class="dot lime"></span><strong style="font-family:var(--font-display)">' + course.title + ' · اجرای زنده</strong>' +
          '<button class="btn primary sm run" type="button">▶ اجرا کن</button>' +
          '<span class="badge ghost small">هر اجرای تازه +۵ امتیاز</span></div>' +
          '<textarea id="code-text" spellcheck="false" aria-label="کد تمرین"></textarea>' +
          '<div class="result"><iframe title="نتیجهٔ اجرا" sandbox="allow-scripts allow-modals"></iframe></div>' +
          '</div>'
          : '') +

        '<div class="callout lime" style="margin-top:20px"><span>🛠</span><p><strong>تمرین این درس: </strong>' + body.task + '</p></div>' +
        '<div class="callout violet" style="margin-top:12px"><span>🎁</span><p>با زدن دکمهٔ «این بخش رو مرور کردم»، ۱۰ امتیاز می‌گیری و تست کوتاه درس باز می‌شود (هر پاسخ درست ۵ امتیاز).</p></div>' +
        '<div class="wizard-actions" style="margin-top:20px">' +
        '<button class="btn ' + (done ? 'ghost' : 'primary xl') + '" data-x="review"' + (done ? ' disabled' : '') + '>' +
        (done ? '✓ این درس ثبت شد' : 'این بخش رو مرور کردم ▸') + '</button>' +
        '<button class="btn ghost" data-go="#/lab">کارگاه کد زنده</button>' +
        '</div>' +

        '<div class="quiz-block" id="quizBox"' + (done ? '' : ' hidden') + '>' +
        '<h3>تست کوتاه درس</h3>' +
        '<p class="muted small">دو سؤال؛ جواب‌ها را با دقت انتخاب کن. اشتباه هم اشکالی ندارد، توضیح را می‌خوانیم.</p>' +
        quizzes.map(function (q, qi) {
          return '<div class="quiz-q" data-qblock="' + qi + '">' +
            '<div class="q-title">' + q.text + '</div>' +
            '<div class="answer-options">' +
            q.opts.map(function (o, oi) {
              return '<button class="answer-option" data-q="' + qi + '" data-qopt="' + oi + '" data-state="off">' + o + '</button>';
            }).join('') + '</div>' +
            '<p class="explain" hidden></p>' +
            '</div>';
        }).join('') +
        '<div id="quizDone" hidden class="lesson-nav">' +
        (idx + 1 < course.topics.length
          ? '<button class="btn primary" data-lesson="' + (idx + 1) + '">درس بعدی: ' + course.topics[idx + 1] + ' →</button>'
          : '<button class="btn lime" data-go="#/course/' + course.id + '">دوره را کامل مرور کن</button>') +
        '<button class="btn ghost" data-go="#/course/' + course.id + '">بازگشت به دوره</button>' +
        '</div></div>' +

        '<div class="lesson-nav">' +
        (idx > 0 ? '<button class="btn ghost" data-lesson="' + (idx - 1) + '">← درس قبلی</button>' : '<span></span>') +
        (idx + 1 < course.topics.length ? '<button class="btn ghost" data-lesson="' + (idx + 1) + '">درس بعدی →</button>' : '') +
        '</div></div>' +

        '<aside class="lesson-side">' +
        '<div class="panel flat">' + HKSAY.svg({ mood: done ? 'happy' : 'think', size: '150px' }) +
        HKSAY.bubble(done ? U.pick(HSK.LINES.lesson_done, idx) : U.pick(HSK.LINES.lesson_intro, idx)) + '</div>' +
        '<div class="panel tight"><strong style="font-family:var(--font-display);font-size:17px">هدف‌های این درس</strong>' +
        '<ul class="goals">' + body.goals.map(function (g) { return '<li>' + g + '</li>'; }).join('') + '</ul></div>' +
        '<div class="panel tight" style="max-height:420px;overflow:auto"><strong style="font-family:var(--font-display);font-size:17px">درس‌های این دوره</strong>' +
        '<div style="margin-top:8px">' + side + '</div></div>' +
        '<div class="callout amber"><span>🔥</span><p>زنجیرهٔ ' + U.fa(u.streak || 0) + ' روزه‌ات فعال است. همین امروز یک درس دیگر بزن تا نشکند.</p></div>' +
        '</aside>' +
        '</section></div></div>',
      bind: function (root) { bind(root, params); }
    };
  };
})();
