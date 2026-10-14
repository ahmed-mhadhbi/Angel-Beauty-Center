import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  ArrowUpLeft,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  X,
  Menu,
  Sparkles,
  Leaf,
  Clock3,
  Gift,
  CalendarDays,
  Copy,
  Printer,
  CheckCheck,
  Play,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpRight,
  LayoutDashboard,
  MessageCircle,
  Info,
  Send,
  ChevronDown,
} from "lucide-react";
import { angel, money } from "./config/angel";
import {
  readRequests,
  saveRequests,
  seedRequests,
  statusLabels,
  validPhone,
  normalizePhone,
  localDate,
  formatDate,
} from "./lib/demo";
import type { BookingRequest, RequestStatus } from "./lib/demo";

type Selection = { packageId: string; addons: string[] };
const getPackage = (id: string) =>
  angel.packages.find((p) => p.id === id) || angel.packages[0];
const getAddons = (s: Selection) =>
  angel.addons.filter(
    (a) => s.addons.includes(a.id) && !a.includedIn.includes(s.packageId),
  );
const totalFor = (s: Selection) =>
  getPackage(s.packageId).price + getAddons(s).reduce((n, a) => n + a.price, 0);
const durationFor = (s: Selection) =>
  getPackage(s.packageId).minutes +
  getAddons(s).reduce((n, a) => n + a.minutes, 0);
const presentationStops = [
  {
    id: "home",
    title: "الانطباع الأول",
    text: "ابدئي من إحساس المكان: تجربة خاصة تستحق وقتها.",
  },
  {
    id: "sanctuary",
    title: "حكاية الجناح الخاص",
    text: "ميزة الجناح الخاص تتحوّل لتجربة واضحة ومميزة.",
  },
  {
    id: "packages",
    title: "اختيار التجربة",
    text: "قارني بين الباقات واختاري تجربة Angel VIP.",
  },
  {
    id: "enhancements",
    title: "تفاصيل ترفع قيمة الحجز",
    text: "أضيفي وقت استرخاء وشوفي الإجمالي بيتغيّر فورًا.",
  },
  {
    id: "booking",
    title: "طلب حجز منظم",
    text: "افتحي الحجز، اختاري الموعد، وكمّلي الطلب التجريبي.",
  },
  {
    id: "gifts",
    title: "الهدية كتجربة جديدة",
    text: "صمّمي هدية شخصية وشوفي معاينتها القابلة للطباعة.",
  },
  {
    id: "owner",
    title: "القيمة لصاحبة المركز",
    text: "راجعي الطلب الجديد وجرّبي سيناريو الإيرادات.",
  },
];

function Mark({ small = false }: { small?: boolean }) {
  return (
    <a
      href="/"
      className={`brand ${small ? "small" : ""}`}
      aria-label="Angel الرئيسية"
    >
      {angel.logo ? (
        <img src={angel.logo} alt={angel.name} />
      ) : (
        <>
          <span className="brand-flower">✧</span>
          <span className="brand-word">
            angel<span className="brand-sub">BEAUTY CENTER & SPA</span>
          </span>
        </>
      )}
    </a>
  );
}
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
function StoryPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  return (
    <div ref={ref} className="arch-image">
      <div className="arch-photo-frame">
        <motion.img
          src={angel.images.hammam}
          style={{ y: reduced ? 0 : y, scale: reduced ? 1 : 1.08 }}
          loading="lazy"
          alt="تصوّر للجناح الخاص بأقواس مغربية وإضاءة دافئة"
        />
      </div>
      <span className="image-caption">
        تصوّر بصري · قابل للاستبدال بصور المركز
      </span>
      <div className="image-seal" dir="ltr">
        YOUR OWN
        <br />
        <i>little sanctuary</i>
      </div>
    </div>
  );
}
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow">
      <span />
      {children}
    </div>
  );
}
function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      d?.close();
      document.body.style.overflow = old;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "wide" : ""}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="modal-inner">
        <div className="modal-top">
          <span className="eyebrow">ANGEL · PRIVATE EXPERIENCE</span>
          <button className="icon-button" onClick={onClose} aria-label="إغلاق">
            <X size={22} />
          </button>
        </div>
        <h2>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}

function App() {
  const reduced = useReducedMotion();
  const owner = window.location.pathname.replace(/\/$/, "") === "/owner-demo";
  const [selection, setSelection] = useState<Selection>({
    packageId: "relax",
    addons: [],
  });
  const [booking, setBooking] = useState(false),
    [gift, setGift] = useState(false),
    [menu, setMenu] = useState(false);
  const [present, setPresent] = useState(
    new URLSearchParams(location.search).has("present"),
  );
  const [presentStep, setPresentStep] = useState(owner ? 6 : 0);
  const [reset, setReset] = useState(false),
    [toast, setToast] = useState("");
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    if (!menu) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [menu]);
  function selectPackage(id: string) {
    setSelection((s) => ({
      packageId: id,
      addons: s.addons.filter(
        (a) => !angel.addons.find((x) => x.id === a)?.includedIn.includes(id),
      ),
    }));
  }
  function toggleAddon(id: string) {
    setSelection((s) => ({
      ...s,
      addons: s.addons.includes(id)
        ? s.addons.filter((x) => x !== id)
        : [...s.addons, id],
    }));
  }
  function goPresent(index: number) {
    if (index === 6 && !owner) {
      location.href = "/owner-demo?present=1";
      return;
    }
    if (owner && index < 6) {
      location.href = "/?present=1#" + presentationStops[index].id;
      return;
    }
    setPresentStep(index);
    document
      .getElementById(presentationStops[index].id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  useEffect(() => {
    if (!owner && present && location.hash) {
      const index = presentationStops.findIndex(
        (x) => "#" + x.id === location.hash,
      );
      if (index >= 0) setPresentStep(index);
    }
  }, [owner, present]);
  function resetDemo() {
    try {
      saveRequests(seedRequests());
      localStorage.removeItem("angel-reminders-v1");
      setSelection({ packageId: "relax", addons: [] });
      setReset(false);
      setToast("تمت إعادة ضبط العرض التجريبي");
      window.dispatchEvent(new Event("angel-reset"));
      if (present) goPresent(0);
    } catch {
      setToast("تعذّر الحفظ في المتصفح. اسمحي بالتخزين المحلي وجربي تاني.");
    }
  }
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        تخطي للقسم الرئيسي
      </a>
      {owner ? (
        <Owner
          onPresent={() => {
            setPresent(true);
            setPresentStep(6);
          }}
          onReset={() => setReset(true)}
          notify={setToast}
        />
      ) : (
        <>
          <header className="header">
            <div className="nav-shell">
              <Mark />
              <nav
                aria-label="التنقل الرئيسي"
                className={menu ? "nav-links open" : "nav-links"}
              >
                {[
                  ["الرئيسية", "home"],
                  ["الجناح الخاص", "sanctuary"],
                  ["الباقات", "packages"],
                  ["بطاقات الهدايا", "gifts"],
                ].map(([label, id]) => (
                  <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
                    {label}
                  </a>
                ))}
                <button
                  className="mobile-nav-book"
                  onClick={() => {
                    setMenu(false);
                    setBooking(true);
                  }}
                >
                  الحجز
                </button>
              </nav>
              <button className="nav-book" onClick={() => setBooking(true)}>
                احجزي لحظتك <ArrowUpLeft size={17} />
              </button>
              <button
                className="menu-button icon-button"
                onClick={() => setMenu(!menu)}
                aria-expanded={menu}
                aria-label={menu ? "إغلاق القائمة" : "فتح القائمة"}
              >
                {menu ? <X /> : <Menu />}
              </button>
            </div>
          </header>
          <main id="main">
            <section id="home" className="hero">
              <img
                className="hero-image"
                src={angel.images.hammam}
                alt="تصوّر معماري لحمام مغربي بحجر دافئ وأقواس هادئة"
                fetchPriority="high"
              />
              <div className="hero-shade" />
              <div className="hero-inner">
                <motion.div
                  className="hero-copy"
                  initial={reduced ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                >
                  <Eyebrow>PRIVATE SPA EXPERIENCE</Eyebrow>
                  <p className="hero-location">
                    ANGEL BEAUTY CENTER & SPA · MAADI, CAIRO
                  </p>
                  <h1>
                    العالم يستنى.
                    <br />
                    اللحظة دي <em>ليكي.</em>
                  </h1>
                  <p className="hero-description">
                    سيبي دوشة اليوم برّه… وادخلي عالم من الهدوء.
                    <br />
                    طقوس مغربية، تفاصيل دافئة، ومساحة تستمتعي فيها بوقتك.
                  </p>
                  <div className="hero-actions">
                    <a className="button light" href="#sanctuary">
                      اكتشفي التجربة <ArrowUpLeft size={19} />
                    </a>
                    <button
                      className="text-button"
                      onClick={() => setBooking(true)}
                    >
                      احجزي تجربتك <ArrowLeft size={18} />
                    </button>
                  </div>
                  <div className="hero-footnote">
                    <span className="tiny-star">✧</span> رفاهية هادية. وتفاصيل
                    على ذوقك.
                  </div>
                </motion.div>
                <div className="hero-side" lang="en" dir="ltr">
                  A LITTLE ESCAPE. ALL YOURS.
                </div>
              </div>
              <div className="hero-bottom">
                <a href="#sanctuary">
                  <span className="scroll-line" />
                  كمّلي الحكاية <ChevronDown size={15} />
                </a>
                <span className="image-caption">{angel.imageDisclaimer}</span>
                <span dir="ltr">01 — 07</span>
              </div>
            </section>
            <div className="intro-strip">
              <span>مساحتك الخاصة</span>
              <span className="strip-star">✧</span>
              <span>طقوس مغربية</span>
              <span className="strip-star">✧</span>
              <span>تفاصيل على ذوقك</span>
              <span className="strip-star">✧</span>
              <span>وقت يستاهل</span>
            </div>
            <section id="sanctuary" className="sanctuary section-wrap">
              <Reveal className="story-heading">
                <Eyebrow>THE PRIVATE SANCTUARY</Eyebrow>
                <h2>
                  بعيد عن الزحمة…
                  <br />
                  أقرب <em>لنفسك.</em>
                </h2>
                <p>
                  في الجناح الخاص، الحكاية بتبدأ بالهدوء.
                  <br />
                  من أول خطوة، لآخر لحظة استرخاء… كل تفصيلة ليها إحساس.
                </p>
              </Reveal>
              <div className="story-layout">
                <StoryPhoto />
                <div className="story-scenes">
                  {[
                    [
                      "01",
                      "خطوة لعالم أهدى",
                      "بعيد عن دوشة اليوم، مساحة خاصة تاخدي فيها نفسك وتسيبي الاستعجال برّه.",
                    ],
                    [
                      "02",
                      "طقوس ليها إحساس",
                      "دفا الحمام المغربي، ورائحة الصابون، ولمسة عناية بتفاصيل بسيطة ومدروسة.",
                    ],
                    [
                      "03",
                      "استراحة من غير استعجال",
                      "بعد الطقوس، لحظة هدوء في أجواء خاصة تكمّل إحساس الراحة.",
                    ],
                    [
                      "04",
                      "على مزاجك إنتِ",
                      "اختاري التجربة، وزوّدي التفاصيل اللي بتحبيها. يومك يبدأ باختيارك.",
                    ],
                  ].map(([n, title, body]) => (
                    <Reveal key={n} className="story-scene">
                      <span className="scene-number">{n}</span>
                      <div>
                        <h3>{title}</h3>
                        <p>{body}</p>
                      </div>
                    </Reveal>
                  ))}
                  <a className="underlined-link" href="#packages">
                    صمّمي لحظتك الخاصة <ArrowUpLeft size={18} />
                  </a>
                </div>
              </div>
            </section>
            <section id="packages" className="packages-section">
              <div className="section-wrap">
                <Reveal className="section-heading">
                  <div>
                    <Eyebrow>CURATED FOR YOUR SLOW MOMENTS</Eyebrow>
                    <h2>
                      لكل مزاج… <em>تجربة.</em>
                    </h2>
                  </div>
                  <p>
                    ابدئي باللي يناسبك، وكمّلي بالتفاصيل اللي بتحبيها.
                    <br />
                    <span className="subtle">
                      باقات وأسعار توضيحية، في انتظار اعتماد المركز.
                    </span>
                  </p>
                </Reveal>
                <div className="package-grid">
                  {angel.packages.map((p, i) => (
                    <Reveal
                      delay={i * 0.08}
                      key={p.id}
                      className={`package-card ${selection.packageId === p.id ? "selected" : ""} ${!p.enabled ? "unavailable" : ""}`}
                    >
                      <div className="package-top">
                        <span dir="ltr">0{i + 1}</span>
                        {p.id === "vip" ? (
                          <span className="package-tag">
                            التجربة المتكاملة <Sparkles size={12} />
                          </span>
                        ) : !p.enabled ? (
                          <span className="package-tag">مقترح قيد التأكيد</span>
                        ) : (
                          <Leaf size={17} />
                        )}
                      </div>
                      <span className="package-english">{p.english}</span>
                      <h3>{p.name}</h3>
                      <p className="package-desc">{p.description}</p>
                      <span className="duration">
                        <Clock3 size={14} />
                        {money(p.minutes)} دقيقة تقريبًا
                      </span>
                      <div className="package-price">
                        <strong>{money(p.price)}</strong>
                        <span>
                          ج.م <small>تقدير تجريبي</small>
                        </span>
                      </div>
                      <ul>
                        {p.includes.map((text) => (
                          <li key={text}>
                            <Check size={14} />
                            {text}
                          </li>
                        ))}
                      </ul>
                      <button
                        disabled={!p.enabled}
                        className={`button ${selection.packageId === p.id ? "olive" : "outline"}`}
                        onClick={() => selectPackage(p.id)}
                      >
                        {!p.enabled
                          ? "بعد تأكيد المركز"
                          : selection.packageId === p.id
                            ? "تجربتك المختارة"
                            : "اختاري التجربة"}
                        {selection.packageId === p.id ? (
                          <Check size={16} />
                        ) : (
                          <ArrowUpLeft size={16} />
                        )}
                      </button>
                    </Reveal>
                  ))}
                </div>
                <div id="enhancements" className="enhancements">
                  <div className="addon-title">
                    <Eyebrow>MAKE IT YOURS</Eyebrow>
                    <h3>
                      تفاصيل صغيرة.
                      <br />
                      <em>إحساس أكبر.</em>
                    </h3>
                    <p>
                      كمّلي تجربتك بلمسة على ذوقك.
                      <br />
                      كل الإضافات هنا مقترحات توضيحية.
                    </p>
                  </div>
                  <div className="addon-grid">
                    {angel.addons.map((a) => {
                      const included = a.includedIn.includes(
                        selection.packageId,
                      );
                      const checked = selection.addons.includes(a.id);
                      return (
                        <button
                          className={`addon ${checked ? "active" : ""}`}
                          key={a.id}
                          disabled={included}
                          aria-pressed={checked || included}
                          onClick={() => toggleAddon(a.id)}
                        >
                          <span className="addon-icon">
                            {a.id === "massage" ? (
                              <Sparkles size={19} />
                            ) : a.id === "lounge" ? (
                              <Clock3 size={19} />
                            ) : (
                              <Leaf size={19} />
                            )}
                          </span>
                          <span>
                            <strong>{a.name}</strong>
                            <small>{a.description}</small>
                          </span>
                          <span className="addon-end">
                            <span>
                              {included
                                ? "ضمن الباقة"
                                : `+ ${money(a.price)} ج.م`}
                            </span>
                            <span className="check-box">
                              {checked || included ? (
                                <Check size={12} />
                              ) : (
                                <Plus size={12} />
                              )}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div id="booking" className="selection-summary">
                  <div>
                    <span className="summary-label">لحظتك بتفاصيلك</span>
                    <h3>{getPackage(selection.packageId).name}</h3>
                    <span>
                      {money(durationFor(selection))} دقيقة تقريبًا{" "}
                      {getAddons(selection).length > 0 &&
                        `· ${money(getAddons(selection).length)} إضافات`}
                    </span>
                  </div>
                  <div className="summary-cost">
                    <span>الإجمالي التقديري</span>
                    <strong>
                      {money(totalFor(selection))} <small>ج.م</small>
                    </strong>
                  </div>
                  <button
                    className="button olive"
                    onClick={() => setBooking(true)}
                  >
                    كمّلي لطلب الحجز <ArrowLeft size={18} />
                  </button>
                </div>
                <p className="demo-note">
                  <Info size={14} /> الأسعار والخدمات للتوضيح فقط، وليست قائمة
                  أسعار رسمية. التوفر والتفاصيل تتأكد مع فريق Angel.
                </p>
              </div>
            </section>
            <section className="interlude">
              <img
                src={angel.images.detail}
                alt="تصوّر لتفاصيل طقوس الحمام المغربي والصابون الطبيعي والمناشف"
                loading="lazy"
              />
              <div className="interlude-shade" />
              <Reveal className="interlude-copy">
                <Eyebrow>THE ART OF DOING NOTHING</Eyebrow>
                <h2>
                  مش كل لحظة
                  <br />
                  لازم تعملي فيها حاجة.
                  <br />
                  <em>ممكن بس… تستمتعي.</em>
                </h2>
                <p>وقت ليكي، من غير قائمة مهام.</p>
              </Reveal>
              <span className="image-caption">{angel.imageDisclaimer}</span>
            </section>
            <section id="gifts" className="gifts-section section-wrap">
              <Reveal className="gift-art">
                <div className="gift-envelope" />
                <div className="gift-card-art">
                  <span className="gift-mini">ANGEL · A GIFT OF STILLNESS</span>
                  <div className="gift-art-star">✧</div>
                  <span className="gift-art-title">
                    a moment
                    <br />
                    <i>just for you.</i>
                  </span>
                  <span className="gift-art-line" />
                  <span>هدية من القلب… لوقت يستاهل</span>
                  <small>DEMO · نموذج غير قابل للاستبدال</small>
                </div>
                <span className="gift-caption" dir="ltr">
                  SOME GIFTS ARE FELT, NOT HELD.
                </span>
              </Reveal>
              <Reveal className="gift-copy">
                <Eyebrow>A BEAUTIFUL WAY TO SAY YOU CARE</Eyebrow>
                <h2>
                  في هدايا بتتفتح.
                  <br />
                  وفي هدايا <em>بتتحس.</em>
                </h2>
                <p>
                  لصاحبتك، لأختك، أو لحد غالي عليكي.
                  <br />
                  اهديها وقت لنفسها، ورسالة منك تخلي اللحظة أحنّ.
                </p>
                <button className="button olive" onClick={() => setGift(true)}>
                  صمّمي هديتك <Gift size={18} />
                </button>
                <span className="gift-note">
                  معاينة بطاقة تجريبية · بدون شراء أو دفع
                </span>
              </Reveal>
            </section>
            <section className="closing">
              <Eyebrow>YOUR NEXT SLOW MOMENT</Eyebrow>
              <h2>
                خدي وقتك.
                <br />
                <em>إحنا هنا عشانك.</em>
              </h2>
              <button className="button light" onClick={() => setBooking(true)}>
                ابدئي تجربتك <ArrowUpLeft size={19} />
              </button>
              <span>
                المعادي، القاهرة · تفاصيل المكان والتواصل تُضاف بعد اعتماد
                المركز
              </span>
            </section>
          </main>
          <footer className="footer">
            <Mark small />
            <p>رفاهية تستحقيها، ووقت على مزاجك.</p>
            <div>
              <button
                onClick={() => {
                  setPresent(true);
                  goPresent(0);
                }}
              >
                <Play size={13} /> وضع العرض
              </button>
              <a href="/owner-demo">
                مساحة الإدارة <ArrowUpLeft size={13} />
              </a>
            </div>
            <small>عرض تفاعلي توضيحي · ليس خدمة حجز فعلية</small>
          </footer>
          <button
            className="mobile-sticky button olive"
            onClick={() => setBooking(true)}
          >
            احجزي لحظتك <span>{money(totalFor(selection))} ج.م تقديريًا</span>
            <ArrowUpLeft size={17} />
          </button>
        </>
      )}
      {booking && (
        <Booking
          selection={selection}
          setSelection={setSelection}
          onClose={() => setBooking(false)}
        />
      )}
      {gift && <GiftBuilder onClose={() => setGift(false)} notify={setToast} />}
      {present && (
        <aside className="present-bar" aria-label="وضع العرض">
          <div className="present-title">
            <Play size={15} />
            <span>
              وضع العرض <small>{presentStep + 1} / 7</small>
            </span>
          </div>
          <div className="present-description">
            <strong>{presentationStops[presentStep].title}</strong>
            <span>{presentationStops[presentStep].text}</span>
          </div>
          <div className="present-controls">
            <button
              className="icon-button"
              disabled={presentStep === 0}
              onClick={() => goPresent(presentStep - 1)}
              aria-label="المشهد السابق"
            >
              <ArrowRight size={18} />
            </button>
            {presentStep === 6 ? (
              <button
                className="button light compact"
                onClick={() => setReset(true)}
              >
                إعادة العرض <RotateCcw size={14} />
              </button>
            ) : (
              <button
                className="button light compact"
                onClick={() => goPresent(presentStep + 1)}
              >
                التالي <ArrowLeft size={15} />
              </button>
            )}
            <button
              className="icon-button"
              onClick={() => setReset(true)}
              aria-label="إعادة ضبط العرض"
            >
              <RotateCcw size={15} />
            </button>
            <button
              className="icon-button"
              onClick={() => {
                setPresent(false);
                history.replaceState(
                  null,
                  "",
                  location.pathname + location.hash,
                );
              }}
              aria-label="إنهاء وضع العرض"
            >
              <X size={18} />
            </button>
          </div>
        </aside>
      )}
      {reset && (
        <Modal title="نبدأ العرض من جديد؟" onClose={() => setReset(false)}>
          <p>
            هيتم مسح الطلبات اللي اتعملت على المتصفح ده، وإرجاع الطلبات والقوالب
            التوضيحية للبداية.
          </p>
          <div className="modal-actions">
            <button className="button olive" onClick={resetDemo}>
              إعادة ضبط العرض <RotateCcw size={16} />
            </button>
            <button className="button outline" onClick={() => setReset(false)}>
              رجوع
            </button>
          </div>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
    </MotionConfig>
  );
}

function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  const today = new Date();
  const [month, setMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const first = (month.getDay() + 1) % 7;
  const count = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const isCurrent =
    month.getFullYear() === today.getFullYear() &&
    month.getMonth() === today.getMonth();
  function move(n: number) {
    setMonth((d) => new Date(d.getFullYear(), d.getMonth() + n, 1));
  }
  return (
    <div className="calendar">
      <div className="calendar-top">
        <button
          className="icon-button"
          disabled={isCurrent}
          onClick={() => move(-1)}
          aria-label="الشهر السابق"
        >
          <ChevronRight size={20} />
        </button>
        <strong>
          {month.toLocaleDateString("ar-EG", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <button
          className="icon-button"
          onClick={() => move(1)}
          aria-label="الشهر التالي"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      <div className="calendar-grid">
        {["س", "ح", "ن", "ث", "ر", "خ", "ج"].map((d, i) => (
          <span className="weekday" key={i}>
            {d}
          </span>
        ))}
        {Array.from({ length: first }, (_, i) => (
          <span key={"blank" + i} />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const date = localDate(
            new Date(month.getFullYear(), month.getMonth(), i + 1),
          );
          return (
            <button
              key={date}
              disabled={date < localDate()}
              className={value === date ? "chosen" : ""}
              aria-pressed={value === date}
              aria-label={formatDate(date)}
              onClick={() => onChange(date)}
            >
              {money(i + 1)}
            </button>
          );
        })}
      </div>
      <p className="field-hint">
        اختيار اليوم تفضيل للطلب، وليس تأكيدًا لتوفره.
      </p>
    </div>
  );
}

function Booking({
  selection,
  setSelection,
  onClose,
}: {
  selection: Selection;
  setSelection: (s: Selection) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0),
    [date, setDate] = useState(""),
    [time, setTime] = useState(""),
    [name, setName] = useState(""),
    [phone, setPhone] = useState(""),
    [note, setNote] = useState(""),
    [error, setError] = useState(""),
    [copied, setCopied] = useState(false);
  const requestId = useRef(crypto.randomUUID());
  const heading = useRef<HTMLHeadingElement>(null);
  const total = totalFor(selection),
    deposit = Math.round(total * angel.depositRate);
  const steps = ["التجربة", "اليوم", "الوقت", "بياناتك", "المراجعة", "الطلب"];
  const message = `طلب حجز تجريبي — ${angel.name}\nالاسم: ${name.trim()}\nالهاتف: ${normalizePhone(phone)}\nالتجربة: ${getPackage(selection.packageId).name}\nالإضافات: ${
    getAddons(selection)
      .map((a) => a.name)
      .join("، ") || "بدون إضافات"
  }\nاليوم المطلوب: ${date ? formatDate(date) : ""}\nالوقت المفضل: ${time}\nالقيمة التقديرية: ${money(total)} ج.م (أسعار توضيحية غير رسمية)\nملاحظات: ${note.trim() || "لا يوجد"}\nهذا طلب تجريبي، وليس حجزًا مؤكدًا. يرجى مراجعة التوفر والسعر مع المركز.`;
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  function next() {
    setError("");
    if (step === 1 && (!date || date < localDate())) {
      setError("اختاري يومًا من النهارده أو بعده.");
      return;
    }
    if (step === 2 && !time) {
      setError("اختاري الوقت اللي يناسبك.");
      return;
    }
    if (step === 3) {
      if (name.trim().length < 2) {
        setError("اكتبي اسمك الأول، حرفين على الأقل.");
        return;
      }
      if (!validPhone(phone)) {
        setError("اكتبي رقم موبايل مصري صحيح، زي 01012345678.");
        return;
      }
    }
    setStep((s) => s + 1);
  }
  function submit() {
    if (!date || date < localDate()) {
      setError("اليوم المختار فات. ارجعي واختاري يوم جديد.");
      return;
    }
    const r: BookingRequest = {
      id: requestId.current,
      name: name.trim(),
      phone: normalizePhone(phone),
      note: note.trim(),
      ...selection,
      addons: getAddons(selection).map((a) => a.id),
      date,
      time,
      total,
      status: "pending",
      source: "visitor",
    };
    try {
      const old = readRequests();
      saveRequests([...old.filter((x) => x.id !== r.id), r]);
      setError("");
      setStep(5);
    } catch {
      setError(
        "المتصفح منع التخزين المحلي. اسمحي بالتخزين لحفظ الطلب التجريبي.",
      );
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setError("النسخ التلقائي مش متاح هنا. حددي الرسالة وانسخيها يدويًا.");
    }
  }
  return (
    <Modal
      title={step === 5 ? "طلبك جاهز للمراجعة" : "تجربتك الخاصة تبدأ هنا"}
      onClose={onClose}
      wide
    >
      <p className="modal-intro">
        تجربة حجز توضيحية. لا يتم حجز موعد فعلي أو تحصيل أي مبلغ.
      </p>
      <ol className="stepper">
        {steps.map((s, i) => (
          <li
            key={s}
            className={i === step ? "current" : i < step ? "done" : ""}
          >
            <span>{i < step ? <Check size={12} /> : money(i + 1)}</span>
            <small>{s}</small>
          </li>
        ))}
      </ol>
      <h3 ref={heading} tabIndex={-1} className="step-title">
        {
          [
            "اختاري بداية يومك",
            "أنهي يوم يناسبك؟",
            "الوقت على راحتك",
            "نتواصل معاكي إزاي؟",
            "كل تفاصيل لحظتك",
            "الخطوة الجاية مع فريق Angel",
          ][step]
        }
      </h3>
      {step === 0 && (
        <div className="booking-package-list">
          {angel.packages
            .filter((p) => p.enabled)
            .map((p) => (
              <button
                key={p.id}
                className={selection.packageId === p.id ? "active" : ""}
                onClick={() =>
                  setSelection({
                    packageId: p.id,
                    addons: selection.addons.filter(
                      (id) =>
                        !angel.addons
                          .find((a) => a.id === id)
                          ?.includedIn.includes(p.id),
                    ),
                  })
                }
              >
                <span className="radio-dot" />
                <span>
                  <strong>{p.name}</strong>
                  <small>
                    {money(p.minutes)} دقيقة · {p.includes.length} تفاصيل عناية
                  </small>
                </span>
                <span>{money(p.price)} ج.م</span>
              </button>
            ))}
          <p className="field-hint">
            الإضافات المختارة:{" "}
            {getAddons(selection)
              .map((a) => a.name)
              .join("، ") || "بدون إضافات"}
            . لتعديلها، ارجعي لقسم التفاصيل في الصفحة.
          </p>
        </div>
      )}
      {step === 1 && <DatePicker value={date} onChange={setDate} />}
      {step === 2 && (
        <>
          <p>دي أوقات مفضلة للطلب، والتوفر بيتأكد مع المركز.</p>
          <div className="time-grid">
            {angel.preferredTimes.map((t) => (
              <button
                className={t === time ? "active" : ""}
                aria-pressed={t === time}
                key={t}
                onClick={() => setTime(t)}
              >
                <Clock3 size={16} />
                {t}
              </button>
            ))}
          </div>
        </>
      )}
      {step === 3 && (
        <div className="form-grid">
          <label>
            الاسم الأول
            <input
              autoComplete="given-name"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك الجميل"
              required
              aria-invalid={!!error && name.trim().length < 2}
            />
          </label>
          <label>
            رقم الموبايل
            <input
              dir="ltr"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              maxLength={20}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              required
              aria-invalid={!!error && !validPhone(phone)}
            />
          </label>
          <label className="full">
            حابة تضيفي حاجة؟ <small>(اختياري)</small>
            <textarea
              value={note}
              maxLength={500}
              onChange={(e) => setNote(e.target.value)}
              placeholder="أي تفاصيل تحبي نعرفها قبل ما نتواصل معاكي"
              rows={3}
            />
          </label>
          <p className="field-hint full">
            البيانات محفوظة على المتصفح ده فقط لأغراض العرض. استخدمي بيانات
            تجريبية، وتقدري تمسحيها من «إعادة ضبط العرض».
          </p>
        </div>
      )}
      {step === 4 && (
        <>
          <div className="booking-review">
            <div>
              <span>التجربة</span>
              <strong>{getPackage(selection.packageId).name}</strong>
              <small>
                {getAddons(selection)
                  .map((a) => a.name)
                  .join(" + ") || "بدون إضافات"}
              </small>
            </div>
            <div>
              <span>الموعد المطلوب</span>
              <strong>{formatDate(date)}</strong>
              <small>{time}</small>
            </div>
            <div>
              <span>بيانات التواصل</span>
              <strong>{name}</strong>
              <small dir="ltr">{phone}</small>
            </div>
            {note && (
              <div>
                <span>ملاحظاتك</span>
                <p>{note}</p>
              </div>
            )}
          </div>
          <div className="deposit-preview">
            <div className="deposit-heading">
              <span>
                <SlidersHorizontal size={17} /> تصوّر العربون
              </span>
              <small>محاكاة فقط · لا يوجد دفع</small>
            </div>
            <div className="deposit-numbers">
              <div>
                <span>قيمة التجربة</span>
                <strong>{money(total)} ج.م</strong>
              </div>
              <div>
                <span>عربون مقترح {money(angel.depositRate * 100)}٪</span>
                <strong>{money(deposit)} ج.م</strong>
              </div>
              <div>
                <span>المتبقي</span>
                <strong>{money(total - deposit)} ج.م</strong>
              </div>
            </div>
            <p>
              في النسخة الفعلية، يمكن ربط بوابة دفع معتمدة بعد موافقة المركز
              وتحديد سياسة التأكيد والإلغاء. لا يتم تحصيل أي مبلغ هنا.
            </p>
          </div>
        </>
      )}
      {step === 5 && (
        <>
          <div className="request-success">
            <CheckCheck size={25} />
            <div>
              <strong>اتحفظ طلب تجريبي على المتصفح ده</strong>
              <p>
                تقدري تشوفيه في مساحة الإدارة. مفيش طلب اتبعت أو موعد اتحجز
                فعليًا.
              </p>
            </div>
          </div>
          <label className="message-label">
            معاينة رسالة طلب الحجز
            <textarea
              className="message-preview"
              readOnly
              value={message}
              rows={10}
              aria-label="رسالة طلب الحجز"
            />
          </label>
          <div className="modal-actions">
            <button className="button olive" onClick={copy}>
              {copied ? "تم نسخ الطلب" : "نسخ طلب الحجز"}
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            {/^\d{10,15}$/.test(angel.whatsapp) ? (
              <a
                className="button outline"
                target="_blank"
                rel="noreferrer"
                href={`https://wa.me/${angel.whatsapp}?text=${encodeURIComponent(message)}`}
              >
                فتح واتساب <MessageCircle size={16} />
              </a>
            ) : (
              <span className="field-hint">
                رقم واتساب المركز لسه مش معتمد؛ تقدري تنسخي الرسالة فقط.
              </span>
            )}
          </div>
          <a className="underlined-link" href="/owner-demo">
            شوفي الطلب في مساحة الإدارة <ArrowUpLeft size={16} />
          </a>
        </>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {step < 5 && (
        <div className="booking-bottom">
          <span>
            تقدير توضيحي <strong>{money(total)} ج.م</strong>
          </span>
          <div>
            {step > 0 && (
              <button
                className="text-button dark"
                onClick={() => {
                  setStep((s) => s - 1);
                  setError("");
                }}
              >
                رجوع
              </button>
            )}
            <button
              className="button olive"
              onClick={step === 4 ? submit : next}
            >
              {step === 4 ? "حفظ الطلب التجريبي" : "كمّلي"}
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function GiftBuilder({
  onClose,
  notify,
}: {
  onClose: () => void;
  notify: (s: string) => void;
}) {
  const [packageId, setPackageId] = useState("relax"),
    [recipient, setRecipient] = useState(""),
    [message, setMessage] = useState(
      "هدية صغيرة عشان تاخدي وقت لنفسك… إنتِ تستاهلي.",
    ),
    [design, setDesign] = useState("olive");
  return (
    <Modal title="هدية شبه اللي بتحبيها" onClose={onClose} wide>
      <p className="modal-intro">
        صمّمي بطاقة، ضيفي رسالتك، واحفظي المعاينة. نموذج توضيحي غير مشترى أو
        قابل للاستبدال.
      </p>
      <div className="gift-builder">
        <div className="gift-fields">
          <label>
            اختاري تجربة الهدية
            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
            >
              {angel.packages
                .filter((p) => angel.giftOffers.includes(p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            اسم اللي هتفرحيها
            <input
              maxLength={35}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="مثلًا: نور"
            />
          </label>
          <label>
            رسالة من القلب
            <textarea
              maxLength={180}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <small>{message.length} / 180</small>
          </label>
          <fieldset className="design-choices">
            <legend>لون اللحظة</legend>
            {[
              ["olive", "زيتوني"],
              ["sand", "رملي"],
              ["noir", "فحمي"],
            ].map(([id, label]) => (
              <button
                key={id}
                className={`design-dot ${id} ${design === id ? "active" : ""}`}
                aria-label={label}
                aria-pressed={design === id}
                onClick={() => setDesign(id)}
              >
                {design === id && <Check size={16} />}
              </button>
            ))}
          </fieldset>
        </div>
        <div className={`voucher ${design}`} id="print-voucher">
          <span className="voucher-brand">
            angel<span>BEAUTY CENTER & SPA</span>
          </span>
          <span className="voucher-star">✧</span>
          <small>A GIFT OF STILLNESS</small>
          <h3>{recipient ? `لـ ${recipient}` : "لحظة ليكي وحدك"}</h3>
          <strong>{getPackage(packageId).name}</strong>
          <p>{message || "وقت للهدوء… مخصوص ليكي."}</p>
          <div className="voucher-bottom">
            DEMO · بطاقة تجريبية
            <br />
            غير مشتراة وغير قابلة للاستبدال أو الاستخدام
          </div>
        </div>
      </div>
      <div className="modal-actions">
        <button
          className="button olive"
          onClick={() => {
            window.print();
            notify("اختاري «حفظ كملف PDF» من نافذة الطباعة لحفظ البطاقة.");
          }}
        >
          طباعة / حفظ PDF <Printer size={16} />
        </button>
        <span className="field-hint">لا يتم شراء أو إرسال أي هدية.</span>
      </div>
    </Modal>
  );
}

function Owner({
  onPresent,
  onReset,
  notify,
}: {
  onPresent: () => void;
  onReset: () => void;
  notify: (s: string) => void;
}) {
  const [requests, setRequests] = useState(readRequests),
    [filter, setFilter] = useState("all"),
    [tab, setTab] = useState(0);
  const [templates, setTemplates] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("angel-reminders-v1") || "null",
      );
      return Array.isArray(saved) &&
        saved.length === 4 &&
        saved.every((x) => typeof x === "string")
        ? saved
        : angel.reminderTemplates.map((t) => t.message);
    } catch {
      return angel.reminderTemplates.map((t) => t.message);
    }
  });
  const [reminderRequest, setReminderRequest] = useState("sample-1");
  useEffect(() => {
    function refresh() {
      setRequests(readRequests());
    }
    function resetTemplates() {
      setTemplates(angel.reminderTemplates.map((t) => t.message));
    }
    window.addEventListener("angel-requests", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("angel-reset", resetTemplates);
    return () => {
      window.removeEventListener("angel-requests", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("angel-reset", resetTemplates);
    };
  }, []);
  function changeStatus(id: string, status: RequestStatus) {
    try {
      const next = requests.map((r) => (r.id === id ? { ...r, status } : r));
      saveRequests(next);
      setRequests(next);
      notify("تم تحديث الحالة تجريبيًا. لم يتم إرسال أي إشعار.");
    } catch {
      notify("تعذّر حفظ الحالة. التخزين المحلي غير متاح.");
    }
  }
  const visitor = requests.filter((r) => r.source === "visitor");
  const sample = requests.filter((r) => r.source === "sample");
  const filtered = requests.filter((r) =>
    filter === "all" || filter === "visitor"
      ? filter === "all" || r.source === "visitor"
      : r.status === filter,
  );
  const target = requests.find((r) => r.id === reminderRequest) || requests[0];
  const reminder = target
    ? templates[tab]
        .replaceAll("{name}", target.name)
        .replaceAll("{date}", formatDate(target.date))
        .replaceAll("{time}", target.time)
    : "ضيفي طلبًا تجريبيًا الأول لمعاينة الرسالة.";
  return (
    <div className="owner-app">
      <header className="owner-header">
        <Mark small />
        <div className="owner-header-label">
          <span className="demo-pill">OWNER DEMO</span>
          <span>مساحة الإدارة التوضيحية</span>
        </div>
        <a href="/" className="underlined-link">
          تجربة الزائرة <ArrowUpLeft size={16} />
        </a>
      </header>
      <main id="main" className="owner-main">
        <div className="owner-welcome">
          <div>
            <Eyebrow>THE BUSINESS BEHIND THE BEAUTY</Eyebrow>
            <h1>
              تجربة أجمل للعميلة.
              <br />
              <em>رؤية أوضح لشغلك.</em>
            </h1>
            <p>من طلب الحجز لتفاصيل الباقة… شوفي الفكرة وهي بتشتغل.</p>
          </div>
          <div className="owner-actions">
            <button className="button olive" onClick={onPresent}>
              ابدئي العرض <Play size={15} />
            </button>
            <button className="button outline" onClick={onReset}>
              إعادة ضبط العرض <RotateCcw size={15} />
            </button>
          </div>
        </div>
        <div className="owner-notice">
          <Info size={18} />
          <p>
            مساحة عرض مفتوحة وليست لوحة إدارة آمنة. البيانات محفوظة محليًا في
            المتصفح، والحالات والرسائل توضيحية. لا تستخدم بيانات عملاء حقيقية.
          </p>
          <span>
            KAIRO DEV
            <br />
            <small>Designed for your next chapter.</small>
          </span>
        </div>
        <div className="metrics-grid">
          <Metric
            label="طلبات من تجربة الزائرة"
            value={money(visitor.length)}
            detail="تفاعلات محلية في هذا المتصفح"
            icon={<CalendarDays size={19} />}
          />
          <Metric
            label="متوسط قيمة الطلب المحلي"
            value={
              visitor.length
                ? `${money(visitor.reduce((n, r) => n + r.total, 0) / visitor.length)} ج.م`
                : "—"
            }
            detail="تقديرات الباقات، وليست إيرادًا محققًا"
            icon={<ArrowUpRight size={19} />}
          />
          <Metric
            label="اختيار إضافة في الطلبات"
            value={
              visitor.length
                ? `${money((visitor.filter((r) => r.addons.length > 0).length / visitor.length) * 100)}٪`
                : "—"
            }
            detail="محسوب من تفاعلات العرض فقط"
            icon={<Plus size={19} />}
          />
          <Metric
            label="طلبات أمثلة جاهزة"
            value={money(sample.length)}
            detail="أمثلة مستقلة عن تفاعلات الزائرات"
            icon={<LayoutDashboard size={19} />}
          />
        </div>
        <section className="owner-panel">
          <div className="panel-heading">
            <div>
              <Eyebrow>BOOKING REQUESTS</Eyebrow>
              <h2>كل طلب… بداية تجربة</h2>
            </div>
            <label className="filter-label">
              عرض
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="تصفية الطلبات"
              >
                <option value="all">كل الطلبات</option>
                <option value="visitor">تفاعلات الزائرات</option>
                <option value="pending">بانتظار المراجعة</option>
                <option value="confirmed">مؤكدة تجريبيًا</option>
                <option value="cancelled">ملغية تجريبيًا</option>
              </select>
            </label>
          </div>
          <div className="requests-table-wrap">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>العميلة</th>
                  <th>التجربة</th>
                  <th>الموعد المطلوب</th>
                  <th>القيمة التقديرية</th>
                  <th>الحالة التجريبية</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.name}</strong>
                      <small dir="ltr">{r.phone}</small>
                      <span className={`source-tag ${r.source}`}>
                        {r.source === "sample" ? "مثال جاهز" : "تفاعل محلي"}
                      </span>
                    </td>
                    <td>
                      <strong>{getPackage(r.packageId).name}</strong>
                      <small>
                        {r.addons
                          .map(
                            (id) => angel.addons.find((a) => a.id === id)?.name,
                          )
                          .filter(Boolean)
                          .join("، ") || "بدون إضافات"}
                      </small>
                      {r.note && (
                        <small className="request-note">{r.note}</small>
                      )}
                    </td>
                    <td>
                      {formatDate(r.date)}
                      <small>{r.time}</small>
                    </td>
                    <td>{money(r.total)} ج.م</td>
                    <td>
                      <select
                        className={`status-select ${r.status}`}
                        value={r.status}
                        aria-label={`حالة طلب ${r.name}`}
                        onChange={(e) =>
                          changeStatus(r.id, e.target.value as RequestStatus)
                        }
                      >
                        {Object.entries(statusLabels).map(([id, label]) => (
                          <option key={id} value={id}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state">
                <CalendarDays />
                <h3>لسه مفيش طلبات هنا</h3>
                <p>جرّبي الحجز من صفحة الزائرة أو غيّري التصفية.</p>
                <a className="underlined-link" href="/#packages">
                  ابدئي طلب تجريبي <ArrowUpLeft size={15} />
                </a>
              </div>
            )}
          </div>
        </section>
        <div className="owner-columns">
          <section className="owner-panel performance">
            <Eyebrow>PACKAGE INTEREST</Eyebrow>
            <h2>كل باقة بتحكي حاجة</h2>
            <p>مقارنة الطلبات المحلية والأمثلة الجاهزة.</p>
            <div className="sample-performance">
              <span>الأمثلة الجاهزة فقط · بيانات محاكاة</span>
              <div>
                <p>
                  متوسط قيمة الطلب{" "}
                  <strong>
                    {sample.length
                      ? money(
                          sample.reduce((n, r) => n + r.total, 0) /
                            sample.length,
                        )
                      : "—"}{" "}
                    ج.م
                  </strong>
                </p>
                <p>
                  نسبة اختيار إضافة{" "}
                  <strong>
                    {sample.length
                      ? money(
                          (sample.filter((r) => r.addons.length > 0).length /
                            sample.length) *
                            100,
                        )
                      : "—"}
                    ٪
                  </strong>
                </p>
              </div>
            </div>
            <div className="chart-legend">
              <span>
                <i />
                تفاعل محلي
              </span>
              <span>
                <i />
                مثال جاهز
              </span>
            </div>
            {angel.packages
              .filter((p) => p.enabled)
              .map((p) => {
                const live = visitor.filter((r) => r.packageId === p.id).length;
                const simulated = sample.filter(
                  (r) => r.packageId === p.id,
                ).length;
                const max = Math.max(
                  1,
                  ...angel.packages.map(
                    (p) => requests.filter((r) => r.packageId === p.id).length,
                  ),
                );
                return (
                  <div key={p.id} className="performance-row">
                    <div>
                      <span>{p.name}</span>
                      <small>
                        {live} محلي · {simulated} مثال
                      </small>
                    </div>
                    <div className="bar-track">
                      <span style={{ width: `${(live / max) * 100}%` }} />
                      <span style={{ width: `${(simulated / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            <p className="field-hint">
              دي مؤشرات اهتمام في العرض، وليست نتائج مبيعات أو بيانات تاريخية
              حقيقية.
            </p>
          </section>
          <section className="owner-panel reminders">
            <Eyebrow>A THOUGHTFUL FOLLOW-UP</Eyebrow>
            <h2>المتابعة… بتفرق</h2>
            <div
              className="reminder-tabs"
              role="tablist"
              aria-label="أنواع المتابعة"
            >
              {angel.reminderTemplates.map((t, i) => (
                <button
                  role="tab"
                  aria-selected={tab === i}
                  key={t.title}
                  onClick={() => setTab(i)}
                >
                  {t.title}
                </button>
              ))}
            </div>
            <label>
              قالب قابل للتعديل
              <textarea
                rows={3}
                value={templates[tab]}
                onChange={(e) => {
                  const next = templates.map((s, i) =>
                    i === tab ? e.target.value : s,
                  );
                  setTemplates(next);
                }}
              />
            </label>
            <p className="field-hint">
              متغيرات متاحة: {"{name}"}، {"{date}"}، {"{time}"}
            </p>
            <label>
              معاينة على طلب
              <select
                value={target?.id || ""}
                onChange={(e) => setReminderRequest(e.target.value)}
              >
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} —{" "}
                    {r.source === "sample" ? "مثال جاهز" : "تفاعل محلي"}
                  </option>
                ))}
              </select>
            </label>
            <div className="reminder-preview">
              <MessageCircle size={18} />
              <p>{reminder}</p>
            </div>
            <button
              className="button outline compact"
              onClick={() => {
                try {
                  localStorage.setItem(
                    "angel-reminders-v1",
                    JSON.stringify(templates),
                  );
                  notify(
                    "تم حفظ القالب ومعاينة الإشعار محليًا. لم يتم إرسال أي رسالة.",
                  );
                } catch {
                  notify("تعذّر الحفظ في التخزين المحلي.");
                }
              }}
            >
              حفظ ومحاكاة إشعار <Send size={14} />
            </button>
          </section>
        </div>
        <RevenueCalculator />
        <footer className="owner-footer">
          <span>ANGEL · A MORE THOUGHTFUL EXPERIENCE</span>
          <p>
            تصميم وتطوير <strong>Kairo Dev</strong> · عرض مخصص لمناقشة الفكرة
          </p>
        </footer>
      </main>
    </div>
  );
}
function Metric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="metric">
      <div>
        {label}
        {icon}
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}
function RevenueCalculator() {
  const [inquiries, setInquiries] = useState(120),
    [current, setCurrent] = useState(25),
    [target, setTarget] = useState(40),
    [value, setValue] = useState(1450),
    [margin, setMargin] = useState("60"),
    [costs, setCosts] = useState(1500);
  useEffect(() => {
    const reset = () => {
      setInquiries(120);
      setCurrent(25);
      setTarget(40);
      setValue(1450);
      setMargin("60");
      setCosts(1500);
    };
    window.addEventListener("angel-reset", reset);
    return () => window.removeEventListener("angel-reset", reset);
  }, []);
  const currentBookings = (inquiries * current) / 100,
    targetBookings = (inquiries * target) / 100,
    extra = targetBookings - currentBookings,
    revenue = extra * value,
    profit = margin !== "" ? (revenue * Number(margin)) / 100 : null;
  const inputs = [
    {
      label: "استفسارات شهرية تقديرية",
      value: inquiries,
      set: setInquiries,
      min: 0,
      max: 1000,
      step: 10,
      suffix: "استفسار",
    },
    {
      label: "نسبة التحويل الحالية",
      value: current,
      set: setCurrent,
      min: 0,
      max: 100,
      step: 1,
      suffix: "٪",
    },
    {
      label: "نسبة التحويل المستهدفة",
      value: target,
      set: setTarget,
      min: 0,
      max: 100,
      step: 1,
      suffix: "٪",
    },
    {
      label: "متوسط قيمة الباقة",
      value,
      set: setValue,
      min: 0,
      max: 10000,
      step: 50,
      suffix: "ج.م",
    },
  ];
  return (
    <section id="revenue" className="revenue-section">
      <div className="revenue-title">
        <Eyebrow>EXPLORE THE POSSIBILITY</Eyebrow>
        <h2>
          لو كل استفسار
          <br />
          بقى <em>فرصة أوضح؟</em>
        </h2>
        <p>
          غيّري الأرقام وشوفي سيناريو محتمل لشغلك.
          <br />
          حسابات افتراضية للنقاش، وليست وعودًا بنتائج.
        </p>
      </div>
      <div className="calculator">
        <div className="calculator-inputs">
          {inputs.map((input) => (
            <label className="range-field" key={input.label}>
              <span>
                {input.label}
                <strong>
                  {money(input.value)} {input.suffix}
                </strong>
              </span>
              <input
                type="range"
                min={input.min}
                max={input.max}
                step={input.step}
                value={input.value}
                onChange={(e) => input.set(Number(e.target.value))}
              />
            </label>
          ))}
          <div className="calculator-extra">
            <label>
              هامش الربح الإجمالي ٪ <small>(اختياري)</small>
              <input
                type="number"
                min="0"
                max="100"
                value={margin}
                onChange={(e) =>
                  setMargin(
                    e.target.value === ""
                      ? ""
                      : String(
                          Math.min(100, Math.max(0, Number(e.target.value))),
                        ),
                  )
                }
              />
            </label>
            <label>
              تكاليف تشغيل إضافية / شهر
              <input
                type="number"
                min="0"
                max="1000000"
                value={costs}
                onChange={(e) =>
                  setCosts(
                    Math.min(1000000, Math.max(0, Number(e.target.value))),
                  )
                }
              />
            </label>
          </div>
        </div>
        <div className="calculator-results" aria-live="polite">
          <span className="result-eyebrow">فرق الإيراد الشهري المحتمل</span>
          <div className="main-result">
            {revenue > 0 ? "+" : ""}
            {money(revenue)} <small>ج.م</small>
          </div>
          <div className="booking-comparison">
            <span>
              حاليًا <strong>{money(currentBookings)} حجز</strong>
            </span>
            <ArrowLeft size={19} />
            <span>
              في السيناريو <strong>{money(targetBookings)} حجز</strong>
            </span>
          </div>
          <div className="result-details">
            <p>
              فرق الحجوزات{" "}
              <strong>
                {extra > 0 ? "+" : ""}
                {money(extra)}
              </strong>
            </p>
            <p>
              فرق الربح الإجمالي{" "}
              <strong>
                {profit === null ? "أدخلي الهامش" : `${money(profit)} ج.م`}
              </strong>
            </p>
            <p>
              بعد التكاليف الإضافية{" "}
              <strong>
                {profit === null ? "—" : `${money(profit - costs)} ج.م`}
              </strong>
            </p>
          </div>
          <p className="calculator-disclaimer">
            الربح الإجمالي = فرق الإيراد × الهامش. الرقم بعد التكاليف يطرح تكلفة
            التشغيل الإضافية فقط؛ لا يمثل صافي ربح محاسبي. الأرقام تتأثر بالطلب
            والتكلفة والقدرة التشغيلية، وقد تنخفض.
          </p>
        </div>
      </div>
    </section>
  );
}
export default App;
