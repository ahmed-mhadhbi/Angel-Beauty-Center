// Every price, duration, inclusion and offering below is a concept awaiting owner approval.
export const angel = {
  name: "Angel Beauty Center & Spa",
  location: "المعادي، القاهرة",
  logo: "", // Optional owner-approved logo URL; empty uses the typographic concept mark.
  whatsapp: "", // Approved international digits only, e.g. 20...; empty disables external handoff.
  socialLinks: { instagram: "", facebook: "" },
  images: { hammam: "/images/hammam.webp", detail: "/images/ritual.webp" },
  imageDisclaimer: "تصوّر بصري للتجربة، وليست صورًا للمركز",
  depositRate: 0.25,
  preferredTimes: [
    "١١:٠٠ صباحًا",
    "١:٠٠ ظهرًا",
    "٣:٠٠ عصرًا",
    "٥:٠٠ مساءً",
    "٧:٠٠ مساءً",
  ],
  packages: [
    {
      id: "ritual",
      name: "طقوس الحمام المغربي",
      english: "THE HAMMAM RITUAL",
      description: "بداية ناعمة… ووقت تفصلي فيه عن كل حاجة.",
      price: 950,
      minutes: 60,
      includes: [
        "حمام مغربي تقليدي",
        "تقشير بالليفة والصابون المغربي",
        "مشروب دافئ ولحظة هدوء",
      ],
      enabled: true,
    },
    {
      id: "relax",
      name: "تجربة الاسترخاء",
      english: "THE SLOW ESCAPE",
      description: "طقوس دافئة، ومساج يكمّل حكاية الهدوء.",
      price: 1450,
      minutes: 90,
      includes: [
        "كل تفاصيل طقوس الحمام المغربي",
        "مساج استرخاء لمدة ٣٠ دقيقة",
        "وقت خاص للاسترخاء",
      ],
      enabled: true,
    },
    {
      id: "vip",
      name: "تجربة Angel VIP",
      english: "THE SIGNATURE EXPERIENCE",
      description: "يوم صغير ليكي… بكل التفاصيل اللي بتحبيها.",
      price: 2100,
      minutes: 120,
      includes: [
        "حمام مغربي وعناية بالجسم",
        "مساج استرخاء لمدة ٤٥ دقيقة",
        "عناية لطيفة بالوجه",
        "وقت استرخاء ومشروب دافئ",
      ],
      enabled: true,
    },
    {
      id: "duo",
      name: "لحظات لشخصين",
      english: "BETTER TOGETHER",
      description: "فكرة لتجربة مشتركة، بعد تأكيد إمكانية الاستضافة.",
      price: 2800,
      minutes: 90,
      includes: ["تصوّر لطقوس حمام مغربي لشخصين", "استراحة خاصة ومشروبان"],
      enabled: false,
    },
  ],
  addons: [
    {
      id: "massage",
      name: "مساج إضافي",
      description: "٢٠ دقيقة من الاسترخاء",
      price: 350,
      minutes: 20,
      includedIn: [],
    },
    {
      id: "facial",
      name: "عناية بالوجه",
      description: "لمسة عناية تكمّل يومك",
      price: 300,
      minutes: 20,
      includedIn: ["vip"],
    },
    {
      id: "lounge",
      name: "وقت أطول ليكي",
      description: "٣٠ دقيقة استرخاء إضافية",
      price: 200,
      minutes: 30,
      includedIn: [],
    },
    {
      id: "beauty",
      name: "عناية باليدين",
      description: "تفاصيل صغيرة، إحساس جميل",
      price: 250,
      minutes: 20,
      includedIn: [],
    },
  ],
  giftOffers: ["ritual", "relax", "vip"],
  reminderTemplates: [
    {
      title: "قبل الموعد",
      message:
        "أهلًا {name}، بنفكّرك بموعدك في Angel يوم {date} الساعة {time}. مستنيينك للحظات هدوء مخصوص ليكي. ردي علينا لتأكيد الحضور.",
    },
    {
      title: "في انتظار التأكيد",
      message:
        "أهلًا {name}، طلب تجربتك لسه في انتظار التأكيد. كلمينا عشان نراجع الموعد والتفاصيل سوا.",
    },
    {
      title: "بعد التجربة",
      message:
        "شكرًا ليكي يا {name} على زيارتك لـ Angel. يهمنا نعرف رأيك في التجربة، ونتمنى نشوفك قريب.",
    },
    {
      title: "وقت لنفسك من جديد",
      message:
        "وحشتينا يا {name}. لو حابة تفصلي شوية، يسعدنا نساعدك تختاري تجربة جديدة تناسبك.",
    },
  ],
};
export type SpaPackage = (typeof angel.packages)[number];
export const money = (n: number) =>
  new Intl.NumberFormat("ar-EG", { maximumFractionDigits: 0 }).format(n);
