/* =====================================================================
   هوشیکا · نما: فهرست دوره‌ها و صفحهٔ دوره
   ===================================================================== */
(function () {
  'use strict';
  var V = (window.HSKVIEWS = window.HSKVIEWS || {});
  var U = HSK.util;
  function A() { return window.HSKAPP; }

  var filter = { q: '', cat: 'all', level: 'all', sort: 'level' };

  function courseCard(c) {
    var app = A(), p = app.courseProgress(c);
    var cat = HSK.catById(c.cat) || {};
    var started = Object.keys(app.state.user.started).indexOf(c.id) >= 0;
    return '<article class="card link tilt course-card" data-course="' + c.id + '">' +
      '<div class="cover" style="--cc:' + c.color + '">' +
      '<span class="cc-code" style="color:' + c.color + '">' + c.code + '</span>' +
      '<span class="cc-sig">' + cat.short + ' · سطح ' + U.fa(c.level) + ' از ۵</span></div>' +
      '<div class="cc-top"><span class="icon-badge">' + c.code + '</span>' +
      '<div class="grow"><h3>' + c.title + '</h3><p>' + c.desc + '</p></div></div>' +
      '<div class="cc-meta"><span>📚 ' + U.fa(c.topics.length) + ' درس</span>' +
      '<span>⏱ ' + U.fa(c.hours) + ' ساعت</span><span>✨ ' + U.fa(c.xp) + ' امتیاز</span></div>' +
      '<div class="progress-line"><div class="bar"><i style="width:' + p.pct + '%"></i></div>' +
      '<span>' + (started ? U.fa(p.done) + ' از ' + U.fa(p.total) : 'شروع نشده') + '</span></div>' +
      '<span class="btn ' + (started ? 'primary' : 'ghost') + ' block">' + (p.done === p.total ? 'مرور دوره' : (started ? 'ادامه بده' : 'شروع کن')) + '</span>' +
      '</article>';
  }

  function bindCatalog(root) {
    var app = A();
    var search = app.$('#courseSearch', root);
    if (search) {
      search.value = filter.q;
      search.addEventListener('input', function () { filter.q = this.value; paint(root); });
      setTimeout(function () { if (filter.q) search.focus(); }, 60);
    }
    app.on(root, '[data-cat-filter]', 'click', function () { filter.cat = this.getAttribute('data-cat-filter'); paint(root); });
    app.on(root, '[data-level-filter]', 'click', function () { filter.level = this.getAttribute('data-level-filter'); paint(root); });
    app.on(root, '[data-sort]', 'change', function () { filter.sort = this.value; paint(root); });
    app.on(root, '[data-course]', 'click', function (ev) {
      var hit = ev.target.closest('[data-course]');
      app.go('#/course/' + hit.getAttribute('data-course'));
    });
  }

  function filtered() {
    var q = filter.q.trim();
    var list = HSK.COURSES.filter(function (c) {
      if (filter.cat !== 'all' && c.cat !== filter.cat) return false;
      if (filter.level !== 'all' && String(c.level) !== filter.level) return false;
      if (q) {
        var hay = (c.title + ' ' + c.desc + ' ' + c.code + ' ' + c.topics.join(' ')).toLowerCase();
        if (hay.indexOf(q.toLowerCase()) < 0) return false;
      }
      return true;
    });
    if (filter.sort === 'level') list.sort(function (a, b) { return a.level - b.level || a.topics.length - b.topics.length; });
    if (filter.sort === 'lessons') list.sort(function (a, b) { return b.topics.length - a.topics.length; });
    if (filter.sort === 'title') list.sort(function (a, b) { return a.title.localeCompare(b.title, 'fa'); });
    return list;
  }

  function paint(root) {
    var app = A();
    var box = app.$('#courseGrid', root);
    if (!box) return;
    var list = filtered();
    box.innerHTML = list.length
      ? list.map(courseCard).join('')
      : '<div class="panel center" style="grid-column:1/-1"><p class="muted">چیزی پیدا نشد. عبارت دیگری امتحان کن.</p></div>';
    var count = app.$('#courseCount', root);
    if (count) count.textContent = U.fa(list.length) + ' دوره';
    app.$$('[data-cat-filter]', root).forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-cat-filter') === filter.cat);
    });
    app.$$('[data-level-filter]', root).forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-level-filter') === filter.level);
    });
    HSKFX.refresh(box);
  }

  V.courses = function (params) {
    var app = A(), u = app.state.user;
    var mine = HSK.COURSES.filter(function (c) { return Object.keys(u.started).indexOf(c.id) >= 0; });
    var all = filtered();
    var goal = HSK.courseById((u.onboard || {}).goalCourse);
    return {
      html: '<div class="page"><div class="stack-lg">' +
        '<section class="row between wrap">' +
        '<div><span class="kicker">آکادمی هوشیکا</span><h1 style="margin:6px 0 6px">همهٔ درس‌ها، یک‌جا</h1>' +
        '<p class="muted" style="margin:0">' + U.fa(HSK.COURSES.length) + ' دوره در ' + U.fa(HSK.CATS.length) +
        ' دسته — از پایتون و جاوااسکریپت تا یونیتی، آنریل، فلاتر و هوش مصنوعی.' +
        (goal ? ' مسیر پیشنهادی تو: <b style="color:var(--cyan)">' + goal.title + '</b>' : '') + '</p></div>' +
        (mine.length ? '<div class="panel tight"><span class="small muted">در حال یادگیری:</span> ' +
          mine.slice(0, 3).map(function (c) {
            return '<span class="chip sm" data-course="' + c.id + '">' + c.title + '</span>';
          }).join(' ') + '</div>' : '') +
        '</section>' +

        '<section class="filters">' +
        '<div class="row wrap between">' +
        '<input class="input grow" id="courseSearch" placeholder="🔍 جست‌وجو: نام زبان، موضوع، مثلاً «بازی» یا «حلقه»" style="max-width:520px" />' +
        '<select class="select" data-sort style="max-width:220px">' +
        '<option value="level">مرتب‌سازی: از مقدماتی به پیشرفته</option>' +
        '<option value="lessons">بیشترین تعداد درس</option>' +
        '<option value="title">الفبایی</option>' +
        '</select>' +
        '<span class="badge ghost" id="courseCount">' + U.fa(all.length) + ' دوره</span>' +
        '</div>' +
        '<div class="cat-chips">' +
        '<button class="chip ' + (filter.cat === 'all' ? 'is-on' : '') + '" data-cat-filter="all">همه</button>' +
        HSK.CATS.map(function (c) {
          return '<button class="chip" data-cat-filter="' + c.id + '">' + c.icon + ' ' + c.short + '</button>';
        }).join('') + '</div>' +
        '<div class="row wrap">' +
        ['1', '2', '3', '4', '5'].map(function (l) {
          return '<button class="chip sm" data-level-filter="' + l + '">سطح ' + U.fa(l) + '</button>';
        }).join('') +
        '<button class="chip sm" data-level-filter="all">همهٔ سطح‌ها</button>' +
        '</div></section>' +

        '<section class="grid g3" id="courseGrid">' + all.map(courseCard).join('') + '</section>' +
        '</div></div>',
      bind: function (root) {
        bindCatalog(root);
        paint(root);
      }
    };
  };

  V.course = function (params) {
    var app = A();
    var course = HSK.courseById(params.id);
    if (!course) return { html: '<div class="page"><div class="panel">دوره پیدا نشد. <a href="#/courses">فهرست دوره‌ها</a></div></div>', bind: function () { } };
    var u = app.state.user;
    var p = app.courseProgress(course);
    var next = app.nextLesson(course);
    var mods = HSK.modulesOf(course);
    var cat = HSK.catById(course.cat) || {};
    var isGoal = (u.onboard || {}).goalCourse === course.id;

    var rows = mods.map(function (m, mi) {
      var open = mi === Math.floor((next < 0 ? 0 : next) / 4);
      var doneInMod = m.topics.filter(function (t, ti) { return app.lessonDone(course.id, m.offset + ti); }).length;
      return '<div class="module ' + (open ? 'open' : '') + '">' +
        '<div class="module-head" data-mod="' + mi + '">' +
        '<span class="icon-badge sm">' + U.fa(mi + 1) + '</span>' +
        '<strong>ماژول ' + U.fa(mi + 1) + ' — ' + m.topics[0] + '</strong>' +
        '<span class="badge ghost">' + U.fa(doneInMod) + ' از ' + U.fa(m.topics.length) + '</span>' +
        '<span class="caret">▼</span></div>' +
        '<div class="module-body">' +
        m.topics.map(function (t, ti) {
          var idx = m.offset + ti, done = app.lessonDone(course.id, idx);
          var state = done ? 'done' : (idx === next ? 'current' : '');
          return '<div class="lesson-row ' + state + '" data-lesson="' + idx + '" role="button" tabindex="0">' +
            '<span class="l-state">' + (done ? '✓' : U.fa(idx + 1)) + '</span>' +
            '<span class="l-title">' + t + '</span>' +
            (idx === next && !done ? '<span class="badge cyan">پیشنهادی</span>' : '') +
            '<span class="l-xp">+' + U.fa(10) + ' ✨</span></div>';
        }).join('') +
        '</div></div>';
    }).join('');

    return {
      html: '<div class="page"><div class="stack-lg">' +
        '<section class="course-hero">' +
        '<div class="panel">' +
        '<div class="row" style="gap:10px"><a class="badge ghost" href="#/courses">← همهٔ دوره‌ها</a>' +
        '<span class="badge" style="color:' + course.color + ';border-color:' + course.color + '55">' + cat.short + '</span>' +
        (isGoal ? '<span class="badge cyan">مسیر هدف تو</span>' : '') + '</div>' +
        '<h1 style="margin:12px 0 8px">' + course.title + '</h1>' +
        '<p class="ink2" style="max-width:640px">' + course.desc + '</p>' +
        '<div class="cc-meta" style="margin:10px 0 16px"><span>📚 ' + U.fa(course.topics.length) + ' درس در ' + U.fa(mods.length) + ' ماژول</span>' +
        '<span>⏱ حدود ' + U.fa(course.hours) + ' ساعت</span><span>✨ ' + U.fa(course.xp) + ' امتیاز کل</span>' +
        '<span>📈 سطح ' + U.fa(course.level) + ' از ۵</span></div>' +
        '<div class="progress-line"><div class="bar"><i style="width:' + p.pct + '%"></i></div>' +
        '<span>' + U.fa(p.done) + ' از ' + U.fa(p.total) + ' درس</span></div>' +
        '<div class="row wrap" style="margin-top:16px">' +
        (next >= 0
          ? '<button class="btn primary xl" data-lesson="' + next + '">' + (p.done > 0 ? '▶ ادامه بده' : '▶ شروع کن') + ' — ' + course.topics[next] + '</button>'
          : '<span class="badge lime">دوره کامل شد! 🎉</span>') +
        '<button class="btn ghost" data-go="#/path">مسیر من</button>' +
        '</div></div>' +
        '<div class="panel flat center">' + HKSAY.svg({ mood: p.done === p.total ? 'proud' : 'happy', size: '190px' }) +
        HKSAY.bubble(p.done === p.total
          ? 'این دوره را تمام کردی! حالا می‌توانی یک درس از رشتهٔ دیگری امتحان کنی یا سراغ پروژه بروی.'
          : 'در دورهٔ ' + course.title + ' هر درس یک تست کوتاه دارد؛ هر پاسخ درست ۵ امتیاز و هر درس ۱۰ امتیاز می‌دهد.') +
        '</div></section>' +
        '<section>' + rows + '</section>' +
        '</div></div>',
      bind: function (root) {
        app.on(root, '.module-head', 'click', function () {
          var m = this.parentElement;
          m.classList.toggle('open');
        });
        app.on(root, '[data-lesson]', 'click', function () {
          app.go('#/lesson/' + course.id + '/' + this.getAttribute('data-lesson'));
        });
        HSKFX.refresh(root);
      }
    };
  };
})();
