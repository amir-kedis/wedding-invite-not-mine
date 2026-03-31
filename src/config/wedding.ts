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
  date: "2027-05-08T19:30:00+02:00",

  venue: {
    name: { en: "Venue Name", ar: "اسم القاعة" },
    time: { en: "From 7:30 PM to 1:00 AM", ar: "من ٧:٣٠ م إلى ١:٠٠ ص" },
    mapsUrl: "https://maps.app.goo.gl/VsUmFxJQi1iamZu17",
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.4416289581713!2d31.322491199999998!3d30.0815359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f16497ea82f%3A0x4ff178b68124d1da!2z2YLYp9i52Kkg2K3Zitin2Kkg2YTZhNin2YHYsdin2K0g2KjYr9in2LEg2KfZhNmC2YjYp9iqINin2YTYrNmI2YrYqQ!5e0!3m2!1sen!2seg!4v1773102531685!5m2!1sen!2seg",
  },

  schedule: [
    {
      time: { en: "7:30 PM", ar: "٧:٣٠ م" },
      title: { en: "Guest Arrival", ar: "وصول الضيوف" },
      description: {
        en: "Reception and welcome at the venue",
        ar: "استقبال وترحيب في القاعة",
      },
    },
    {
      time: { en: "8:00 PM", ar: "٨:٠٠ م" },
      title: { en: "Wedding Ceremony", ar: "حفل الزفاف" },
      description: {
        en: "The most special moment of the day",
        ar: "أجمل لحظة في اليوم",
      },
    },
    {
      time: { en: "9:30 PM", ar: "٩:٣٠ م" },
      title: { en: "Wedding Photos", ar: "صور الزفاف" },
      description: {
        en: "Leave a memory for our special day",
        ar: "اتركوا ذكرى ليومنا المميز",
      },
    },
    {
      time: { en: "10:00 PM", ar: "١٠:٠٠ م" },
      title: { en: "Banquet Dinner", ar: "حفل العشاء" },
      description: {
        en: "Dinner and celebration with family and friends",
        ar: "عشاء واحتفال مع العائلة والأصدقاء",
      },
    },
    {
      time: { en: "10:45 PM", ar: "١٠:٤٥ م" },
      title: { en: "Party & Dancing", ar: "حفلة ورقص" },
      description: {
        en: "Dance and celebrate together on the dance floor",
        ar: "ارقصوا واحتفلوا معًا على حلبة الرقص",
      },
    },
    {
      time: { en: "12:30 AM", ar: "١٢:٣٠ ص" },
      title: { en: "End of Celebration", ar: "نهاية الاحتفال" },
      description: {
        en: "Farewell and beautiful memories to remember",
        ar: "وداع وذكريات جميلة نتذكرها",
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
    dressCode: true,
    rsvp: true,
    guestbook: true,
    music: true,
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
    const title = encodeURIComponent(`Wedding — ${name}`);
    const venue = encodeURIComponent(
      locale === "ar"
        ? weddingConfig.venue.name.ar
        : weddingConfig.venue.name.en
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20270508T193000/20270509T010000&location=${venue}`;
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
