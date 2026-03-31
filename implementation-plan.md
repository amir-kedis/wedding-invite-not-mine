# Wedding Invitation Website — Implementation Plan

## Background

Build a wedding invitation website inspired by [sample.weddingg.co](https://sample.weddingg.co/), customized for Omar & Salma's wedding. The site features an envelope-opening animation, a cinematic hero, countdown, day programme, venue details, RSVP with signature canvas, a guestbook, and a footer — all with bilingual support (Arabic default / English).

## Screenshots from Reference Site

````carousel
![Envelope — sealed invitation with wax seal, "Dear Guest" header, "Tap to open" prompt](/home/amir/.gemini/antigravity/brain/29356a75-08a9-4443-84f4-ce973f77a5e7/initial_envelope_state_1774970198836.png)
<!-- slide -->
![Hero — full-bleed video background, couple names in script font, date, "Confirm your attendance" CTA](/home/amir/.gemini/antigravity/brain/29356a75-08a9-4443-84f4-ce973f77a5e7/hero_section_1774970239177.png)
<!-- slide -->
![Countdown — large script numerals for Days/Hours/Minutes/Seconds with venue illustration watermark](/home/amir/.gemini/antigravity/brain/29356a75-08a9-4443-84f4-ce973f77a5e7/countdown_section_1774970257266.png)
<!-- slide -->
![RSVP — split layout with heading left, form right including name, attendance toggle, message, signature canvas](/home/amir/.gemini/antigravity/brain/29356a75-08a9-4443-84f4-ce973f77a5e7/rsvp_form_section_1774970362172.png)
<!-- slide -->
![Guestbook & Footer — guest message cards with signatures, dark footer with couple names](/home/amir/.gemini/antigravity/brain/29356a75-08a9-4443-84f4-ce973f77a5e7/guestbook_and_footer_1774970381128.png)
````

---

## User Review Required

> [!IMPORTANT]
> **Database Choice**: The plan uses **Supabase** (free tier) for RSVP submissions and guestbook data. This aligns with the requirement for a simple, free database. Is this acceptable, or do you prefer Firebase?

> [!IMPORTANT]
> **Assets**: The scraped assets in `./data_acquisition` include the envelope video (`bg.mp4`/`bg.webm`), venue illustration PNG, wedding car PNG, and hero media. We'll copy these to `public/` during setup. The intro video/image for the envelope is hosted externally on GitHub — should we download and self-host these, or keep the external URLs?

> [!IMPORTANT]
> **Couple Data**: The current data references "Omar & Salma" with an event date of May 8, 2027. All text, dates, times, venue info, and media URLs will be centralized in a single config file (`src/config/wedding.ts`). Should I use this data as-is for the initial build?

> [!WARNING]
> **Tailwind Version**: The requirement asks for Tailwind. I'll use **Tailwind CSS v4** (latest, shipped with Next.js 15). This uses the new CSS-first configuration approach. Let me know if you'd prefer v3 instead.

---

## Proposed Changes

### Phase 1: Project Scaffolding

#### [NEW] Next.js 15 App Router Project

Initialize via `npx create-next-app@latest ./` with:
- TypeScript
- Tailwind CSS
- App Router
- `src/` directory
- ESLint
- No Turbopack (for stability)

#### [NEW] Dependencies

```
npm install framer-motion next-intl @supabase/supabase-js lucide-react
```

#### [NEW] `.gitignore`

Standard Next.js gitignore + `node_modules`, `.env.local`, `.next`, `out`, `data_acquisition/.venv`, `data_acquisition/__pycache__`

#### [NEW] `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

---

### Phase 2: Configuration & Content System

#### [NEW] `src/config/wedding.ts`

Central config file — **the single place** to customize the entire site:

```typescript
export const weddingConfig = {
  couple: {
    partner1: { en: "Omar", ar: "عمر" },
    partner2: { en: "Salma", ar: "سلمى" },
  },
  date: "2027-05-08T19:30:00+02:00",
  venue: {
    name: { en: "Venue Name", ar: "اسم القاعة" },
    time: { en: "From 5:00 PM to 1:00 AM", ar: "من ٥:٠٠ م إلى ١:٠٠ ص" },
    mapsUrl: "https://maps.app.goo.gl/...",
    embedUrl: "https://www.google.com/maps/embed?pb=...",
  },
  schedule: [
    { time: "7:30 PM", title: { en: "Guest Arrival", ar: "وصول الضيوف" }, description: { en: "Reception and welcome at the venue", ar: "استقبال وترحيب في القاعة" } },
    // ... more events
  ],
  sections: {
    envelope: { enabled: true },
    hero: { enabled: true },
    countdown: { enabled: true },
    programme: { enabled: true },
    details: { enabled: true },
    dressCode: { enabled: true, text: { en: "Dress code - semi formal", ar: "الزي - شبه رسمي" } },
    rsvp: { enabled: true },
    guestbook: { enabled: true },
  },
  media: {
    envelopeVideo: "/media/bg.mp4",
    envelopeImage: "/media/bg.png",
    heroVideo: "/media/hero-video.mp4",
    heroPoster: "/media/hero-poster.jpg",
    introVideo: "/media/intro.mp4",
    introImage: "/media/intro.jpg",
    venueIllustration: "/media/venue-illustration.png",
    weddingCar: "/media/wedding-car.png",
  },
  theme: {
    fonts: {
      script: "'Dancing Script', cursive",
      display: "'Libre Baskerville', serif",
      body: "'Raleway', sans-serif",
      arabic: "'Amiri', serif",
    },
    colors: {
      primary: "0 0% 0%",
      primaryForeground: "40 33% 97%",
      sage: "0 0% 20%",
      background: "0 33% 97%",
    }
  },
  social: {
    ogImage: "/media/og-image.png",
  }
};
```

---

### Phase 3: Internationalization (i18n)

#### [NEW] `src/i18n/` directory

Using `next-intl` with App Router:

- `src/i18n/request.ts` — locale detection
- `src/i18n/routing.ts` — `/ar` (default) and `/en` routes
- `src/messages/ar.json` — Arabic translations (primary)
- `src/messages/en.json` — English translations
- `src/app/[locale]/layout.tsx` — locale-aware layout with `dir="rtl"` for Arabic
- `src/middleware.ts` — locale redirect middleware

Fonts:
- English: Dancing Script (script), Libre Baskerville (display), Raleway (body)
- Arabic: Amiri (script/display), Tajawal (body), Noto Naskh Arabic (fallback)

RTL handled via dir attribute + Tailwind's built-in RTL modifiers.

---

### Phase 4: UI Components

All components use Framer Motion for scroll-triggered reveal animations (fade-in-up pattern from the reference).

#### [NEW] `src/components/envelope/EnvelopeGate.tsx`

The initial full-screen envelope experience:
- Video background (bg.mp4) showing the sealed envelope with wax seal
- "Dear Guest" header text at top
- Pulsing "✦" icon with concentric ring animation
- "Tap to open" text at bottom
- On click → envelope opens with CSS `perspective` + `rotateX` animation on the flap
- Transitions to intro video → then reveals main content
- Uses `framer-motion` `AnimatePresence` for exit

#### [NEW] `src/components/hero/HeroSection.tsx`

Full-viewport hero with:
- Background video (hero-video.mp4) with poster image fallback
- Dark overlay (55% opacity)
- "We're Getting Married" uppercase tracking text
- Couple names in script font (large, drop-shadow)
- "✦" diamond divider
- Event date in display italic font
- Bouncing chevron "Confirm your attendance" CTA at bottom

#### [NEW] `src/components/countdown/CountdownSection.tsx`

- Script font heading "Countdown"
- Subtitle "To the big day"
- 4-column grid with circular SVG progress rings (from the clone variant)
- Live countdown computed from `weddingConfig.date`
- Venue illustration watermark at bottom (15% opacity, sepia filter)

#### [NEW] `src/components/programme/ProgrammeSection.tsx`

- Desktop: horizontal timeline with dots, time pills, and descriptions
- Mobile: vertical timeline with left-aligned dots
- Script font heading
- Reads schedule from `weddingConfig.schedule`

#### [NEW] `src/components/details/DetailsSection.tsx`

- 2-column grid (md): left card with location icon, venue name, time, map + calendar buttons; right card with embedded Google Map
- Map has sepia filter, removes on hover
- Reads data from `weddingConfig.venue`

#### [NEW] `src/components/details/DressCodeSection.tsx`

- Centered card with info icon
- Display text from config
- Only rendered if `sections.dressCode.enabled`

#### [NEW] `src/components/rsvp/RSVPSection.tsx`

- Script heading + subtitle
- Form with: Full Name input, Yes/No attendance toggle (emoji cards), message textarea, signature canvas
- Signature canvas using HTML Canvas API with touch support
- Submit to Supabase `rsvp` table via API route

#### [NEW] `src/components/guestbook/GuestbookSection.tsx`

- Displays approved RSVP messages in card grid
- Each card: quote marks, message text, signature image, guest name with heart
- Loads from Supabase on mount

#### [NEW] `src/components/footer/Footer.tsx`

- Dark background (`bg-sage-dark`)
- Couple names in large script font
- Diamond divider
- Date in display italic
- "With all our love" in small text
- Venue illustration watermark (inverted, low opacity)

#### [NEW] `src/components/ui/LanguageToggle.tsx`

- Fixed top-right pill with EN / عربي toggle buttons
- Glassmorphic background (`bg-foreground/40 backdrop-blur-sm`)
- Switches locale via `next-intl`

#### [NEW] `src/components/ui/ScrollReveal.tsx`

- Reusable wrapper using `framer-motion`'s `useInView` + `motion.div`
- Fade-in-up animation (opacity 0→1, translateY 40→0)
- Configurable delay, duration, threshold

---

### Phase 5: Database & API

#### Supabase Setup

Create a `rsvp` table:

```sql
CREATE TABLE rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  message TEXT,
  signature_data TEXT,  -- base64 of signature canvas
  locale TEXT DEFAULT 'ar',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon
CREATE POLICY "Allow public inserts" ON rsvp FOR INSERT WITH CHECK (true);

-- Allow public reads for guestbook
CREATE POLICY "Allow public reads" ON rsvp FOR SELECT USING (attending = true);
```

#### [NEW] `src/lib/supabase.ts`

Supabase client initialization.

#### [NEW] `src/app/api/rsvp/route.ts`

- `POST`: Validate + insert RSVP. Rate-limit (basic token bucket or cooldown).
- `GET`: Fetch attending guests for guestbook display.

---

### Phase 6: Page Assembly

#### [NEW] `src/app/[locale]/page.tsx`

Main page composing all sections:

```tsx
export default function WeddingPage() {
  return (
    <>
      {config.sections.envelope.enabled && <EnvelopeGate />}
      <main>
        {config.sections.hero.enabled && <HeroSection />}
        {config.sections.countdown.enabled && <ScrollReveal><CountdownSection /></ScrollReveal>}
        {config.sections.programme.enabled && <ScrollReveal><ProgrammeSection /></ScrollReveal>}
        {config.sections.details.enabled && <ScrollReveal><DetailsSection /></ScrollReveal>}
        {config.sections.dressCode.enabled && <ScrollReveal><DressCodeSection /></ScrollReveal>}
        {config.sections.rsvp.enabled && <ScrollReveal><RSVPSection /></ScrollReveal>}
        {config.sections.guestbook.enabled && <ScrollReveal><GuestbookSection /></ScrollReveal>}
        <Footer />
      </main>
    </>
  );
}
```

#### [NEW] `src/app/[locale]/layout.tsx`

- HTML lang + dir attributes based on locale
- Google Fonts via `next/font`
- CSS custom properties for theme tokens
- Meta tags, OG tags, PWA manifest
- Language toggle overlay

---

### Phase 7: Media & Assets

Copy from `data_acquisition/` to `public/media/`:

| Source | Destination |
|--------|-------------|
| `final_assets_clone/assets/our.weddingg.co/bg.mp4` | `public/media/bg.mp4` |
| `final_assets_clone/assets/our.weddingg.co/bg.png` | `public/media/bg.png` |
| `final_assets_clone/assets/our.weddingg.co/bg.webm` | `public/media/bg.webm` |
| `final_assets_sample_clone/assets/sample.weddingg.co/assets/venue-illustration-B9VKTKcW.png` | `public/media/venue-illustration.png` |
| `final_assets_sample_clone/assets/sample.weddingg.co/assets/wedding-car-DyKA2AU-.png` | `public/media/wedding-car.png` |
| `final_assets_clone/assets/external/.../hero-video-*.mp4` | `public/media/hero-video.mp4` |
| `final_assets_clone/assets/external/.../og-*.png` | `public/media/og-image.png` |
| `final_assets_clone/assets/our.weddingg.co/favicon.ico` | `public/favicon.ico` |
| `final_assets_clone/assets/our.weddingg.co/pwa-192x192.png` | `public/pwa-192x192.png` |
| Amiri font TTF | `public/fonts/Amiri-Regular.ttf` |

---

## File Structure Summary

```
wedding-invite-not-mine/
├── public/
│   ├── media/            # All video/image assets
│   ├── fonts/            # Self-hosted Arabic font
│   ├── favicon.ico
│   └── pwa-192x192.png
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── rsvp/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── envelope/
│   │   │   └── EnvelopeGate.tsx
│   │   ├── hero/
│   │   │   └── HeroSection.tsx
│   │   ├── countdown/
│   │   │   └── CountdownSection.tsx
│   │   ├── programme/
│   │   │   └── ProgrammeSection.tsx
│   │   ├── details/
│   │   │   ├── DetailsSection.tsx
│   │   │   └── DressCodeSection.tsx
│   │   ├── rsvp/
│   │   │   └── RSVPSection.tsx
│   │   ├── guestbook/
│   │   │   └── GuestbookSection.tsx
│   │   ├── footer/
│   │   │   └── Footer.tsx
│   │   └── ui/
│   │       ├── LanguageToggle.tsx
│   │       └── ScrollReveal.tsx
│   ├── config/
│   │   └── wedding.ts
│   ├── i18n/
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── lib/
│   │   └── supabase.ts
│   └── messages/
│       ├── ar.json
│       └── en.json
├── .env.local
├── .gitignore
├── next.config.ts
├── tailwind.config.ts    # (if v3) or CSS-based (if v4)
├── package.json
└── requirement.md
```

---

## Open Questions

> [!IMPORTANT]
> 1. **Supabase vs Firebase**: Which database provider do you prefer? (Plan assumes Supabase)
> 2. **Asset hosting**: Self-host all media in `public/` or use external CDN URLs from the scraped data?
> 3. **Tailwind v3 vs v4**: v4 is the new default with Next.js 15. Any preference?
> 4. **Couple data**: Should I use Omar & Salma / May 8, 2027 as the initial content? Or different names?
> 5. **Background music**: The reference site has optional background music. Should we include this feature?
> 6. **Guestbook visibility**: Should submitted RSVPs appear immediately or require admin approval first?

---

## Verification Plan

### Automated Tests
- `npm run build` — ensure zero TypeScript / build errors
- `npm run lint` — ESLint clean
- Browser subagent test: navigate through envelope → hero → scroll all sections → submit RSVP → verify guestbook
- Browser subagent test: switch language to Arabic → verify RTL layout + Arabic text

### Manual Verification
- Mobile responsiveness check across viewport sizes
- Lighthouse performance audit targeting 90+ score
- Deploy to Vercel preview and share URL for user review
