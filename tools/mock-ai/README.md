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

CORS reflects `Origin` for `http(s)://localhost:*` and `http(s)://127.0.0.1:*` so Vite dev works on either hostname. For `HOST=0.0.0.0`, responses use `Access-Control-Allow-Origin: *` (use only in trusted networks).

## Endpoints

- `GET /health` — liveness
- `POST /navi/respond` — `{ prompt, context? }` → `{ text, intent, followUps }`
- `POST /navi/callback` — ingest callback payloads from the SPA
- `GET /navi/callbacks` — recent captured events (demo only)
