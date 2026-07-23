/**
 * Wedding Configuration
 * =====================
 * This is the SINGLE source of truth for all wedding content.
 * Change names, dates, schedule, venue, media, theme — everything here.
 */

export type LocalizedString = {
  en: string;
  ar: string;
};

export interface ScheduleEvent {
  time: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
}

export interface WeddingLocation {
  kind: LocalizedString;
  name: LocalizedString;
  time: LocalizedString;
  address: LocalizedString;
  mapsUrl: string;
  embedUrl: string;
}

const churchMapsUrl =
  "https://www.google.com/maps/place/%D9%83%D9%86%D9%8A%D8%B3%D8%A9+%D8%A7%D9%84%D8%B4%D9%87%D9%8A%D8%AF+%D8%A7%D9%84%D8%B9%D8%B8%D9%8A%D9%85+%D8%A7%D8%A8%D9%89+%D8%B3%D9%8A%D9%81%D9%8A%D9%86+%D8%A7%D9%84%D9%85%D9%87%D9%86%D8%AF%D8%B3%D9%8A%D9%86,+5+%D8%A7%D9%84%D8%AD%D8%AC%D8%A7%D8%B2%D8%8C+%D8%AC%D8%B2%D9%8A%D8%B1%D8%A9+%D9%85%D9%8A%D8%AA+%D8%B9%D9%82%D8%A8%D8%A9%D8%8C+%D8%AD%D9%8A+%D8%A7%D9%84%D8%B9%D8%AC%D9%88%D8%B2%D8%A9%D8%8C+%D9%85%D8%AD%D8%A7%D9%81%D8%B8%D8%A9+%D8%A7%D9%84%D8%AC%D9%8A%D8%B2%D8%A9+3752240%E2%80%AD/data=!4m2!3m1!1s0x1458410054336035:0x427276b572702848?entry=gps&coh=192189&g_ep=CAESBzI1LjI3LjQYACDXggMqWyw5NDI2NzcyNywxMDA4MjA2OTEsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTlCAkVH&skid=2f0b7787-c96c-43fb-a725-6d8c718831bb&g_st=aw";

const receptionMapsUrl =
  "https://www.google.com/maps?q=30.1278819,31.1930786&z=17&hl=en";

export const weddingConfig = {
  couple: {
    partner1: { en: "Gerges", ar: "جرجس" },
    partner2: { en: "Marina", ar: "مارينا" },
  },

  /** ISO 8601 date string with timezone */
  date: "2026-09-10T17:00:00+03:00",

  venue: {
    name: { en: "Villa Saudi", ar: "ڤيلا سعودي" },
    time: { en: "7:00 PM", ar: "٧:٠٠ م" },
    mapsUrl: receptionMapsUrl,
    embedUrl:
      "https://www.google.com/maps?q=30.1278819,31.1930786&z=17&output=embed",
  },

  locations: [
    {
      kind: { en: "Ceremony", ar: "الإكليل" },
      name: {
        en: "St. Mercurius Church, Mohandessin",
        ar: "كنيسة الشهيد العظيم أبي سيفين، المهندسين",
      },
      time: { en: "5:00 PM", ar: "٥:٠٠ م" },
      address: {
        en: "St. Mercurius Church, Mohandessin",
        ar: "كنيسة الشهيد العظيم أبي سيفين، المهندسين",
      },
      mapsUrl: churchMapsUrl,
      embedUrl:
        "https://www.google.com/maps?q=%D9%83%D9%86%D9%8A%D8%B3%D8%A9+%D8%A7%D9%84%D8%A7%D9%83%D9%84%D9%8A%D9%84+%D8%A7%D9%84%D9%85%D9%87%D9%86%D8%AF%D8%B3%D9%8A%D9%86&output=embed",
    },
    {
      kind: { en: "Reception", ar: "القاعة" },
      name: { en: "Villa Saudi", ar: "ڤيلا سعودي" },
      time: { en: "7:00 PM", ar: "٧:٠٠ م" },
      address: {
        en: "Nile Corniche - 500 meters after Warraq Ring Road exit",
        ar: "كورنيش النيل – بعد ٥٠٠ متر من نزلة دائري الوراق",
      },
      mapsUrl: receptionMapsUrl,
      embedUrl:
        "https://www.google.com/maps?q=30.1278819,31.1930786&z=17&output=embed",
    },
  ] as WeddingLocation[],

  schedule: [
    {
      time: { en: "5:00 PM", ar: "٥:٠٠ م" },
      title: { en: "Wedding Ceremony", ar: "الإكليل" },
      description: {
        en: "The wedding ceremony at St. Mercurius Church, Mohandessin",
        ar: "صلوات الإكليل في كنيسة الشهيد العظيم أبي سيفين، المهندسين",
      },
    },
    {
      time: { en: "7:00 PM", ar: "٧:٠٠ م" },
      title: { en: "Reception", ar: "القاعة" },
      description: {
        en: "Celebration at Villa Saudi",
        ar: "الاحتفال في ڤيلا سعودي",
      },
    },
  ] as ScheduleEvent[],

  /** Toggle each section on/off */
  sections: {
    envelope: true,
    hero: true,
    countdown: true,
    programme: true,
    details: true,
    dressCode: false,
    rsvp: false,
    guestbook: false,
    music: false,
  },

  dressCode: {
    en: "Dress code — Semi Formal",
    ar: "الزي — شبه رسمي",
  },

  media: {
    envelopeVideo: "/media/intro.mp4",
    envelopeVideoWebm: "",
    envelopeImage: "/media/intro.jpg",
    heroVideo: "/media/bg.mp4",
    heroVideoWebm: "/media/bg.webm",
    heroPoster: "/media/bg.png",
    venueIllustration: "/media/venue-illustration.png",
    weddingCar: "/media/wedding-car.png",
    ogImage: "/media/og-image.png",
    /** Optional background music file */
    backgroundMusic: "/media/music.mp3",
  },

  theme: {
    fonts: {
      script: "'Dancing Script', cursive",
      display: "'Libre Baskerville', serif",
      body: "'Raleway', sans-serif",
      arabic: "'Amiri', serif",
      arabicBody: "'Tajawal', sans-serif",
    },
    colors: {
      primary: "0 0% 0%",
      primaryForeground: "40 33% 97%",
      sage: "0 0% 20%",
      sageDark: "0 0% 0%",
      sageLight: "0 0% 50%",
      background: "40 33% 97%",
      foreground: "0 0% 25%",
      border: "0 0% 80%",
      muted: "0 0% 90%",
      mutedForeground: "0 0% 45%",
      card: "0 5% 95%",
      cardForeground: "0 0% 25%",
      secondary: "0 0% 92%",
      secondaryForeground: "0 0% 30%",
    },
  },

  /** Google Calendar link params */
  calendarUrl: (locale: string) => {
    const c = weddingConfig.couple;
    const name =
      locale === "ar"
        ? `${c.partner1.ar} و ${c.partner2.ar}`
        : `${c.partner1.en} & ${c.partner2.en}`;
    const title = encodeURIComponent(`Wedding — ${name}`);
    const location = encodeURIComponent(
      locale === "ar"
        ? `${weddingConfig.locations[0].name.ar} ثم ${weddingConfig.locations[1].name.ar}`
        : `${weddingConfig.locations[0].name.en}, then ${weddingConfig.locations[1].name.en}`,
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260910T140000Z/20260910T210000Z&location=${location}`;
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
