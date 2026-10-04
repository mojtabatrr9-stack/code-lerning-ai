/* ============================================================
   جوانه · موتور حرکت و تعامل (Motion Engine)
   بدون هیچ وابستگی بیرونی؛ فقط DOM و Canvas.
   کارها: بخش‌های تازه، نوار پیشرفت اسکرول، ذرات زنده،
   شناوری/تیلت سه‌بعدی، نمایان‌شدن نرم، شمارنده و پرش سریع.
   ============================================================ */
(() => {
  "use strict";
  const root = document.getElementById("root");
  if (!root) return;

  /* React این صفحه به‌صورت غیرهم‌زمان mount می‌شود؛ پس صبر می‌کنیم تا
     <main> ساخته شود و بعد موتور را راه می‌اندازیم. */
  let tries = 0;
  const attempt = () => {
    const el = document.querySelector("main");
    if (el && el.querySelector(".hero")) { init(el); return; }
    if (tries++ < 900) requestAnimationFrame(attempt);
  };

  const init = main => {

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fa = v => Number(v).toLocaleString("fa-IR");
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));
  let motionOn = !main.classList.contains("still") && !reduced.matches;

  /* ---------- آیکون‌های خطی ---------- */
  const ico = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="20" height="20">' + d + "</svg>";
  const ICON = {
    home: ico('<path d="M4 11.4 12 4l8 7.4"/><path d="M6.6 10.4V20h10.8v-9.6"/>'),
    book: ico('<path d="M5 5.6A2.6 2.6 0 0 1 7.6 3H19v15.2H7.6A2.6 2.6 0 0 0 5 20.8z"/><path d="M5 20.8A2.6 2.6 0 0 1 7.6 18.2H19"/>'),
    route: ico('<circle cx="7" cy="18" r="2.6"/><circle cx="17" cy="6" r="2.6"/><path d="M14.6 7.6H11a4 4 0 0 0 0 8h2a4 4 0 0 1 0 8H9.4"/>'),
    tool: ico('<path d="M15.2 3.6a4.6 4.6 0 0 0-3.9 6.9L4 17.7 6.3 20l7.2-7.3a4.6 4.6 0 0 0 6.9-3.9l-2.9 2.3-2.4-2.4z"/>'),
    code: ico('<path d="m9 7.5-4.5 4.5L9 16.5"/><path d="m15 7.5 4.5 4.5L15 16.5"/>'),
    help: ico('<circle cx="12" cy="12" r="8.6"/><path d="M9.7 9.5a2.4 2.4 0 1 1 3.1 2.3c-.7.3-1 .8-1 1.5v.3"/><circle cx="12" cy="16.9" r=".95" fill="currentColor" stroke="none"/>'),
    up: ico('<path d="M12 19V5.6"/><path d="m6.4 11.2 5.6-5.6 5.6 5.6"/>')
  };

  /* ---------- بخش‌های تازهٔ سایت ---------- */
  const SECTIONS = '' +
  '<section class="stats-section" aria-label="جوانه در یک نگاه">' +
    '<article class="stat-card"><span class="stat-glyph">۰۱</span><strong data-count="6">۶</strong><span class="stat-label">بخش آموزشی</span><p>از تفاوت زبان‌ها تا اولین کار؛ هر بخش یک لقمهٔ کوتاه با یک تمرین.</p></article>' +
    '<article class="stat-card"><span class="stat-glyph">۰۲</span><strong data-count="6">۶</strong><span class="stat-label">قدم تا نقشهٔ راه</span><p>علاقه، هدف، تجربه، زمان و دو سؤال کوچک؛ بعد مسیرت ساخته می‌شود.</p></article>' +
    '<article class="stat-card"><span class="stat-glyph">۰۳</span><strong data-count="5">۵</strong><span class="stat-label">مسیر پیشنهادی</span><p>وب، پایتون، داده، موبایل و بازی؛ هر مسیر یک پروژهٔ جمع‌بندی دارد.</p></article>' +
    '<article class="stat-card"><span class="stat-glyph">۰۴</span><strong data-count="0">۰</strong><span class="stat-label">نصب و ثبت‌نام</span><p>همین صفحه بدون اینترنت و بدون حساب کاربری کار می‌کند؛ فقط بازش کن.</p></article>' +
  '</section>' +

  '<section id="tools" class="tools-section">' +
    '<div class="section-intro"><span class="section-kicker">' + ICON.tool + ' جعبه‌ابزار واقعی</span><h2>شش ابزار،<br><span>شش قدم مشخص.</span></h2><p>لازم نیست همه را روز اول نصب کنی. هر ابزار را همان‌وقت بردار که به آن نیاز پیدا می‌کنی.</p></div>' +
    '<div class="tools-grid">' +
      '<article class="tool-card"><span class="tool-badge">روز اول</span><h3>مرورگر مدرن</h3><p>Firefox یا Chrome؛ خروجی کارت را همین‌جا می‌بینی. با F12 ابزار توسعه باز می‌شود: عنصرها، خطاها و شبکه.</p><footer>' + ICON.code + ' اولین قدم: یک صفحهٔ خالی را باز کن و Inspect بزن.</footer></article>' +
      '<article class="tool-card"><span class="tool-badge">روز اول</span><h3>ویرایشگر کد: VS Code</h3><p>برای وب، پایتون و تقریباً هر زبانی. پوشهٔ پروژه را باز می‌کند، خطاها را نشان می‌دهد و با افزونه‌ها بزرگ می‌شود.</p><footer>' + ICON.code + ' اولین قدم: پوشهٔ first-project را باز کن و index.html بساز.</footer></article>' +
      '<article class="tool-card"><span class="tool-badge">مسیر پایتون و داده</span><h3>Python 3</h3><p>زبان محبوب اتوماسیون، بک‌اند و کار با داده. نسخه را با python --version یا python3 --version بررسی کن.</p><footer>' + ICON.code + ' اولین قدم: یک فایل hello.py با یک print بنویس.</footer></article>' +
      '<article class="tool-card"><span class="tool-badge">بعد از پروژهٔ اول</span><h3>Git</h3><p>تاریخچهٔ تغییرات را نگه می‌دارد تا بتوانی به عقب برگردی و کارت را با دیگران به اشتراک بگذاری.</p><footer>' + ICON.code + ' اولین قدم: git init و یک commit با پیام روشن.</footer></article>' +
      '<article class="tool-card"><span class="tool-badge">وقتی JS جدی شد</span><h3>Node.js</h3><p>اجرای JavaScript بیرون مرورگر؛ لازمهٔ ابزارهای وب و کتابخانه‌ها. برای تمرین اول این صفحه اصلاً لازم نیست.</p><footer>' + ICON.code + ' اولین قدم: نسخهٔ نصب‌شده را با node -v چک کن.</footer></article>' +
      '<article class="tool-card"><span class="tool-badge">مسیر بازی</span><h3>Godot</h3><p>موتور بازی رایگان و متن‌باز با ویرایشگر داخلی و زبان GDScript؛ برای بازی‌های دوبعدی نقطهٔ شروع خوبی است.</p><footer>' + ICON.code + ' اولین قدم: یک صحنهٔ خالی با یک شخصیت بساز.</footer></article>' +
    '</div>' +
  '</section>' +

  '<section id="code" class="showcase-section">' +
    '<div class="section-intro"><span class="section-kicker">' + ICON.code + ' سه نمونه‌کد کوچک</span><h2>کد واقعی،<br><span>به‌اندازهٔ یک نفس.</span></h2><p>این‌ها همان چیزهایی‌اند که در مسیر یاد می‌گیری؛ بخوان، حدس بزن خروجی چیست، بعد خودت تایپ کن.</p></div>' +
    '<div class="showcase-grid">' +
      '<article class="showcase-card"><div class="showcase-bar"><span>first-seed.html</span><i><b></b><b></b><b></b></i></div><pre dir="ltr"><b>&lt;!doctype html&gt;</b>\n&lt;<b>h1</b>&gt;سلام، دنیا!&lt;/<b>h1</b>&gt;\n&lt;<b>style</b>&gt;\n  h1 { <em>color</em>: <u>#b4d9ff</u>; }\n&lt;/<b>style</b>&gt;</pre><p>اولین ساختهٔ تو: یک عنوان که رنگش را خودت انتخاب می‌کنی.</p></article>' +
      '<article class="showcase-card"><div class="showcase-bar"><span>sum.py</span><i><b></b><b></b><b></b></i></div><pre dir="ltr"><b>def</b> <em>sum_to</em>(n):\n    total = <u>0</u>\n    <b>for</b> i <b>in</b> <em>range</em>(<u>1</u>, n + <u>1</u>):\n        total += i\n    <b>return</b> total\n\n<em>print</em>(<em>sum_to</em>(<u>5</u>))  <u># 15</u></pre><p>یک حلقه، یک متغیر و یک تابع؛ پایهٔ منطقی که در همهٔ مسیرها لازم است.</p></article>' +
      '<article class="showcase-card"><div class="showcase-bar"><span>counter.js</span><i><b></b><b></b><b></b></i></div><pre dir="ltr"><b>let</b> count = <u>0</u>;\n<em>button</em>.addEventListener(<u>"click"</u>, () =&gt; {\n  count++;\n  <em>label</em>.textContent = count;\n});</pre><p>ساده‌ترین رفتار تعاملی وب: یک کلیک، یک تغییر در صفحه.</p></article>' +
    '</div>' +
  '</section>' +

  '<section id="faq" class="faq-section">' +
    '<div class="section-intro"><span class="section-kicker">' + ICON.help + ' پرسش‌های پرتکرار</span><h2>قبل از شروع،<br><span>این پنج تا را بخوان.</span></h2><p>پاسخ‌ها کوتاه و بی‌اغراق‌اند؛ همان چیزی که واقعاً لازم داری بدانی.</p></div>' +
    '<div class="faq-list">' +
      '<details class="faq-item"><summary>برای شروع باید ریاضی و انگلیسی عالی بلد باشم؟<span class="faq-plus">' + ICON.up + '</span></summary><div class="faq-body"><p>نه. برای وب و پایتونِ مقدماتی، ریاضیِ پیشرفته لازم نیست؛ داده و یادگیری ماشین بعداً ریاضی بیشتری می‌خواهند. از انگلیسی هم واژه‌های کوچک مثل file، error و return را کم‌کم یاد بگیر و پیام خطا را با همان‌ها بخوان.</p></div></details>' +
      '<details class="faq-item"><summary>هفته‌ای چقدر وقت لازم است؟<span class="faq-plus">' + ICON.up + '</span></summary><div class="faq-body"><p>جلسه‌های کوتاه و منظم از جلسه‌های طولانیِ پراکنده بهتر جواب می‌دهند. در همین سایت با پاسخ «۲، ۵ یا ۸ ساعت» یک برنامهٔ تمرینی تقریبی می‌گیری؛ ملاک عبور از هر مرحله، انجام تمرین است، نه گذشت زمان.</p></div></details>' +
      '<details class="faq-item"><summary>اول کدام زبان را یاد بگیرم؟<span class="faq-plus">' + ICON.up + '</span></summary><div class="faq-body"><p>زبان را با پروژه انتخاب کن، نه با شهرتش. برای دیدن سریع نتیجه: HTML و CSS و JavaScript. برای اتوماسیون و داده: Python. برای موبایل: اول JavaScript و React، بعد React Native. برای بازی: Godot و GDScript.</p></div></details>' +
      '<details class="faq-item"><summary>این سایت حساب کاربری می‌سازد یا اطلاعاتم را نگه می‌دارد؟<span class="faq-plus">' + ICON.up + '</span></summary><div class="faq-body"><p>نه. این نسخه حساب واقعی، ایمیل و رمز ندارد و به سرویس هوش مصنوعی وصل نیست. پاسخ‌های تو و نقشهٔ راه فقط تا وقتی این صفحه باز است در حافظهٔ همان صفحه می‌مانند؛ برای نگه‌داشتن نقشه از دکمهٔ «دانلود نقشه» استفاده کن.</p></div></details>' +
      '<details class="faq-item"><summary>از هوش مصنوعی استفاده کنم یا نه؟<span class="faq-plus">' + ICON.up + '</span></summary><div class="faq-body"><p>بله، ولی به‌عنوان همکار، نه جایگزین فهمیدن. اول خودت تلاش کن، بعد یک راهنمایی بگیر، خروجی را با ورودی عادی و حالت مرزی تست کن و در آخر بدون نگاه‌کردن دوباره بنویس. رمز و کلید API را در درخواست نگذار.</p></div></details>' +
    '</div>' +
  '</section>';

  const TICKER_ITEMS = ["HTML", "CSS", "JavaScript", "Python", "SQL", "Git", "React", "Godot", "داده", "هوش مصنوعی", "تست", "منطق برنامه"];
  const tickerMarkup = TICKER_ITEMS.map(t => '<span>' + t + '<i>✦</i></span>').join("");
  const tickerHTML = '<div class="ticker" aria-hidden="true"><div class="ticker-track">' + tickerMarkup + tickerMarkup + '</div></div>' +
    '<nav class="fx-chips" aria-label="پرش سریع"><a href="#playground">تمرین زنده</a><a href="#chapters">شش بخش</a><a href="#enroll">مسیر من</a><a href="#tools">جعبه‌ابزار</a><a href="#code">نمونه‌کد</a><a href="#faq">پرسش‌ها</a></nav>';

  const hero = $(".hero", main);
  if (hero) hero.insertAdjacentHTML("afterend", tickerHTML);
  const footer = $("footer", main);
  const sections = document.createElement("div");
  sections.className = "fx-sections";
  sections.innerHTML = SECTIONS;
  if (footer) footer.before(sections); else main.appendChild(sections);

  /* ---------- نوار پیشرفت اسکرول ---------- */
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = "<i></i>";
  document.body.appendChild(bar);
  const barFill = bar.firstChild;

  /* ---------- درخشش نشانگر ---------- */
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);

  /* ---------- بوم ذرات ---------- */
  const canvas = document.createElement("canvas");
  canvas.className = "fx-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d", { alpha: true });
  let W = 0, H = 0, dots = [], scrollY = 0, scrollVel = 0, lastScroll = 0;
  const mouse = { x: -9999, y: -9999, on: false };
  const paint = { gx: -9999, gy: -9999, tx: -9999, ty: -9999 };

  const resize = () => {
    W = window.innerWidth;
    H = window.innerHeight;
    const d = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * d);
    canvas.height = Math.floor(H * d);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const target = Math.round(clamp((W * H) / 26000, 24, 88));
    dots = [];
    for (let i = 0; i < target; i++) dots.push(makeDot(true));
  };
  const makeDot = seed => {
    const depth = 0.35 + Math.random() * 0.85;
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: (0.8 + Math.random() * 1.9) * depth,
      depth,
      hue: 200 + Math.random() * 60,
      a: seed ? 0.25 + Math.random() * 0.5 : 0.7,
      life: seed ? 1 : 0
    };
  };
  const burst = (x, y) => {
    if (!motionOn) return;
    for (let i = 0; i < 10; i++) {
      const d = makeDot(false);
      const ang = (Math.PI * 2 * i) / 10 + Math.random() * 0.6;
      const sp = 0.9 + Math.random() * 2.1;
      d.x = x; d.y = y;
      d.vx = Math.cos(ang) * sp;
      d.vy = Math.sin(ang) * sp;
      d.r = 1 + Math.random() * 2;
      d.life = 1;
      d.fade = 0.012 + Math.random() * 0.014;
      dots.push(d);
    }
    if (dots.length > 220) dots.splice(0, dots.length - 220);
  };

  let raf = 0, visible = true;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible || !motionOn) return;
    ctx.clearRect(0, 0, W, H);
    const off = scrollY * 0.03;
    for (let i = 0; i < dots.length; i++) {
      const p = dots[i];
      p.x += p.vx;
      p.y += p.vy + scrollVel * 0.0016 * p.depth;
      if (mouse.on) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 20000 && d2 > 0.01) {
          const f = (1 - d2 / 20000) * 0.55;
          const len = Math.sqrt(d2);
          p.x += (dx / len) * f * 2.4;
          p.y += (dy / len) * f * 2.4;
        }
      }
      if (p.life < 1) { p.life += 0.03; p.a = p.life * 0.8; }
      else if (p.fade) { p.a -= p.fade; if (p.a <= 0) { dots.splice(i, 1); i--; continue; } }
      const py = p.y - off * p.depth;
      if (p.x < -40) p.x = W + 30;
      if (p.x > W + 40) p.x = -30;
      if (py < -40) p.y = H + 30 + off * p.depth;
      if (py > H + 40) p.y = -30 + off * p.depth;
      const alpha = clamp(p.a, 0, 1);
      ctx.beginPath();
      ctx.arc(p.x, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(" + p.hue + ",100%,82%," + alpha + ")";
      ctx.fill();
      for (let j = i + 1; j < dots.length; j++) {
        const q = dots[j];
        const qy = q.y - off * q.depth;
        const dx = p.x - q.x, dy = py - qy;
        const d2 = dx * dx + dy * dy;
        if (d2 < 13200) {
          ctx.beginPath();
          ctx.moveTo(p.x, py);
          ctx.lineTo(q.x, qy);
          ctx.strokeStyle = "hsla(215,100%,84%," + (1 - d2 / 13200) * 0.12 * alpha + ")";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    scrollVel *= 0.9;
  };

  /* ---------- نمایان‌شدن نرم ---------- */
  const REVEAL = [".section-intro", ".chapter-item", ".stats-section .stat-card", ".tool-card",
    ".showcase-card", ".faq-item", ".roadmap-heading", ".roadmap-disclaimer", ".roadmap-progress",
    ".enroll-copy", ".privacy-note", ".enroll-orbit", ".onboarding-panel", ".ticker", ".fx-chips",
    ".plan-summary", ".roadmap-bottom"];
  let io = null;
  if ("IntersectionObserver" in window && !reduced.matches) {
    io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("fx-shown");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
  }
  const reveal = () => {
    if (!io) return;
    REVEAL.forEach(sel => $$(sel, main).forEach(el => {
      if (el.classList.contains("fx-in")) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.94) return;
      el.classList.add("fx-in");
      io.observe(el);
    }));
  };

  /* ---------- تیلت سه‌بعدی ---------- */
  const TILT = [".workbench", ".chapter-item", ".road-step", ".onboarding-panel", ".tool-card",
    ".showcase-card", ".stat-card", ".faq-item", ".roadmap-disclaimer"];
  const tilt = () => {
    TILT.forEach(sel => $$(sel, main).forEach(el => {
      if (el.dataset.fxTilt || !finePointer || !motionOn) return;
      el.dataset.fxTilt = "1";
      el.classList.add("fx-tilt");
      const max = el.classList.contains("workbench") ? 5 : 3;
      const move = e => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width;
        const ny = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", ((nx - 0.5) * 2 * max).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((0.5 - ny) * 2 * max).toFixed(2) + "deg");
        el.style.setProperty("--mx", (nx * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (ny * 100).toFixed(1) + "%");
      };
      const leave = () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("focusin", leave);
    }));
  };

  /* ---------- شمارندهٔ آمار ---------- */
  const count = el => {
    if (el.dataset.fxCounted) return;
    el.dataset.fxCounted = "1";
    const to = parseFloat(el.dataset.count || "0");
    if (!motionOn) { el.textContent = fa(to); return; }
    const t0 = performance.now(), dur = 1300;
    const step = now => {
      const p = clamp((now - t0) / dur, 0, 1);
      el.textContent = fa(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counters = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { count(e.target); counters.unobserve(e.target); } });
  }, { threshold: 0.4 });

  /* ---------- پرش سریع و داک ---------- */
  const dock = document.createElement("nav");
  dock.className = "fx-dock";
  dock.setAttribute("aria-label", "ناوبری شیشه‌ای");
  dock.innerHTML = '<a href="#playground" data-label="تمرین زنده">' + ICON.home + '</a>' +
    '<a href="#chapters" data-label="شش بخش">' + ICON.book + '</a>' +
    '<a href="#enroll" data-label="مسیر من">' + ICON.route + '</a>' +
    '<a href="#tools" data-label="جعبه‌ابزار">' + ICON.tool + '</a>' +
    '<a href="#code" data-label="نمونه‌کد">' + ICON.code + '</a>' +
    '<a href="#faq" data-label="پرسش‌ها">' + ICON.help + '</a>' +
    '<button type="button" data-label="برو بالا" aria-label="بازگشت به بالای صفحه">' + ICON.up + '</button>';
  document.body.appendChild(dock);
  requestAnimationFrame(() => dock.classList.add("fx-ready"));
  dock.querySelector("button").addEventListener("click", () => {
    root.scrollTo({ top: 0, behavior: motionOn ? "smooth" : "auto" });
  });
  const links = $$("a", dock);
  const sectionsForDock = [["playground", links[0]], ["chapters", links[1]], ["enroll", links[2]],
    ["tools", links[3]], ["code", links[4]], ["faq", links[5]]];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        sectionsForDock.forEach(([id, a]) => a.classList.toggle("fx-active", id === e.target.id));
      });
    }, { rootMargin: "-42% 0px -52% 0px" });
    sectionsForDock.forEach(([id]) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---------- تعامل‌های اشاره‌گر ---------- */
  if (finePointer) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy;
    window.addEventListener("pointermove", e => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true;
      paint.tx = e.clientX; paint.ty = e.clientY;
      const r = main.getBoundingClientRect();
      main.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      main.style.setProperty("--py", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    }, { passive: true });
    window.addEventListener("pointerleave", () => {
      mouse.on = false;
      main.style.setProperty("--px", "0");
      main.style.setProperty("--py", "0");
    });
    const glowLoop = () => {
      requestAnimationFrame(glowLoop);
      if (!motionOn) return;
      if (paint.tx !== paint.gx) { gx += (paint.tx - gx) * 0.12; gy += (paint.ty - gy) * 0.12; paint.gx = gx; paint.gy = gy; }
      glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
    };
    requestAnimationFrame(glowLoop);
  }
  window.addEventListener("pointerdown", e => {
    if (!motionOn) return;
    if (e.target && e.target.closest && e.target.closest("input, textarea, select, summary")) return;
    burst(e.clientX, e.clientY);
    const r = document.createElement("span");
    r.className = "fx-ripple";
    r.style.left = e.clientX + "px";
    r.style.top = e.clientY + "px";
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 780);
  }, { passive: true });

  /* ---------- حباب‌های شناور: چرخش سه‌بعدی نرم با نشانگر ---------- */
  const bubble = el => {
    if (el.dataset.fxBubble || !finePointer) return;
    el.dataset.fxBubble = "1";
    const limit = el.classList.contains("fx-chip") ? 16 : 10;
    const move = e => {
      const r = el.getBoundingClientRect();
      const nx = clamp((e.clientX - r.left) / r.width, 0, 1);
      const ny = clamp((e.clientY - r.top) / r.height, 0, 1);
      el.style.setProperty("--ry", ((nx - 0.5) * 2 * limit).toFixed(1) + "deg");
      el.style.setProperty("--rx", ((0.5 - ny) * 2 * limit).toFixed(1) + "deg");
      el.style.setProperty("--mx", (nx * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (ny * 100).toFixed(1) + "%");
    };
    const leave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.style.setProperty("--ry", "0deg");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("focus", leave);
  };
  const bubbleAll = () => {
    $$(".fx-chips a", main).forEach(el => { el.classList.add("fx-chip"); bubble(el); });
    $$(".fx-dock a, .fx-dock button", document).forEach(el => bubble(el));
    $$(".swatch, .run", main).forEach(el => bubble(el));
  };

  if (finePointer && !reduced.matches) {
    $$(".primary, .plan-link", main).forEach(el => {
      let armed = false, timer = 0;
      el.addEventListener("pointerenter", () => { timer = setTimeout(() => { armed = true; }, 220); });
      el.addEventListener("pointermove", e => {
        if (!armed) return;
        const r = el.getBoundingClientRect();
        const dx = clamp((e.clientX - (r.left + r.width / 2)) * 0.09, -7, 7);
        const dy = clamp((e.clientY - (r.top + r.height / 2)) * 0.09, -5, 5);
        el.style.setProperty("--magx", dx.toFixed(2) + "px");
        el.style.setProperty("--magy", dy.toFixed(2) + "px");
      });
      el.addEventListener("pointerleave", () => {
        clearTimeout(timer); armed = false;
        el.style.setProperty("--magx", "0px");
        el.style.setProperty("--magy", "0px");
      });
    });
  }

  /* ---------- اسکرول ---------- */
  const onScroll = () => {
    scrollY = root.scrollTop || window.scrollY || 0;
    scrollVel = scrollY - lastScroll;
    lastScroll = scrollY;
    const max = Math.max(1, root.scrollHeight - root.clientHeight);
    barFill.style.width = clamp((scrollY / max) * 100, 0, 100) + "%";
  };
  root.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- راه‌اندازی و پاسخ به تغییر وضعیت حرکت ---------- */
  const scan = () => { reveal(); tilt(); bubbleAll(); $$("[data-count]", main).forEach(el => { if (el.dataset.fxSeen) return; el.dataset.fxSeen = "1"; counters.observe(el); }); };
  let scanTimer = 0;
  const scheduleScan = () => { clearTimeout(scanTimer); scanTimer = setTimeout(scan, 90); };
  if ("MutationObserver" in window) new MutationObserver(scheduleScan).observe(main, { childList: true, subtree: true });

  const setMotion = on => {
    motionOn = on;
    if (!on) {
      ctx.clearRect(0, 0, W, H);
      $$(".fx-in", main).forEach(el => el.classList.add("fx-shown"));
    }
  };
  new MutationObserver(() => setMotion(!main.classList.contains("still") && !reduced.matches))
    .observe(main, { attributes: true, attributeFilter: ["class"] });
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; });

  resize();
  onScroll();
  scan();
  requestAnimationFrame(frame);
  setTimeout(() => { reveal(); $$(".fx-in", main).forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("fx-shown"); }); }, 1200);
  };

  attempt();
})();
