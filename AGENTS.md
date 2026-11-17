# AGENTS.md — Urban Air Quality Advisor (AeroPulse)

## Project Overview
**AeroPulse** is an agentic, GenAI-driven urban air-quality advisor designed for families and vulnerable communities coping with severe winter smog and atmospheric inversion episodes. It integrates real-time outdoor atmospheric telemetry (Open-Meteo, OpenAQ), WHO/EPA indoor air-quality standards, physics-based inhalation and carbon impact calculation models, and Google Vertex AI Gemini 3 prompt orchestration.

---

## Architectural Principles & Design System
1. **Design System Specification**: Adheres strictly to `landing-page-design` skill (Manrope & Geist Mono typography, Tailwind strict scale, zero hyphens in text phrases, zero orphaned words with `text-wrap: balance` & `text-wrap: pretty`, flat dark theme backgrounds `#000000` to `#1F1F1F`, nested radii formula $R_{\text{inner}} = R_{\text{outer}} - \text{gap}$, Phosphor icons, custom cubic-bezier motion `cubic-bezier(0.22, 1, 0.36, 1)`, and mandatory B11 word-by-word tagline reveal).
2. **Deterministic Impact Computation**: AI recommends actions, but impact statistics (carbon saved in kg CO2e, PM2.5 inhaled dose reduction in µg) are calculated by verified mathematical models with transparent, inspectable assumptions.
3. **Google Cloud Integration**: Vertex AI Gemini 3 structured prompt pipeline, Google Cloud Translation integration for multilingual localized guidance, and Cloud-native telemetry logging architecture.
4. **Resilient Data Ingestion**: Real-time atmospheric API fetching with caching, fallbacks, and parameter validations.

---

## Agentic Task Execution List

- [x] **Phase 1: Architecture, Strategy & Design Specification**
  - [x] Draft end-to-end system architecture & data flow
  - [x] Create Part A Strategy document (Intake, Hero copy, Benefits, How it works, FAQ, SEO/AEO, Layout selection)
  - [x] Initialize `AGENTS.md` task tracker
- [x] **Phase 2: Project Scaffolding & Design System Tokens**
  - [x] Initialize Next.js 14 TypeScript application
  - [x] Configure Tailwind CSS with strict scale, named text styles (`heading-1`..`caption-5`), custom colors, spacing tokens
  - [x] Install Phosphor icons (`@phosphor-icons/react`), Zod, and testing libraries (`vitest`, `axe-core`)
- [x] **Phase 3: Core Domain Services & Data Flow**
  - [x] `lib/aqi-service.ts`: Open-Meteo & OpenAQ outdoor atmospheric collector (PM2.5, PM10, NO2, O3, temperature inversion detection)
  - [x] `lib/impact-calculator.ts`: Deterministic inhalation dose (µg PM2.5 avoided) and carbon abatement (kg CO2e) engine
  - [x] `lib/indoor-guidelines.ts`: WHO 2021 & EPA indoor AQ guidelines and DIY air cleaner CADR model
  - [x] `lib/gemini-advisor.ts`: Vertex AI Gemini 3 prompt orchestrator with structured JSON outputs and fallback resilience
  - [x] `lib/sanitizer.ts`: Input sanitization and Zod validation schema
  - [x] `lib/i18n.ts`: Multilingual engine (English, Hindi, Mandarin, Spanish, French, Punjabi)
- [x] **Phase 4: API Routes & Backend Handlers**
  - [x] `app/api/aqi/route.ts`: Weather and outdoor smog conditions endpoint
  - [x] `app/api/advisor/route.ts`: Agentic advisor endpoint combining context, profile, real-time AQI, and Gemini 3
  - [x] `app/api/cadr/route.ts`: DIY Corsi-Rosenthal / HEPA sizing calculator
- [x] **Phase 5: User Interface Implementation (Design Skill Compliant)**
  - [x] Floating navigation bar with language selector and live smog alert status
  - [x] Hero section with `#FFFFFF` -> `#9B9B9B` text gradient, outcome copy, primary CTA
  - [x] Live Urban Air Advisor Interactive Studio (City picker, user profile builder, dynamic recommendations)
  - [x] Transparent Impact & Inhaled Dose visualizer with formula breakdowns
  - [x] DIY Clean Air Hacks & Corsi-Rosenthal CADR interactive planner
  - [x] B11 Mandatory Tagline Reveal section with word-by-word scroll reveal
  - [x] Benefits & How It Works sections
  - [x] Real Community Case Studies & Proof
  - [x] FAQ section & Final CTA
  - [x] Semantic, keyboard & screen-reader accessible footer
- [x] **Phase 6: Dedicated Data Retrieval Layer & Antigravity Agent**
  - [x] Register Antigravity subagent `atmospheric-data-collector`
  - [x] Author `lib/agents/atmospheric-agent-spec.ts` with agent prompt and schema
  - [x] Author reusable client `lib/data-retrieval/atmospheric-client.ts` with PM2.5, NO2, local weather, and boundary layer ingestion
  - [x] Author standalone executable example `examples/fetch-air-quality-example.ts`
  - [x] Document data source reliability analysis (Open-Meteo CAMS, Open-Meteo High Resolution Forecast, OpenAQ)
  - [x] Implement timeout controls via `AbortController` and exponential backoff retry logic
- [x] **Phase 7: Indoor Air Quality Advice & Authoritative EPA Module**
  - [x] Author `lib/indoor-advice.ts` with authoritative EPA cross-references and winter hacks
  - [x] Cross-reference EPA finding that indoor air can be 2 to 5 times more polluted than outdoor air (up to 100x in unvented winter heating)
  - [x] Implement brief, quantified impact explanations for all items (e.g. range hood cuts NO2/aerosols by up to 82%, HEPA cuts PM2.5 by 65-85%, kerosene avoidance cuts >90% combustion hazards)
  - [x] Author `components/IndoorAirAdvice.tsx` with dynamic household risk toggles and category filters
  - [x] Integrate into `app/page.tsx` and `components/Navbar.tsx` as a distinct section
  - [x] Unit test suite in `tests/indoor-advice.test.ts`
- [x] **Phase 8: Greener Alternatives & Emission Quantification Module**
  - [x] Author `lib/greener-swaps.ts` with EPA emission factor models (EPA 404 g/mile passenger vehicle factor, AP-42 combustion)
  - [x] Enumerate sustainable swaps formatted in arrow-annotated UI text (`Action ➞ Impact annotation`)
  - [x] Compute carbon saved (kg CO2e) and particulate/VOC pollution reduced (µg/m³ or %)
  - [x] Author `components/GreenerAlternatives.tsx` with interactive personal impact simulator widget
  - [x] Unit test suite in `tests/greener-swaps.test.ts`
- [x] **Phase 9: Semantic Frontend Architecture & Accessibility (a11y) Overhaul**
  - [x] Author `components/LocationInput.tsx` with `<fieldset>`, `<legend>`, `<label htmlFor="...">`, `role="radiogroup"`
  - [x] Author `components/ProfileBuilder.tsx` with accessible slider (`role="slider"`, `aria-valuenow`), dropdowns, focus rings
  - [x] Author `components/SuggestionsDisplay.tsx` with W3C APG Tablist (`role="tablist"`, `role="tab"`) & Modal Dialog (`role="dialog"`, `aria-modal="true"`, Esc key handler)
  - [x] Enhance `components/Navbar.tsx` with mobile menu disclosure, `aria-expanded`, skip-to-content landmark
  - [x] Configure visible high-contrast focus rings (`:focus-visible`) and `@media (forced-colors: active)` in `app/globals.css`
  - [x] Author automated accessibility audit suite in `tests/accessibility.test.ts` using `axe-core`
- [x] **Phase 10: Automated Testing & Verification**
  - [x] Vitest test suite covering PM2.5, NO2, weather, boundary layer, timeouts, fallbacks, indoor guidelines, EPA advice, greener swaps, and WCAG accessibility
  - [x] Execute tests and verify 100% pass rate (35 / 35 tests passed)
  - [x] Production build verification (`npm run build` completed with code 0)
