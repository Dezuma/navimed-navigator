import { mkdirSync, appendFileSync, existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT || 8787);
const NAVI_API_KEY = process.env.NAVI_API_KEY?.trim() || "";
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 49152);
const MAX_PROMPT_CHARS = Number(process.env.MAX_PROMPT_CHARS || 2000);
const MAX_CONTEXT_CHARS = Number(process.env.MAX_CONTEXT_CHARS || 256);
const RATE_WINDOW_MS = Number(process.env.RATE_WINDOW_MS || 60_000);
const RATE_MAX = Number(process.env.RATE_MAX || 120);
const MAX_EVENTS_MEMORY = Number(process.env.MAX_EVENTS_MEMORY || 200);
const PERSIST_PATH =
  process.env.PERSIST_PATH || join(__dirname, "data", "callbacks.jsonl");

/** @type {Array<{timestamp:string,prompt:string,context:string|null,response:unknown}>} */
let callbackEvents = [];

/** Rate limit state: ip -> count start */
const rateBuckets = new Map();

function clampStr(s, max) {
  if (!s || typeof s !== "string") return "";
  return s.length <= max ? s : s.slice(0, max) + "…";
}

function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string") return xf.split(",")[0]?.trim() || "unknown";
  return req.socket?.remoteAddress ?? "unknown";
}

function rateLimit(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start >= RATE_WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= RATE_MAX;
}

function authOk(req) {
  if (!NAVI_API_KEY) return true;
  const auth = req.headers.authorization;
  const headerKey = req.headers["x-api-key"];
  const bearer =
    typeof auth === "string" && auth.startsWith("Bearer ")
      ? auth.slice(7).trim()
      : "";
  const key =
    bearer || (typeof headerKey === "string" ? headerKey.trim() : "");
  return key === NAVI_API_KEY;
}

function json(req, res, status, body) {
  const origin = req.headers.origin;
  const allow =
    typeof origin === "string" &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ? origin
      : HOST === "0.0.0.0" || HOST === "::"
        ? "*"
        : "http://localhost:5173";

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  };
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function inferIntent(prompt = "") {
  const p = prompt.toLowerCase();
  if (p.includes("schedule") || p.includes("book") || p.includes("reschedule")) return "schedule";
  if (p.includes("appointment") || p.includes("check in")) return "appointments";
  if (p.includes("prepare") || p.includes("prep") || p.includes("bring")) return "prep";
  if (p.includes("summary") || p.includes("result") || p.includes("after visit")) return "summary";
  return "general";
}

function responseFromIntent(intent) {
  switch (intent) {
    case "schedule":
      return {
        text: "I can help you lock in the best appointment slot. Do you prefer earliest availability or a specific day/time?",
        followUps: ["Show earliest opening", "Schedule this week", "Reschedule current visit"],
      };
    case "appointments":
      return {
        text: "I can pull your appointment details and walk through check-in, reminders, and required docs.",
        followUps: ["Open appointments", "Start check-in", "What should I bring?"],
      };
    case "prep":
      return {
        text: "Prep checklist: photo ID, insurance card, medications, and your top 2–3 questions for the clinician.",
        followUps: ["Create prep checklist", "Review meds list", "Send reminder"],
      };
    case "summary":
      return {
        text: "I can summarize your last visit in plain language and highlight next steps and follow-up timing.",
        followUps: ["Show summary", "List next steps", "Set follow-up reminder"],
      };
    default:
      return {
        text: "I can assist with scheduling, visit prep, check-in, and summaries. Tell me your goal and I will guide you.",
        followUps: ["Schedule a visit", "Help me prepare", "Explain my summary"],
      };
  }
}

function persistEvent(record) {
  mkdirSync(dirname(PERSIST_PATH), { recursive: true });
  appendFileSync(PERSIST_PATH, `${JSON.stringify(record)}\n`, "utf8");
}

function loadPersistedTail() {
  if (!existsSync(PERSIST_PATH)) return;
  try {
    const raw = readFileSync(PERSIST_PATH, "utf8");
    const lines = raw.trim().split("\n").filter(Boolean);
    const tail = lines.slice(-MAX_EVENTS_MEMORY);
    callbackEvents = [];
    for (const line of tail) {
      try {
        callbackEvents.push(JSON.parse(line));
      } catch {
        /* skip corrupt JSON line */
      }
    }
  } catch {
    callbackEvents = [];
  }
}

async function readBody(req, maxBytes) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > maxBytes) throw new Error("payload_too_large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

loadPersistedTail();

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const ip = clientIp(req);

  if (req.method === "OPTIONS") {
    return json(req, res, 204, {});
  }

  if (req.method === "GET" && url.pathname === "/health") {
    return json(req, res, 200, {
      ok: true,
      service: "mock-navi-ai",
      callbacksStored: callbackEvents.length,
      persistPath: PERSIST_PATH,
      authRequired: Boolean(NAVI_API_KEY),
    });
  }

  if (req.method === "GET" && url.pathname === "/navi/callbacks") {
    if (!authOk(req)) return json(req, res, 401, { error: "Unauthorized" });
    return json(req, res, 200, {
      total: callbackEvents.length,
      events: callbackEvents.slice(-50).reverse(),
    });
  }

  if (req.method === "POST" && (url.pathname === "/navi/respond" || url.pathname === "/navi/callback")) {
    if (!rateLimit(ip)) {
      return json(req, res, 429, {
        error: "Too many requests",
        retryAfterSec: Math.ceil(RATE_WINDOW_MS / 1000),
      });
    }
    if (!authOk(req)) return json(req, res, 401, { error: "Unauthorized" });

    let raw = "";
    try {
      raw = await readBody(req, MAX_BODY_BYTES);
    } catch (e) {
      if (e?.message === "payload_too_large") {
        return json(req, res, 413, { error: "Payload too large", maxBytes: MAX_BODY_BYTES });
      }
      return json(req, res, 400, { error: "Could not read body" });
    }

    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      return json(req, res, 400, { error: "Invalid JSON" });
    }

    if (url.pathname === "/navi/respond") {
      const prompt = clampStr(String(payload.prompt || ""), MAX_PROMPT_CHARS);
      const context =
        payload.context == null ? null : clampStr(String(payload.context), MAX_CONTEXT_CHARS);

      if (!prompt.trim()) {
        return json(req, res, 400, { error: "prompt required" });
      }

      const intent = inferIntent(prompt);
      const template = responseFromIntent(intent);

      return json(req, res, 200, {
        text: template.text,
        intent,
        followUps: template.followUps,
      });
    }

    const record = {
      timestamp: String(payload.timestamp || new Date().toISOString()),
      prompt: clampStr(String(payload.prompt || ""), MAX_PROMPT_CHARS),
      context:
        payload.context == null ? null : clampStr(String(payload.context), MAX_CONTEXT_CHARS),
      response: payload.response ?? null,
    };

    callbackEvents.push(record);
    if (callbackEvents.length > MAX_EVENTS_MEMORY) {
      callbackEvents.splice(0, callbackEvents.length - MAX_EVENTS_MEMORY);
    }

    try {
      persistEvent(record);
    } catch {
      return json(req, res, 507, {
        error: "Could not persist callback (disk full or permissions)",
      });
    }

    return json(req, res, 200, { ok: true, stored: callbackEvents.length });
  }

  return json(req, res, 404, { error: "Not found", path: url.pathname });
}).listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock Navi AI listening on http://${HOST}:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Callbacks file: ${PERSIST_PATH} (loaded ${callbackEvents.length} events)`);
});
