<<<<<<< HEAD
# navi-med
An AI-driven patient platform utilizing generative AI and data algorithms to automate medical logistics, transportation scheduling, and personalized care insights.

### Overview
NaviMed is a patient-centric "App" platform that replaces static health dashboards with an active, predictive interface. Built on empathic analysis the platform utilizes generative AI to translate complex clinical data into actionable patient insights.

### Core Features

    Generative AI Insights: Synthesizes lab results and care plans into simplified, conversational explanations.

    Logistics Orchestration: Integrated algorithms for automated calendar management and transportation assistance.

    Contextual UI: A state-driven dashboard that surfaces high-priority requests (QR check-ins, meal ordering, transit alerts) based on real-time patient data.

    Data Integrity: Architected for high-integrity data pipelines to ensure secure and accurate medical information delivery.

### Team

Robert Baer

April Duley

Debaris Ezumah

Meenakshi Sundaram Venkatanarayanan

Vijayshankar Mishra
=======
# NaviMed

AI-assisted patient navigation showcase aligned with the [NaviMed Figma flows](https://www.figma.com/design/JgNiWH1DOrn4VRq43WG6Xn/NaviMed?node-id=0-1).

## Patient demo (frontend)

Mobile-first React demo: onboarding, auth, HIPAA privacy, Navi intro, home, scheduling, appointments, visit detail, booking success, and Navi listening/thinking overlays. **Navi** is scoped to scheduling, visit prep, check-in, and summaries—not clinical triage.

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
cd frontend
npm run build
npm run preview   # optional local preview of dist/
```

Static assets are emitted to `frontend/dist/` with `base: './'` for flexible hosting (including GitHub Pages project sites).

## Documentation

- `docs/navimed-mvp.docx` — MVP document with **triage agent** language removed or reframed as **scheduling** / **visit intake** (no separate triage agent).

## Repository

Upstream home for this work: [github.com/Dezuma/navi-med](https://github.com/Dezuma/navi-med).
>>>>>>> 5de3071 (Add patient showcase frontend, update MVP doc without triage agent)
