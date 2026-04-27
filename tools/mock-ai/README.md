# Mock Navi AI (local demo backend)

Purpose: **localhost-only** demo API that pairs with `frontend/` so Ask Navi can show generated responses and optional callback logging.

Not intended for PHI or production workloads. Bind to loopback by default.

## Storage

Callbacks append to `data/callbacks.jsonl` (gitignored). Rotate/delete that file anytime.

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `HOST` | `127.0.0.1` | Listen address (`0.0.0.0` only if you know you need LAN access) |
| `PORT` | `8787` | Port |
| `NAVI_API_KEY` | _(empty)_ | If set, `POST /navi/*` requires `Authorization: Bearer <token>` or `x-api-key: <token>` |
| `MAX_BODY_BYTES` | `49152` | Request body cap |
| `RATE_WINDOW_MS` | `60000` | Rate-limit window |
| `RATE_MAX` | `120` | Max POST requests per IP per window |
| `PERSIST_PATH` | `data/callbacks.jsonl` | Append-only callback log |
| `NAVI_DATA_DIR` | `tools/mock-ai/data_sources` | CSV dataset root for slot recommendation |
| `WATSONX_APIKEY_FILE` | `/home/dbz/Downloads/apikey.json` | JSON file containing `apikey`, or a raw API key file such as `/home/dbz/Downloads/apiWatson` |
| `WATSONX_PROJECT_ID` | _(empty)_ | watsonx project ID/GUID, e.g. `3a59db38-a8bc-4033-b779-8a3f2085aefe` for the sandbox export |
| `WATSONX_REGION` | `us-south` | watsonx region |
| `WATSONX_MODEL` | `ibm/granite-3-8b-instruct` | model id |
| `WATSONX_ROUTE_ENABLED` | `false` | enable watsonx composition path |

CORS reflects `Origin` for `http(s)://localhost:*` and `http(s)://127.0.0.1:*` so Vite dev works on either hostname. For `HOST=0.0.0.0`, responses use `Access-Control-Allow-Origin: *` (use only in trusted networks).

## Endpoints

- `GET /health` — liveness
- `POST /navi/respond` — `{ prompt, context? }` → `{ text, intent, followUps, structured, evidence }`
- `POST /navi/recommend` — `{ patient_id, prompt? }` → ranked scheduling slots from CSV data
- `POST /navi/callback` — ingest callback payloads from the SPA
- `GET /navi/callbacks` — recent captured events (demo only)
- `GET /navi/prompts` — constructable router/response prompt templates
- `GET /navi/reload-data` — reload CSV datasets from disk

## Data sources used by the demo

- `appointments.csv`
- `providers.csv`
- `clinics.csv`
- `schedule_slots.csv`
- `scheduling_preferences.csv`
- `reminder_events.csv`
- `transport_context.csv`
