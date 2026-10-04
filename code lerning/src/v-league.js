/* =====================================================================
   هوشیکا · نما: لیگ هفتگی و ماهانه
   ===================================================================== */
(function () {
  'use strict';
  var V = (window.HSKVIEWS = window.HSKVIEWS || {});
  var U = HSK.util;
  function A() { return window.HSKAPP; }

  var tab = 'week';

  function countdownHTML(kind) {
    var target = kind === 'week' ? U.weekEnd() : U.monthEnd();
    var c = U.countdown(target);
    return '<div class="countdown">' +
      '<div class="cd-cell"><strong>' + U.fa(c.days) + '</strong><span>روز</span></div>' +
      '<div class="cd-cell"><strong>' + U.fa(c.h) + '</strong><span>ساعت</span></div>' +
      '<div class="cd-cell"><strong>' + U.fa(c.m) + '</strong><span>دقیقه</span></div>' +
      '</div>';
  }
  function rowsHTML(L, u) {
    return L.rows.map(function (r) {
      var zone = r.rank <= 3 ? 'promo' : (r.rank >= L.rows.length - 2 ? 'drop' : '');
      var delta = r.me ? Math.round(A().xpInPeriod(tab)) : Math.round(r.xp * 0.07);
      return '<div class="league-row ' + (r.me ? 'me' : '') + ' ' + zone + '">' +
        '<span class="rank ' + (r.rank <= 3 ? 'top' : '') + '">' + (r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : U.fa(r.rank)) + '</span>' +
        (r.me ? A().avatarHTML(u) : HKSAY.avatar(r.avatar, r.rank <= 3 ? '#ffc94d' : '#4de2ff')) +
        '<span class="name">' + A().esc(r.name) + (r.me ? ' <span class="badge cyan small">تو</span>' : '') + '</span>' +
        '<span class="dot ' + (zone === 'promo' ? 'lime' : (zone === 'drop' ? 'pink' : '')) + '"></span>' +
        '<span class="delta">▲ ' + U.fa(delta) + '</span>' +
        '<span class="xp">' + U.faNum(r.xp) + ' ✨</span></div>';
    }).join('');
  }

  V.league = function () {
    var app = A(), u = app.state.user;
    var L = app.leagueRows(tab);
    var tier = HSK.tierFor(u.xp);
    var nextTier = HSK.TIERS[HSK.TIERS.indexOf(tier) + 1];
    var tierPct = nextTier ? Math.round(((u.xp - tier.min) / (nextTier.min - tier.min)) * 100) : 100;
    var target = tab === 'week' ? U.weekEnd() : U.monthEnd();

    return {
      html: '<div class="page"><div class="stack-lg">' +
        '<section class="row between wrap">' +
        '<div><span class="kicker">🏆 رقابت سالم</span><h1 style="margin:6px 0">لیگ ' + (tab === 'week' ? 'هفتگی' : 'ماهانه') + '</h1>' +
        '<p class="muted" style="margin:0">هر امتیازی که از درس، تست، مأموریت یا کارگاه می‌گیری، همان لحظه در جدول لیگ حساب می‌شود. ' +
        'لیگ هفتگی هر جمعه و لیگ ماهانه پایان هر ماه میلادی-شمسی بسته می‌شود.</p></div>' +
        '<div class="tabs" style="max-width:330px">' +
        '<button class="' + (tab === 'week' ? 'on' : '') + '" data-ltab="week">هفتگی</button>' +
        '<button class="' + (tab === 'month' ? 'on' : '') + '" data-ltab="month">ماهانه</button>' +
        '</div></section>' +

        '<section class="league-head">' +
        '<div class="tier-badge"><span class="t-icon">' + tier.icon + '</span>' +
        '<div><strong>' + tier.title + '</strong>' +
        '<div class="small muted">' + (nextTier ? U.faNum(Math.max(0, nextTier.min - u.xp)) + ' امتیاز تا ' + nextTier.title : 'بالاترین لیگ!') + '</div></div></div>' +
        '<div class="panel tight"><div class="small muted">جایگاه تو در این دوره</div>' +
        '<strong style="font-family:var(--font-display);font-size:30px;color:var(--cyan)">' + U.fa(L.rank) + '</strong>' +
        '<div class="small muted">از ' + U.fa(L.rows.length) + ' نفر · ' + U.faNum(L.mine) + ' امتیاز</div></div>' +
        '<div class="panel tight"><div class="small muted">پایان دوره تا</div>' + countdownHTML(tab) +
        '<div class="small muted" style="margin-top:8px">' + U.persianDate(target) + '</div></div>' +
        '<div class="panel tight"><div class="small muted">امتیاز این ماه</div>' +
        '<strong style="font-family:var(--font-display);font-size:26px;color:var(--amber)">' + U.faNum(app.xpInPeriod('month')) + '</strong>' +
        '<div class="bar slim" style="margin-top:8px"><i style="width:' + tierPct + '%"></i></div></div>' +
        '</section>' +

        '<section class="grid" style="grid-template-columns:1.5fr .5fr">' +
        '<div class="panel"><div class="sec-head"><h2 style="font-size:24px">جدول ' + (tab === 'week' ? 'این هفته' : 'این ماه') + '</h2>' +
        '<div class="zone-note"><span><i style="background:var(--lime)"></i>صعود به لیگ بالاتر</span>' +
        '<span><i style="background:var(--danger)"></i>منطقهٔ سقوط</span></div></div>' +
        '<div class="league-table" id="leagueTable">' + rowsHTML(L, u) + '</div>' +
        '<p class="hint" style="margin-top:12px">سه نفر اول به لیگ بالاتر صعود می‌کنند و دو نفر آخر به لیگ پایین‌تر می‌روند. رقبا ربات‌های تمرینی هوشیکا هستند تا همیشه یک مسابقهٔ نزدیک داشته باشی.</p>' +
        '</div>' +
        '<div class="col">' +
        '<div class="panel tight">' + HKSAY.svg({ mood: L.rank <= 3 ? 'proud' : 'think', size: '140px' }) +
        HKSAY.bubble(U.pick(HSK.LINES.league, String(L.rank))) + '</div>' +
        '<div class="panel tight"><h3 style="font-size:20px">امتیاز از کجا می‌آید؟</h3>' +
        '<ul class="goals" style="margin-top:10px">' +
        '<li>هر درس کامل: <b class="ink2">+۱۰</b></li>' +
        '<li>هر پاسخ درست در تست: <b class="ink2">+۵</b></li>' +
        '<li>تست بی‌نقص درس: <b class="ink2">+۱۰</b></li>' +
        '<li>مأموریت روزانه: <b class="ink2">+۱۵ تا +۴۵</b></li>' +
        '<li>چالش هفته: <b class="ink2">+۵۰ تا +۸۰</b></li>' +
        '<li>هر اجرای کد در کارگاه: <b class="ink2">+۵</b></li>' +
        '</ul></div>' +
        '<div class="callout"><span>💡</span><p>می‌خواهی سریع بالا بروی؟ هر روز یک درس + مأموریت‌ها را بگیر؛ همان اندازه که ۱۰ درس در یک روز می‌زنی امتیاز می‌گیری، ولی زنجیره‌ات هم حفظ می‌شود.</p></div>' +
        '</div></section>' +
        '</div></div>',
      bind: function (root) {
        app.on(root, '[data-ltab]', 'click', function () {
          tab = this.getAttribute('data-ltab');
          app.render();
        });
        /* شمارش معکوس زنده */
        var cells = app.$$('.cd-cell strong', root);
        var timer = setInterval(function () {
          if (!document.body.contains(cells[0])) { clearInterval(timer); return; }
          var c = U.countdown(tab === 'week' ? U.weekEnd() : U.monthEnd());
          cells[0].textContent = U.fa(c.days);
          cells[1].textContent = U.fa(c.h);
          cells[2].textContent = U.fa(c.m);
        }, 30000);
        HSKFX.refresh(root);
      }
    };
  };
})();
