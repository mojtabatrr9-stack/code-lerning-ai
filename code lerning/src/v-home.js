/* =====================================================================
   هوشیکا · نما: داشبورد یادگیری
   ===================================================================== */
(function () {
  'use strict';
  var V = (window.HSKVIEWS = window.HSKVIEWS || {});
  var U = HSK.util;
  function A() { return window.HSKAPP; }

  function greeting() {
    var h = new Date().getHours();
    if (h < 5) return 'شب‌زنده‌داری!';
    if (h < 12) return 'صبح بخیر';
    if (h < 17) return 'روز بخیر';
    if (h < 21) return 'عصر بخیر';
    return 'شب بخیر';
  }
  function ringHTML(pct, big, small) {
    var r = 46, c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(1, pct / 100)));
    return '<div class="ring">' +
      '<svg width="108" height="108" viewBox="0 0 108 108">' +
      '<circle class="ring-bg" cx="54" cy="54" r="' + r + '"></circle>' +
      '<circle class="ring-fg" cx="54" cy="54" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"></circle>' +
      '</svg><div class="ring-label"><div><strong>' + big + '</strong><span>' + small + '</span></div></div></div>';
  }
  function missionHTML(m, i) {
    var pct = Math.round(((m.progress || 0) / m.goal) * 100);
    var ready = A().missionReady(m);
    return '<div class="mission ' + (m.claimed ? 'done' : '') + '">' +
      '<span class="icon-badge sm">' + (m.claimed ? '✅' : U.fa(i + 1)) + '</span>' +
      '<div class="m-body"><strong>' + m.text + '</strong>' +
      '<div class="bar slim" style="margin-top:6px"><i style="width:' + pct + '%"></i></div>' +
      '<span class="small muted">' + U.fa(m.progress || 0) + ' از ' + U.fa(m.goal) + ' — پاداش ' + U.fa(m.xp) + ' امتیاز</span></div>' +
      (m.claimed
        ? '<span class="badge lime">گرفته شد</span>'
        : (ready ? '<button class="btn lime sm" data-claim="' + m.id + '">دریافت پاداش</button>'
          : '<span class="badge ghost">در جریان</span>')) +
      '</div>';
  }
  function streakHTML(u) {
    var out = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var key = U.dayKey(d), on = u.days.indexOf(key) >= 0;
      var label = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'narrow' }).format(d);
      out.push('<div class="streak-day ' + (on ? 'on' : '') + (i === 0 ? ' today' : '') + '">' +
        '<i>' + (on ? '🔥' : '·') + '</i><span>' + label + '</span></div>');
    }
    return '<div class="streak-grid">' + out.join('') + '</div>';
  }
  function miniLeague(u) {
    var L = A().leagueRows('week');
    var rows = L.rows.slice(0, 5);
    if (!rows.some(function (r) { return r.me; })) {
      var me = L.rows.filter(function (r) { return r.me; })[0];
      if (me) rows = rows.slice(0, 4).concat([me]);
    }
    return '<div class="mini-league">' + rows.map(function (r) {
      return '<div class="mini-row ' + (r.me ? 'me' : '') + '">' +
        '<span class="rank">' + U.fa(r.rank) + '</span>' +
        (r.me ? A().avatarHTML(u) : HKSAY.avatar(r.avatar, r.rank <= 3 ? '#ffc94d' : '#4de2ff')) +
        '<span class="name">' + A().esc(r.name) + (r.me ? ' (تو)' : '') + '</span>' +
        '<span class="xp">' + U.faNum(r.xp) + ' ✨</span></div>';
    }).join('') + '</div>';
  }
  function courseCard(c) {
    var p = A().courseProgress(c);
    var cat = HSK.catById(c.cat) || {};
    return '<article class="card link tilt" data-course="' + c.id + '">' +
      '<div class="cover" style="--cc:' + c.color + '">' +
      '<span class="cc-code" style="color:' + c.color + '">' + c.code + '</span>' +
      '<span class="cc-sig">' + cat.short + ' · سطح ' + U.fa(c.level) + '</span></div>' +
      '<div class="cc-top"><span class="icon-badge">' + c.code + '</span>' +
      '<div class="grow"><h3>' + c.title + '</h3><p>' + c.desc + '</p></div></div>' +
      '<div class="cc-meta"><span>📚 ' + U.fa(c.topics.length) + ' درس</span><span>⏱ ' + U.fa(c.hours) + ' ساعت</span>' +
      '<span>✨ ' + U.fa(c.xp) + ' امتیاز</span></div>' +
      '<div class="progress-line"><div class="bar"><i style="width:' + p.pct + '%"></i></div><span>' + U.fa(p.pct) + '٪</span></div>' +
      '<span class="btn primary block">' + (p.done > 0 ? 'ادامه بده' : 'شروع کن') + '</span>' +
      '</article>';
  }
  function challengeHTML(u) {
    var ch = HSK.challengeFor(U.weekKey());
    var done = !!u.flags['ch-' + ch.id + '-' + U.weekKey()];
    return '<div class="card">' +
      '<div class="card-top"><span class="icon-badge">🏆</span><div class="grow"><h3 style="margin:0">چالش هفته</h3>' +
      '<p class="muted small" style="margin:4px 0 0">هر هفته یک چالش تازه؛ با انجامش نشان «قهرمان هفته» را بگیر.</p></div></div>' +
      '<p style="margin:14px 0 6px"><strong style="font-family:var(--font-display);font-size:19px">' + ch.title + '</strong></p>' +
      '<p class="muted">' + ch.desc + '</p>' +
      '<div class="row between"><span class="badge amber">+' + U.fa(ch.xp) + ' امتیاز</span>' +
      (done ? '<span class="badge lime">ثبت شد ✓</span>' : '<button class="btn violet sm" data-challenge="' + ch.id + '">چالش را انجام دادم</button>') +
      '</div></div>';
  }
  function achStrip(u) {
    var got = HSK.ACHIEVEMENTS.filter(function (a) { return u.achievements.indexOf(a.id) >= 0; });
    var locked = HSK.ACHIEVEMENTS.filter(function (a) { return u.achievements.indexOf(a.id) < 0; }).slice(0, 3);
    return '<div class="ach-strip">' +
      (got.length ? got.slice(-6).map(function (a) {
        return '<div class="ach-tile get"><span class="a-icon">' + a.icon + '</span><strong>' + a.title + '</strong><small>' + a.desc + '</small></div>';
      }).join('') : '') +
      locked.map(function (a) {
        return '<div class="ach-tile locked"><span class="a-icon">🔒</span><strong>' + a.title + '</strong><small>' + a.desc + '</small></div>';
      }).join('') + '</div>';
  }

  function bind(root) {
    var app = A(), u = app.state.user;
    app.ensureMissions();
    app.on(root, '[data-claim]', 'click', function (ev) { app.claimMission(this.getAttribute('data-claim'), ev); });
    app.on(root, '[data-course]', 'click', function (ev) {
      var hit = ev.target.closest('[data-course]');
      if (hit !== this) return;
      app.go('#/course/' + this.getAttribute('data-course'));
    });
    app.on(root, '[data-x="tip"]', 'click', function () {
      var b = app.$('.hk-say', root);
      if (b) { b.classList.add('rv'); HKSAY.type(b, U.pick(HSK.LINES.tip, Date.now())); b.classList.remove('rv'); b.classList.add('is-in'); }
      HKSAY.react('think', 1600);
    });
    app.on(root, '[data-challenge]', 'click', function (ev) {
      var id = this.getAttribute('data-challenge');
      var ch = HSK.challengeFor(U.weekKey());
      u.flags['ch-' + id + '-' + U.weekKey()] = true;
      u.flags.weeklyWin = true;
      app.saveUser();
      app.addXp(ch.xp, 'challenge', 'چالش هفتگی');
      HSKFX.confetti(ev.clientX, ev.clientY, 30);
      app.toast({ icon: '🏆', title: 'چالش هفتگی انجام شد!', text: 'نشان «قهرمان هفته» باز شد.' });
      app.render();
    });
    HSKFX.refresh(root);
  }

  V.home = function () {
    var app = A(), u = app.state.user;
    var lvl = app.levelInfo();
    var ob = u.onboard || {};
    var goalCourse = HSK.courseById(ob.goalCourse) || HSK.COURSES[0];
    var nextIdx = app.nextLesson(goalCourse);
    var p = app.courseProgress(goalCourse);
    var L = app.leagueRows('week');
    var lessonsDone = Object.keys(u.lessons).length;
    var totalLessons = HSK.COURSES.reduce(function (s, c) { return s + c.topics.length; }, 0);
    var acc = u.answered ? Math.round((u.correct / u.answered) * 100) : 0;
    var tip = nextIdx >= 0
      ? 'درس بعدی تو «' + goalCourse.topics[nextIdx] + '» از دورهٔ ' + goalCourse.title + ' است. با هم تمامش کنیم؟'
      : 'دورهٔ ' + goalCourse.title + ' را تمام کرده‌ای! برو سراغ مسیر بعدی.';
    var cat = HSK.catById(ob.goalCat) || HSK.CATS[0];
    var recs = HSK.COURSES.filter(function (c) { return c.cat === ob.goalCat && c.id !== goalCourse.id; }).slice(0, 3);
    if (!recs.length) recs = HSK.COURSES.slice(0, 3);

    return {
      html: '<div class="page">' +
        '<div class="stack-lg">' +

        /* هیرو */
        '<section class="dash-hero">' +
        '<div class="panel who">' +
        '<span class="kicker">' + greeting() + '</span>' +
        '<h1 style="margin:0">' + A().esc(u.name) + '، سطح ' + U.fa(lvl.index) + ' · ' + lvl.title + '</h1>' +
        '<p class="who-line">' + tip + '</p>' +
        '<div class="row wrap">' +
        (nextIdx >= 0
          ? '<button class="btn primary xl" data-go="#/lesson/' + goalCourse.id + '/' + nextIdx + '">▶ ادامهٔ یادگیری</button>'
          : '<button class="btn lime xl" data-go="#/path">🎯 دیدن مسیر بعدی</button>') +
        '<button class="btn ghost" data-go="#/courses">فهرست دوره‌ها</button>' +
        '<button class="btn ghost" data-x="tip">یک نکته از ربات 🤖</button>' +
        '</div>' +
        '<div class="progress-line"><div class="bar"><i style="width:' + p.pct + '%"></i></div>' +
        '<span>' + U.fa(p.done) + ' از ' + U.fa(p.total) + ' درس دورهٔ ' + goalCourse.title + '</span></div>' +
        '</div>' +
        '<div class="panel flat center">' + HKSAY.svg({ mood: nextIdx >= 0 ? 'idle' : 'proud', size: '230px' }) +
        HKSAY.bubble(tip) + '</div>' +
        '</section>' +

        /* آمار */
        '<section class="grid g4">' +
        '<div class="card stat-card tilt"><span class="s-icon">✨</span><div><strong>' + U.faNum(u.xp) + '</strong><span>امتیاز کل</span></div></div>' +
        '<div class="card stat-card tilt"><span class="s-icon">🔥</span><div><strong>' + U.fa(u.streak || 0) + '</strong><span>روز پیوسته</span></div></div>' +
        '<div class="card stat-card tilt"><span class="s-icon">📚</span><div><strong>' + U.fa(lessonsDone) + '</strong><span>درس کامل‌شده</span></div></div>' +
        '<div class="card stat-card tilt"><span class="s-icon">🏆</span><div><strong>' + U.fa(L.rank) + '</strong><span>رتبهٔ لیگ هفته</span></div></div>' +
        '<div class="card stat-card tilt"><span class="s-icon">🎯</span><div><strong>' + U.fa(acc) + '٪</strong><span>دقت پاسخ‌ها</span></div></div>' +
        '<div class="card stat-card tilt"><span class="s-icon">🎖</span><div><strong>' + U.fa(u.achievements.length) + '</strong><span>نشان گرفته‌شده</span></div></div>' +
        '</section>' +

        /* مأموریت و حلقهٔ سطح */
        '<section class="grid" style="grid-template-columns:1.35fr .65fr">' +
        '<div class="panel"><div class="sec-head"><h2 style="font-size:24px">مأموریت‌های امروز</h2>' +
        '<span class="badge ghost">' + U.fa(u.missionsDone || 0) + ' مأموریت انجام‌شده</span></div>' +
        u.missions.items.map(missionHTML).join('') +
        '<p class="hint" style="margin-top:12px">هر روز سه مأموریت تازه می‌گیری؛ جمعشان تا ۱۰۰ امتیاز اضافه در روز می‌شود.</p></div>' +
        '<div class="panel center">' + ringHTML(lvl.pct, U.fa(lvl.index), 'سطح') +
        '<p class="small muted" style="margin:14px 0 0">' + (lvl.next ? U.faNum(lvl.toNext) + ' امتیاز تا «' + (HSK.LEVELS[lvl.index] ? HSK.LEVELS[lvl.index].title : '') + '»' : 'بالاترین سطح!') + '</p>' +
        '<div class="hr-soft"></div>' + streakHTML(u) +
        '<p class="small muted" style="margin-top:10px">' + U.pick(HSK.LINES.streak, u.streak + 3) + '</p></div>' +
        '</section>' +

        /* لیگ و چالش */
        '<section class="grid g2">' +
        '<div class="card"><div class="card-top"><span class="icon-badge">' + L.tier.icon + '</span>' +
        '<div class="grow"><h3 style="margin:0">' + L.tier.title + '</h3>' +
        '<p class="muted small" style="margin:4px 0 0">این هفته ' + U.faNum(L.mine) + ' امتیاز گرفتی · رتبهٔ ' + U.fa(L.rank) +
        ' · ' + U.pick(HSK.LINES.league, String(u.xp)) + '</p></div></div>' +
        '<div style="margin:14px 0">' + miniLeague(u) + '</div>' +
        '<button class="btn block" data-go="#/league">جدول کامل لیگ →</button></div>' +
        challengeHTML(u) +
        '</section>' +

        /* نشان‌ها */
        '<section class="panel"><div class="sec-head"><h2 style="font-size:24px">نشان‌ها</h2>' +
        '<button class="btn ghost sm" data-go="#/profile/ach">همهٔ نشان‌ها</button></div>' + achStrip(u) + '</section>' +

        /* پیشنهادها */
        '<section><div class="sec-head"><div><span class="kicker">' + cat.title + '</span>' +
        '<h2>بعد از این، این‌ها را ببین</h2></div>' +
        '<span class="badge ghost">' + U.fa(totalLessons) + ' درس در کل آکادمی</span></div>' +
        '<div class="grid g3">' + recs.map(courseCard).join('') + '</div></section>' +

        '</div></div>',
      bind: bind
    };
  };
})();
