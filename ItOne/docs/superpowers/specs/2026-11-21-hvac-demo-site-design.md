# HVAC Demo Site — Design

## Intent
A demo website to show HVAC prospects what the developer can build. It is a portfolio pitch piece, not a live business site. Success = a prospect clicks through it and thinks "I want that for my company."

- Brand: **fictional** HVAC company, reusable for any HVAC prospect; real details can be swapped in later.
- Layout: **separate pages** (chosen over one long scrolling page because it feels like a real business site and shows more range).

## Goals
- Modern, polished, mobile-first homepage that sells the company in one screen.
- Five routed pages: Home, Request Service, Service Areas, Reviews, Contact.
- Forms that feel real: validation, inline errors, a success state.
- Accessible (WCAG AA, passes AXE) and fast — a quality signal in itself.

## Non-goals
- No backend, email sending, payments, CMS, auth, or booking calendar integration.
- No real customer data or real reviews.

## Anti-goals (failure even if it works)
- Looks like a generic template / stock Tailwind starter.
- Fake content that could be mistaken for a real company's (reviews must be marked as sample content in the footer).
- Broken or awkward on a phone — most HVAC customers arrive on mobile in an emergency.

## Constraints
- Existing app in `ItOne/`: Angular 22 standalone, Tailwind v4 (CSS-configured), Vitest, Prettier. No new dependencies needed.
- Follow `ItOne/CLAUDE.md` conventions: signals, `input()`/`output()`, native control flow, Signal Forms for new forms, `@Service`/`inject()`, lazy-loaded routes, host bindings in `host`, no `ngClass`/`ngStyle`.
- Component style budget is 4kB warn / 8kB error → style with Tailwind utilities.

## Approaches considered
1. **Separate routed pages (chosen).** Each section is its own lazy route; homepage previews areas and reviews and links through. Most realistic, best showcase.
2. One long scrolling page + Contact page. Faster to skim, but shows less range and looks more like a landing page than a business site.

## Decided design

### Brand (builder's call, swappable)
- Name: **"Summit Air Heating & Cooling"**, tagline "Comfort you can count on, 24/7."
- Placeholder phone `(555) 010-2468`, email `hello@summitair.example`, fictional address.
- Palette: deep navy base, warm orange accent (heat/CTA), cool sky blue secondary (cooling). Defined as Tailwind v4 `@theme` tokens in `src/styles.css`. All text/background pairs meet AA contrast.
- Brand-level data (name, phone, hours, etc.) lives in one config file so it can be swapped per prospect.

### Shared shell
- Sticky header: logo/wordmark, nav (Home, Request Service, Areas, Reviews, Contact), prominent "Call now" button (`tel:` link). Mobile: hamburger menu with proper focus handling and `aria-expanded`.
- Footer: contact info, hours, service area summary, "Demo site — sample content" note.
- Skip-to-content link; page titles set per route.

### Pages
- **Home (`/`)**: hero with headline, emergency CTA + "Request service" button, trust badges (licensed & insured, 24/7, years in business); services grid (AC repair, heating/furnace, installation, maintenance plans, indoor air quality, emergency service); "why choose us" strip; 3 review cards → `/reviews`; service-area chips → `/areas`; closing CTA band.
- **Request Service (`/request`)**: Signal Forms form — name, phone, email, address/ZIP, service type (select), urgency (radio: emergency / this week / flexible), preferred date + time window, problem description. Inline validation with accessible error messages; on submit shows a confirmation panel with a summary and a fake reference number. Nothing is sent.
- **Service Areas (`/areas`)**: grid of ~8–10 fictional towns grouped by region, each with ZIP codes; a "Do we serve you?" ZIP checker giving an instant yes/no result (announced via `aria-live`). Stylized map illustration optional (builder's call; no external map service).
- **Reviews (`/reviews`)**: rating summary (average, count, star breakdown bars); filterable list of sample reviews (by service type) with name, town, date, star rating, text.
- **Contact (`/contact`)**: phone, email, hours, address; simple contact form (name, email, message) with validation and success state.

### Data
- Static typed data files (services, areas, reviews, company info) under `src/app/data/` — no HTTP.

## Left to the builder
- Exact component breakdown, folder structure, copy wording, icons (inline SVG), imagery approach (no external image hosts; CSS/SVG illustration or gradient backgrounds), and animation details (subtle, respects `prefers-reduced-motion`).
- Tests: specs for form validation/submit behavior, ZIP checker, and review filtering; update the existing `app.spec.ts`.
