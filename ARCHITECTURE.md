# NaviMed Technical Architecture

## 1. System Overview

NaviMed is a mobile-first patient care navigation prototype. The app demonstrates how a patient like **Michael Carter (PT0141)** can ask for help with scheduling, appointment prep, check-in, lab review, medication review, visit summaries, and follow-up planning.

The current implementation is a deployable EHR integrated React/Vite frontend backed by a Node.js AI service that loads structured CSV/JSON data and routes response generation through the IBM watsonx API.

## 2. Actual Tech Stack

| Layer | Technology Used | Purpose |
| --- | --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router | Mobile patient showcase UI and hash-routed GitHub Pages deployment |
| Styling | Plain CSS in `frontend/src/index.css` plus inline component styles | Lightweight mobile-first styling without Tailwind |
| Local AI/API service | Node.js HTTP server in `tools/mock-ai/server.mjs` | Prompt handling, intent routing, slot ranking, medical context responses, callback capture |
| Data sources | CSV files and JSON under `tools/mock-ai/data_sources/` | Appointments, providers, clinics, schedule slots, reminders, preferences, transport context, and Michael Carter medical profile |
| LLM | IBM watsonX text generation API | Generation path when `WATSONX_ROUTE_ENABLED=true` and valid IBM credentials/project ID are configured / Not Rejected |
| Deployment | GitHub Pages via `.github/workflows/deploy-pages.yml` | Static frontend hosting |
| Runtime fallback | Frontend dictionary fallback in `frontend/src/lib/navi-ai.ts` | Keeps public/static demos useful if the API backend is unavailable |

## 3. Repository Layout

```text
navi-med/
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── components/        # Phone shell, side menu, Ask Navi bar
│   │   ├── screens/           # Patient, scheduling, visit, post-visit, provider/admin screens
│   │   ├── lib/navi-ai.ts     # Frontend AI client + local dictionary fallback
│   │   └── demo-medical-data.ts
│   └── vite.config.ts         # GitHub Pages base path config
├── tools/mock-ai/
│   ├── server.mjs             # WatsonX AI/API backend
│   └── data_sources/          # CSV/JSON grounding data
├── docs/
│   ├── watsonx-constructable-prompts.md
│   └── demo-script.md
└── .github/workflows/
    └── deploy-pages.yml
```

## 4. Data Sources Used

The backend loads these files at startup:

```text
tools/mock-ai/data_sources/appointments.csv
tools/mock-ai/data_sources/providers.csv
tools/mock-ai/data_sources/clinics.csv
tools/mock-ai/data_sources/schedule_slots.csv
tools/mock-ai/data_sources/scheduling_preferences.csv
tools/mock-ai/data_sources/reminder_events.csv
tools/mock-ai/data_sources/transport_context.csv
tools/mock-ai/data_sources/medical_profiles.json
```

The current proof dataset includes:

- 220 appointments
- 1,136 schedule slots
- 8 providers
- 4 clinics
- 180 reminder events
- 150 scheduling preferences
- 170 transport records
- 1 medical profile for Michael Carter / `PT0141`

## 5. AI / Agent Flow

The frontend calls:

```text
POST http://127.0.0.1:8787/navi/respond
```

with:

```json
{
  "prompt": "Explain liver enzymes for Michael Carter PT0141",
  "context": "live chat demo"
}
```

The mock backend then:

1. Extracts or defaults the patient ID (`PT0141`).
2. Infers intent such as `schedule`, `prep`, `appointments`, `summary`, or `general`.
3. Loads relevant schedule and medical context from CSV/JSON.
4. Uses deterministic dictionary/routing logic for reliable responses.
5. Sends prompt + evidence to IBM watsonx if enabled.
6. Returns:
   - patient-facing text
   - follow-up chips
   - structured JSON
   - evidence snapshots

## 6. Scheduling Logic

Appointment recommendations are generated in `tools/mock-ai/server.mjs` using:

- specialty match
- modality match
- same-provider preference
- time-of-day preference
- clinic access
- soonest availability
- provider lateness risk

The output includes ranked appointment options with provider, clinic, time, modality, and score.

## 7. Medical Context Logic

The medical response path uses `tools/mock-ai/data_sources/medical_profiles.json`.

For Michael Carter, the app can respond to prompts such as:

- `I feel sick`
- `Explain liver enzymes`
- `Review meds list`
- `Show care gaps`
- `Schedule follow-up`

Current medical data includes:

- blood pressure: `138/86 mmHg`
- heart rate: `78 bpm`
- oxygen saturation: `98%`
- temperature: `98.4 F`
- medication: `lisinopril 10 mg daily`
- allergy: `penicillin`
- ALT: `68 U/L`
- AST: `42 U/L`
- fasting glucose: `104 mg/dL`

The app is designed for care navigation and does not diagnose, prescribe, or replace emergency care.

## 8. IBM watsonx API Integration

watsonx is supported as a backend generation path.

The server-side config is:

```bash
cd tools/mock-ai
export WATSONX_APIKEY_FILE=/home/dbz/Downloads/apiWatson
export WATSONX_PROJECT_ID=3a59db38-a8bc-4033-b779-8a3f2085aefe
export WATSONX_REGION=us-south
export WATSONX_MODEL=ibm/granite-3-8b-instruct
export WATSONX_ROUTE_ENABLED=true
npm start
```

When enabled, `server.mjs`:

1. Reads the IBM API key from `WATSONX_APIKEY_FILE`.
2. Exchanges it for an IAM bearer token.
3. Calls the watsonx text generation endpoint:

```text
https://{region}.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29
```

4. Sends prompt, intent, top ranked slots, follow-up appointment, and medical context as evidence.
5. Falls back to deterministic local responses if watsonx is unavailable or authentication fails.

The current app does **not** expose watsonx credentials to the frontend. Credentials stay in the local Node backend.

## 9. Frontend Fallback Behavior

The public GitHub Pages frontend cannot call a private local API. To keep the app usable, `frontend/src/lib/navi-ai.ts` includes a local dictionary fallback for common prompts:

- symptoms / “I feel sick”
- labs / liver enzymes
- medications / allergies
- scheduling / follow-up
- visit prep
- appointment details

This means the public static UI can still return realistic Michael Carter responses even without the API backend.

## 10. Governance and Safety Controls

Current controls include:

- no diagnosis / no prescribing language in prompts and responses
- emergency escalation wording for urgent or worsening symptoms
- input length limits for body, prompt, and context
- per-IP rate limiting on the local API
- optional API key auth via `NAVI_API_KEY`
- localhost-focused CORS rules
- callback redaction and append-only callback logging
- no browser-exposed watsonx API key

Production hardening still needed:

- real identity and role-based access control
- encrypted persistence for PHI
- consent management
- immutable audit logs
- production BAA / compliance review
- EHR/FHIR integration
- human-in-the-loop approval workflows
  
