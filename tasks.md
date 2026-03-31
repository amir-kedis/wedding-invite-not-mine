# Wedding Invitation Site — Task Tracker

## Phase 1: Project Scaffolding
- [x] Initialize Next.js 15 project with TypeScript, Tailwind, App Router
- [x] Install dependencies (framer-motion, next-intl, @supabase/supabase-js, lucide-react)
- [x] Set up .gitignore
- [x] Copy media assets from data_acquisition to public/media/

## Phase 2: Configuration & Content
- [x] Create `src/config/wedding.ts` with Ramez & Basma data
- [x] Set up theme CSS variables in globals.css

## Phase 3: Internationalization
- [x] Set up next-intl with ar (default) and en locales
- [x] Create ar.json and en.json message files
- [x] Set up middleware for locale routing
- [x] Configure locale-aware layout with RTL support

## Phase 4: UI Components
- [x] EnvelopeGate component (video bg, wax seal, tap-to-open animation)
- [x] HeroSection component (video bg, couple names, date, CTA)
- [x] CountdownSection component (circular progress rings, live timer)
- [x] ProgrammeSection component (horizontal/vertical timeline)
- [x] DetailsSection component (venue card + map embed)
- [x] DressCodeSection component (info card)
- [x] RSVPSection component (form with signature canvas)
- [x] GuestbookSection component (message cards)
- [x] Footer component (dark, couple names, date)
- [x] LanguageToggle component (fixed pill)
- [x] ScrollReveal wrapper component
- [x] BackgroundMusic component (audio player)

## Phase 5: Database & API
- [x] Create Supabase client lib
- [x] Create RSVP API route (POST + GET)

## Phase 6: Page Assembly
- [x] Compose all sections in main page
- [x] Set up root + locale layouts with fonts & meta tags

## Phase 7: Verification
- [x] npm run build — fix Supabase URL error during build
- [x] Browser test — full flow walkthrough
- [x] RTL/Arabic verification
