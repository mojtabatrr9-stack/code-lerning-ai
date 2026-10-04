/* =====================================================================
   هوشیکا · نما: دروازهٔ ثبت‌نام و ورود
   ===================================================================== */
(function () {
  'use strict';
  var V = (window.HSKVIEWS = window.HSKVIEWS || {});
  var U = HSK.util;

  function A() { return window.HSKAPP; }

  function brandSide() {
    return '' +
      '<div class="auth-visual">' +
      '<div class="center">' +
      '<span class="kicker" style="justify-content:center">' + HSK.BRAND.tagline + '</span>' +
      '<h1 class="auth-title">یاد بگیر با <b>' + HSK.BRAND.name + '</b></h1>' +
      '<p class="ink2" style="max-width:520px;margin:8px auto 0">ربات معلمی که سطحت را می‌سنجد، مسیر اختصاصی می‌سازد، امتیاز می‌دهد و در لیگ هفتگی و ماهانه با بقیه رقابتت می‌دهد.</p>' +
      '</div>' +
      HKSAY.svg({ mood: 'happy', size: '300px' }) +
      HKSAY.bubble(HSK.LINES.hello[2]) +
      '<div class="auth-points">' +
      '<span class="chip bob">🧠 سنجش سطح هوشمند</span>' +
      '<span class="chip bob" style="animation-delay:.5s">🎮 مسیر همهٔ زبان‌ها و بازی‌سازی</span>' +
      '<span class="chip bob" style="animation-delay:1s">🏆 لیگ هفتگی و ماهانه</span>' +
      '</div>' +
      '</div>';
  }

  function tabs(a) {
    return '<div class="tabs" role="tablist">' +
      '<button data-tab="signup" class="' + (a.mode === 'signup' ? 'on' : '') + '">ثبت‌نام</button>' +
      '<button data-tab="login" class="' + (a.mode === 'login' ? 'on' : '') + '">ورود</button>' +
      '</div>';
  }

  function methodSeg(a) {
    return '<div class="seg" style="margin-bottom:16px">' +
      '<button data-method="phone" class="' + (a.method === 'phone' ? 'on' : '') + '">📱 شماره موبایل</button>' +
      '<button data-method="email" class="' + (a.method === 'email' ? 'on' : '') + '">✉️ ایمیل</button>' +
      '</div>';
  }

  function formStep(a) {
    var signup = a.mode === 'signup';
    return '' +
      tabs(a) +
      methodSeg(a) +
      '<form class="stack" id="authForm" novalidate>' +
      (signup ? '<div class="field"><label for="f-name">اسمت چیه؟</label>' +
        '<input class="input" id="f-name" placeholder="مثلاً سارا" autocomplete="name" value="' + A().esc(a.name) + '" /></div>' : '') +
      (a.method === 'phone'
        ? '<div class="field"><label for="f-contact">شماره موبایل</label>' +
        '<input class="input ltr" id="f-contact" placeholder="0912 345 6789" inputmode="numeric" value="' + A().esc(a.contact) + '" /></div>' +
        '<p class="hint">کد تأیید پنج‌رقمی برایت پیامک می‌شود. (در نسخهٔ دمو کد روی صفحه نشان داده می‌شود)</p>'
        : '<div class="field"><label for="f-contact">ایمیل</label>' +
        '<input class="input ltr" id="f-contact" placeholder="you@gmail.com" inputmode="email" value="' + A().esc(a.contact) + '" /></div>') +
      (a.method === 'email'
        ? '<div class="field"><label for="f-pw">رمز عبور</label>' +
        '<input class="input ltr" id="f-pw" type="password" placeholder="حداقل ۶ کاراکتر" /></div>'
        : '') +
      '<p class="hint err" id="authErr" hidden></p>' +
      '<div class="wizard-actions">' +
      '<button class="btn primary xl grow" type="submit">' +
      (signup ? (a.method === 'phone' ? 'ارسال کد و ادامه' : 'ساخت حساب') : 'ورود') + '</button>' +
      '</div>' +
      '</form>' +
      '<p class="auth-switch">' +
      (signup ? 'حساب داری؟ <b data-tab="login">وارد شو</b>' : 'حساب نداری؟ <b data-tab="signup">ثبت‌نام کن</b>') +
      '</p>' +
      '<p class="auth-switch" style="margin-top:6px"><b data-x="guest">فعلاً به‌عنوان مهمان ببینم →</b></p>' +
      '<div class="callout violet" style="margin-top:18px"><span>🔐</span><p class="small">این نسخه روی همین دستگاه کار می‌کند و اطلاعات حساب و پیشرفتت فقط در مرورگر خودت ذخیره می‌شود؛ پس بدون نگرانی امتحان کن.</p></div>';
  }

  function otpStep(a) {
    var isPhone = a.method === 'phone';
    return '' +
      '<div class="step-dots"><i class="on"></i><i class="on"></i><i></i></div>' +
      '<h2 style="font-size:26px;margin-bottom:4px">کد تأیید را وارد کن</h2>' +
      '<p class="muted small">کد پنج‌رقمی به ' + (isPhone ? 'شمارهٔ ' + A().esc(a.contact) : 'ایمیل ' + A().esc(a.contact)) + ' فرستاده شد.</p>' +
      '<form id="otpForm" class="stack" novalidate>' +
      '<div class="otp-row">' +
      [0, 1, 2, 3, 4].map(function (i) { return '<input class="otp-cell" maxlength="1" inputmode="numeric" aria-label="رقم ' + (i + 1) + '" />'; }).join('') +
      '</div>' +
      '<p class="hint err" id="otpErr" hidden></p>' +
      '<div class="demo-sms"><span style="font-size:22px">📨</span>' +
      '<div class="grow"><strong class="small">پیامک دمو (در نسخهٔ واقعی ارسال می‌شود)</strong>' +
      '<div>کد تأیید: <code id="demoCode">' + U.fa(a.code) + '</code></div></div>' +
      '<button class="btn ghost sm" type="button" data-x="fill">پر کردن خودکار</button></div>' +
      '<div class="wizard-actions">' +
      '<button class="btn ghost" type="button" data-x="back">← تغییر ' + (isPhone ? 'شماره' : 'ایمیل') + '</button>' +
      '<button class="btn primary grow" type="submit">تأیید و ادامه</button>' +
      '</div>' +
      '</form>';
  }

  function bind(root) {
    var app = A();
    var a = app.state.auth;

    app.on(root, '[data-tab]', 'click', function () {
      a.mode = this.getAttribute('data-tab');
      a.step = 'form';
      app.render();
    });
    app.on(root, '[data-method]', 'click', function () {
      a.method = this.getAttribute('data-method');
      a.step = 'form';
      app.render();
    });
    app.on(root, '[data-x="guest"]', 'click', function () {
      var u = app.createUser('guest-' + Date.now(), 'guest', 'مهمان کاشف', '');
      u.flags.guest = true;
      app.saveUser();
      app.toast({ icon: '👋', title: 'خوش آمدی مهمان!', text: 'پیشرفتت روی همین دستگاه ذخیره می‌شود.' });
      app.go('#/onboarding');
    });

    var form = app.$('#authForm', root);
    if (form) {
      var nameEl = app.$('#f-name', root), contactEl = app.$('#f-contact', root), pwEl = app.$('#f-pw', root);
      var err = app.$('#authErr', root);
      if (contactEl) setTimeout(function () { contactEl.focus(); }, 120);
      function fail(msg, el) {
        err.textContent = msg;
        err.hidden = false;
        if (el) { el.classList.add('err'); el.addEventListener('input', function once() { el.classList.remove('err'); err.hidden = true; el.removeEventListener('input', once); }); }
      }
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var contact = (contactEl.value || '').trim();
        var list = app.users();
        if (a.method === 'phone') {
          contact = app.normPhone(contact);
          if (!app.phoneOk(contact)) return fail('شمارهٔ موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.', contactEl);
        } else {
          if (!app.emailOk(contact)) return fail('ایمیل معتبر نیست؛ مثلاً you@gmail.com', contactEl);
        }
        if (a.method === 'email') {
          var pw = pwEl.value || '';
          if (pw.length < 6) return fail('رمز عبور باید حداقل ۶ کاراکتر باشد.', pwEl);
          a.pw = pw;
        }
        if (a.mode === 'login') {
          if (!list[contact]) return fail('حسابی با این ' + (a.method === 'phone' ? 'شماره' : 'ایمیل') + ' پیدا نشد. اول ثبت‌نام کن.', contactEl);
          if (a.method === 'email') {
            if ((list[contact].pw || '') !== a.pw) return fail('رمز عبور درست نیست.', pwEl);
            app.loginAs(contact);
            app.toast({ icon: '👋', title: 'خوش برگشتی ' + app.state.user.name + '!', text: 'ادامه بده از همان جایی که ماندی.' });
            app.go('#/home');
            return app.render();
          }
        }
        a.contact = contact;
        a.name = nameEl ? (nameEl.value || '').trim() : '';
        a.code = String(Math.floor(10000 + Math.random() * 89999));
        a.step = 'otp';
        app.render();
      });
    }

    var otp = app.$('#otpForm', root);
    if (otp) {
      var cells = app.$$('.otp-cell', root);
      cells[0].focus();
      cells.forEach(function (c, i) {
        c.addEventListener('input', function () {
          c.value = c.value.replace(/\D/g, '');
          if (c.value && cells[i + 1]) cells[i + 1].focus();
        });
        c.addEventListener('keydown', function (ev) {
          if (ev.key === 'Backspace' && !c.value && cells[i - 1]) cells[i - 1].focus();
        });
        c.addEventListener('paste', function (ev) {
          var text = (ev.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 5);
          if (!text) return;
          ev.preventDefault();
          text.split('').forEach(function (d, j) { if (cells[j]) cells[j].value = d; });
          if (cells[text.length]) cells[text.length].focus();
        });
      });
      app.on(root, '[data-x="back"]', 'click', function () { a.step = 'form'; app.render(); });
      app.on(root, '[data-x="fill"]', 'click', function () {
        String(a.code).split('').forEach(function (d, i) { if (cells[i]) cells[i].value = d; });
        cells[4].focus();
      });
      otp.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var err = app.$('#otpErr', root);
        var typed = cells.map(function (c) { return c.value; }).join('');
        if (typed.length < 5) { err.textContent = 'کد پنج‌رقمی را کامل وارد کن.'; err.hidden = false; return; }
        if (typed !== String(a.code)) {
          err.textContent = 'کد درست نیست. دوباره امتحان کن.';
          err.hidden = false;
          HKSAY.react('sad', 1500);
          return;
        }
        var list = app.users();
        if (a.mode === 'login' || list[a.contact]) {
          app.loginAs(a.contact);
          HKSAY.react('happy', 2000);
          app.toast({ icon: '🤖', title: 'خوش برگشتی ' + app.state.user.name + '!', text: 'بریم سراغ ادامهٔ مسیر.' });
          app.go(app.state.user.onboard.done ? '#/home' : '#/onboarding');
        } else {
          var u = app.createUser(a.contact, a.method, a.name || 'کاشف', a.pw || '');
          HKSAY.react('happy', 2400);
          app.toast({ icon: '🎉', title: 'حسابت ساخته شد!', text: 'حالا بگو دوست داری چه چیزی یاد بگیری.' });
          u.flags.fresh = true;
          app.saveUser();
          app.go('#/onboarding');
        }
        a.step = 'form';
        app.render();
      });
    }
    HSKFX.refresh(root);
  }

  V.auth = function (a) {
    return {
      html: '<div class="auth">' + brandSide() +
        '<div class="auth-card"><div class="auth-box">' +
        '<div class="row" style="gap:12px;margin-bottom:18px">' + HKSAY.head(40) +
        '<div><div class="brand-name">' + HSK.BRAND.name + '<span>.</span></div>' +
        '<div class="brand-sub">' + HSK.BRAND.claim + '</div></div></div>' +
        (a.step === 'otp' ? otpStep(a) : formStep(a)) +
        '</div></div></div>',
      bind: bind
    };
  };
})();
