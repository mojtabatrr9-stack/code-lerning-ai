// Subject: Persian beginners discovering programming and building a personal roadmap.
// Revision: midnight navy, iPhone-inspired luminous glass icons and floating panes.
// Type: user-supplied local Lalezar / JetBrains Mono for code.
// Palette: midnight #080f24, navy #111e3d, ice #b4d9ff, white #eef5ff,
// muted #a5b4cc. RTL hero / transparent learning instrument.
// Signature: an illuminated glass seed grows inside the live HTML output.
// Extension: six beginner chapters, a six-step anonymous onboarding instrument,
// and a branch-specific roadmap based on interest, motivation, time and a tiny quiz.
import { useState } from "react";
import { ArrowUpLeft, ArrowLeft, Play, Check, RotateCcw, Code2, Sprout, Sparkles, X } from "lucide-react";
import "./design.css";
import "./glass.css";
import Academy from "./Academy";
import "./academy.css";

export default function App() {
  const [started, setStarted] = useState(false);
  const [text, setText] = useState("سلام، دنیا!");
  const [color, setColor] = useState("#dbef88");
  const [output, setOutput] = useState({ text: "سلام، دنیا!", color: "#dbef88" });
  const [runs, setRuns] = useState(0);
  const [changed, setChanged] = useState(false);
  const [motion, setMotion] = useState(true);
  const begin = () => { setStarted(true); window.setTimeout(() => document.getElementById("code-text")?.focus(), 250); };
  const run = () => { setOutput({ text: text || "سلام، دنیا!", color }); setRuns(n => n + 1); setChanged(true); };
  const reset = () => { setText("سلام، دنیا!"); setColor("#dbef88"); setOutput({ text: "سلام، دنیا!", color: "#dbef88" }); setChanged(false); setRuns(0); };
  return (
    <main dir="rtl" className={motion ? "" : "still"}>
      <div className="grain" />
      <header>
        <a className="brand" href="#" aria-label="جوانه، صفحه اصلی"><span className="brand-icon"><Sprout size={27}/></span>جوانه<span className="brand-dot">.</span></a>
        <nav className="academy-nav" aria-label="بخش‌های سایت"><a href="#chapters">از کجا شروع کنم؟</a><a href="#enroll">مسیر من</a></nav>
        <a className="nav-start" href="#enroll">ثبت‌نام در مسیر <ArrowUpLeft size={18}/></a>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span/> از صفر، با دست‌های خودت</div>
          <h1>فقط کد نخوان.<br/><span className="build-word">خلق کن<svg viewBox="0 0 300 25" aria-hidden="true"><path d="M9 16 Q140 -2 289 12" /></svg></span><span className="full-stop">.</span></h1>
          <p className="intro">برنامه‌نویسی رو لقمه‌لقمه یاد بگیر.<br/>یک مفهوم، یک تجربه، یک «خودم ساختم!»</p>
          <div className="hero-actions"><button className="primary" onClick={begin}>{started ? "حالا نوبت توئه" : "بیا اولین چیز رو بسازیم"}<ArrowLeft size={21}/></button><span className="time-note">بدون پیش‌نیاز<br/><strong>فقط ۲ دقیقه</strong></span></div>
          <div className="lesson-meta"><span className="lesson-icon"><Code2 size={21}/></span><div><strong>اولین جوانه: سلام، دنیا!</strong><span>یک شروع کوچک با HTML</span></div><span className="meta-tag">درس ۰۱</span></div>
        </div>
        <div className="studio">
          <div className="orbit"/><div className="orbit orbit-two"/>
          <span className="float-symbol symbol-two" aria-hidden="true">&lt;/&gt;</span>
          <div className="live-pill"><span/> اینجا کدت زنده می‌شه</div>
          <div className="workbench" id="playground">
            <div className="window-bar"><span className="filename" dir="ltr"><Code2 size={16}/> first-seed.html</span><div className="window-dots"><i/><i/><i/></div></div>
            <div className="editor" dir="ltr">
              <div className="code-row"><span className="line-num">1</span><code><span className="punct">&lt;</span><span className="tag">h1</span><span className="punct">&gt;</span></code></div>
              <div className="code-row input-row"><span className="line-num">2</span><input id="code-text" aria-label="متن عنوان HTML" dir="rtl" maxLength={36} value={text} onChange={e => {setText(e.target.value); setChanged(false);}}/></div>
              <div className="code-row"><span className="line-num">3</span><code><span className="punct">&lt;/</span><span className="tag">h1</span><span className="punct">&gt;</span></code></div>
              <div className="code-row comment"><span className="line-num">4</span><code>&lt;!-- your first creation --&gt;</code></div>
            </div>
            <div className="editor-toolbar"><div className="color-picker"><span>رنگت رو انتخاب کن</span>{["#dbef88","#a7d8e8","#ed9276"].map(c => <button key={c} aria-label={c === "#dbef88" ? "سبز" : c === "#a7d8e8" ? "آبی" : "مرجانی"} aria-pressed={color === c} style={{background:c}} className={color === c ? "swatch selected" : "swatch"} onClick={() => {setColor(c); setChanged(false);}}>{color === c && <Check size={12}/>}</button>)}</div><button className="run" onClick={run}><Play size={13} fill="currentColor"/> اجرا کن</button></div>
            <div className="preview">
              <div className="preview-label"><span>خروجی زنده</span><span className="preview-status"><i/> مرورگر کوچولوی تو</span></div>
              <div className="result" key={runs} style={{"--seed-color":output.color}}>
                <div className="plant" aria-hidden="true"><div className="stem"/><div className="leaf left-leaf"/><div className="leaf right-leaf"/><div className="soil"/></div>
                <h2>{output.text}</h2><span className="result-caption">از یک خط کد، یک شروع تازه.</span>
                <span className="result-star"><Sparkles size={21}/></span>
              </div>
            </div>
            <div className="workbench-footer" aria-live="polite"><span>{changed ? "دیدی؟ این یکی رو خودت ساختی!" : "متن رو تغییر بده و اجرا کن."}</span><button onClick={reset} aria-label="شروع دوباره"><RotateCcw size={15}/></button></div>
          </div>
          <div className="hand-note"><svg width="58" height="45" viewBox="0 0 58 45" aria-hidden="true"><path d="M52 38 Q5 41 12 8 M4 17 L12 7 L22 14"/></svg><span>دست‌کاریش کن، خراب نمی‌شه :)</span></div>
        </div>
      </section>
      {started && <div className="lesson-hint" role="status"><span className="hint-spark"><Sparkles size={20}/></span><p><strong>چالش اولت:</strong> به‌جای «سلام، دنیا!» اسم خودت رو بنویس و «اجرا کن» رو بزن. تگ <code dir="ltr">&lt;h1&gt;</code> یک عنوان بزرگ می‌سازه.</p><button onClick={() => setStarted(false)} aria-label="بستن راهنمای درس"><X size={18}/></button></div>}
      <Academy />
      <footer><div className="footer-left"><span className="small-seed"><Sprout size={16}/></span>هر چیزی، از یک جوانه شروع می‌شه.</div><button className="motion-toggle" onClick={() => setMotion(m => !m)} aria-pressed={motion}><span className={motion ? "toggle on" : "toggle"}><i/></span>{motion ? "حرکت روشن" : "حرکت خاموش"}</button><span className="prototype">نمونهٔ آموزشی · بدون حساب کاربری واقعی</span></footer>
    </main>
  );
}
