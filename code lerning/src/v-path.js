/* =====================================================================
   هوشیکا · نما: مسیر یادگیری شخصی
   ===================================================================== */
(function () {
  'use strict';
  var V = (window.HSKVIEWS = window.HSKVIEWS || {});
  var U = HSK.util;
  function A() { return window.HSKAPP; }

  function buildPlan(u) {
    var ob = u.onboard || {};
    var cat = HSK.catById(ob.goalCat) || HSK.CATS[0];
    var goal = HSK.courseById(ob.goalCourse) || HSK.COURSES[0];
    var pool = HSK.COURSES.filter(function (c) { return c.cat === cat.id; }).sort(function (a, b) { return a.level - b.level; });
    var lvl = ob.level || 2;
    var steps = [];
    var startIdx = Math.max(0, Math.min(pool.length - 1, lvl - 1));
    var first = pool[0];
    var second = pool[Math.min(pool.length - 1, startIdx)];

    steps.push({
      icon: '🚀', week: 'هفتهٔ ۱', title: 'پایه‌ها: ' + first.title,
      text: 'بدون عجله پایه را می‌سازیم. سطح ' + U.fa(lvl) + ' تشخیص داده شده، پس درس‌های پایه را سریع‌تر مرور می‌کنیم.',
      task: '۴ درس اول دوره را کامل کن و کد هر درس را یک بار خودت بنویس.',
      courses: [first.id]
    });
    if (second && second.id !== first.id) {
      steps.push({
        icon: '🧱', week: 'هفتهٔ ۲-۳', title: 'عمق بیشتر: ' + second.title,
        text: 'سراغ مفاهیمی می‌رویم که تفاوت یک تازه‌کار و یک برنامه‌نویس واقعی را می‌سازند.',
        task: 'نصف دورهٔ ' + second.title + ' را جلو ببر و برای هر ماژول یک یادداشت کوتاه بنویس.',
        courses: [second.id]
      });
    }
    steps.push({
      icon: '🛠', week: 'هفتهٔ ۴', title: 'پروژهٔ کوچک',
      text: 'یادگیری بدون ساختن، فراموش می‌شود. یک پروژهٔ کوچک با ' + goal.title + ' می‌سازیم.',
      task: 'یک برنامهٔ زیر ۵۰ خط بساز که ورودی بگیرد و خروجی نشان دهد (مثلاً ماشین‌حساب یا لیست کارها).',
      courses: []
    });
    steps.push({
      icon: '🧠', week: 'هفتهٔ ۵-۶', title: 'مباحث حرفه‌ای',
      text: 'مباحثی که در مصاحبه‌ها و پروژه‌های واقعی پرتکرارند: ساختار کد، دیباگ و بهینه‌سازی.',
      task: 'دو دورهٔ سطح ۴ از دستهٔ ' + cat.short + ' را شروع کن و تست‌هایشان را بزن.',
      courses: pool.filter(function (c) { return c.level >= 4; }).slice(0, 2).map(function (c) { return c.id; })
    });
    steps.push({
      icon: '🏁', week: 'هفتهٔ ۷-۸', title: 'پروژهٔ نهایی و نمایش',
      text: 'یک پروژهٔ کامل بساز، منتشر کن و در لیگ با امتیازهایش بدرخش.',
      task: 'پروژه‌ات را جایی منتشر کن و لینکش را برای یک دوست بفرست تا تست کند.',
      courses: []
    });
    return { cat: cat, goal: goal, steps: steps, level: lvl };
  }

  function stepState(step, doneCount) {
    return step.courses.length ? (step.courses.every(function (id) {
      var c = HSK.courseById(id);
      return c && A().courseProgress(c).done === c.topics.length;
    }) ? 'completed' : '') : '';
  }

  V.path = function () {
    var app = A(), u = app.state.user;
    var plan = buildPlan(u);
    var mine = HSK.COURSES.filter(function (c) { return Object.keys(u.started).indexOf(c.id) >= 0; });
    var stepsDone = plan.steps.filter(function (s) { return stepState(s) === 'completed'; }).length;
    var pct = Math.round((stepsDone / plan.steps.length) * 100);

    return {
      html: '<div class="page"><div class="stack-lg">' +
        '<section class="row between wrap">' +
        '<div><span class="kicker">' + plan.cat.icon + ' ' + plan.cat.title + '</span>' +
        '<h1 style="margin:6px 0">مسیر شخصی تو</h1>' +
        '<p class="muted" style="margin:0">بر اساس هدف («' + plan.goal.title + '») و سطحی که تست تعیین کرد (سطح ' + U.fa(plan.level) + ') این نقشه ساخته شده. هر هفته پیشرفتت را با همین صفحه بسنج.</p></div>' +
        '<div class="col">' +
        '<div class="row wrap"><button class="btn violet" data-x="download">⬇ دریافت نقشه (فایل متنی)</button>' +
        '<button class="btn ghost" data-go="#/courses">همهٔ دوره‌ها</button></div>' +
        '<div class="roadmap-progress"><div class="bar"><i style="width:' + pct + '%"></i></div>' +
        '<span>' + U.fa(stepsDone) + ' از ' + U.fa(plan.steps.length) + ' گام</span></div></div>' +
        '</section>' +

        '<section class="callout amber"><span>🤖</span><p><strong>یادداشت هوشیکا: </strong>مسیر خط‌کشی است، نه زندان. اگر یک هفته عقب افتادی، خودت را سرزنش نکن؛ فقط گام بعدی را بردار. ربات‌ها هیچ‌وقت خسته نمی‌شوند، ولی تو انسان هستی و طبیعی است.</p></section>' +

        '<section>' + plan.steps.map(function (s, i) {
          var st = stepState(s);
          return '<div class="road-step ' + st + '">' +
            '<span class="step-marker">' + (st ? '✓' : U.fa(i + 1)) + '</span>' +
            '<div class="step-body"><span class="small muted">' + s.week + '</span>' +
            '<h3>' + s.icon + ' ' + s.title + '</h3>' +
            '<p>' + s.text + '</p>' +
            '<div class="step-task">' + s.task + '</div>' +
            (s.courses.length ? '<div class="row wrap" style="margin-top:10px">' + s.courses.map(function (id) {
              var c = HSK.courseById(id);
              if (!c) return '';
              var p = app.courseProgress(c);
              return '<span class="chip sm" data-course="' + id + '">' + c.code + ' ' + c.title + ' — ' + U.fa(p.pct) + '٪</span>';
            }).join('') + '</div>' : '') +
            '</div>' +
            (s.courses.length ? '<button class="btn ' + (st ? 'ghost' : 'primary') + ' sm" data-course="' + s.courses[0] + '">' + (st ? 'مرور' : 'برو') + '</button>' : '') +
            '</div>';
        }).join('') + '</section>' +

        '<section class="panel"><div class="sec-head"><h2 style="font-size:24px">دوره‌های در جریان</h2>' +
        '<span class="badge ghost">' + U.fa(mine.length) + ' دوره</span></div>' +
        (mine.length ? '<div class="grid g3">' + mine.map(function (c) {
          var p = app.courseProgress(c);
          return '<div class="card link tilt" data-course="' + c.id + '">' +
            '<div class="cc-top"><span class="icon-badge">' + c.code + '</span>' +
            '<div class="grow"><h3 style="margin:0">' + c.title + '</h3>' +
            '<p class="muted small" style="margin:4px 0 0">' + U.fa(p.done) + ' از ' + U.fa(p.total) + ' درس</p></div></div>' +
            '<div class="progress-line" style="margin-top:10px"><div class="bar"><i style="width:' + p.pct + '%"></i></div>' +
            '<span>' + U.fa(p.pct) + '٪</span></div></div>';
        }).join('') + '</div>' : '<p class="muted">هنوز دوره‌ای شروع نکرده‌ای. <a href="#/courses">از فهرست دوره‌ها</a> یکی را انتخاب کن.</p>') +
        '</section>' +

        '<section class="panel flat">' + HKSAY.svg({ mood: 'proud', size: '180px' }) +
        HKSAY.bubble('راستی، هر گامی که تمام می‌کنی امتیاز می‌گیری؛ و امتیازت مستقیم می‌رود در جدول لیگ هفتگی و ماهانه. یعنی هم یاد می‌گیری، هم رقابت می‌کنی.') + '</section>' +
        '</div></div>',
      bind: function (root) {
        app.on(root, '[data-course]', 'click', function (ev) {
          var hit = ev.target.closest('[data-course]');
          if (hit && hit === this) app.go('#/course/' + this.getAttribute('data-course'));
        });
        app.on(root, '[data-x="download"]', 'click', function () {
          var lines = ['هوشیکا — نقشهٔ مسیر یادگیری', 'هدف: ' + plan.goal.title + ' (' + plan.cat.title + ')',
            'سطح: ' + U.fa(plan.level), 'تاریخ: ' + U.persianDate(new Date()), ''];
          plan.steps.forEach(function (s, i) {
            lines.push((i + 1) + ') ' + s.week + ' — ' + s.title);
            lines.push('   ' + s.text);
            lines.push('   تمرین: ' + s.task);
            lines.push('');
          });
          var blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/plain;charset=utf-8' });
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'hooshika-curriculum.txt';
          document.body.appendChild(a);
          a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
          app.addXp(10, 'path', 'دریافت نقشهٔ مسیر');
          app.toast({ icon: '⬇', title: 'نقشه دانلود شد', text: 'فایل متنی مسیر در پوشهٔ دانلود ذخیره شد. +۱۰ امتیاز' });
        });
        HSKFX.refresh(root);
      }
    };
  };
})();
