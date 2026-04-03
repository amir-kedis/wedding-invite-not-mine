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

export const weddingConfig = {
  couple: {
    partner1: { en: "Ramez", ar: "رامز" },
    partner2: { en: "Basma", ar: "بسمة" },
  },

  /** ISO 8601 date string with timezone */
  date: "2026-04-17T18:00:00+02:00",

  venue: {
    name: { en: "Lokoumet Gould El Nael", ar: "لوكيمة جولد النيل" },
    time: { en: "From 6:00 PM onwards", ar: "من ٦:٠٠ م فصاعدًا" },
    mapsUrl: "https://maps.app.goo.gl/nTjZhXvd4jzQFZdN9",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3450.777190417625!2d31.192062377929688!3d30.129188537597656!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14586be319fb4cbf%3A0x843d67626b087a10!2z2YTZiNmD2YrYtNmGINis2YjZhNivINmG2KfZitmE!5e0!3m2!1sen!2seg!4v1775221939519!5m2!1sen!2seg",
  },

  schedule: [
    {
      time: { en: "6:00 PM", ar: "٦:٠٠ م" },
      title: { en: "Guest Arrival", ar: "وصول الضيوف" },
      description: {
        en: "Welcome and reception at the venue",
        ar: "استقبال وترحيب في القاعة",
      },
    },
    {
      time: { en: "6:30 PM", ar: "٦:٣٠ م" },
      title: { en: "Engagement Ceremony", ar: "حفل الخطوبة" },
      description: {
        en: "The ring exchange and the beginning of a beautiful journey",
        ar: "تبادل الخواتم وبداية رحلة جميلة",
      },
    },
    {
      time: { en: "7:30 PM", ar: "٧:٣٠ م" },
      title: { en: "Photos & Celebration", ar: "صور واحتفال" },
      description: {
        en: "Capture memories from this special occasion",
        ar: "التقاط ذكريات من هذه المناسبة الرائعة",
      },
    },
    {
      time: { en: "8:00 PM", ar: "٨:٠٠ م" },
      title: { en: "Dinner & Music", ar: "عشاء وموسيقى" },
      description: {
        en: "Dinner, music, and dancing with family and friends",
        ar: "عشاء وموسيقى ورقص مع العائلة والأصدقاء",
      },
    },
  ] as ScheduleEvent[],

  /** Toggle each section on/off */
  sections: {
    envelope: true,
    hero: true,
    countdown: true,
    programme: false,
    details: true,
    dressCode: false,
    rsvp: true,
    guestbook: true,
    music: false,
  },

  dressCode: {
    en: "Dress code — Semi Formal",
    ar: "الزي — شبه رسمي",
  },

  media: {
    envelopeVideo: "https://github.com/kkhh-hub/assets/raw/refs/heads/main/intro.mp4",
    envelopeVideoWebm: "",
    envelopeImage: "https://raw.githubusercontent.com/kkhh-hub/assets/main/intro.jpg",
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
    const title = encodeURIComponent(`Engagement — ${name}`);
    const venue = encodeURIComponent(
      locale === "ar"
        ? weddingConfig.venue.name.ar
        : weddingConfig.venue.name.en
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260417T160000Z/20260417T220000Z&location=${venue}`;
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
