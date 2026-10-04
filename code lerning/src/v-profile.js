/* =====================================================================
   هوشیکا · نما: پروفایل، دستاوردها و تنظیمات
   ===================================================================== */
(function () {
  'use strict';
  var V = (window.HSKVIEWS = window.HSKVIEWS || {});
  var U = HSK.util;
  function A() { return window.HSKAPP; }

  var COLORS = ['#4de2ff', '#8b7dff', '#9bff7a', '#ffc94d', '#ff7bb0', '#ff8a5c'];

  function tabsBar(sub) {
    var items = [['profile', 'پروفایل'], ['ach', 'دستاوردها'], ['settings', 'تنظیمات']];
    return '<div class="tabs" style="max-width:520px">' + items.map(function (x) {
      return '<button class="' + ((sub || 'profile') === x[0] ? 'on' : '') + '" data-ptab="' + x[0] + '">' + x[1] + '</button>';
    }).join('') + '</div>';
  }

  function profileTab(u) {
    var app = A(), lvl = app.levelInfo(), s = app.summary();
    var L = app.leagueRows('week');
    return '' +
      '<div class="stack-lg">' +
      '<section class="panel profile-head">' +
      HKSAY.svg({ mood: 'happy', size: '150px' }) +
      '<div class="grow">' +
      '<div class="row wrap"><input class="input" id="nameInput" value="' + app.esc(u.name) + '" style="max-width:260px" />' +
      '<button class="btn primary" data-x="saveName">ذخیرهٔ نام</button></div>' +
      '<p class="muted small" style="margin:10px 0 0">' + (u.method === 'guest' ? 'حساب مهمان (فقط روی این دستگاه)' : (u.method === 'phone' ? 'شمارهٔ ' : 'ایمیل ') + app.esc(u.contact)) +
      ' · عضویت از ' + U.persianDate(new Date(u.createdAt)) + '</p>' +
      '<div class="row wrap" style="margin-top:12px">' +
      '<span class="badge amber">سطح ' + U.fa(lvl.index) + ' — ' + lvl.title + '</span>' +
      '<span class="badge cyan">' + U.faNum(u.xp) + ' امتیاز</span>' +
      '<span class="badge pink">🔥 ' + U.fa(u.streak || 0) + ' روز پیوسته</span>' +
      '<span class="badge lime">🏆 رتبهٔ ' + U.fa(L.rank) + '</span>' +
      '</div></div>' +
      '<div class="col" style="align-items:flex-end"><button class="btn ghost sm" data-go="#/league">جدول لیگ</button>' +
      '<button class="btn ghost sm" data-x="logout">خروج از حساب</button></div>' +
      '</section>' +

      '<section class="panel"><h3>شخصیت ربات تو</h3>' +
      '<p class="muted small">آواتارت در جدول لیگ و کنار اسمت نشان داده می‌شود. یک حالت انتخاب کن یا رنگش را عوض کن.</p>' +
      '<div class="avatar-picker" style="margin-top:12px">' +
      HSK.AVATARS.map(function (a) {
        return '<button class="avatar-opt ' + (u.avatar === a ? 'on' : '') + '" data-avatar="' + a + '">' + HKSAY.avatar(a, u.avatarColor) + '</button>';
      }).join('') + '</div>' +
      '<div class="avatar-picker" style="margin-top:12px">' +
      COLORS.map(function (c) {
        return '<button class="avatar-opt ' + (u.avatarColor === c ? 'on' : '') + '" data-color="' + c + '">' +
          '<span style="display:block;width:26px;height:26px;border-radius:50%;background:' + c + ';box-shadow:0 0 16px ' + c + '"></span></button>';
      }).join('') + '</div></section>' +

      '<section class="grid g3 stat-grid">' +
      '<div class="card stat-card"><span class="s-icon">📚</span><div><strong>' + U.fa(s.lessonsDone) + '</strong><span>درس کامل‌شده</span></div></div>' +
      '<div class="card stat-card"><span class="s-icon">🎖</span><div><strong>' + U.fa(u.achievements.length) + '</strong><span>نشان گرفته‌شده</span></div></div>' +
      '<div class="card stat-card"><span class="s-icon">🎯</span><div><strong>' + U.fa(u.answered ? Math.round((u.correct / u.answered) * 100) : 0) + '٪</strong><span>دقت پاسخ‌ها</span></div></div>' +
      '<div class="card stat-card"><span class="s-icon">🏁</span><div><strong>' + U.fa(s.coursesDone) + '</strong><span>دوره تمام‌شده</span></div></div>' +
      '<div class="card stat-card"><span class="s-icon">📝</span><div><strong>' + U.fa(u.answered || 0) + '</strong><span>پاسخ ثبت‌شده</span></div></div>' +
      '<div class="card stat-card"><span class="s-icon">⚡</span><div><strong>' + U.fa(u.bestCombo || 0) + '</strong><span>بهترین زنجیرهٔ درست</span></div></div>' +
      '</section>' +

      '<section class="panel"><div class="sec-head"><h2 style="font-size:24px">آخرین نشان‌ها</h2>' +
      '<button class="btn ghost sm" data-ptab="ach">همه</button></div>' +
      '<div class="ach-strip">' + HSK.ACHIEVEMENTS.slice(0, 8).map(function (a) {
        var got = u.achievements.indexOf(a.id) >= 0;
        return '<div class="ach-tile ' + (got ? 'get' : 'locked') + '"><span class="a-icon">' + (got ? a.icon : '🔒') + '</span>' +
          '<strong>' + a.title + '</strong><small>' + a.desc + '</small></div>';
      }).join('') + '</div></section>' +
      '</div>';
  }

  function achTab(u) {
    var got = u.achievements.length;
    var ch = HSK.challengeFor(U.weekKey());
    var chDone = !!u.flags['ch-' + ch.id + '-' + U.weekKey()];
    return '' +
      '<div class="stack-lg">' +
      '<section class="panel"><div class="sec-head"><div><span class="kicker">🎖 نشان‌ها</span>' +
      '<h2 style="margin:6px 0">' + U.fa(got) + ' از ' + U.fa(HSK.ACHIEVEMENTS.length) + ' نشان</h2></div>' +
      '<div class="bar" style="width:220px;align-self:center"><i style="width:' + Math.round((got / HSK.ACHIEVEMENTS.length) * 100) + '%"></i></div></div>' +
      '<p class="muted small">نشان‌ها با درس خواندن، پاسخ درست، پیوستگی روزانه و رقابت در لیگ باز می‌شوند.</p></section>' +
      '<section class="grid g4">' + HSK.ACHIEVEMENTS.map(function (a) {
        var on = u.achievements.indexOf(a.id) >= 0;
        return '<div class="ach-tile ' + (on ? 'get' : 'locked') + '" style="min-width:0">' +
          '<span class="a-icon">' + (on ? a.icon : '🔒') + '</span>' +
          '<strong>' + a.title + '</strong><small>' + a.desc + '</small>' +
          (on ? '<span class="badge lime small" style="margin-top:8px">گرفته شد</span>' : '') + '</div>';
      }).join('') + '</section>' +
      '<section class="panel"><div class="sec-head"><h2 style="font-size:24px">چالش هفته</h2>' +
      (chDone ? '<span class="badge lime">انجام شد ✓</span>' : '<span class="badge amber">+' + U.fa(ch.xp) + ' امتیاز</span>') + '</div>' +
      '<p><strong style="font-family:var(--font-display);font-size:19px">' + ch.title + '</strong></p>' +
      '<p class="muted">' + ch.desc + '</p></section>' +
      '</div>';
  }

  function settingsTab(u) {
    var still = HSKFX.getStill();
    return '' +
      '<div class="stack-lg">' +
      '<section class="panel"><h3>تنظیمات نمایش</h3>' +
      '<div class="setting-row"><div class="grow"><strong>حالت آرام (بدون انیمیشن)</strong>' +
      '<span>اگر حرکت‌ها اذیتت می‌کند یا دستگاهت کند است، این را روشن کن.</span></div>' +
      '<button class="switch ' + (still ? 'on' : '') + '" data-x="still"><i></i></button></div>' +
      '<div class="setting-row"><div class="grow"><strong>صدای ربات</strong>' +
      '<span>در نسخهٔ بعدی: صداهای کوتاه برای امتیاز و پاسخ درست.</span></div>' +
      '<span class="badge ghost">به‌زودی</span></div>' +
      '</section>' +

      '<section class="panel"><h3>پیشرفت من</h3>' +
      '<div class="row wrap">' +
      '<button class="btn ghost" data-x="export">⬇ دریافت فایل پیشرفت (JSON)</button>' +
      '<button class="btn ghost" data-x="reset">↺ صفر کردن پیشرفت</button>' +
      '<button class="btn ghost" data-x="logout">🚪 خروج</button>' +
      '<button class="btn ghost" data-x="delete" style="color:#ff9a9a;border-color:#ff6b6b66">🗑 حذف حساب</button>' +
      '</div>' +
      '<p class="hint" style="margin-top:12px">همهٔ اطلاعات روی همین مرورگر ذخیره می‌شود. اگر حافظهٔ مرورگر را پاک کنی، حساب هم پاک می‌شود؛ پس اگر خواستی پیشرفتت را جایی نگه داری، فایل JSON را بگیر.</p>' +
      '</section>' +

      '<section class="panel flat">' + HKSAY.svg({ mood: 'think', size: '150px' }) +
      '<h3>دربارهٔ هوشیکا</h3>' +
      '<p class="muted">هوشیکا یک ربات معلم است: سطحت را می‌سنجد، مسیر می‌سازد، امتیاز می‌دهد و در لیگ کنارت می‌جنگد. ' +
      'این نسخه کاملاً آفلاین کار می‌کند و همهٔ داده‌ها در مرورگر خودت می‌ماند. نسخهٔ بعدی: حساب ابری، کلاس‌های گروهی و رقابت واقعی چندنفره.</p>' +
      '<div class="row wrap"><span class="badge cyan">هوشیکا ۲٫۰</span><span class="badge ghost">' + U.fa(HSK.COURSES.length) + ' دوره</span>' +
      '<span class="badge ghost">' + U.fa(HSK.COURSES.reduce(function (s, c) { return s + c.topics.length; }, 0)) + ' درس</span>' +
      '<span class="badge ghost">' + U.fa(HSK.ACHIEVEMENTS.length) + ' نشان</span></div></section>' +
      '</div>';
  }

  function bind(root, sub) {
    var app = A(), u = app.state.user;
    app.on(root, '[data-ptab]', 'click', function () { app.go('#/profile/' + (this.getAttribute('data-ptab') === 'profile' ? '' : this.getAttribute('data-ptab'))); });
    app.on(root, '[data-avatar]', 'click', function () {
      u.avatar = this.getAttribute('data-avatar');
      app.saveUser(); app.render();
      app.toast({ icon: '🤖', title: 'آواتار عوض شد', text: 'از این به بعد در لیگ با این شخصیت دیده می‌شوی.' });
    });
    app.on(root, '[data-color]', 'click', function () {
      u.avatarColor = this.getAttribute('data-color');
      app.saveUser(); app.render();
    });
    app.on(root, '[data-x="saveName"]', 'click', function () {
      var inp = app.$('#nameInput', root);
      var v = (inp.value || '').trim();
      if (v.length < 2) return app.toast({ icon: '✋', title: 'نام کوتاه است', text: 'حداقل ۲ حرف بنویس.', cls: 'bad' });
      u.name = v;
      app.saveUser(); app.render();
      app.toast({ icon: '✅', title: 'نام ذخیره شد', text: 'سلام ' + v + '!' });
    });
    app.on(root, '[data-x="still"]', 'click', function () { app.toggleStill(); });
    app.on(root, '[data-x="logout"]', 'click', function () {
      app.confirmBox('خروج از حساب', 'از حساب خارج می‌شوی؟ پیشرفتت ذخیره می‌ماند و بعداً می‌توانی برگردی.', 'خروج', app.logout);
    });
    app.on(root, '[data-x="reset"]', 'click', function () {
      app.confirmBox('صفر کردن پیشرفت', 'همهٔ امتیازها، درس‌ها و نشان‌ها پاک می‌شود. مطمئنی؟', 'بله، صفر کن', function () {
        u.xp = 0; u.xpLog = []; u.lessons = {}; u.started = {}; u.days = []; u.streak = 0; u.lastDay = '';
        u.achievements = []; u.flags = {}; u.answered = 0; u.correct = 0; u.combo = 0; u.bestCombo = 0; u.missionsDone = 0;
        u.onboard.done = false;
        app.saveUser();
        app.toast({ icon: '↺', title: 'همه‌چیز صفر شد', text: 'بیا از نو شروع کنیم.' });
        app.go('#/onboarding');
        app.render();
      });
    });
    app.on(root, '[data-x="delete"]', 'click', function () {
      app.confirmBox('حذف حساب', 'حساب و همهٔ داده‌هایش برای همیشه پاک می‌شود. مطمئنی؟', 'حذف کن', app.deleteAccount);
    });
    app.on(root, '[data-x="export"]', 'click', function () {
      var blob = new Blob([JSON.stringify(u, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'hooshika-progress-' + u.contact + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      app.toast({ icon: '⬇', title: 'فایل پیشرفت ساخته شد', text: 'در پوشهٔ دانلود ذخیره شد.' });
    });
    HSKFX.refresh(root);
  }

  V.profile = function (params) {
    var app = A(), u = app.state.user;
    var raw = params.sub || params.id || 'profile';
    var sub = ['profile', 'ach', 'settings'].indexOf(raw) >= 0 ? raw : 'profile';
    var body = sub === 'ach' ? achTab(u) : (sub === 'settings' ? settingsTab(u) : profileTab(u));
    return {
      html: '<div class="page">' +
        '<div class="stack-lg">' +
        '<section class="row between wrap"><div><span class="kicker">حساب من</span>' +
        '<h1 style="margin:6px 0">' + (sub === 'ach' ? 'دستاوردها' : (sub === 'settings' ? 'تنظیمات' : 'پروفایل')) + '</h1></div>' +
        tabsBar(sub) + '</section>' + body +
        '</div></div>',
      bind: function (root) { bind(root, sub); }
    };
  };
})();
