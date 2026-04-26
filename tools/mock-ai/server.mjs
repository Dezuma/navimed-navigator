import { mkdirSync, appendFileSync, existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT || 8787);
const NAVI_API_KEY = process.env.NAVI_API_KEY?.trim() || "";
const WATSONX_APIKEY_FILE = process.env.WATSONX_APIKEY_FILE || "/home/dbz/Downloads/apikey.json";
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID?.trim() || "";
const WATSONX_REGION = process.env.WATSONX_REGION || "us-south";
const WATSONX_MODEL = process.env.WATSONX_MODEL || "ibm/granite-3-8b-instruct";
const WATSONX_ROUTE_ENABLED = (process.env.WATSONX_ROUTE_ENABLED || "false").toLowerCase() === "true";
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 49152);
const MAX_PROMPT_CHARS = Number(process.env.MAX_PROMPT_CHARS || 2000);
const MAX_CONTEXT_CHARS = Number(process.env.MAX_CONTEXT_CHARS || 256);
const RATE_WINDOW_MS = Number(process.env.RATE_WINDOW_MS || 60_000);
const RATE_MAX = Number(process.env.RATE_MAX || 120);
const MAX_EVENTS_MEMORY = Number(process.env.MAX_EVENTS_MEMORY || 200);
const PERSIST_PATH =
  process.env.PERSIST_PATH || join(__dirname, "data", "callbacks.jsonl");
const DATA_DIR = process.env.NAVI_DATA_DIR || join(__dirname, "data_sources");

/** @type {Array<{timestamp:string,prompt:string,context:string|null,response:unknown}>} */
let callbackEvents = [];
let providers = [];
let clinics = [];
let slots = [];
let appointments = [];
let reminders = [];
let preferences = [];
let transport = [];
const providerById = new Map();
const clinicById = new Map();
const prefByPatientId = new Map();
const appointmentsByPatientId = new Map();

/** Rate limit state: ip -> count start */
const rateBuckets = new Map();

function clampStr(s, max) {
  if (!s || typeof s !== "string") return "";
  return s.length <= max ? s : s.slice(0, max) + "…";
}

function safeNum(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function csvRows(path) {
  if (!existsSync(path)) return [];
  const raw = readFileSync(path, "utf8").trim();
  if (!raw) return [];
  const [head, ...lines] = raw.split(/\r?\n/);
  const headers = head.split(",");
  return lines
    .filter(Boolean)
    .map((line) => line.split(","))
    .map((parts) => {
      const row = {};
      headers.forEach((h, i) => {
        row[h] = (parts[i] ?? "").trim();
      });
      return row;
    });
}

function dayPart(dateLike) {
  const d = new Date(dateLike);
  const h = d.getHours();
  if (h < 11) return "morning";
  if (h < 15) return "midday";
  return "afternoon";
}

function loadDataSources() {
  providers = csvRows(join(DATA_DIR, "providers.csv"));
  clinics = csvRows(join(DATA_DIR, "clinics.csv"));
  slots = csvRows(join(DATA_DIR, "schedule_slots.csv"));
  appointments = csvRows(join(DATA_DIR, "appointments.csv"));
  reminders = csvRows(join(DATA_DIR, "reminder_events.csv"));
  preferences = csvRows(join(DATA_DIR, "scheduling_preferences.csv"));
  transport = csvRows(join(DATA_DIR, "transport_context.csv"));

  providerById.clear();
  clinicById.clear();
  prefByPatientId.clear();
  appointmentsByPatientId.clear();
  for (const p of providers) providerById.set(p.provider_id, p);
  for (const c of clinics) clinicById.set(c.clinic_id, c);
  for (const p of preferences) prefByPatientId.set(p.patient_id, p);
  for (const a of appointments) {
    const arr = appointmentsByPatientId.get(a.patient_id) || [];
    arr.push(a);
    appointmentsByPatientId.set(a.patient_id, arr);
  }
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
  if (
    p.includes("summary") ||
    p.includes("result") ||
    p.includes("after visit") ||
    p.includes("post visit") ||
    p.includes("post-visit") ||
    p.includes("completed my visit") ||
    p.includes("completed visit") ||
    p.includes("follow-up") ||
    p.includes("follow up")
  ) return "summary";
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

function pickPatientId(prompt, context) {
  const c = `${prompt} ${context || ""}`;
  const match = c.match(/PT\d{4}/i);
  return match?.[0]?.toUpperCase() || "PT0141";
}

function chooseUpcomingFollowUp(patientId) {
  const mine = appointmentsByPatientId.get(patientId) || [];
  const upcoming = mine
    .filter((a) => a.status !== "completed" && a.status !== "cancelled")
    .sort((a, b) => new Date(a.appointment_ts) - new Date(b.appointment_ts));
  return upcoming[0] || null;
}

function recommendSlots(patientId, prompt) {
  const pref = prefByPatientId.get(patientId) || {};
  const now = new Date();
  const preferredDayPart = pref.preferred_day_part || "morning";
  const preferredModality =
    pref.preferred_modality && pref.preferred_modality !== "either"
      ? pref.preferred_modality
      : null;
  const preferredSpecialty = pref.preferred_specialty || null;
  const sameProviderWeight = safeNum(pref.same_provider_preference_score, 3) / 5;
  const soonestWeight = safeNum(pref.soonest_available_preference_score, 3) / 5;
  const locationWeight = safeNum(pref.location_convenience_preference_score, 3) / 5;

  const recent = (appointmentsByPatientId.get(patientId) || [])
    .sort((a, b) => new Date(b.appointment_ts) - new Date(a.appointment_ts))[0];
  const sameProviderId = recent?.provider_id || null;

  const desiredModalityFromPrompt = /\btelehealth\b/i.test(prompt)
    ? "telehealth"
    : /\bin[- ]?person\b/i.test(prompt)
      ? "in_person"
      : null;
  const explicitModalityRequest = Boolean(desiredModalityFromPrompt);
  const modalityNeed = desiredModalityFromPrompt || preferredModality;

  const candidates = slots
    .filter((s) => s.slot_status === "open")
    .map((s) => {
      const provider = providerById.get(s.provider_id) || {};
      const clinic = clinicById.get(s.clinic_id) || {};
      const start = new Date(s.slot_start_ts);
      const hoursOut = Math.max(0, (start - now) / (1000 * 60 * 60));
      const soonestScore = Math.max(0, 1 - hoursOut / (24 * 14));
      const specialtyScore =
        preferredSpecialty && s.specialty === preferredSpecialty ? 1 : 0;
      const modalityScore = modalityNeed && s.modality === modalityNeed ? 1 : 0;
      const modalityMismatchPenalty =
        explicitModalityRequest && modalityNeed && s.modality !== modalityNeed ? 1 : 0;
      const dayPartScore = dayPart(start) === preferredDayPart ? 1 : 0;
      const sameProviderScore =
        sameProviderId && s.provider_id === sameProviderId ? 1 : 0;
      const clinicAccess =
        (safeNum(clinic.public_transport_access_score, 2) +
          (6 - safeNum(clinic.parking_difficulty_score, 3))) /
        10;
      const latePenalty = safeNum(provider.late_running_probability, 0.15);
      const base = safeNum(s.base_priority_score, 0.4);
      const weighted =
        base +
        specialtyScore * 1.2 +
        modalityScore * (explicitModalityRequest ? 2.2 : 0.9) +
        dayPartScore * 0.5 +
        sameProviderScore * sameProviderWeight +
        soonestScore * soonestWeight +
        clinicAccess * locationWeight -
        modalityMismatchPenalty * 0.9 -
        latePenalty * 0.7;
      return {
        ...s,
        provider_name: provider.provider_name || s.provider_id,
        clinic_name: clinic.clinic_name || s.clinic_id,
        score: Number(weighted.toFixed(4)),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    patient_id: patientId,
    ranked_slots: candidates.map((c) => ({
      slot_id: c.slot_id,
      provider_id: c.provider_id,
      provider_name: c.provider_name,
      clinic_id: c.clinic_id,
      clinic_name: c.clinic_name,
      specialty: c.specialty,
      slot_start_ts: c.slot_start_ts,
      modality: c.modality,
      score: c.score,
    })),
    ranking_factors: [
      "specialty_match",
      "modality_match",
      "same_provider_preference",
      "time_of_day_preference",
      "clinic_access",
      "soonest_available",
      "provider_lateness_risk",
    ],
  };
}

function promptTemplates() {
  return {
    router_system:
      "You are NaviMed Router. Output strict JSON only: {intent, patient_id, needs_data, action}. intents: schedule,reschedule,checkin,previsit,postvisit,summary,general. Never diagnose.",
    routing_user:
      "Classify this user request into one intent and decide whether to call schedule recommender data tools. Include extracted patient_id if present.",
    response_system:
      "You are NaviMed Assistant. Use plain language. No diagnosis. Return JSON only with keys: patient_message, follow_up_json.",
    response_user:
      "Given intent, data evidence, and safety policy, produce concise patient-facing response plus structured follow_up_json event.",
    guardrail_system:
      "If user requests diagnosis, medications changes, or emergency advice, redirect to clinician/emergency services and set follow_up_json.escalation=true.",
  };
}

function loadWatsonxApiKey() {
  if (!existsSync(WATSONX_APIKEY_FILE)) return "";
  try {
    const raw = JSON.parse(readFileSync(WATSONX_APIKEY_FILE, "utf8"));
    return typeof raw.apikey === "string" ? raw.apikey : "";
  } catch {
    return "";
  }
}

let watsonxToken = "";
let watsonxTokenExp = 0;
async function getWatsonxToken() {
  const now = Date.now();
  if (watsonxToken && now < watsonxTokenExp - 60_000) return watsonxToken;
  const apikey = loadWatsonxApiKey();
  if (!apikey) throw new Error("Missing watsonx apikey");
  const form = new URLSearchParams();
  form.set("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
  form.set("apikey", apikey);
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  if (!res.ok) throw new Error(`IAM token error ${res.status}`);
  const json = await res.json();
  watsonxToken = json.access_token;
  watsonxTokenExp = now + safeNum(json.expires_in, 3600) * 1000;
  return watsonxToken;
}

async function watsonxGenerate(input) {
  if (!WATSONX_PROJECT_ID) throw new Error("Missing WATSONX_PROJECT_ID");
  const token = await getWatsonxToken();
  const endpoint = `https://${WATSONX_REGION}.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model_id: WATSONX_MODEL,
      input,
      project_id: WATSONX_PROJECT_ID,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 320,
        min_new_tokens: 16,
        temperature: 0.2,
        repetition_penalty: 1.05,
      },
    }),
  });
  if (!res.ok) throw new Error(`watsonx generation error ${res.status}`);
  const json = await res.json();
  const text =
    json?.results?.[0]?.generated_text || json?.generated_text || "";
  return String(text);
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
loadDataSources();

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
      dataLoaded: {
        providers: providers.length,
        clinics: clinics.length,
        slots: slots.length,
        appointments: appointments.length,
        reminders: reminders.length,
        preferences: preferences.length,
      },
      watsonxEnabled: WATSONX_ROUTE_ENABLED,
    });
  }

  if (req.method === "GET" && url.pathname === "/navi/prompts") {
    return json(req, res, 200, promptTemplates());
  }

  if (req.method === "GET" && url.pathname === "/navi/reload-data") {
    if (!authOk(req)) return json(req, res, 401, { error: "Unauthorized" });
    loadDataSources();
    return json(req, res, 200, {
      ok: true,
      counts: {
        providers: providers.length,
        clinics: clinics.length,
        slots: slots.length,
        appointments: appointments.length,
        reminders: reminders.length,
        preferences: preferences.length,
      },
    });
  }

  if (req.method === "GET" && url.pathname === "/navi/callbacks") {
    if (!authOk(req)) return json(req, res, 401, { error: "Unauthorized" });
    return json(req, res, 200, {
      total: callbackEvents.length,
      events: callbackEvents.slice(-50).reverse(),
    });
  }

  if (
    req.method === "POST" &&
    (url.pathname === "/navi/respond" ||
      url.pathname === "/navi/callback" ||
      url.pathname === "/navi/recommend")
  ) {
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

    if (url.pathname === "/navi/recommend") {
      const patientId = clampStr(String(payload.patient_id || "PT0141"), 32).toUpperCase();
      const prompt = clampStr(String(payload.prompt || ""), MAX_PROMPT_CHARS);
      const recommendations = recommendSlots(patientId, prompt);
      return json(req, res, 200, recommendations);
    }

    if (url.pathname === "/navi/respond") {
      const prompt = clampStr(String(payload.prompt || ""), MAX_PROMPT_CHARS);
      const context =
        payload.context == null ? null : clampStr(String(payload.context), MAX_CONTEXT_CHARS);

      if (!prompt.trim()) {
        return json(req, res, 400, { error: "prompt required" });
      }

      const patientId = pickPatientId(prompt, context || "");
      const intent = inferIntent(prompt);
      const template = responseFromIntent(intent);
      const recommendations = recommendSlots(patientId, prompt);
      const followUpAppt = chooseUpcomingFollowUp(patientId);

      let aiMessage = "";
      if (WATSONX_ROUTE_ENABLED) {
        try {
          const promptPack = promptTemplates();
          aiMessage = await watsonxGenerate(
            `${promptPack.response_system}\n\nUser prompt: ${prompt}\nIntent: ${intent}\nContext: ${context || ""}\nEvidence: ${JSON.stringify({
              patient_id: patientId,
              top_slots: recommendations.ranked_slots.slice(0, 3),
              follow_up_appointment: followUpAppt,
            })}\n\nOutput JSON with keys patient_message and follow_up_json only.`,
          );
        } catch {
          aiMessage = "";
        }
      }

      let generated = null;
      if (aiMessage) {
        try {
          generated = JSON.parse(aiMessage);
        } catch {
          generated = null;
        }
      }

      return json(req, res, 200, {
        text: generated?.patient_message || template.text,
        intent,
        followUps: generated?.follow_up_json?.follow_up_actions || template.followUps,
        structured: generated?.follow_up_json || {
          event_type:
            intent === "schedule" || intent === "appointments"
              ? "SchedulingRecommendationReady"
              : "PostVisitFollowUpReady",
          patient_id: patientId,
          intent,
          next_steps: ["select_slot", "confirm_appointment"],
          follow_up_window: "2 weeks",
          follow_up_actions: ["view_available_times", "select_time", "confirm_appointment"],
          patient_questions_pending: false,
          reentry_prompt: "Would you like me to continue with scheduling now?",
          available_time_slots: recommendations.ranked_slots.slice(0, 4).map((s) => ({
            slot_start_ts: s.slot_start_ts,
            provider_name: s.provider_name,
            clinic_name: s.clinic_name,
            modality: s.modality,
            score: s.score,
          })),
        },
        evidence: {
          patient_id: patientId,
          source_counts: {
            appointments: appointments.length,
            slots: slots.length,
            providers: providers.length,
            reminders: reminders.length,
            transport: transport.length,
            preferences: preferences.length,
            clinics: clinics.length,
          },
          top_recommendations: recommendations.ranked_slots.slice(0, 3),
          upcoming_appointment: followUpAppt,
        },
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
  // eslint-disable-next-line no-console
  console.log(
    `Data loaded from ${DATA_DIR}: ${appointments.length} appointments, ${slots.length} slots, ${providers.length} providers`,
  );
});
