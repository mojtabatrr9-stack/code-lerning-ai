/* =====================================================================
   هوشیکا · هستهٔ اپلیکیشن
   حساب‌ها، وضعیت، امتیاز، مأموریت، دستاورد، لیگ، مسیر و رابط کاربری
   ===================================================================== */
(function () {
  'use strict';

  var U = HSK.util;
  var K_USERS = 'hsk.users', K_SESSION = 'hsk.session', K_DATA = 'hsk.data.';

  function read(k, def) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function today() { return U.dayKey(); }
  function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return U.dayKey(d); }
  function minutesAgo(ts) { return (Date.now() - ts) / 60000; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function phoneOk(v) { return /^09\d{9}$/.test(v.replace(/[^\d]/g, '')); }
  function normPhone(v) { var d = v.replace(/[^\d]/g, ''); if (d.indexOf('98') === 0) d = '0' + d.slice(2); if (d.indexOf('9') === 0 && d.length === 10) d = '0' + d; return d; }

  var state = {
    user: null,
    route: { name: 'home', params: {} },
    menuOpen: false,
    auth: { mode: 'signup', method: 'phone', step: 'form', contact: '', code: '', name: '' },
    onboarding: null
  };

  /* ------------------------------------------------------------ ذخیره‌سازی */
  function users() { return read(K_USERS, {}); }
  function saveUsers(u) { write(K_USERS, u); }
  function saveUser() {
    if (!state.user) return;
    write(K_DATA + state.user.contact, state.user);
    var list = users();
    list[state.user.contact] = {
      contact: state.user.contact, method: state.user.method, name: state.user.name,
      pw: state.user.pw, avatar: state.user.avatar, createdAt: state.user.createdAt
    };
    saveUsers(list);
  }
  function loadUser(contact) {
    var fresh = read(K_DATA + contact, null);
    var meta = users()[contact] || {};
    if (fresh) { state.user = Object.assign(baseUser(), meta, fresh); }
    else state.user = Object.assign(baseUser(), meta, { contact: contact });
    normalize(state.user);
    saveUser();
    return state.user;
  }
  function baseUser() {
    return {
      contact: '', method: 'guest', name: 'کاشف', pw: '', avatar: 'robot-a', avatarColor: '#4de2ff',
      createdAt: Date.now(), xp: 0, xpLog: [], lessons: {}, started: {}, days: [], streak: 0, lastDay: '',
      answered: 0, correct: 0, combo: 0, bestCombo: 0, missionsDone: 0, achievements: [], flags: {},
      missions: { date: '', items: [] }, onboard: { done: false, goalCat: '', goalCourse: '', why: '', level: 0, score: 0, total: 0 },
      prefs: { still: false }
    };
  }
  function normalize(u) {
    if (!u.lessons) u.lessons = {};
    if (!u.started) u.started = {};
    if (!u.days) u.days = [];
    if (!u.flags) u.flags = {};
    if (!u.prefs) u.prefs = {};
    if (!u.onboard) u.onboard = { done: false };
    if (!u.xpLog) u.xpLog = [];
  }

  /* ---------------------------------------------------------------- حساب‌ها */
  function createUser(contact, method, name, pw) {
    var meta = { contact: contact, method: method, name: name || 'کاشف', pw: pw || '', avatar: 'robot-a', avatarColor: '#4de2ff', createdAt: Date.now() };
    var list = users();
    list[contact] = meta;
    saveUsers(list);
    state.user = Object.assign(baseUser(), meta);
    normalize(state.user);
    write(K_SESSION, contact);
    saveUser();
    markActive(true);
    return state.user;
  }
  function loginAs(contact) {
    write(K_SESSION, contact);
    loadUser(contact);
    markActive(false);
  }
  function logout() {
    state.user = null;
    write(K_SESSION, '');
    go('#/auth');
  }
  function deleteAccount() {
    var list = users();
    if (state.user) {
      delete list[state.user.contact];
      saveUsers(list);
      try { localStorage.removeItem(K_DATA + state.user.contact); } catch (e) { }
    }
    state.user = null;
    write(K_SESSION, '');
    go('#/auth');
  }

  /* ------------------------------------------------------ فعالیت و پیوستگی */
  function markActive(silent) {
    var u = state.user;
    if (!u) return;
    var d = today();
    if (u.lastDay !== d) {
      u.streak = (u.lastDay === yesterday()) ? (u.streak || 0) + 1 : 1;
      u.lastDay = d;
      if (u.days.indexOf(d) < 0) u.days.push(d);
      var h = new Date().getHours();
      if (h >= 0 && h < 5) u.flags.night = true;
      if (h < 8) u.flags.early = true;
      if (!silent && u.streak > 1) toast({ icon: '🔥', title: 'زنجیرهٔ ' + U.fa(u.streak) + ' روزه!', text: 'امروز ادامه بده تا نشکند.' });
      saveUser();
    }
    ensureMissions();
  }
  function dailyBonus() {
    var u = state.user;
    if (!u || u.flags['bonus-' + today()]) return;
    u.flags['bonus-' + today()] = true;
    addXp(15, 'streak', 'پاداش پیوستگی روزانه', true);
  }

  /* ------------------------------------------------------------- مأموریت‌ها */
  function ensureMissions() {
    var u = state.user;
    if (!u) return;
    if (!u.missions || u.missions.date !== today()) {
      u.missions = { date: today(), items: HSK.missionsFor(today(), u.contact || 'x') };
      saveUser();
    }
  }
  function bumpMission(kind, n) {
    var u = state.user;
    if (!u) return;
    ensureMissions();
    u.missions.items.forEach(function (m) {
      if (m.kind !== kind || m.claimed) return;
      m.progress = Math.min(m.goal, (m.progress || 0) + n);
    });
    saveUser();
  }
  function missionReady(m) { return m.progress >= m.goal && !m.claimed; }
  function claimMission(id, ev) {
    var u = state.user;
    var m = u.missions.items.filter(function (x) { return x.id === id; })[0];
    if (!m || m.claimed || m.progress < m.goal) return;
    m.claimed = true;
    u.missionsDone = (u.missionsDone || 0) + 1;
    addXp(m.xp, 'mission', 'پاداش مأموریت روزانه');
    toast({ icon: '🎖', title: 'مأموریت کامل شد!', text: '+' + U.fa(m.xp) + ' امتیاز', cls: 'win' });
    saveUser();
    if (ev) HSKFX.confetti(ev.clientX, ev.clientY, 22);
    render();
  }

  /* ------------------------------------------------------------- امتیاز (XP) */
  function addXp(amount, kind, note, silent) {
    var u = state.user;
    if (!u || !amount) return;
    u.xp += amount;
    u.xpLog.push({ ts: Date.now(), amount: amount, kind: kind });
    if (kind !== 'streak') bumpMission('xp', amount);
    saveUser();
    updatePills();
    if (!silent) floatXp(amount);
    checkAchievements();
  }
  function floatXp(amount) {
    var pill = document.querySelector('.pill.xp');
    var n = document.createElement('div');
    n.className = 'xp-float';
    n.textContent = '+' + U.fa(amount) + ' امتیاز';
    var r = pill ? pill.getBoundingClientRect() : { left: window.innerWidth - 120, top: 40 };
    n.style.left = (r.left - 30) + 'px';
    n.style.top = (r.top + 4) + 'px';
    document.body.appendChild(n);
    setTimeout(function () { n.remove(); }, 1400);
  }
  function updatePills() {
    var u = state.user;
    if (!u) return;
    var xp = document.querySelector('.pill.xp b');
    if (xp) xp.textContent = U.faNum(u.xp);
    var st = document.querySelector('.pill.streak b');
    if (st) st.textContent = U.fa(u.streak || 0);
  }
  function levelInfo() { return HSK.levelOf(state.user ? state.user.xp : 0); }

  /* --------------------------------------------------------------- پیشرفت */
  function lessonKey(courseId, index) { return courseId + ':' + index; }
  function lessonDone(courseId, index) { return !!(state.user && state.user.lessons[lessonKey(courseId, index)]); }
  function courseProgress(course) {
    var done = 0;
    for (var i = 0; i < course.topics.length; i++) if (lessonDone(course.id, i)) done++;
    return { done: done, total: course.topics.length, pct: Math.round((done / course.topics.length) * 100) };
  }
  function nextLesson(course) {
    for (var i = 0; i < course.topics.length; i++) if (!lessonDone(course.id, i)) return i;
    return -1;
  }
  function completeLesson(course, index, ev) {
    var u = state.user, key = lessonKey(course.id, index), first = !u.lessons[key];
    u.lessons[key] = { done: true, ts: Date.now() };
    u.started[course.id] = u.started[course.id] || { ts: Date.now() };
    saveUser();
    if (first) {
      addXp(10, 'lesson', 'تکمیل درس');
      bumpMission('lessons', 1);
      var mod = Math.floor(index / 4);
      var modDone = true;
      for (var i = mod * 4; i < Math.min((mod + 1) * 4, course.topics.length); i++) if (!lessonDone(course.id, i)) modDone = false;
      if (modDone) bumpMission('module', 1);
      var p = courseProgress(course);
      if (p.done === p.total) {
        addXp(60, 'course', 'تکمیل دوره');
        toast({ icon: '🏁', title: 'دورهٔ ' + course.title + ' تمام شد!', text: '+۶۰ امتیاز پاداش دوره', cls: 'win' });
        HSKFX.confetti(window.innerWidth / 2, window.innerHeight / 3, 40);
      }
      toast({ icon: '✅', title: 'درس ثبت شد', text: '«' + course.topics[index] + '»', cls: 'win' });
      if (ev) HSKFX.confetti(ev.clientX, ev.clientY, 18);
    }
    saveUser();
    checkAchievements();
  }

  /* ------------------------------------------------------------- دستاوردها */
  function summary() {
    var u = state.user;
    var coursesDone = 0;
    HSK.COURSES.forEach(function (c) { if (courseProgress(c).done === c.topics.length) coursesDone++; });
    return {
      xp: u.xp, lessonsDone: Object.keys(u.lessons).length, streak: u.streak || 0,
      coursesDone: coursesDone, started: u.started, flags: u.flags, answered: u.answered || 0,
      correct: u.correct || 0, bestCombo: u.bestCombo || 0, missionsDone: u.missionsDone || 0
    };
  }
  function checkAchievements() {
    var u = state.user;
    if (!u) return;
    var s = summary(), unlocked = [];
    HSK.ACHIEVEMENTS.forEach(function (a) {
      if (u.achievements.indexOf(a.id) >= 0) return;
      var ok = false;
      try { ok = a.test(s); } catch (e) { ok = false; }
      if (ok) { u.achievements.push(a.id); unlocked.push(a); }
    });
    if (unlocked.length) {
      saveUser();
      unlocked.forEach(function (a, i) {
        setTimeout(function () {
          toast({ icon: a.icon, title: 'دستاورد: ' + a.title, text: a.desc, cls: 'win' });
          HSKFX.confetti(window.innerWidth - 160, 90, 26);
        }, i * 700);
      });
    }
  }

  /* ------------------------------------------------------------------- لیگ */
  function periodKey(kind) { return kind === 'month' ? U.monthKey() : U.weekKey(); }
  function xpInPeriod(kind) {
    var u = state.user;
    var now = new Date();
    var start;
    if (kind === 'month') start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    else {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      d.setDate(d.getDate() - ((d.getDay() + 1) % 7));
      d.setHours(0, 0, 0, 0);
      start = d.getTime();
    }
    return (u.xpLog || []).reduce(function (sum, e) { return e.ts >= start ? sum + e.amount : sum; }, 0);
  }
  function leagueRows(kind) {
    var u = state.user;
    var key = periodKey(kind);
    var mine = xpInPeriod(kind);
    var tier = HSK.tierFor(u.xp);
    var rows = HSK.rivals(key, tier).slice();
    rows.push({ id: 'me', name: u.name, avatar: u.avatar, xp: mine, me: true });
    rows.sort(function (a, b) { return b.xp - a.xp; });
    rows.forEach(function (r, i) { r.rank = i + 1; });
    var myRank = rows.filter(function (r) { return r.me; })[0].rank;
    if (mine > 0) {
      u.flags.leagueSeen = true;
      if (myRank <= 3) u.flags.leagueTop3 = true;
      if (myRank === 1) u.flags.leagueFirst = true;
      saveUser();
    }
    return { rows: rows, mine: mine, tier: tier, rank: myRank, key: key };
  }
  function tierRoom(tier) { return HSK.TIERS; }

  /* --------------------------------------------------------------- رابط‌ها */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function on(root, sel, ev, fn) {
    $$(sel, root).forEach(function (el) { el.addEventListener(ev, fn); });
  }
  function toast(opt) {
    var box = $('.toasts');
    if (!box) { box = document.createElement('div'); box.className = 'toasts'; document.body.appendChild(box); }
    var n = document.createElement('div');
    n.className = 'toast ' + (opt.cls || '');
    n.innerHTML = '<span class="t-icon">' + (opt.icon || '🤖') + '</span><div><strong>' + esc(opt.title || '') +
      '</strong>' + (opt.text ? '<span class="small">' + esc(opt.text) + '</span>' : '') + '</div>';
    box.appendChild(n);
    setTimeout(function () {
      n.classList.add('out');
      setTimeout(function () { n.remove(); }, 420);
    }, opt.ms || 4600);
  }
  function modal(html, opts) {
    opts = opts || {};
    closeModal();
    var portal = $('#hsk-portal');
    var scrim = document.createElement('div');
    scrim.className = 'scrim';
    scrim.addEventListener('click', function () { if (opts.dismissable !== false) closeModal(); });
    var box = document.createElement('div');
    box.className = 'modal';
    box.innerHTML = html;
    portal.appendChild(scrim);
    portal.appendChild(box);
    return box;
  }
  function closeModal() { $$('.scrim, .modal').forEach(function (n) { n.remove(); }); }
  function confirmBox(title, text, okLabel, fn) {
    var m = modal('<h3>' + esc(title) + '</h3><p class="muted">' + esc(text) + '</p>' +
      '<div class="row between" style="margin-top:18px"><button class="btn ghost" data-x="no">انصراف</button>' +
      '<button class="btn primary" data-x="yes">' + esc(okLabel || 'باشه') + '</button></div>');
    on(m, '[data-x="no"]', 'click', closeModal);
    on(m, '[data-x="yes"]', 'click', function () { closeModal(); fn(); });
  }
  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }
  function parseHash() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var parts = h.split('/').filter(Boolean);
    if (!parts.length) return { name: 'home', params: {} };
    return { name: parts[0], params: { id: parts[1] || '', sub: parts[2] || '' } };
  }

  /* ---------------------------------------------------------------- نوار بالا */
  function avatarHTML(user, cls) {
    return HKSAY.avatar(user.avatar, user.avatarColor).replace('class="hk-avatar"', 'class="hk-avatar ' + (cls || '') + '"');
  }
  function topbar(route) {
    var u = state.user, lvl = levelInfo(), tier = HSK.tierFor(u.xp);
    var navItems = [
      { id: 'home', label: 'داشبورد', hash: '#/home' },
      { id: 'courses', label: 'دوره‌ها', hash: '#/courses' },
      { id: 'path', label: 'مسیر من', hash: '#/path' },
      { id: 'league', label: 'لیگ', hash: '#/league' },
      { id: 'lab', label: 'کارگاه', hash: '#/lab' }
    ];
    return '' +
      '<header class="topbar">' +
      '<div class="brand" data-go="#/home">' + HKSAY.head(38) +
      '<div><div class="brand-name">' + HSK.BRAND.name + '<span>.</span></div><div class="brand-sub">' + HSK.BRAND.tagline + '</div></div></div>' +
      '<nav class="nav">' + navItems.map(function (n) {
        return '<a class="nav-link ' + (route.name === n.id ? 'on' : '') + '" href="' + n.hash + '">' + n.label + '</a>';
      }).join('') + '</nav>' +
      '<div class="topbar-right">' +
      '<span class="pill xp" title="امتیاز کل">✨ <b>' + U.faNum(u.xp) + '</b> امتیاز</span>' +
      '<span class="pill streak" title="روزهای پیوسته">🔥 <b>' + U.fa(u.streak || 0) + '</b> روز</span>' +
      '<span class="pill league" title="لیگ جاری">' + tier.icon + ' ' + tier.title.replace('لیگ ', '') + '</span>' +
      '<button class="avatar-btn" id="avatarBtn" aria-haspopup="true" aria-expanded="false">' +
      avatarHTML(u) + '<span>' + esc(u.name) + '</span><span class="caret">▼</span></button>' +
      '</div></header>';
  }
  function openMenu(anchor) {
    closeMenu();
    state.menuOpen = true;
    var u = state.user, lvl = levelInfo();
    var box = document.createElement('div');
    box.className = 'menu';
    box.innerHTML = '' +
      '<div class="menu-head">' + avatarHTML(u) +
      '<div><strong>' + esc(u.name) + '</strong><span class="small">' + esc(u.method === 'guest' ? 'حساب مهمان' : u.contact) + '</span></div></div>' +
      '<div class="callout" style="padding:10px 12px;margin-bottom:8px"><p class="small">سطح ' + U.fa(lvl.index) + ' — <strong>' + lvl.title + '</strong><br>' +
      (lvl.next ? U.faNum(lvl.toNext) + ' امتیاز تا سطح بعدی' : 'بالاترین سطح!') + '</p></div>' +
      '<button class="menu-item" data-go="#/profile"><span class="mi">👤</span> پروفایل من</button>' +
      '<button class="menu-item" data-go="#/path"><span class="mi">🎯</span> مسیر یادگیری</button>' +
      '<button class="menu-item" data-go="#/courses"><span class="mi">📚</span> دوره‌های من</button>' +
      '<button class="menu-item" data-go="#/league"><span class="mi">🏆</span> لیگ هفتگی و ماهانه</button>' +
      '<button class="menu-item" data-go="#/profile/ach"><span class="mi">🎖</span> دستاوردها (' + U.fa(u.achievements.length) + ')</button>' +
      '<button class="menu-item" data-go="#/lab"><span class="mi">🧪</span> کارگاه کد زنده</button>' +
      '<div class="menu-sep"></div>' +
      '<button class="menu-item" data-x="still"><span class="mi">🌊</span> حالت آرام (بدون حرکت)' + (HSKFX.getStill() ? ' ✓' : '') + '</button>' +
      '<button class="menu-item" data-go="#/profile/settings"><span class="mi">⚙️</span> تنظیمات</button>' +
      '<button class="menu-item danger" data-x="logout"><span class="mi">🚪</span> خروج از حساب</button>' +
      '<div class="menu-foot"><span class="small muted">هوشیکا v۲.۰</span><span class="small muted">' + U.fa(u.achievements.length) + ' نشان</span></div>';
    document.body.appendChild(box);
    var r = anchor.getBoundingClientRect();
    box.style.top = (r.bottom + 10) + 'px';
    box.style.left = Math.max(12, r.left - 40) + 'px';
    anchor.classList.add('open');
    box.querySelectorAll('.menu-item').forEach(function (b) { b.classList.add('rv', 'is-in'); });
    box.addEventListener('click', function (ev) {
      var item = ev.target.closest('.menu-item');
      if (!item) return;
      if (item.getAttribute('data-x') === 'still') { toggleStill(); return; }
      if (item.getAttribute('data-x') === 'logout') { closeMenu(); confirmBox('خروج از حساب', 'می‌خواهی از حساب خارج شوی؟ پیشرفتت ذخیره می‌ماند.', 'خروج', logout); return; }
      var g = item.getAttribute('data-go');
      if (g) { closeMenu(); go(g); }
    });
  }
  function closeMenu() {
    $$('.menu').forEach(function (n) { n.remove(); });
    var b = $('#avatarBtn');
    if (b) { b.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); }
    state.menuOpen = false;
  }
  function toggleStill() {
    var s = !HSKFX.getStill();
    HSKFX.setStill(s);
    state.user.prefs.still = s;
    saveUser();
    toast({ icon: s ? '🌊' : '✨', title: s ? 'حالت آرام روشن شد' : 'حالت پویا روشن شد', text: s ? 'انیمیشن‌ها خاموش شدند.' : 'انیمیشن‌ها برگشتند.' });
    closeMenu();
    render();
  }
  function footer() {
    return '' +
      '<footer class="foot">' +
      '<div class="foot-brand">' + HKSAY.head(30) + '<span>ساخته‌شده در <strong>' + HSK.BRAND.name + '</strong> — ' + HSK.BRAND.claim + '</span></div>' +
      '<div class="row wrap"><span class="small">' + esc(HSK.BRAND.email) + '</span>' +
      '<button class="btn ghost sm" data-go="#/lab">کارگاه کد</button>' +
      '<button class="btn ghost sm" data-x="top">بالا ↑</button></div></footer>';
  }

  /* ---------------------------------------------------------------- مسیرها */
  function render() {
    var app = $('#hsk-app');
    var route = parseHash();
    var u = state.user;
    closeMenu();
    if (!u) {
      state.route = { name: 'auth', params: {} };
      var authView = HSKVIEWS.auth(state.auth);
      app.innerHTML = authView.html;
      authView.bind(app);
      HSKFX.refresh(app);
      return;
    }
    if (!u.onboard.done && route.name !== 'onboarding') route = { name: 'onboarding', params: {} };
    if (u.onboard.done && route.name === 'auth') route = { name: 'home', params: {} };
    state.route = route;
    var view = HSKVIEWS[route.name] || HSKVIEWS.home;
    var out = view(route.params);
    app.innerHTML = topbar(route) + out.html + footer();
    out.bind(app, route.params);
    HSKFX.refresh(app);
    on(app, '[data-go]', 'click', function () { go(this.getAttribute('data-go')); });
    on(app, '[data-x="top"]', 'click', function () { app.scrollTo({ top: 0, behavior: 'smooth' }); });
    var ab = $('#avatarBtn');
    if (ab) ab.addEventListener('click', function (ev) { ev.stopPropagation(); state.menuOpen ? closeMenu() : openMenu(ab); });
    on(app, '.nav-link', 'click', function () { closeMenu(); });
    updatePills();
  }

  /* ------------------------------------------------------------------ بوت */
  function boot() {
    document.body.insertAdjacentHTML('afterbegin', HKSAY.sprite());
    HSKFX.boot();
    var session = read(K_SESSION, '');
    if (session && users()[session]) loadUser(session);
    if (state.user && state.user.prefs && state.user.prefs.still) HSKFX.setStill(true);
    window.addEventListener('hashchange', function () { closeModal(); render(); });
    document.addEventListener('click', function () { if (state.menuOpen) closeMenu(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); closeModal(); }
    });
    if (!location.hash) location.hash = '#/' + (state.user ? (state.user.onboard.done ? 'home' : 'onboarding') : 'auth');
    render();
    var bootEl = $('#hsk-boot');
    if (bootEl) { bootEl.classList.add('done'); setTimeout(function () { bootEl.remove(); }, 600); }
    if (state.user) {
      markActive(false);
      toast({ icon: '🤖', title: 'سلام ' + state.user.name + '!', text: HSK.LINES.hello[0] });
    }
  }

  window.HSKAPP = {
    boot: boot, render: render, go: go, state: state, saveUser: saveUser, saveUsers: saveUsers, users: users,
    loadUser: loadUser, createUser: createUser, loginAs: loginAs, logout: logout, deleteAccount: deleteAccount,
    addXp: addXp, toast: toast, modal: modal, closeModal: closeModal, confirmBox: confirmBox,
    on: on, $: $, $$: $$, esc: esc, emailOk: emailOk, phoneOk: phoneOk, normPhone: normPhone,
    levelInfo: levelInfo, lessonDone: lessonDone, courseProgress: courseProgress, nextLesson: nextLesson,
    completeLesson: completeLesson, summary: summary, checkAchievements: checkAchievements,
    markActive: markActive, dailyBonus: dailyBonus, ensureMissions: ensureMissions, bumpMission: bumpMission,
    missionReady: missionReady, claimMission: claimMission, leagueRows: leagueRows, xpInPeriod: xpInPeriod,
    periodKey: periodKey, tierRoom: tierRoom, avatarHTML: avatarHTML, toggleStill: toggleStill, closeMenu: closeMenu
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
