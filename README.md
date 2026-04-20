# NaviMed

An AI-driven patient platform using generative AI and data algorithms for medical logistics, transportation scheduling, and personalized care insights.

**Live patient UI demo (GitHub Pages):** https://dezuma.github.io/navi-med/

Design reference: [NaviMed Figma](https://www.figma.com/design/JgNiWH1DOrn4VRq43WG6Xn/NaviMed?node-id=0-1).

## Repository layout

```
navi-med/
├── frontend/           # Vite + React SPA (deployable static site)
├── tools/mock-ai/      # Local demo API + JSONL callback storage (dev only)
├── docs/               # Product docs (e.g. MVP docx)
└── .github/workflows/  # GitHub Pages deploy
```

## Patient showcase (frontend)

Mobile-first React demo: onboarding, auth, HIPAA privacy, Navi intro, home, scheduling, appointments, visit detail, booking success, and Navi listening/thinking overlays. **Navi** focuses on scheduling, visit prep, check-in, and summaries—not clinical triage.

### Run locally

```bash
cd frontend
npm install
npm run dev
```

### AI responses + callbacks

The UI calls an optional HTTP endpoint for generated replies and can POST anonymized payloads to an optional callback URL. If the endpoint is missing or unreachable, **deterministic smart fallback** text is used so demos never break.

Environment variables (see `frontend/.env.example`):

| Variable | Purpose |
|----------|---------|
| `VITE_NAVI_AI_ENDPOINT` | `POST` JSON `{ prompt, context? }` → `{ text, intent?, followUps? }` |
| `VITE_NAVI_CALLBACK_URL` | Optional `POST` for telemetry/analytics (payload size–limited client-side) |
| `VITE_NAVI_API_KEY` | Optional Bearer token for the mock server **only** — still exposed in the browser bundle |

**Security notes**

- Anything prefixed with `VITE_` is embedded in static assets — **never treat it as a secret**.
- Do not paste PHI into the demo assistant; use synthetic demo content only.
- For production, put API keys on a **backend-for-frontend** or managed gateway, not in the SPA.
- The mock server defaults to **loopback** (`127.0.0.1`) and optional `NAVI_API_KEY` if you expose it beyond your machine.

### Local mock AI + callback server

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

- Responses: `http://127.0.0.1:8787/navi/respond`
- Callback log (memory + append-only file): `GET http://127.0.0.1:8787/navi/callbacks`
- Persisted lines: `tools/mock-ai/data/callbacks.jsonl` (gitignored)
- Health: `http://127.0.0.1:8787/health`

See `tools/mock-ai/README.md` for tunables (`HOST`, `PORT`, rate limits, API key).

### GitHub Pages behavior

Static hosting cannot proxy private APIs: the public demo uses **fallback responses** unless you configure a **publicly reachable HTTPS** endpoint (rare for demos). Local mock remains the recommended full pipeline.

## Documentation

- `docs/navimed-mvp.docx` — MVP document.

## Repository

https://github.com/Dezuma/navi-med

### Team

Robert Baer · April Duley · Debaris Ezumah · Meenakshi Sundaram Venkatanarayanan · Vijayshankar Mishra

### Overview

NaviMed is a patient-centric app that replaces static health dashboards with an active interface: generative AI for clearer explanations, logistics orchestration, a state-driven UI, and high-integrity data practices.
