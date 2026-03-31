# Stack Recommendation Report: Wedding Invite Site

## 1) Observed Characteristics of the Target

From rendered content and response headers, the site appears to be:

- A single-page, media-heavy invitation template.
- Optimized for mobile first interactions (tap-to-open, animated reveal).
- Served behind Cloudflare (edge caching and bot protection).

Even without full source maps, this category of site is typically a static frontend with light API needs.

## 2) Recommended Stack (Production)

### Frontend

- Framework: Next.js 15 (App Router) with React.
- Styling: Tailwind CSS + CSS variables for branding themes.
- Animation: Framer Motion (hero reveals, section transitions, countdown effects).
- Media handling:
  - Images: `next/image` + AVIF/WebP variants.
  - Video: MP4 (H.264) fallback + optional WebM.
  - Audio: compressed MP3/AAC background music with explicit user-triggered playback.
- Internationalization: `next-intl` (Arabic/English with RTL support).

### CMS / Content Editing

- Best balance: Sanity or Strapi (headless CMS) for non-technical editors.
- Content model:
  - Couple profile, event timeline, venue cards, gallery, RSVP settings, language strings, theme tokens.

### Backend

- Keep minimal:
  - Next.js Route Handlers for RSVP submit/read.
  - Optional serverless DB for RSVP only (Postgres on Neon/Supabase).
- Email/notifications:
  - Resend or SendGrid for RSVP confirmations.

### Hosting / Delivery

- Deploy frontend on Vercel.
- Put Cloudflare in front for WAF, CDN, and caching if needed.
- Store media on R2/S3 + CDN for lower latency and lower egress costs.

### Analytics / Observability

- Privacy-first analytics: Plausible or PostHog.
- Error/perf tracking: Sentry.

## 3) Why This Stack Fits

- Fast time-to-market for a template-style product.
- Excellent SEO + social cards for invitation links.
- Easy Arabic/RTL support.
- Scales from one invitation to multi-tenant template platform.
- Keeps operations simple (mostly static pages + small dynamic RSVP endpoints).

## 4) Implementation Blueprint

1. Create a reusable template shell (hero, story, gallery, schedule, location, RSVP).
2. Build a theme token system (fonts, colors, spacing, decorative assets).
3. Model content in CMS and map to typed frontend schema.
4. Implement RSVP API and admin export.
5. Optimize media pipeline (responsive image sizes, preload critical hero media).
6. Add i18n with RTL-aware layout switching.
7. Add analytics, Sentry, and production cache rules.

## 5) Suggested Data Model (Minimal)

- `invitation`
  - `slug`, `title`, `language`, `themeId`, `heroMedia`, `musicTrack`, `eventDate`, `sections[]`, `rsvpEnabled`
- `section`
  - `type` (story/gallery/schedule/location/custom), `order`, `content`
- `rsvp`
  - `invitationId`, `guestName`, `attending`, `partySize`, `notes`, `createdAt`

## 6) Performance Targets

- LCP < 2.5s on mid-tier mobile.
- Total JS under ~220KB gzipped for first load of landing view.
- Hero image/video delivered via adaptive sizes.
- 95+ Lighthouse performance on template pages.

## 7) Security / Compliance Notes

- Explicitly enforce ownership/licensing of uploaded photos/music/templates.
- Rate-limit RSVP endpoints.
- Validate and sanitize all public form inputs.
- Keep bot protection (Cloudflare Turnstile/reCAPTCHA) for RSVP spam.

## 8) Alternative If You Want Simpler

- Astro + Tailwind + Cloudflare Pages + Supabase Forms.
- Better for very static pages and minimal interactivity, but less convenient than Next.js if you want richer app-like interactions later.
