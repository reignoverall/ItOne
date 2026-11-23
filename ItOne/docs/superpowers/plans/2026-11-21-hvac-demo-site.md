# HVAC Demo Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a five-page demo website for a fictional HVAC company ("Summit Air Heating & Cooling") to show prospects what the developer can build.

**Architecture:** Angular standalone app with lazy-loaded routes per page, a shared shell (header/footer), static typed data files plus pure helper functions, and Signal Forms for the two forms. No backend — forms validate and show a success state locally.

**Tech Stack:** Angular 22.3 (standalone, signals, Signal Forms from `@angular/forms/signals`), Tailwind CSS v4 (CSS `@theme` tokens), Vitest via `ng test` (jsdom), Prettier.

**Spec:** `ItOne/docs/superpowers/specs/2026-11-21-hvac-demo-site-design.md`

All paths below are relative to `ItOne/` (the Angular app). Run every command from `ItOne/`. The git root is the parent folder.

## Global Constraints

- No new npm dependencies. No external image hosts, fonts CDNs, or map services; icons are inline SVG.
- Follow `ItOne/CLAUDE.md`: no `standalone: true`, no explicit `OnPush`; `input()`/`output()`; native `@if/@for/@switch`; no `ngClass`/`ngStyle`/`CommonModule`; `inject()`; host bindings in `host`; services via `@Service()`; signals with `set`/`update`.
- Signal Forms API (verified in installed 22.3.0): `form(model, schemaFn)`, validators `required`, `email`, `minLength`, `pattern`, `validate`; bind controls with the `FormField` directive: `[formField]="f.name"`; field state via `f.name().invalid()`, `.touched()`, `.errors()`; `submit(form, action)`.
- Component style budget 4kB warn / 8kB error → style with Tailwind utilities, not component CSS.
- WCAG AA contrast and AXE-clean: every input has a `<label>`, errors linked by `aria-describedby`, live results in `aria-live="polite"`, visible focus rings, one `<h1>` per page.
- Animations are subtle and disabled under `prefers-reduced-motion` (use Tailwind `motion-safe:` variants).
- Brand copy (exact): name `Summit Air Heating & Cooling`, tagline `Comfort you can count on, 24/7.`, phone `(555) 010-2468` (`tel:+15550102468`), email `hello@summitair.example`, address `1200 Ridgeline Ave, Pine Valley`, hours `Mon–Fri 7am–7pm, Sat 8am–4pm, 24/7 emergency service`.
- Footer must include the text `Demo site — company, reviews and details are sample content.`
- Palette tokens in `src/styles.css` `@theme`: `--color-navy-900 #0b1f3a`, `--color-navy-700 #16325c`, `--color-ember-500 #f26b1d` (CTA bg with `navy-900` text), `--color-ember-600 #d4560f` (hover), `--color-sky-400 #38bdf8`, `--color-frost-50 #f2f7fc`.

## Review Focus

1. **ZIP input variants** — `" 80512 "`, `"80512-1234"` (ZIP+4) must match Ridgeline; `"8051"`, `"abcde"`, `""` must give a "please enter a 5-digit ZIP" message, not "we don't serve you". → tests in Task 2 (`findAreaByZip`) and Task 4.
2. **Preferred date in the past** on the request form must be rejected; today is allowed. → test in Task 6 (uses injectable `TODAY` token, not a bare `new Date()` in logic).
3. **Mobile menu stays open after navigating** — clicking a nav link must close it and `aria-expanded` returns to `"false"`. → test in Task 1.
4. **Review filter with zero matches** must show an empty-state message, not a blank list. → test in Task 5.
5. **Double submit / submit with errors** — submitting an invalid form shows all errors (fields marked touched) and no success panel; after success, the form is not re-shown until "Submit another request". → tests in Tasks 6 and 7.

---

### Task 1: Branch, baseline, theme, shell and routes

**Files:**
- Modify: `src/styles.css`, `src/index.html` (title, meta description, `lang="en"`), `src/app/app.ts`, `src/app/app.html`, `src/app/app.routes.ts`, `src/app/app.config.ts`, `src/app/app.spec.ts`
- Delete content: `src/app/app.css` (leave empty)
- Create: `src/app/data/company.ts`, `src/app/layout/site-header.ts`, `src/app/layout/site-footer.ts`, `src/app/layout/site-header.spec.ts`, placeholder pages `src/app/pages/home/home-page.ts`, `src/app/pages/request/request-page.ts`, `src/app/pages/areas/areas-page.ts`, `src/app/pages/reviews/reviews-page.ts`, `src/app/pages/contact/contact-page.ts` (each just an `<h1>` for now)

**Interfaces:**
- Produces: `COMPANY` const in `data/company.ts`: `{ name, tagline, phoneDisplay, phoneHref, email, address, hours: string[], yearsInBusiness: 18 }`.
- Produces: `NAV_LINKS: { path: string; label: string }[]` in `layout/site-header.ts` — `/` Home, `/request` Request Service, `/areas` Service Areas, `/reviews` Reviews, `/contact` Contact.
- Produces: routes with `loadComponent` and `title` (`Summit Air | Home`, `… | Request Service`, `… | Service Areas`, `… | Reviews`, `… | Contact`), plus `**` redirecting to `''`. Page components are default-exported classes `HomePage`, `RequestPage`, `AreasPage`, `ReviewsPage`, `ContactPage`.
- Produces: `app.config.ts` adds `withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })` and `withComponentInputBinding()`.

- [ ] **Step 1:** Create branch and commit the untracked scaffold as a baseline: `git -C .. checkout -b feature/hvac-demo`, `git -C .. add ItOne`, commit `chore: add Angular scaffold`.
- [ ] **Step 2: Write failing tests** in `site-header.spec.ts` (render `SiteHeader` with `provideRouter([])`):
  - `renders all five nav links` — 5 links with the `NAV_LINKS` labels.
  - `call button links to phone` — an `a[href="tel:+15550102468"]` exists.
  - `menu toggle sets aria-expanded` — toggle button starts `aria-expanded="false"`, click → `"true"`.
  - `closes menu after navigating` — open menu, click a mobile nav link, `aria-expanded` back to `"false"`.
  - Update `app.spec.ts`: replace the `Hello, ItOne` test with `renders skip link, header and footer` — `a[href="#main"]` exists, `main#main` exists, footer contains the demo-disclaimer text.
- [ ] **Step 3:** Run `npx ng test --watch=false` → new tests FAIL.
- [ ] **Step 4:** Implement: `@theme` tokens + base body styles in `styles.css`; `SiteHeader` (sticky, wordmark linking `/`, desktop nav with `routerLinkActive` + `aria-current`, ember "Call now" button, mobile toggle with `menuOpen = signal(false)` and `aria-controls`); `SiteFooter` (contact, hours, nav, disclaimer); `app.html` = skip link + header + `<main id="main" tabindex="-1"><router-outlet/></main>` + footer; routes and placeholder pages.
- [ ] **Step 5:** Run `npx ng test --watch=false` → PASS; `npx ng build` → succeeds with no budget errors.
- [ ] **Step 6:** Commit `feat: add site shell, theme and routes`.

### Task 2: Static data and pure helpers

**Files:**
- Create: `src/app/data/services.ts`, `src/app/data/areas.ts`, `src/app/data/reviews.ts`, `src/app/data/today.ts`, `src/app/data/areas.spec.ts`, `src/app/data/reviews.spec.ts`

**Interfaces:**
- Produces: `type ServiceId = 'ac-repair' | 'heating' | 'installation' | 'maintenance' | 'air-quality' | 'emergency'`; `interface HvacService { id: ServiceId; name: string; summary: string; icon: string /* SVG path d */ }`; `SERVICES: HvacService[]` (6 entries, names: AC Repair, Heating & Furnace, New System Installation, Maintenance Plans, Indoor Air Quality, 24/7 Emergency Service).
- Produces: `interface ServiceArea { town: string; region: string; zips: string[] }`; `SERVICE_AREAS: ServiceArea[]`; `type ZipLookup = { status: 'invalid' } | { status: 'served'; area: ServiceArea } | { status: 'not-served' }`; `findAreaByZip(input: string): ZipLookup`.
- Produces: `interface Review { id: number; name: string; town: string; date: string /* ISO yyyy-mm-dd */; rating: 1|2|3|4|5; service: ServiceId; text: string }`; `REVIEWS: Review[]` (12 entries, spread across services and towns, mostly 5★, at least one 4★ and one 3★, at least one per `ServiceId`, 2+ for `emergency`, sample first names + last initial); `ratingSummary(reviews: Review[]): { average: number /* 1 decimal */; count: number; byStars: Record<1|2|3|4|5, number> }`; `filterReviews(reviews: Review[], service: ServiceId | 'all'): Review[]` (newest first).
- Produces: `TODAY = new InjectionToken<() => Date>('TODAY', { factory: () => () => new Date() })` in `today.ts`.

Area data (exact, fictional towns):

| Town | Region | ZIPs |
|---|---|---|
| Pine Valley | Central | 80510, 80511 |
| Ridgeline | Central | 80512 |
| Cedar Falls | North | 80520, 80521 |
| Maple Hollow | North | 80522 |
| Brookstone | East | 80530 |
| Willow Creek | East | 80531, 80532 |
| Stonebridge | South | 80540 |
| Aspen Grove | South | 80541 |
| Harbor Point | West | 80550 |
- [ ] **Step 1: Write failing tests**
  - `areas.spec.ts`: `findAreaByZip('80512')` → served, town `Ridgeline`; `' 80512 '` → served; `'80512-1234'` → served; `'99999'` → `not-served`; `'8051'`, `'abcde'`, `''` → `invalid`.
  - `reviews.spec.ts`: `ratingSummary` on `[5,4,5]`-rated fixtures → `{ average: 4.7, count: 3, byStars: {5:2,4:1,3:0,2:0,1:0} }`; `ratingSummary([])` → `{ average: 0, count: 0, … }`; `filterReviews(fixtures, 'heating')` returns only heating, newest first; `'all'` returns all newest first; `REVIEWS` covers every `ServiceId` in `SERVICES`.
- [ ] **Step 2:** `npx ng test --watch=false` → FAIL (modules missing).
- [ ] **Step 3:** Implement data and helpers. `findAreaByZip`: trim, accept `/^\d{5}(-\d{4})?$/`, match first 5 digits.
- [ ] **Step 4:** Tests PASS.
- [ ] **Step 5:** Commit `feat: add HVAC services, areas and reviews data`.

### Task 3: Home page

**Files:**
- Modify: `src/app/pages/home/home-page.ts`
- Create: `src/app/shared/review-card.ts`, `src/app/shared/star-rating.ts`, `src/app/shared/service-icon.ts`, `src/app/pages/home/home-page.spec.ts`

**Interfaces:**
- Consumes: `COMPANY`, `SERVICES`, `SERVICE_AREAS`, `REVIEWS`, `ratingSummary` (Task 1–2).
- Produces: `ReviewCard` (`review = input.required<Review>()`), `StarRating` (`rating = input.required<number>()`, renders 5 SVG stars with `role="img"` and `aria-label="{n} out of 5 stars"`), `ServiceIcon` (`path = input.required<string>()`, decorative `aria-hidden`). Reused by Task 5.

Sections, in order: hero (navy gradient, `<h1>` "Fast, honest heating & cooling for Pine Valley and beyond", tagline, buttons "Request service" → `/request` and "Call (555) 010-2468" → tel, trust badges: Licensed & insured · 24/7 emergency · 18 years in business · average rating from `ratingSummary(REVIEWS)`); services grid (6 cards from `SERVICES`); "Why choose Summit Air" (4 points: upfront pricing, same-day service, certified technicians, 100% satisfaction guarantee); reviews preview (3 newest 5★ via `ReviewCard`, link "Read all reviews" → `/reviews`); areas preview (town chips, link → `/areas`); closing CTA band.

- [ ] **Step 1: Write failing tests** `home-page.spec.ts`: one `h1`; 6 service cards with `SERVICES` names; exactly 3 `app-review-card`; link with `href="/request"` and `href="/reviews"` and `href="/areas"`; badge shows the computed average (e.g. text contains `ratingSummary(REVIEWS).average.toFixed(1)`).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement components and page.
- [ ] **Step 4:** Run → PASS; `npx ng build` → no budget errors.
- [ ] **Step 5:** Commit `feat: build homepage`.

### Task 4: Service Areas page with ZIP checker

**Files:**
- Modify: `src/app/pages/areas/areas-page.ts`
- Create: `src/app/pages/areas/zip-checker.ts`, `src/app/pages/areas/zip-checker.spec.ts`

**Interfaces:**
- Consumes: `SERVICE_AREAS`, `findAreaByZip`, `ZipLookup` (Task 2).
- Produces: `ZipChecker` component — text input (`inputmode="numeric"`, `autocomplete="postal-code"`, label "Enter your ZIP code"), "Check" button, result region `aria-live="polite"`. Uses a plain `zip = signal('')` and `result = signal<ZipLookup | null>(null)` set on submit (no Signal Form needed).

Messages (exact): served → `Good news — we serve {town}! ` + link "Request service" → `/request`; not-served → `We don't currently serve that ZIP, but call us — we may still be able to help.`; invalid → `Please enter a 5-digit ZIP code.`

Page: `<h1>Service Areas</h1>`, intro, `ZipChecker`, areas grouped by region (cards listing towns and ZIPs), a decorative inline-SVG stylized region map (`aria-hidden`).

- [ ] **Step 1: Write failing tests** `zip-checker.spec.ts`: entering `80512` and submitting shows text containing `Ridgeline`; `99999` shows the not-served message; `8051` shows the invalid message; the result container has `aria-live="polite"`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add service areas page and ZIP checker`.

### Task 5: Reviews page

**Files:**
- Modify: `src/app/pages/reviews/reviews-page.ts`
- Create: `src/app/pages/reviews/reviews-page.spec.ts`

**Interfaces:**
- Consumes: `REVIEWS`, `SERVICES`, `ratingSummary`, `filterReviews`, `ReviewCard`, `StarRating`.

Page: `<h1>Customer Reviews</h1>`; summary panel (large average, `StarRating`, "Based on {count} reviews", 5→1 star breakdown bars as `<meter>`-like bars with visible counts); filter as a group of toggle buttons (`aria-pressed`) "All" + each service name, `filter = signal<ServiceId | 'all'>('all')`, `visible = computed(() => filterReviews(REVIEWS, filter()))`; review grid; empty state text `No reviews for this service yet.`

- [ ] **Step 1: Write failing tests**: initial render shows `REVIEWS.length` cards; clicking the "Heating & Furnace" filter shows only heating reviews and sets its `aria-pressed="true"`; with the component's review source overridden to a list lacking `maintenance` (expose `reviews = input<Review[]>(REVIEWS)` for testability), choosing Maintenance shows the empty-state text.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add reviews page with filtering`.

### Task 6: Request Service form

**Files:**
- Modify: `src/app/pages/request/request-page.ts`
- Create: `src/app/pages/request/request-form.ts` (model + schema), `src/app/pages/request/request-page.spec.ts`, `src/app/shared/field-error.ts`

**Interfaces:**
- Consumes: `SERVICES`, `TODAY`, `COMPANY`.
- Produces: `interface ServiceRequest { name: string; phone: string; email: string; address: string; zip: string; service: ServiceId | ''; urgency: 'emergency' | 'this-week' | 'flexible'; preferredDate: string; timeWindow: 'morning' | 'afternoon' | 'evening'; details: string }`; `emptyRequest(): ServiceRequest` (urgency `this-week`, timeWindow `morning`); `requestSchema(today: () => Date)` schema fn.
- Produces: `FieldError` component (`field = input.required<FieldTree<unknown>>()`, `id = input.required<string>()`) that renders the first error message when the field is touched and invalid. Reused by Task 7.

Validation (exact messages): name required `Please enter your name.`; phone required + `pattern(/^\D*(\d\D*){10}$/)` `Please enter a 10-digit phone number.`; email required + `email` `Please enter a valid email address.`; address required `Please enter the service address.`; zip `pattern(/^\d{5}$/)` `Please enter a 5-digit ZIP code.`; service required `Please choose a service.`; preferredDate required unless urgency is `emergency`, and `validate` not before `today()` `Please choose today or a later date.`; details `minLength(10)` `Please describe the problem (at least 10 characters).`

Behavior: `submitted = signal<{ ref: string; data: ServiceRequest } | null>(null)`; on submit use `submit(form, async () => {...})`; invalid → all fields touched, focus moves to first invalid field, no success panel. Valid → show confirmation panel (heading focused, `Thanks, {name}! Your request is in.`, summary, reference `SA-` + 6 digits, emergency note "For emergencies, call (555) 010-2468 now"). Button "Submit another request" resets model to `emptyRequest()` and `submitted` to null. Emergency urgency shows a highlighted callout with the phone number above the submit button.

- [ ] **Step 1: Write failing tests** (provide `{ provide: TODAY, useValue: () => new Date('2026-11-21T12:00:00') }`):
  - submitting the empty form shows `Please enter your name.` and no element containing `Your request is in`.
  - phone `555-010-2468` valid; `555-0102` shows the phone error.
  - preferredDate `2026-11-20` shows `Please choose today or a later date.`; `2026-11-21` has no date error.
  - urgency `emergency` with empty date → no date error.
  - filling all fields validly and submitting shows `Thanks, Jordan! Your request is in.` and a reference matching `/SA-\d{6}/`; clicking "Submit another request" shows an empty form again.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement schema, `FieldError`, and page (two-column on desktop: form + side panel with phone, hours, "What happens next" 3 steps).
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add service request form`.

### Task 7: Contact page

**Files:**
- Modify: `src/app/pages/contact/contact-page.ts`
- Create: `src/app/pages/contact/contact-page.spec.ts`

**Interfaces:**
- Consumes: `COMPANY`, `FieldError`, Signal Forms.

Page: `<h1>Contact Us</h1>`; info cards (phone `tel:` link, email `mailto:` link, address, hours list); contact form `{ name, email, message }` — name required `Please enter your name.`, email required + valid `Please enter a valid email address.`, message `minLength(10)` `Please enter a message (at least 10 characters).`; success state `Thanks, {name} — we'll get back to you within one business day.` with "Send another message" reset.

- [ ] **Step 1: Write failing tests**: tel and mailto links present with `COMPANY` values; empty submit shows all three errors and no success text; valid submit shows the success text; reset shows the form again.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5:** Commit `feat: add contact page`.

### Task 8: Polish and final verification

**Files:** any touched above; `ItOne/CLAUDE.md` (add a short "Project" note: fictional HVAC demo, brand data in `src/app/data/company.ts`).

- [ ] **Step 1:** `npx prettier --write src` and confirm no diff beyond formatting.
- [ ] **Step 2:** `npx ng test --watch=false` → all PASS.
- [ ] **Step 3:** `npx ng build` → success, no budget warnings/errors.
- [ ] **Step 4:** `npm start`, check each page at 375px and 1280px widths: no horizontal scroll, mobile menu works with keyboard (Tab/Enter/Escape closes), focus rings visible, reduced-motion respected. Run an AXE check (browser devtools extension or Lighthouse accessibility) on every page; fix any violations.
- [ ] **Step 5:** Commit `chore: polish and docs`.
