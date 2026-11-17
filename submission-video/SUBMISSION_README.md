# AeroPulse — Project Demo Video Submission Package

> **PromptWars Virtual · Challenge 6 Submission**  
> **Repository**: [https://github.com/Amit-Patra-04/PromptsWars-Challenge6-H2S](https://github.com/Amit-Patra-04/PromptsWars-Challenge6-H2S)  
> **Video File**: `submission-video/aeropulse-demo-presentation.mp4` (21.74 MB · 720p HD · 67 Seconds · 30 FPS)  

---

## Package Directory Overview

```
submission-video/
├── aeropulse-demo-presentation.mp4    # High-definition rendered MP4 demo video presentation
├── DEMO_VIDEO_SCRIPT.md               # Word-for-word voiceover script with exact timecodes
├── SUBMISSION_README.md               # Evaluator guide, timestamps, and rubric alignment
├── INTERACTIVE_DEMO_WALKTHROUGH.html  # Interactive browser-executable presentation player
└── generate_video.py                  # Self-contained, reproducible Python video generation script
```

---

## Video Scene Timestamps & Content Index

| Timestamp | Scene Name | Core Concepts & Rubric Requirements Demonstrated |
| :--- | :--- | :--- |
| **0:00 – 0:08** | **Scene 1: Introduction & Overview** | Introduction to AeroPulse, Antigravity agentic architecture, Challenge 6 overview, and test/a11y badges. |
| **0:08 – 0:17** | **Scene 2: Winter Smog & Geophysics** | Atmospheric thermal inversion formula ($H_{\text{pbl}} < 350\text{ m}$, wind $< 8\text{ km/h}$) and the EPA 2 to 5x (up to 100x) indoor pollution finding (EPA 402/F-08/008). |
| **0:17 – 0:25** | **Scene 3: Real-Time Ingestion** | Open-Meteo CAMS criteria pollutants ($\text{PM}_{2.5}$, $\text{NO}_2$), Open-Meteo weather ($H_{\text{pbl}}$), OpenAQ ground monitors, 6000ms `AbortController`, in-memory cache, and fallbacks. |
| **0:25 – 0:34** | **Scene 4: Pulmonary Dose Modeling** | Deterministic inhalation formula ($\Delta \text{Dose} = V_E \times \Delta C \times t$), EPA Table 6-1 minute ventilation rates ($0.35$ to $1.80\ \text{m}^3/\text{h}$), and audited infant proof ($336\ \mu\text{g avoided}$, 74% reduction). |
| **0:34 – 0:42** | **Scene 5: EPA Indoor Hacks** | 4 quantified winter hacks (HEPA cuts $\text{PM}_{2.5}$ 65–85%, range hood cuts ultrafines up to 82%, kerosene avoidance cuts $>90\%$ combustion hazards, damp mopping). |
| **0:42 – 0:50** | **Scene 6: Greener Swaps & Simulator** | Arrow-annotated UI syntax (`Action ➞ Impact annotation`), EPA 404 g/mile vehicle factor, AP-42 residential combustion, and interactive commute/heating slider simulator. |
| **0:50 – 0:58** | **Scene 7: Dual Google Cloud Services** | Service 1: Vertex AI (Gemini 3 Pro/Flash) structured JSON synthesis; Service 2: Google Cloud Translation API across 6 languages (EN, HI, ZH, ES, FR, PA). |
| **0:58 – 1:07** | **Scene 8: Rigor, Testing & Impact** | 59/59 automated Vitest tests passing across 13 files (100% pass rate), WCAG 2.1 AAA compliance with `axe-core`, strict Level 3 CSP, and civic climate impact. |

---

## How to View and Play the Demo Video

### Option A: Direct Video Playback
Open [aeropulse-demo-presentation.mp4](file:///c:/Main/H2S%206/submission-video/aeropulse-demo-presentation.mp4) in any media player (Windows Media Player, VLC, QuickTime, or Chrome/Edge).

### Option B: Interactive Browser Walkthrough
Open [INTERACTIVE_DEMO_WALKTHROUGH.html](file:///c:/Main/H2S%206/submission-video/INTERACTIVE_DEMO_WALKTHROUGH.html) in your browser. It provides an interactive slide-by-slide player with play/pause, keyboard navigation, scrubber, and voiceover text.

### Option C: Re-generate the Video
To re-render the MP4 video programmatically from source:
```bash
python submission-video/generate_video.py
```
*(Requires Python 3.10+ with `Pillow`, `numpy`, and `opencv-python` installed).*
