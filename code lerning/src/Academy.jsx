import { useState } from "react";
import { Globe, Terminal, Laptop, History, Sparkles, BriefcaseBusiness, ArrowLeft, ArrowRight, Check, Compass, Download, RotateCcw, BookOpen, Clock, Route, ShieldCheck } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, FieldGroup, Field, FieldLabel, FieldDescription, ToggleGroup, ToggleGroupItem, Button, Progress } from "@kits/shadcn";

const chapters = [
  { id: "languages", title: "کدها چه فرقی با هم دارن؟", teaser: "هر ابزار، یک کار. از ظاهر سایت تا منطق برنامه.", icon: Globe, time: "۴ دقیقه", parts: [
    ["HTML و CSS", "HTML ساختار صفحه رو می‌سازه؛ CSS ظاهرش رو. HTML زبان نشانه‌گذاریه و CSS زبان سبک‌دهی، نه زبان برنامه‌نویسیِ عمومی. برای شروعِ ساخت سایت، همین دو تا عالی‌ان."],
    ["JavaScript و TypeScript", "JavaScript رفتار تعاملی سایت رو می‌سازه و با Node.js می‌تونه روی سرور هم اجرا بشه. TypeScript بهش بررسی نوع اضافه می‌کنه؛ اول پایه‌های JavaScript رو یاد بگیر."],
    ["Python، SQL و مسیرهای دیگه", "Python برای اتوماسیون، بک‌اند و کار با داده محبوبه. SQL برای پرس‌وجو از پایگاه داده است. Kotlin و Swift برای موبایل، و C# یا C++ در بعضی مسیرهای بازی و نرم‌افزار کاربرد دارن."],
    ["سه مفهوم که قاطی نکنیم", "زبان یعنی ابزار نوشتن دستور؛ کتابخانه یعنی کد آمادهٔ قابل‌استفاده؛ فریم‌ورک یعنی چارچوب ساخت برنامه. لازم نیست برای شروع همهٔ زبان‌ها رو یاد بگیری."]
  ], exercise: "یک چیزی که دوست داری بسازی انتخاب کن: سایت، ابزار خودکار، اپ یا بازی. زبان رو بر اساس پروژه انتخاب کن، نه شهرتش." },
  { id: "basics", title: "قبل از شروع چی لازم دارم؟", teaser: "نه نابغه بودن، نه ریاضی عجیب. یک قدم منطقی.", icon: Compass, time: "۳ دقیقه", parts: [
    ["واقعاً لازم‌ها", "کار با فایل و پوشه، تایپ، استفاده از مرورگر و صبر برای آزمون‌وخطا. برای شروع وب و پایتون، ریاضیِ پیشرفته لازم نیست؛ داده و یادگیری ماشین بعداً ریاضی بیشتری می‌خوان."],
    ["انگلیسی، به‌اندازهٔ نیاز", "از اول مسلط بودن لازم نیست. واژه‌های کوچک مثل file، error، function و return رو کم‌کم یاد بگیر. پیام خطا رو بخون و کلمهٔ ناآشنا رو جست‌وجو کن."],
    ["عادت مهم‌تر از استعداد", "جلسه‌های کوتاه و منظم، نوشتن کد با دست خودت و ساخت پروژه‌های کوچک. دیدن ویدئو بدون تمرین، یادگیری رو کامل نمی‌کنه."]
  ], exercise: "یک پوشه به نام first-project بساز و یک هدف خیلی کوچک براش بنویس: مثلاً یک صفحهٔ معرفی." },
  { id: "tools", title: "جعبه‌ابزار اولین روز", teaser: "چه برنامه‌هایی نصب کنیم و کد رو کجا اجرا کنیم؟", icon: Laptop, time: "۴ دقیقه", parts: [
    ["شروع وب: مرورگر + ویرایشگر", "یک مرورگر جدید مثل Firefox یا Chrome و یک ویرایشگر مثل VS Code کافیه. فایل index.html بساز و در مرورگر بازش کن؛ برای همین مرحله نصب Node.js لازم نیست."],
    ["شروع پایتون", "Python 3 رو از python.org بگیر، همراه یک ویرایشگر یا IDLE. نسخه رو در ترمینال با python --version یا در بعضی سیستم‌ها python3 --version بررسی کن. دستورِ درست به سیستم‌عامل بستگی داره."],
    ["بعدتر، نه همه در روز اول", "Git برای نگهداری تاریخچهٔ تغییرات مفیده. Node.js وقتی سراغ ابزارهای JavaScript می‌ری لازم می‌شه. برای اندروید، Android Studio؛ برای توسعهٔ بومی iOS، Xcode روی macOS."],
    ["فقط موبایل داری؟", "برای آشنایی می‌تونی با محیط‌های تمرین تحت‌وب شروع کنی؛ ولی پروژه‌های بزرگ روی رایانه راحت‌ترن. در همین سایت برای اولین تمرین نصب چیزی لازم نیست."]
  ], exercise: "در بخش بالای همین صفحه متن «سلام، دنیا!» رو تغییر بده. بعداً همون عنوان رو توی یک فایل HTML واقعی بساز." },
  { id: "history", title: "این داستان از کجا شروع شد؟", teaser: "از دستورهای روی کاغذ تا نرم‌افزارهای امروز.", icon: History, time: "۳ دقیقه", parts: [
    ["۱۸۴۳: ایدهٔ یک برنامه", "آدا لاولیس در یادداشت‌هایش برای ماشین تحلیلی ببیج، روشی برای محاسبهٔ اعداد برنولی توضیح داد؛ نمونه‌ای اولیه از فکرکردن به برنامه، پیش از رایانه‌های الکترونیکی."],
    ["دهه‌های ۱۹۴۰ تا ۱۹۷۰", "رایانه‌های الکترونیکی، زبان ماشین و سپس زبان‌های سطح بالاتر مثل FORTRAN و COBOL پدید اومدن. C در دههٔ ۱۹۷۰ به ساخت نرم‌افزارهای سیستمی کمک کرد."],
    ["۱۹۸۹ تا امروز: وب و ابزارهای تازه", "تیم برنرز لی در ۱۹۸۹ پیشنهاد وب رو مطرح کرد. Python در ۱۹۹۱ و JavaScript در ۱۹۹۵ منتشر شدن. وب، موبایل، متن‌باز و ابزارهای هوش مصنوعی راه‌های ساختن رو بیشتر کردن."]
  ], exercise: "چرا زبان‌های سطح بالاتر ساخته شدن؟ چون انسان می‌خواست دستورها رو خواناتر بنویسه، نه فقط به شکل عددهای ماشین." },
  { id: "ai", title: "کدنویسی کنار هوش مصنوعی", teaser: "یک همکار سریع، نه یک جواب همیشه درست.", icon: Sparkles, time: "۴ دقیقه", parts: [
    ["کمک‌هایی که واقعاً مفیدن", "توضیح یک خط کد، پیشنهاد مثال، ساخت تست و کمک به بررسی خطا. درخواستت رو دقیق بنویس: هدف، زبان، ورودی، خروجی و محدودیت‌ها رو مشخص کن."],
    ["یک درخواست خوب", "«من مبتدی‌ام. یک حلقهٔ Python برای جمع عددهای ۱ تا ۵ بنویس، خط‌به‌خط توضیح بده و دو تست پیشنهاد کن. از کتابخانهٔ اضافی استفاده نکن.»"],
    ["قاعدهٔ طلایی: بفهم، اجرا کن، تست کن", "پیشنهاد AI ممکنه غلط یا ناامن باشه. کدی که نمی‌فهمی رو کورکورانه اجرا نکن؛ با ورودی عادی و حالت‌های مرزی تستش کن. رمز، کلید API و اطلاعات خصوصی رو داخل درخواست نذار."],
    ["تمرینِ بدون وابستگی", "اول خودت راه‌حل رو امتحان کن، بعد فقط یک راهنمایی بخواه. در آخر بدون نگاه‌کردن دوباره بنویس. این بخش آموزشی است؛ این نمونه به سرویس AI وصل نیست."]
  ], exercise: "از AI بخواه به‌جای دادن جواب کامل، فقط یک سؤال راهنما بپرسه؛ بعد بررسی کن آیا خودت می‌تونی مسئله رو حل کنی." },
  { id: "careers", title: "از یادگیری تا کار", teaser: "چه نقش‌هایی هست و چطور براشون آماده بشیم؟", icon: BriefcaseBusiness, time: "۴ دقیقه", parts: [
    ["مسیرهای شناخته‌شده", "فرانت‌اند برای رابط کاربری، بک‌اند برای منطق و داده، توسعهٔ موبایل، تست نرم‌افزار و تحلیل داده. عنوان شغل‌ها فرق می‌کنه؛ شرحِ کار مهم‌تر از اسمشه."],
    ["نقش‌های درحال‌گسترش کنار AI", "ساخت اتوماسیون، اتصال مدل‌ها به محصولات و ارزیابی خروجی مدل‌ها از حوزه‌های قابل‌بررسی‌ان. این نقش‌ها معمولاً به برنامه‌نویسی، شناخت مسئله و تست نیاز دارن؛ فقط پرامپت‌نویسی تضمین شغل نیست."],
    ["اولین نمونه‌کار", "یک مسئلهٔ واقعی کوچک حل کن، README بنویس، محدودیت‌ها و تست‌ها رو توضیح بده و تغییرات رو با Git نگه دار. پروژه‌ای که می‌تونی توضیحش بدی از ده پروژهٔ کپی‌شده بهتره."],
    ["واقع‌بینی از همان اول", "درآمد، زمان استخدام و تقاضا به بازار و مهارت بستگی داره. این بخش معرفی مسیرهاست، نه آگهی شغل یا تضمین استخدام."]
  ], exercise: "یک نقش انتخاب کن و سه مهارتِ تکرارشونده در آگهی‌های واقعی همون نقش رو یادداشت کن؛ از همون‌ها برای انتخاب تمرین کمک بگیر." }
];
const tracks = {
  web: {label:"ساخت سایت", tool:"مرورگر + VS Code", project:"یک سایت معرفیِ واکنش‌گرا", stages:[
    ["ساختار و ظاهر","HTML معنایی، CSS، چیدمان و طراحی واکنش‌گرا","یک صفحهٔ معرفی با نسخهٔ موبایل بساز."],
    ["رفتار تعاملی","JavaScript، متغیر، شرط، حلقه، تابع و DOM","یک لیست کار با افزودن و حذف آیتم بساز."],
    ["داده و کیفیت","درخواست API، مدیریت خطا، Git و دسترس‌پذیری","یک برنامهٔ کوچک با دادهٔ نمونه و تست حالت خالی بساز."],
    ["پروژهٔ جمع‌بندی","ساخت، توضیح و انتشار یک سایت کامل کوچک","کدت رو مستند کن و از یک نفر بازخورد بگیر."]
  ]},
  python: {label:"پایتون و اتوماسیون",tool:"Python 3 + ویرایشگر",project:"یک ابزار مرتب‌سازی فایل با حالت پیش‌نمایش",stages:[
    ["پایه‌های پایتون","متغیر، رشته، شرط، حلقه و تابع","یک برنامهٔ محاسبهٔ هزینه‌های نمونه بساز."],
    ["کار با داده و فایل","لیست، دیکشنری، فایل و مدیریت خطا","یک فایل CSV نمونه رو بخون و خلاصه کن."],
    ["اتوماسیون امن","pathlib، محیط مجازی، تست و Git","ابزار مرتب‌سازی فایل بساز؛ قبل از جابه‌جایی، پیش‌نمایش بده."],
    ["پروژهٔ جمع‌بندی","انتخاب یک کار تکراری و خودکارکردن بخش کوچکش","راهنمای اجرا، محدودیت‌ها و تست بنویس."]
  ]},
  data: {label:"داده و هوش مصنوعی",tool:"Python 3 + Jupyter",project:"یک گزارش از یک مجموعه‌دادهٔ عمومی",stages:[
    ["پایتون برای داده","متغیر، حلقه، تابع، لیست و دیکشنری","چند ردیف دادهٔ ساختگی رو خلاصه کن."],
    ["تحلیل داده","pandas، پاک‌سازی، نمودار و SQL مقدماتی","دادهٔ گمشده رو پیدا کن و نمودار خوانا بساز."],
    ["آمار و مدل‌سازی","آمار پایه، تفکیک آموزش و آزمون و ارزیابی","یک مدل ساده بساز و خطاش رو با معیار مناسب بسنج."],
    ["پروژهٔ جمع‌بندی","گزارش قابل‌تکرار، محدودیت داده و توضیح نتیجه","یک گزارش بساز که ادعاهاش به داده قابل‌ردگیری باشن."]
  ]},
  mobile: {label:"ساخت اپ موبایل",tool:"مرورگر و ویرایشگر؛ بعداً ابزار پلتفرم",project:"یک اپ یادداشت کوچک",stages:[
    ["منطق و رابط","JavaScript پایه و اصول رابط واکنش‌گرا","یک فرم یادداشت در مرورگر بساز."],
    ["انتخاب مسیر موبایل","مسیر پیشنهادی: React و سپس React Native","با کامپوننت، state و رویداد تمرین کن."],
    ["اولین اپ","ناوبری، ذخیرهٔ محلی و محدودیت‌های دستگاه","یک اپ یادداشت با چند صفحه بساز."],
    ["تست روی دستگاه","مدیریت خطا، دسترس‌پذیری و آزمون اندازه‌های مختلف","اپ رو روی دستگاه یا شبیه‌ساز تست کن؛ ساخت بومی iOS به macOS نیاز داره."]
  ]},
  game: {label:"ساخت بازی",tool:"Godot + ویرایشگر داخلی",project:"یک بازی دوبعدیِ جمع‌کردن امتیاز",stages:[
    ["منطق بازی","متغیر، شرط، حلقه و تابع با GDScript","حرکت یک شخصیت ساده رو برنامه‌نویسی کن."],
    ["دنیای دوبعدی","صحنه، گره، ورودی و برخورد در Godot","یک مرحلهٔ کوچک با مانع بساز."],
    ["قواعد و بازخورد","امتیاز، باخت، شروع دوباره و صدا","یک چرخهٔ قابل‌بازی با پایان روشن بساز."],
    ["نسخهٔ قابل‌تجربه","تست، رفع باگ و خروجی متناسب با پلتفرم","از یک نفر بخواه بازی کنه و نقاط مبهم رو اصلاح کن."]
  ]}
};
const questions = [
  {key:"track",title:"دوست داری چی بسازی؟",desc:"یک مسیر برای شروع انتخاب کن؛ بعداً می‌تونی عوضش کنی.",options:[["web","سایت و رابط کاربری"],["python","ابزار و اتوماسیون"],["data","داده و هوش مصنوعی"],["mobile","اپ موبایل"],["game","بازی"],["unsure","هنوز نمی‌دونم"]]},
  {key:"why",title:"برای چی می‌خوای یاد بگیری؟",desc:"تمرین‌های نقشهٔ راه رو با هدفت هماهنگ می‌کنیم.",options:[["curious","کنجکاوی و سرگرمی"],["job","آمادگی برای کار"],["idea","ساخت ایدهٔ خودم"],["study","درس و دانشگاه"]]},
  {key:"experience",title:"تا حالا چقدر کد نوشتی؟",desc:"این خودارزیابیه؛ دو سؤال بعدی فقط یک بررسی اولیه‌ان.",options:[["zero","هنوز شروع نکردم"],["little","کمی تمرین کردم"],["project","یک پروژهٔ کوچک ساختم"]]},
  {key:"hours",title:"هفته‌ای چقدر وقت می‌ذاری؟",desc:"زمان‌بندی پیشنهادی است، نه تضمین زمان تسلط.",options:[["2","۲ ساعت"],["5","۵ ساعت"],["8","۸ ساعت"]]},
  {key:"quiz1",title:"یک سؤال خیلی کوچک",desc:"اگر x برابر ۳ باشه و یک واحد بهش اضافه کنیم، مقدار جدیدش چنده؟",options:[["a","۳"],["b","۴"],["c","۳۱"],["unknown","هنوز نمی‌دونم"]]},
  {key:"quiz2",title:"آخرین سؤال: شرط",desc:"اگر امتیاز ۷ باشه و شرط «امتیاز بزرگ‌تر از ۵» رو بررسی کنیم، نتیجه چیه؟",options:[["false","نادرست"],["true","درست"],["unknown","هنوز نمی‌دونم"]]}
];
const motivations={curious:"کشف و سرگرمی",job:"آمادگی برای کار",idea:"ساخت ایدهٔ شخصی",study:"درس و دانشگاه"};

function makePlan(a) {
  const score=Number(a.quiz1==="b")+Number(a.quiz2==="true");
  const level=a.experience==="zero" ? "شروع از صفر" : score===2 ? "آشنایی مقدماتی" : "مرور پایه‌ها";
  const track=a.track==="unsure"?"web":a.track;
  const base=tracks[track];
  const steps=[{title:"آماده‌سازی و اولین اجرا",learn:base.tool,task:"بخش جعبه‌ابزار رو بخون و یک مثال کوچک رو خودت اجرا کن.",hours:2}];
  if(a.experience==="zero" || score<2) steps.push({title:"منطق، قبل از سرعت",learn:"دستور، متغیر، شرط، حلقه و خطایابی",task:"با چند مثال روی کاغذ پیش‌بینی کن کد چه خروجی‌ای می‌ده.",hours:6});
  base.stages.forEach((s,i)=>steps.push({title:s[0],learn:s[1],task:s[2],hours:[10,14,16,18][i]}));
  const extras={job:{title:"نمونه‌کار قابل‌توضیح",learn:"Git، README، تست و توضیح تصمیم‌ها",task:"پروژه رو مرتب کن و شرح یک موقعیت شغلی مرتبط رو با مهارت‌هات مقایسه کن.",hours:8},idea:{title:"اولین نسخهٔ ایدهٔ تو",learn:"تعریف مسئله و محدودکردن دامنه",task:"فقط یک قابلیت از ایده‌ات رو بساز و از یک نفر بازخورد بگیر.",hours:8},curious:{title:"یک آزمایشِ فقط برای خودت",learn:"یک تغییر خلاقانه در پروژه",task:"رنگ، رفتار یا ورودی جدید اضافه کن و نتیجه رو توضیح بده.",hours:4},study:{title:"تمرین و توضیح",learn:"حل مسئله و مرور فاصله‌دار",task:"سه تمرین کوچک حل کن و یکی رو بدون نگاه به جواب توضیح بده.",hours:6}};
  steps.push(extras[a.why]);
  let total=0; const hours=Number(a.hours);
  const scheduled=steps.map(s=>{const start=Math.floor(total/hours)+1;total+=s.hours;return {...s,range:start===Math.ceil(total/hours)?`هفتهٔ ${start}`:`هفتهٔ ${start} تا ${Math.ceil(total/hours)}`}});
  return {score,level,track,base,steps:scheduled,weeks:Math.ceil(total/hours),hours};
}

export default function Academy(){
  const [read,setRead]=useState([]);
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [plan,setPlan]=useState(null);
  const [done,setDone]=useState([]);
  const [notice,setNotice]=useState("");
  const q=questions[step];
  const mark=id=>setRead(r=>r.includes(id)?r.filter(x=>x!==id):[...r,id]);
  const next=()=>{if(!answers[q.key])return;if(step<questions.length-1)setStep(s=>s+1);else{setPlan(makePlan(answers));setDone([]);}};
  const restart=()=>{setPlan(null);setStep(0);setDone([]);setNotice("");};
  const download=()=>{
    const text=`نقشهٔ راه جوانه\nمسیر: ${plan.base.label}\nهدف: ${motivations[answers.why]}\nسطح اولیه: ${plan.level} (بررسی مقدماتی، نه آزمون جامع)\nزمان: هفته‌ای ${plan.hours} ساعت؛ حدود ${plan.weeks} هفته برای این تمرین‌ها\n\n`+plan.steps.map((s,i)=>`${i+1}. ${s.title} | ${s.range}\nیادگیری: ${s.learn}\nتمرین: ${s.task}\n`).join("\n")+"\nاین نقشه با قواعد محلی ساخته شده؛ به سرویس هوش مصنوعی وصل نیست. زمان‌بندی تقریبی است و تضمین شغل یا تسلط نیست.";
    const url=URL.createObjectURL(new Blob(["\ufeff"+text],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="javaneh-roadmap.txt";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice("فایل نقشهٔ راه برای دانلود آماده شد.");
  };
  return <div className="academy">
    <section id="chapters" className="chapter-section">
      <div className="section-intro"><span className="section-kicker"><BookOpen size={17}/> قبل از اولین پروژه</span><h2>اول مسیر رو بشناس.<br/><span>بعد، قدم بردار.</span></h2><p>شش لقمهٔ کوچک برای شروع؛ هر بخش رو باز کن، بخون و یک تمرین انجام بده.</p></div>
      <div className="chapter-progress"><span>{read.length} از ۶ بخش مرور شده</span><Progress value={read.length/6*100} aria-label="پیشرفت مرور بخش‌ها"/><span>با سرعت خودت</span></div>
      <Accordion type="single" collapsible className="chapter-list">
        {chapters.map((c,i)=><AccordionItem key={c.id} value={c.id} className="chapter-item">
          <AccordionTrigger className="chapter-trigger"><span className="chapter-icon"><c.icon size={25}/></span><span className="chapter-heading"><span className="chapter-number">بخش {["۰۱","۰۲","۰۳","۰۴","۰۵","۰۶"][i]} · {c.time}</span><strong>{c.title}</strong><span className="chapter-teaser">{c.teaser}</span></span>{read.includes(c.id)&&<span className="read-tick"><Check size={18}/></span>}</AccordionTrigger>
          <AccordionContent className="chapter-content"><div className="lesson-parts">{c.parts.map(([t,b])=><article key={t}><h3>{t}</h3><p>{b}</p></article>)}</div><div className="tiny-exercise"><Sparkles size={19}/><p><strong>یک قدم عملی</strong>{c.exercise}</p></div><div className="chapter-end"><Button variant="outline" onClick={()=>mark(c.id)}>{read.includes(c.id)? "علامت مرور رو بردار" : "این بخش رو مرور کردم"}<Check/></Button>{c.id==="tools"&&<a href="#playground">رفتن به تمرین زنده <ArrowLeft size={16}/></a>}</div></AccordionContent>
        </AccordionItem>)}
      </Accordion>
    </section>
    <section id="enroll" className="enroll-section">
      <div className="enroll-copy"><span className="section-kicker"><Route size={18}/> ثبت‌نام در مسیر یادگیری</span><h2>یک مسیر آماده؟ نه.<br/><span>مسیرِ خودت.</span></h2><p>بگو چی می‌خوای بسازی، چرا و با چه سرعتی. نقشهٔ راهت از همون‌جا شروع می‌شه.</p><div className="privacy-note"><ShieldCheck size={23}/><span>بدون ایمیل و رمز<br/>این نسخه حساب واقعی نمی‌سازه؛ پاسخ‌ها فقط تا وقتی این صفحه بازه نگه داشته می‌شن.</span></div><div className="enroll-orbit" aria-hidden="true"><div className="orb-center"><Compass size={44}/></div><span className="orb-dot dot-a"/><span className="orb-dot dot-b"/><span className="orb-dot dot-c"/></div></div>
      <div className="onboarding-panel">
        {!plan ? <form onSubmit={e=>{e.preventDefault();next();}} className="onboarding-form">
          <div className="wizard-top"><span>قدم {step+1} از ۶</span><span>{step<4?"شناخت مسیر":"بررسی مقدماتی"}</span></div><Progress value={(step+1)/6*100} aria-label="پیشرفت سؤال‌های مسیر"/>
          <FieldGroup><Field><FieldLabel className="question-title">{q.title}</FieldLabel><FieldDescription className="question-description">{q.desc}</FieldDescription><ToggleGroup type="single" value={answers[q.key]||""} onValueChange={value=>{if(value)setAnswers(a=>({...a,[q.key]:value}));}} className="answer-options" aria-label={q.title}>{q.options.map(([v,l])=><ToggleGroupItem key={v} value={v} className="answer-option">{l}</ToggleGroupItem>)}</ToggleGroup></Field></FieldGroup>
          <div className="wizard-actions"><Button type="submit" disabled={!answers[q.key]}>{step===5?"نقشهٔ من رو بساز":"قدم بعدی"}<ArrowLeft/></Button><Button type="button" variant="ghost" disabled={step===0} onClick={()=>setStep(s=>s-1)}><ArrowRight/>قبلی</Button></div>
          <p className="wizard-note">دو سؤال ساده برای پیشنهاد نقطهٔ شروع؛ نه تعیین سطح جامع.</p>
        </form> : <div className="plan-summary" aria-live="polite"><span className="summary-icon"><Check size={32}/></span><span className="section-kicker">مسیرت آماده‌ست</span><h3>{plan.base.label}</h3><p>{plan.level} · هدف: {motivations[answers.why]}</p><div className="summary-stats"><div><Clock size={19}/><strong>{plan.hours} ساعت</strong><span>در هفته</span></div><div><Route size={19}/><strong>حدود {plan.weeks} هفته</strong><span>برای این برنامهٔ تمرینی</span></div></div><p className="score-note">پاسخ درست: {plan.score} از ۲. {answers.experience==="zero"?"چون تازه شروع می‌کنی، پایه‌ها رو نگه داشتیم.":plan.score===2?"پایه‌ها رو می‌شناسی؛ سرعت پیشروی رو با تمرین واقعی بسنج.":"مرور منطق رو قبل از پروژه پیشنهاد می‌کنیم."}</p><a className="plan-link" href="#roadmap">دیدن نقشهٔ راه <ArrowLeft size={19}/></a><Button variant="ghost" onClick={restart}><RotateCcw/>ویرایش پاسخ‌ها</Button></div>}
      </div>
    </section>
    {plan&&<section id="roadmap" className="roadmap-section">
      <div className="roadmap-heading"><div><span className="section-kicker"><Compass size={18}/> نقشهٔ راه شخصی تو</span><h2>از اینجا، تا اولین ساخته‌ات.</h2><p>{answers.track==="unsure"?"برای کشف علاقه، وب رو پیشنهاد دادیم؛ می‌تونی با ویرایش پاسخ‌ها مسیر رو عوض کنی.":`پروژهٔ پیشنهادی: ${plan.base.project}`}</p></div><Button variant="outline" onClick={download}><Download/>دانلود نقشه</Button></div>
      <div className="roadmap-disclaimer">پیشنهاد بر اساس پاسخ‌های تو و قواعد همین سایت ساخته شده، نه AI آنلاین. هفته‌ها تقریبی‌اند؛ ملاک عبور از هر مرحله، انجام تمرینه، نه فقط گذشت زمان.</div>
      <div className="roadmap-progress"><span>{done.length} از {plan.steps.length} مرحله انجام شده</span><Progress value={done.length/plan.steps.length*100} aria-label="پیشرفت نقشهٔ راه"/></div>
      <ol className="roadmap-list">{plan.steps.map((s,i)=><li key={s.title} className={done.includes(i)?"road-step completed":"road-step"}><span className="step-marker">{done.includes(i)?<Check size={20}/>:String(i+1).padStart(2,"0")}</span><div className="step-body"><span className="step-week">{s.range} · حدود {s.hours} ساعت تمرین</span><h3>{s.title}</h3><p>{s.learn}</p><div className="step-task"><Terminal size={18}/>{s.task}</div></div><Button variant="outline" aria-pressed={done.includes(i)} onClick={()=>setDone(d=>d.includes(i)?d.filter(x=>x!==i):[...d,i])}>{done.includes(i)?"انجام شد":"انجام دادم"}<Check/></Button></li>)}</ol>
      <div className="roadmap-bottom"><Sparkles size={20}/><p>{done.length===plan.steps.length?"همهٔ مرحله‌ها رو انجام دادی! حالا پروژه‌ات رو بدون کمک توضیح بده و یک قابلیت تازه اضافه کن.":"کنار هر مرحله از AI برای توضیح و تست کمک بگیر؛ جواب رو بفهم، بعد اجرا کن."}</p></div><p className="download-notice" role="status">{notice}</p>
    </section>}
  </div>;
}
