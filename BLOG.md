# Engineering AeroPulse: Building a GenAI Urban Air Quality Advisor in Google Antigravity

*By the Antigravity Engineering Team · November 18, 2026*

---

## Executive Summary

When severe winter smog grips metropolitan basins like Delhi, Salt Lake City, Beijing, or Katowice, colder air pools near the surface under a thermal inversion layer, trapping vehicular exhaust, biomass smoke, and industrial particulate matter close to street level. In response, families tightly seal their homes to preserve warmth—frequently unaware that **indoor air can become 2 to 5 times (and during unvented cooking or heating, up to 100 times) more polluted than the air outside**.

**AeroPulse** was conceived and built within Google Antigravity to solve this crisis. Combining real-time atmospheric telemetry (Open-Meteo, OpenAQ), deterministic pulmonary exposure physics, Google Cloud Vertex AI (Gemini 3), and strict accessible design, AeroPulse delivers verified daily routines, indoor air quality hacks, and greener alternatives for vulnerable families.

This narrative documents our step-by-step engineering journey, highlighting our agentic workflow, architectural decisions, and automated test verifications.

---

## 1. The Antigravity Agentic Workflow

Rather than writing monolithic code, we leveraged Antigravity's agentic primitives, breaking down the application lifecycle into distinct, verifiable phases tracked in `AGENTS.md`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ANTIGRAVITY TASK BOARD                          │
├────────────────────────────────┬───────────────────────────────────────┤
│ Milestone                      │ Status & Verification                 │
├────────────────────────────────┼───────────────────────────────────────┤
│ Phase 1: Architecture & Plan   │ [COMPLETED] Architecture Spec created │
│ Phase 2: Design Tokens & Scaff │ [COMPLETED] Next.js 14 + Tailwind set │
│ Phase 3: Core Domain Services  │ [COMPLETED] Deterministic & AI engine │
│ Phase 4: API Handlers          │ [COMPLETED] /api/aqi, /api/advisor    │
│ Phase 5: UI & Landing Page     │ [COMPLETED] Skill-compliant layout    │
│ Phase 6: Atmospheric Subagent  │ [COMPLETED] atmospheric-data-collector│
│ Phase 7: EPA Indoor Hacks      │ [COMPLETED] EPA 2-5x Module active    │
│ Phase 8: Greener Swaps         │ [COMPLETED] EPA 404g/mi Factor Engine │
│ Phase 9: Accessibility & a11y  │ [COMPLETED] axe-core 0 violations     │
│ Phase 10: Full Automated Tests │ [COMPLETED] 52 / 52 tests passed      │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Ingesting Real-Time Atmospheric Telemetry

The foundation of any honest air advisor is reliable data. We created a dedicated, reusable retrieval client (`lib/data-retrieval/atmospheric-client.ts`) and registered an Antigravity agent (`atmospheric-data-collector`).

### Understanding Data Reliability
- **Open-Meteo Air Quality (CAMS & NOAA GFS)**: Operates at an 11 km global grid, assimilating satellite Aerosol Optical Depth (AOD) from Sentinel-5P, MODIS, and VIIRS. It updates hourly with a 1-to-2-hour processing latency.
- **Open-Meteo High-Resolution Weather**: Provides synoptic surface temperature, relative humidity, wind velocity, and critical **Planetary Boundary Layer Height ($H_{\text{pbl}}$)**.
- **Inversion Physics Formulation**:
  $$\text{Thermal Inversion} = (H_{\text{pbl}} < 350\text{ m}) \land (\text{Wind Speed} < 8\text{ km/h})$$
  When $H_{\text{pbl}}$ collapses below 350 meters on calm winter nights, the atmospheric mixing volume drops dramatically, locking pollutants at human breathing height.

### Resilient Error Handling & Timeouts
To ensure zero failure during emergency episodes, the client wraps every fetch in an `AbortController` timeout (default 6000ms), provides exponential backoff retry with jitter on `5xx` responses, and catches `429 Too Many Requests` gracefully. If upstream servers are unreachable, a calibrated physical fallback guarantees continuous guidance.

---

## 3. Deterministic Pulmonary Inhalation & Carbon Abatement

A core design principle of AeroPulse is: **Never let an LLM hallucinate mathematical impact numbers.**

While Google Cloud Vertex AI (Gemini 3) provides natural language synthesis and contextual translation, all quantitative metrics are calculated deterministically by `lib/impact-calculator.ts`:

$$\Delta \text{Dose}_{\text{PM2.5}} = V_E \times \Delta C \times t_{\text{exp}}$$

Where:
- $V_E$ represents demographic ventilation rates from the *EPA Exposure Factors Handbook* ($0.35\text{ m}^3/\text{h}$ for infants, $0.55\text{ m}^3/\text{h}$ for seniors, $0.70\text{ m}^3/\text{h}$ for pregnant women, and $1.80\text{ m}^3/\text{h}$ for outdoor commuters).
- $\Delta C$ represents the concentration differential between ambient air and a sealed, filtered clean room.
- Carbon savings are calculated via DEFRA 2023 and EPA fuel emission factors.

Every suggestion in the UI features an inspectable **"Formula & Assumptions"** modal dialog, allowing users to verify the exact equations and parameters used.

---

## 4. The EPA 2–5× Indoor Pollution Finding & Winter Hacks

A key finding highlighted in AeroPulse is the **EPA Indoor Environments Division** discovery (EPA publication *Care for Your Air*, EPA 402/F-08/008):

> *"Indoor air pollutant levels can be 2 to 5 times higher than outdoor levels, and in some winter conditions with unvented heating, up to 100 times higher."*

We built a dedicated module (`components/IndoorAirAdvice.tsx`) with verified winter hacks, each featuring an exact impact explanation:
1. **Continuous True HEPA Operation**: Cuts room PM2.5 by 65% to 85% within 30 minutes without losing room warmth.
2. **Ducted Range Hood Exhaust**: Reduces cooking-generated ultrafine particles and $\text{NO}_2$ spikes by up to 82%.
3. **Avoiding Unvented Kerosene Heaters**: Eliminates direct carbon monoxide emissions and cuts peak combustion hazards by over 90%.
4. **Damp Microfiber Mopping**: Prevents a 25 to 40 $\mu\text{g/m}^3$ particulate resuspension spike that lingers for up to 3 hours when dry sweeping.
5. **Silicone Weatherstripping**: Lowers outdoor smog infiltration into sleeping quarters by up to 70%.

---

## 5. Sustainable Swaps & The EPA 404 g/Mile Benchmark

To empower individual and community climate action, AeroPulse enumerates sustainable swaps formatted in clear arrow-annotated UI text (`Action ➞ Impact annotation`):

- `Switch from solo gasoline car to electric metro rail ➞ ~4.85 kg CO2e saved per 15 mile commute & 55 µg in cabin exhaust avoided` (grounded in the EPA $404\ \text{g CO}_2\text{e}/\text{mile}$ vehicle factor).
- `Switch from biomass cookstove to LPG or induction ➞ ~180 µg/m³ indoor PM2.5 reduction & 3.6 kg CO2e avoided daily` (EPA AP-42 residential combustion factor).
- `Switch from unvented kerosene to electric heat pump ➞ ~0.52 kg CO2e saved per hour & eliminates 45 µg/m³ indoor soot`.
- `Switch to plant based non aerosol cleaning products ➞ ~720 µg/m³ VOC reduction & prevents secondary aerosol formation`.

An interactive simulator widget allows families to slide their personal commute distance (5 to 45 miles) or heating hours (2 to 14 hours) to see their direct daily and annual carbon savings calculated in real time.

---

## 6. Frontend Accessibility & Semantic Engineering

Following the strict `landing-page-design` skill:
- **Typography**: Manrope for text (`sans`), Geist Mono for numerical metrics (`mono`). Zero italics anywhere.
- **Copy**: Zero hyphens inside text phrases (`real time`, `low emission`, `clean room`, `two to five times`).
- **Semantic HTML**: `<fieldset>`, `<legend>`, `<label htmlFor="...">`, `<section>`, `<article>`, `<dl>`, `<dt>`, `<dd>`.
- **W3C APG Patterns**:
  - Tablist with `role="tablist"`, `role="tab"`, and arrow key navigation.
  - Modal Dialog with `role="dialog"`, `aria-modal="true"`, focus trapping, and `Escape` key listeners.
  - Range sliders with `role="slider"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuetext`.
- **Contrast & Focus**: 2px visible focus rings (`:focus-visible`) and `@media (forced-colors: active)` support for Windows High Contrast mode.
- **Mobile Responsive**: Tested and optimized down to 390px viewport width with zero horizontal overflow.

---

## 7. Verification: 52 Automated Tests & Strict Security

Every layer of AeroPulse is backed by automated tests using Vitest, jsdom, and axe-core:

```
$ npm test

 RUN  v2.1.9 C:/Main/H2S 6

 ✓ tests/security-csp.test.ts (3 tests)
 ✓ tests/indoor-advice.test.ts (4 tests)
 ✓ tests/suggestion-generation.test.ts (4 tests)
 ✓ tests/indoor-guidelines.test.ts (4 tests)
 ✓ tests/impact-calculator.test.ts (3 tests)
 ✓ tests/sanitizer.test.ts (5 tests)
 ✓ tests/greener-swaps.test.ts (4 tests)
 ✓ tests/data-fetching-mock.test.ts (5 tests)
 ✓ tests/accessibility.test.ts (7 tests)
 ✓ tests/i18n.test.ts (3 tests)
 ✓ tests/ui-rendering-snapshots.test.tsx (5 tests)
 ✓ tests/atmospheric-client.test.ts (5 tests)

 Snapshots:   5 written
 Test Files:  12 passed (12)
 Tests:       52 passed (52)
 Duration:    11.38s
```

### Security & Secret Scanning Audit
- **Zero Hardcoded Secrets**: Automated static scanning confirms no API keys, credentials, or secrets exist in the codebase. All external credentials are read exclusively through `process.env`.
- **Strict Content Security Policy (CSP)**: Enforced via `next.config.mjs` with `default-src 'self'`, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security`.

---

## Conclusion

AeroPulse illustrates how GenAI and environmental science can combine to protect human health during climate emergencies. By anchoring Gemini 3 within deterministic physical bounds and wrapping it in an accessible, transparent user experience, we can help families make informed, life-saving decisions when the winter air turns toxic.
