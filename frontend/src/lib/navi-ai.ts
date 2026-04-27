import { patientMedicalProfile } from "../demo-medical-data";

export type NaviIntent = "schedule" | "appointments" | "prep" | "summary" | "general";

export type FallbackReason =
  | "missing-endpoint"
  | "timeout"
  | "aborted"
  | "network"
  | "http-error"
  | "invalid-response";

export type NaviGeneratedResponse = {
  text: string;
  intent: NaviIntent;
  followUps: string[];
  structured?: Record<string, unknown>;
  evidence?: Record<string, unknown>;
  source: "remote" | "local-fallback";
  fallbackReason?: FallbackReason;
  httpStatus?: number;
};

type GenerateOptions = {
  prompt: string;
  context?: string;
  signal?: AbortSignal;
  onResponse?: (response: NaviGeneratedResponse) => void;
};

const API_URL =
  (import.meta.env.VITE_NAVI_AI_ENDPOINT as string | undefined) ||
  (import.meta.env.DEV ? "http://127.0.0.1:8787/navi/respond" : undefined);
const CALLBACK_URL = import.meta.env.VITE_NAVI_CALLBACK_URL as string | undefined;
const DEMO_API_KEY = import.meta.env.VITE_NAVI_API_KEY as string | undefined;

const REQUEST_MS = 15_000;
const MAX_PROMPT_IN = 2000;
const MAX_CONTEXT_IN = 256;
const MAX_TEXT_OUT = 6000;
const MAX_FOLLOW = 8;
const MAX_CHIP_LEN = 160;

const INTENTS: NaviIntent[] = ["schedule", "appointments", "prep", "summary", "general"];

function inferIntent(prompt: string): NaviIntent {
  const p = prompt.toLowerCase();
  if (p.includes("schedule") || p.includes("book") || p.includes("reschedule")) return "schedule";
  if (p.includes("prepare") || p.includes("prep") || p.includes("bring")) return "prep";
  if (p.includes("appointment") || p.includes("check in")) return "appointments";
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

function clampStr(s: string, max: number): string {
  return s.length <= max ? s : `${s.slice(0, max)}…`;
}

function sanitizeFollowUps(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out = raw
    .filter((x): x is string => typeof x === "string")
    .map((s) => clampStr(s.trim(), MAX_CHIP_LEN))
    .filter(Boolean);
  return out.slice(0, MAX_FOLLOW);
}

function sanitizeIntent(raw: unknown, prompt: string): NaviIntent {
  if (typeof raw === "string" && INTENTS.includes(raw as NaviIntent)) return raw as NaviIntent;
  return inferIntent(prompt);
}

function isMedicalPrompt(prompt: string): boolean {
  return /\b(lab|labs|liver|enzyme|enzymes|alt|ast|glucose|cholesterol|blood pressure|bp|vital|vitals|med|meds|medication|medications|allerg|condition|medical|result|results|sick|ill|unwell|symptom|symptoms|pain|nausea|dizzy|fever|tired|fatigue)\b/i.test(prompt);
}

function localMedicalSummary() {
  return {
    vitals: Object.fromEntries(patientMedicalProfile.vitals),
    abnormal_or_watch_items: patientMedicalProfile.watchItems.map(([name, value, status]) => ({
      panel: name === "Fasting glucose" ? "Glucose" : "Liver Function Panel",
      name,
      value,
      status: status.toLowerCase().replaceAll(" ", "_"),
    })),
    care_gaps: patientMedicalProfile.careGaps,
    safety_note: patientMedicalProfile.safetyNote,
  };
}

function localSlotOptions() {
  return [
    {
      slot_start_ts: "2026-04-24T13:00:00",
      provider_name: "Dr. David Warren",
      clinic_name: "NaviMed Downtown Primary Care",
      modality: "in_person",
      score: 4.053,
    },
    {
      slot_start_ts: "2026-04-28T11:30:00",
      provider_name: "Dr. David Warren",
      clinic_name: "NaviMed Downtown Primary Care",
      modality: "in_person",
      score: 3.951,
    },
    {
      slot_start_ts: "2026-04-22T11:00:00",
      provider_name: "Dr. Sarah Kim",
      clinic_name: "NaviMed Downtown Primary Care",
      modality: "telehealth",
      score: 4.166,
    },
  ];
}

function localDictionaryText(prompt: string, intent: NaviIntent): string {
  const vitals = "blood pressure 138/86 mmHg, heart rate 78 bpm, oxygen saturation 98%, and temperature 98.4 F";
  const watch = "ALT 68 U/L (high), AST 42 U/L (slightly high), and fasting glucose 104 mg/dL (slightly high)";
  const meds = "lisinopril 10 mg daily";
  const allergy = "penicillin";
  const careGaps = patientMedicalProfile.careGaps.join("; ");

  if (/\b(sick|ill|unwell|symptom|symptoms|pain|nausea|dizzy|fever|tired|fatigue)\b/i.test(prompt)) {
    return `I'm sorry you're not feeling well. I can organize Michael Carter's chart context for a provider, but I cannot diagnose or recommend treatment. Current vitals show ${vitals}. His chart includes hypertension, family history of diabetes, recent elevated liver enzymes, medication ${meds}, and allergy to ${allergy}. Items to review include ${watch}. For new, worsening, or urgent symptoms, contact a clinician or emergency services.`;
  }

  if (/\b(med|meds|medication|medications|allerg|allergy|allergies)\b/i.test(prompt)) {
    return `For Michael Carter's medication review, I found medication on file: ${meds}. Listed allergy: ${allergy}. Current vitals show ${vitals}. Items to review with the provider include ${watch}.`;
  }

  if (/\b(lab|labs|liver|enzyme|enzymes|alt|ast|glucose|cholesterol|result|results)\b/i.test(prompt)) {
    return `For Michael Carter's lab review, the watch items are ${watch}. In-range context includes total cholesterol 176 mg/dL, LDL 94 mg/dL, HDL 54 mg/dL, and bilirubin 0.8 mg/dL. His current vitals show ${vitals}.`;
  }

  if (intent === "schedule") {
    return "I found follow-up options for Michael Carter: Dr. David Warren at NaviMed Downtown Primary Care on Fri, Apr 24 at 1:00 PM; Dr. David Warren on Tue, Apr 28 at 11:30 AM; and Dr. Sarah Kim by telehealth on Wed, Apr 22 at 11:00 AM. I can help compare by modality, clinic, or timing.";
  }

  if (intent === "prep") {
    return `For Michael Carter's visit prep, bring an ID, insurance card, and medication list. His chart shows ${meds}, allergy to ${allergy}, and care gaps: ${careGaps}.`;
  }

  if (intent === "appointments") {
    return "I can help with Michael Carter's appointment details, check-in, reminders, directions, labs, medications, and follow-up scheduling. Ask me what you want to review next.";
  }

  if (intent === "summary") {
    return `Michael Carter's follow-up summary should focus on care gaps: ${careGaps}. I can also explain labs, review medications, or schedule the follow-up appointment.`;
  }

  if (isMedicalPrompt(prompt)) {
    return `For Michael Carter's chart, I found ${vitals}. Medication on file is ${meds}; listed allergy is ${allergy}. Items to review include ${watch}.`;
  }

  return "I can help Michael Carter with labs, medications, blood pressure, visit prep, appointment details, check-in, directions, and follow-up scheduling. Ask me in your own words and I will use the available chart and scheduling context.";
}

function localStructured(intent: NaviIntent) {
  return {
    event_type: intent === "schedule" ? "SchedulingRecommendationReady" : "CareNavigationReady",
    patient_id: "PT0141",
    intent,
    next_steps: intent === "schedule" ? ["select_slot", "confirm_appointment"] : ["review_context", "choose_next_action"],
    follow_up_window: "2 weeks",
    follow_up_actions: ["view_available_times", "review_labs", "review_medications"],
    patient_questions_pending: false,
    reentry_prompt: "What would you like to do next?",
    available_time_slots: localSlotOptions(),
    medical_context_summary: localMedicalSummary(),
  };
}

function localFollowUps(prompt: string, intent: NaviIntent): string[] {
  if (isMedicalPrompt(prompt)) return ["Explain liver enzymes", "Review meds list", "Schedule follow-up", "Show care gaps"];
  if (intent === "schedule") return ["Show telehealth options", "Compare earliest slots", "Schedule follow-up"];
  if (intent === "prep") return ["Review meds list", "Show care gaps", "Open check-in"];
  if (intent === "appointments") return ["Open appointments", "Start check-in", "Get directions"];
  return ["Explain labs", "Review meds list", "Schedule follow-up"];
}

function localFallback(prompt: string, reason?: FallbackReason): NaviGeneratedResponse {
  const intent = inferIntent(prompt);
  return {
    text: localDictionaryText(prompt, intent),
    intent,
    followUps: localFollowUps(prompt, intent),
    structured: localStructured(intent),
    evidence: {
      patient_id: "PT0141",
      local_chart_context: true,
      medical_context: patientMedicalProfile,
      top_recommendations: localSlotOptions(),
    },
    source: "local-fallback",
    fallbackReason: reason,
  };
}

function sanitizeRemotePayload(
  json: Record<string, unknown>,
  prompt: string,
): Omit<NaviGeneratedResponse, "source" | "fallbackReason"> {
  const textRaw = typeof json.text === "string" ? json.text : "";
  const text = clampStr(textRaw.trim() || localFallback(prompt).text, MAX_TEXT_OUT);
  const intent = sanitizeIntent(json.intent, prompt);
  const followUps = sanitizeFollowUps(json.followUps);
  return {
    text,
    intent,
    followUps: followUps.length ? followUps : localFallback(prompt).followUps,
    structured:
      json.structured && typeof json.structured === "object"
        ? (json.structured as Record<string, unknown>)
        : undefined,
    evidence:
      json.evidence && typeof json.evidence === "object"
        ? (json.evidence as Record<string, unknown>)
        : undefined,
  };
}

/** Strip fields before optional analytics callback (limits accidental PHI payload size). */
function redactForCallback(r: NaviGeneratedResponse): NaviGeneratedResponse {
  return {
    text: clampStr(r.text, 4000),
    intent: r.intent,
    followUps: r.followUps.slice(0, MAX_FOLLOW),
    structured: r.structured,
    source: r.source,
    fallbackReason: r.fallbackReason,
    httpStatus: r.httpStatus,
  };
}

async function postCallback(prompt: string, response: NaviGeneratedResponse, context?: string) {
  if (!CALLBACK_URL) return;
  try {
    await fetch(CALLBACK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(DEMO_API_KEY ? { Authorization: `Bearer ${DEMO_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        prompt: clampStr(prompt, MAX_PROMPT_IN),
        context: context != null ? clampStr(context, MAX_CONTEXT_IN) : null,
        response: redactForCallback(response),
      }),
    });
  } catch {
    // Callback transport failure should not break user experience.
  }
}

function buildAuthHeaders(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (DEMO_API_KEY) h.Authorization = `Bearer ${DEMO_API_KEY}`;
  return h;
}

async function fetchWithDeadline(
  url: string,
  init: RequestInit,
  external: AbortSignal | undefined,
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), REQUEST_MS);

  const onExternalAbort = () => {
    clearTimeout(t);
    ctrl.abort();
  };

  if (external?.aborted) {
    clearTimeout(t);
    throw Object.assign(new Error("aborted"), { name: "AbortError" });
  }

  external?.addEventListener("abort", onExternalAbort, { once: true });

  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
    external?.removeEventListener("abort", onExternalAbort);
  }
}

export async function generateNaviResponse({
  prompt,
  context,
  signal,
  onResponse,
}: GenerateOptions): Promise<NaviGeneratedResponse> {
  const cleanPrompt = clampStr(prompt.trim(), MAX_PROMPT_IN);
  const ctx = context != null ? clampStr(context, MAX_CONTEXT_IN) : undefined;

  if (!cleanPrompt.trim()) {
    const fallback = localFallback("navigation help");
    onResponse?.(fallback);
    return fallback;
  }

  if (!API_URL?.trim()) {
    const fallback = localFallback(cleanPrompt, "missing-endpoint");
    onResponse?.(fallback);
    await postCallback(cleanPrompt, fallback, ctx);
    return fallback;
  }

  try {
    const res = await fetchWithDeadline(
      API_URL.trim(),
      {
        method: "POST",
        headers: buildAuthHeaders(),
        body: JSON.stringify({ prompt: cleanPrompt, context: ctx }),
      },
      signal,
    );

    if (!res.ok) {
      const fb = localFallback(cleanPrompt, "http-error");
      fb.httpStatus = res.status;
      onResponse?.(fb);
      await postCallback(cleanPrompt, fb, ctx);
      return fb;
    }

    let rawJson: unknown;
    try {
      rawJson = await res.json();
    } catch {
      const fb = localFallback(cleanPrompt, "invalid-response");
      onResponse?.(fb);
      await postCallback(cleanPrompt, fb, ctx);
      return fb;
    }

    if (!rawJson || typeof rawJson !== "object") {
      const fb = localFallback(cleanPrompt, "invalid-response");
      onResponse?.(fb);
      await postCallback(cleanPrompt, fb, ctx);
      return fb;
    }

    const parsed = sanitizeRemotePayload(rawJson as Record<string, unknown>, cleanPrompt);
    const response: NaviGeneratedResponse = {
      ...parsed,
      source: "remote",
    };
    onResponse?.(response);
    await postCallback(cleanPrompt, response, ctx);
    return response;
  } catch (e) {
    let reason: FallbackReason = "network";
    if (signal?.aborted) {
      reason = "aborted";
    } else if (e instanceof DOMException && e.name === "AbortError") {
      reason = "timeout";
    }
    const fallback = localFallback(cleanPrompt, reason);
    onResponse?.(fallback);
    await postCallback(cleanPrompt, fallback, ctx);
    return fallback;
  }
}
