# NaviMed

An AI-driven patient platform using generative AI and data algorithms for medical logistics, transportation scheduling, and personalized care insights.

**Live patient UI demo (GitHub Pages):** https://dezuma.github.io/navi-med/

Design reference: [NaviMed Figma](https://www.figma.com/design/JgNiWH1DOrn4VRq43WG6Xn/NaviMed?node-id=0-1).

## Patient showcase (frontend)

Mobile-first React demo: onboarding, auth, HIPAA privacy, Navi intro, home, scheduling, appointments, visit detail, booking success, and Navi listening/thinking overlays. **Navi** focuses on scheduling, visit prep, check-in, and summaries—not clinical triage.

### Run locally

```bash
cd frontend
npm install
npm run dev
```

### AI response callback integration

The UI now supports generated responses from an external AI endpoint, plus an optional callback webhook.

- `VITE_NAVI_AI_ENDPOINT` - `POST` endpoint that accepts `{ prompt, context }` and can return:
  - `text` (string),
  - `intent` (`schedule | appointments | prep | summary | general`),
  - `followUps` (string array).
- `VITE_NAVI_CALLBACK_URL` - optional `POST` callback destination for generated responses.

Example:

```bash
cd frontend
cat <<'EOF' > .env.local
VITE_NAVI_AI_ENDPOINT=https://your-api.example.com/navi/respond
VITE_NAVI_CALLBACK_URL=https://your-api.example.com/navi/callback
EOF
```

If no AI endpoint is configured (or the request fails), Navi uses an in-app fallback generator.

### Local mock AI + callback server (ready demo)

You can run a local mock endpoint and callback collector included in this repo:

```bash
# Terminal 1
cd tools/mock-ai
npm start
```

```bash
# Terminal 2
cd frontend
cp .env.example .env.local
npm run dev
```

Then:

- Ask Navi anything in the UI to generate responses from `http://127.0.0.1:8787/navi/respond`
- Callback events are stored in memory and viewable at:
  - `http://127.0.0.1:8787/navi/callbacks`
  - health check: `http://127.0.0.1:8787/health`


## Documentation

- `docs/navimed-mvp.docx` — MVP document.

## Repository

https://github.com/Dezuma/navi-med

### Team

Robert Baer · April Duley · Debaris Ezumah · Meenakshi Sundaram Venkatanarayanan · Vijayshankar Mishra

### Overview

NaviMed is a patient-centric app that replaces static health dashboards with an active interface: generative AI for clearer explanations, logistics orchestration, a state-driven UI, and high-integrity data practices.
