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

const API_URL = import.meta.env.VITE_NAVI_AI_ENDPOINT as string | undefined;
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

function localFallback(prompt: string, reason?: FallbackReason): NaviGeneratedResponse {
  const intent = inferIntent(prompt);
  const byIntent: Record<NaviIntent, Omit<NaviGeneratedResponse, "source" | "fallbackReason">> = {
    schedule: {
      text: "I can help you schedule or reschedule with Dr. Brooks. Want me to take you to available time slots now?",
      intent,
      followUps: ["Show available slots", "Find earliest opening", "Reschedule current visit"],
    },
    appointments: {
      text: "I found your upcoming visit details. I can open appointments, help with check-in steps, or send reminder guidance.",
      intent,
      followUps: ["Open appointments", "Start check-in", "What should I bring?"],
    },
    prep: {
      text: "For visit prep: bring your ID, insurance card, medication list, and any recent symptom notes. I can generate a quick checklist.",
      intent,
      followUps: ["Create prep checklist", "Explain check-in flow", "Open visit details"],
    },
    summary: {
      text: "I can provide a plain-language summary and next steps from your recent visit, including follow-up reminders.",
      intent,
      followUps: ["Show summary", "List next steps", "Set follow-up reminder"],
    },
    general: {
      text: "I can help with scheduling, visit prep, check-in, and summaries. Tell me what you need and I will guide you step by step.",
      intent,
      followUps: ["Schedule a visit", "Prepare for my appointment", "Explain last visit summary"],
    },
  };
  return {
    ...byIntent[intent],
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
