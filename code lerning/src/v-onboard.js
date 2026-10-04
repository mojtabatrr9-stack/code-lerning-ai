/* =====================================================================
   هوشیکا · نما: آنبوردینگ هوشمند (هدف → درس → انگیزه → تجربه → تست سطح)
   ===================================================================== */
(function () {
  'use strict';
  var V = (window.HSKVIEWS = window.HSKVIEWS || {});
  var U = HSK.util;
  function A() { return window.HSKAPP; }

  var WHY = [
    { id: 'job', icon: '💼', t: 'رسیدن به شغل و درآمد', d: 'دنبال کار برنامه‌نویسی یا فریلنسری هستم.' },
    { id: 'project', icon: '🛠', t: 'ساختن پروژه و ایده', d: 'یک ایده دارم و می‌خواهم بسازمش.' },
    { id: 'fun', icon: '🎈', t: 'کنجکاوی و علاقه', d: 'برای خودم جذاب است و دوست دارم یاد بگیرم.' },
    { id: 'school', icon: '🎓', t: 'درس و دانشگاه', d: 'برای درس‌هام به آن نیاز دارم.' },
    { id: 'game', icon: '🎮', t: 'ساختن بازی', d: 'می‌خواهم بازی خودم را بسازم.' },
    { id: 'ai', icon: '🤖', t: 'کار با هوش مصنوعی', d: 'می‌خواهم با AI ابزار بسازم.' }
  ];
  var EXP = [
    { id: 1, icon: '🌱', t: 'هیچ آشنایی ندارم', d: 'از صفر و قدم‌به‌قدم شروع می‌کنیم.' },
    { id: 2, icon: '🌿', t: 'کمی آشنا هستم', d: 'چند چیز بلدم ولی منظم نیست.' },
    { id: 3, icon: '🌳', t: 'خوب بلدم', d: 'می‌خواهم عمیق‌تر و حرفه‌ای‌تر شوم.' }
  ];

  function fresh() {
    return {
      step: 0, cat: '', course: '', why: '', exp: 0,
      qIndex: 0, tier: 2, used: [], correct: 0, asked: 0,
      current: null, feedback: null, result: null
    };
  }
  function state() {
    var a = A().state;
    if (!a.onboarding) a.onboarding = fresh();
    return a.onboarding;
  }

  function pickQuestion(ob) {
    var bank = HSK.QB[ob.cat] || HSK.QB.lang;
    var tier = ob.tier;
    var pool = bank.filter(function (q) { return q.tier === tier && ob.used.indexOf(q.text) < 0; });
    if (!pool.length) {
      pool = bank.filter(function (q) { return ob.used.indexOf(q.text) < 0; });
    }
    if (!pool.length) return null;
    var q = pool[U.hash(ob.cat + ob.qIndex + tier) % pool.length];
    ob.used.push(q.text);
    ob.current = { text: q.text, opts: q.opts, ans: q.ans, why: q.why, tier: q.tier };
    return ob.current;
  }

  function progressBar() {
    var ob = state();
    var total = 5, done = ob.qIndex;
    if (ob.step < 4) return '';
    return '<div class="bar slim"><i style="width:' + Math.round((done / total) * 100) + '%"></i></div>';
  }

  function step0() {
    return '' +
      '<div class="row" style="gap:16px;align-items:flex-start;margin-bottom:20px">' +
      HKSAY.svg({ mood: 'happy', size: '150px' }) +
      '<div class="grow">' + HKSAY.bubble(HSK.LINES.ask_goal[0]) +
      '<div class="question-title" style="margin-top:14px">می‌خواهی چه درسی یاد بگیری؟</div>' +
      '<p class="question-description">یک رشته انتخاب کن؛ من بانک درس‌های آن را نشانت می‌دهم و بعد مسیرت را می‌سازم.</p></div></div>' +
      '<div class="answer-options">' +
      HSK.CATS.map(function (c) {
        var n = HSK.COURSES.filter(function (x) { return x.cat === c.id; }).length;
        return '<button class="answer-option goal-tile" data-cat="' + c.id + '" data-state="' + (state().cat === c.id ? 'on' : 'off') + '">' +
          '<span class="gt-icon" style="color:' + c.color + '">' + c.icon + '</span>' +
          '<strong>' + c.title + '</strong><p>' + c.blurb + '</p>' +
          '<span class="badge ghost small">' + U.fa(n) + ' دوره</span></button>';
      }).join('') +
      '<button class="answer-option goal-tile" data-x="surprise" data-state="off">' +
      '<span class="gt-icon">🎲</span><strong>نمی‌دانم؛ تو انتخاب کن</strong>' +
      '<p>بر اساس محبوب‌ترین مسیرها برایت پیشنهاد می‌دهم.</p></button>' +
      '</div>';
  }

  function step1() {
    var ob = state(), cat = HSK.catById(ob.cat);
    var courses = HSK.COURSES.filter(function (c) { return c.cat === ob.cat; })
      .sort(function (a, b) { return a.level - b.level; });
    return '' +
      '<div class="row" style="gap:14px;align-items:center;margin-bottom:14px">' +
      '<span class="icon-badge">' + (cat ? cat.icon : '📘') + '</span>' +
      '<div class="grow"><div class="question-title" style="margin:0">کدام درس را شروع کنیم؟</div>' +
      '<p class="question-description" style="margin:0">' + U.fa(courses.length) + ' دوره در «' + (cat ? cat.title : '') + '» هست. هر کدام را انتخاب کردی، مسیر همان را می‌سازم.</p></div></div>' +
      '<div class="answer-options">' +
      courses.map(function (c) {
        return '<button class="answer-option" data-course="' + c.id + '" data-state="' + (ob.course === c.id ? 'on' : 'off') + '">' +
          '<span class="ao-num">' + c.code + '</span>' +
          '<strong style="font-weight:400">' + c.title + '</strong>' +
          '<p class="small muted" style="margin:6px 0 0">' + c.desc + '</p>' +
          '<div class="cc-meta" style="margin-top:8px"><span>📚 ' + U.fa(c.topics.length) + ' درس</span>' +
          '<span>⏱ ' + U.fa(c.hours) + ' ساعت</span><span>✨ ' + U.fa(c.xp) + ' امتیاز</span>' +
          '<span>📈 سطح ' + U.fa(c.level) + ' از ۵</span></div></button>';
      }).join('') + '</div>';
  }

  function step2() {
    var ob = state();
    return '' +
      '<div class="question-title">چرا می‌خواهی این را یاد بگیری؟</div>' +
      '<p class="question-description">این جواب، لحن مسیر و پروژه‌های پیشنهادی را مشخص می‌کند.</p>' +
      '<div class="answer-options">' +
      WHY.map(function (w) {
        return '<button class="answer-option" data-why="' + w.id + '" data-state="' + (ob.why === w.id ? 'on' : 'off') + '">' +
          '<span class="gt-icon">' + w.icon + '</span><strong style="font-weight:400;display:block;margin-top:6px">' + w.t + '</strong>' +
          '<p class="small muted" style="margin:4px 0 0">' + w.d + '</p></button>';
      }).join('') + '</div>';
  }

  function step3() {
    var ob = state();
    return '' +
      '<div class="question-title">چقدر با این موضوع آشنا هستی؟</div>' +
      '<p class="question-description">صادق باش! این جواب فقط نقطهٔ شروع تست سطح را تعیین می‌کند.</p>' +
      '<div class="answer-options">' +
      EXP.map(function (e) {
        return '<button class="answer-option" data-exp="' + e.id + '" data-state="' + (ob.exp === e.id ? 'on' : 'off') + '">' +
          '<span class="gt-icon">' + e.icon + '</span><strong style="font-weight:400;display:block;margin-top:6px">' + e.t + '</strong>' +
          '<p class="small muted" style="margin:4px 0 0">' + e.d + '</p></button>';
      }).join('') + '</div>';
  }

  function step4() {
    var ob = state();
    if (!ob.current) pickQuestion(ob);
    var q = ob.current;
    var mood = ob.feedback ? (ob.feedback.ok ? 'happy' : 'sad') : 'think';
    return '' +
      '<div class="panel quiz-card">' +
      '<div class="wizard-top"><span>سؤال ' + U.fa(ob.qIndex + 1) + ' از ۵</span><span>سطح تست: ' + ['', 'آسان', 'متوسط', 'سخت'][q.tier] + '</span></div>' +
      progressBar() +
      '<div class="row" style="gap:14px;align-items:flex-start;margin:16px 0">' +
      HKSAY.svg({ mood: mood, size: '128px' }) +
      '<div class="grow">' + HKSAY.bubble(ob.feedback ? ob.feedback.say : HSK.LINES.quiz[0]) + '</div></div>' +
      '<div class="question-title">' + q.text + '</div>' +
      (q.why && ob.feedback ? '<p class="explain ' + (ob.feedback.ok ? 'right' : 'wrong') + '">' + q.why + '</p>' : '') +
      '<div class="answer-options">' +
      q.opts.map(function (o, i) {
        var st = 'off';
        if (ob.feedback) {
          if (i === q.ans) st = 'right';
          else if (i === ob.chosen) st = 'wrong';
        }
        return '<button class="answer-option" data-answer="' + i + '" data-state="' + st + '"' + (ob.feedback ? ' disabled' : '') + '>' +
          '<span class="ao-num">' + U.fa(i + 1) + '</span>' + o + '</button>';
      }).join('') + '</div>' +
      '<div class="wizard-actions">' +
      '<span class="hint">امتیاز فعلی تست: ' + U.fa(ob.correct) + ' از ' + U.fa(ob.asked) + '</span>' +
      '<button class="btn primary" data-x="next" ' + (ob.feedback ? '' : 'disabled') + '>' +
      (ob.qIndex >= 4 ? 'دیدن نتیجه' : 'سؤال بعدی →') + '</button>' +
      '</div></div>';
  }

  function step5() {
    var ob = state(), r = ob.result, course = HSK.courseById(ob.course);
    if (!r) return '';
    return '' +
      '<div class="panel quiz-card center" style="padding:30px">' +
      '<div class="row" style="justify-content:center;gap:18px;align-items:center">' +
      HKSAY.svg({ mood: 'proud', size: '190px' }) +
      '<div style="text-align:right">' +
      '<span class="kicker">نتیجهٔ سطح‌بندی</span>' +
      '<h2 style="margin:6px 0">سطح ' + U.fa(r.level) + ' — ' + r.title + '</h2>' +
      '<p class="muted" style="margin:0">' + r.note + '</p></div></div>' +
      '<div class="summary-stats" style="display:flex;gap:30px;justify-content:center;margin:22px 0;flex-wrap:wrap">' +
      '<div><strong style="font-family:var(--font-display);font-size:26px;color:var(--cyan)">' + U.fa(ob.correct) + '/' + U.fa(ob.asked) + '</strong><div class="small muted">پاسخ درست</div></div>' +
      '<div><strong style="font-family:var(--font-display);font-size:26px;color:var(--lime)">' + U.fa(course ? course.hours : 0) + ' ساعت</strong><div class="small muted">زمان تخمینی مسیر</div></div>' +
      '<div><strong style="font-family:var(--font-display);font-size:26px;color:var(--amber)">' + U.fa(course ? course.topics.length : 0) + ' درس</strong><div class="small muted">در دورهٔ انتخابی</div></div></div>' +
      HKSAY.bubble('از «' + (course ? course.title : '') + '» شروع می‌کنیم و بر اساس سطحت، درس‌های پایه را سریع مرور می‌کنیم. اگر وسط راه سخت شد، تست را دوباره می‌گیریم.') +
      '<div class="wizard-actions" style="justify-content:center;margin-top:22px">' +
      '<button class="btn ghost" data-x="retest">تست را دوباره بده</button>' +
      '<button class="btn primary xl" data-x="start">شروع یادگیری (+۳۰ امتیاز)</button>' +
      '</div></div>';
  }

  function bind(root) {
    var app = A(), ob = state();
    app.on(root, '[data-cat]', 'click', function () {
      ob.cat = this.getAttribute('data-cat');
      ob.step = 1;
      app.render();
    });
    app.on(root, '[data-x="surprise"]', 'click', function () {
      ob.cat = 'lang';
      var best = HSK.COURSES.filter(function (c) { return c.cat === 'lang'; }).sort(function (a, b) { return a.level - b.level; })[0];
      ob.course = best.id;
      ob.step = 2;
      app.toast({ icon: '🎲', title: 'انتخاب هوشیکا', text: 'مسیر «' + best.title + '» را پیشنهاد می‌کنم.' });
      app.render();
    });
    app.on(root, '[data-course]', 'click', function () {
      ob.course = this.getAttribute('data-course');
      ob.step = 2;
      app.render();
    });
    app.on(root, '[data-why]', 'click', function () {
      ob.why = this.getAttribute('data-why');
      ob.step = 3;
      app.render();
    });
    app.on(root, '[data-exp]', 'click', function () {
      ob.exp = parseInt(this.getAttribute('data-exp'), 10);
      ob.tier = ob.exp;
      ob.step = 4;
      ob.qIndex = 0; ob.used = []; ob.correct = 0; ob.asked = 0; ob.current = null; ob.feedback = null;
      app.render();
    });
    app.on(root, '[data-answer]', 'click', function () {
      if (ob.feedback) return;
      var idx = parseInt(this.getAttribute('data-answer'), 10);
      var q = ob.current;
      var ok = idx === q.ans;
      ob.chosen = idx;
      ob.asked++;
      if (ok) {
        ob.correct++;
        ob.tier = Math.min(3, ob.tier + 1);
        ob.feedback = { ok: true, say: U.pick(HSK.LINES.correct, U.hash(q.text)) };
        HKSAY.react('happy', 1800);
      } else {
        ob.tier = Math.max(1, ob.tier - 1);
        ob.feedback = { ok: false, say: U.pick(HSK.LINES.wrong, U.hash(q.text)) };
        HKSAY.react('sad', 1800);
      }
      app.render();
    });
    app.on(root, '[data-x="next"]', 'click', function () {
      if (!ob.feedback) return;
      if (ob.qIndex >= 4) {
        ob.result = HSK.levelFromScore(ob.correct, ob.asked);
        ob.step = 5;
        HKSAY.react('proud', 3000);
        app.render();
        return;
      }
      ob.qIndex++;
      ob.feedback = null;
      pickQuestion(ob);
      app.render();
    });
    app.on(root, '[data-x="retest"]', 'click', function () {
      ob.step = 3; ob.qIndex = 0; ob.used = []; ob.correct = 0; ob.asked = 0; ob.current = null; ob.feedback = null; ob.result = null;
      app.render();
    });
    app.on(root, '[data-x="start"]', 'click', function (ev) {
      var u = app.state.user;
      u.onboard = {
        done: true, goalCat: ob.cat, goalCourse: ob.course, why: ob.why,
        level: ob.result.level, title: ob.result.title, score: ob.correct, total: ob.asked
      };
      u.flags.placement = true;
      app.saveUser();
      app.addXp(30, 'placement', 'تکمیل تست سطح‌بندی');
      HSKFX.confetti(ev.clientX, ev.clientY, 44);
      app.toast({ icon: '🚀', title: 'مسیرت آماده است!', text: 'داشبورد اختصاصی تو ساخته شد.' });
      app.go('#/home');
      app.render();
    });
    HSKFX.refresh(root);
  }

  V.onboarding = function () {
    var ob = state();
    var heads = ['هدف تو', 'انتخاب درس', 'انگیزه', 'تجربه', 'تست سطح', 'نتیجه'];
    var body = [step0, step1, step2, step3, step4, step5][ob.step]();
    return {
      html: '<div class="page narrow">' +
        '<div class="wizard">' +
        '<div class="step-dots">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= ob.step ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '<div class="wizard-top"><span>گام ' + U.fa(ob.step + 1) + ' — ' + heads[ob.step] + '</span>' +
        '<span>' + HSK.BRAND.name + ' · سطح‌بندی هوشمند</span></div>' +
        (ob.step === 0 || ob.step === 1 ? '<div class="panel flat" style="padding:20px">' + body + '</div>' : body) +
        (ob.step === 0 ? '<p class="hint center" style="margin-top:16px">بعد از انتخاب رشته، پنج سؤال کوتاه می‌پرسم تا سطحت را دقیق بفهمم.</p>' : '') +
        '</div></div>',
      bind: bind
    };
  };
})();
