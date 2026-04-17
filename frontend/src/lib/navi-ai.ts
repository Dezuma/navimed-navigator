export type NaviGeneratedResponse = {
  text: string;
  intent: "schedule" | "appointments" | "prep" | "summary" | "general";
  followUps: string[];
  source: "remote" | "local-fallback";
};

type GenerateOptions = {
  prompt: string;
  context?: string;
  signal?: AbortSignal;
  onResponse?: (response: NaviGeneratedResponse) => void;
};

const API_URL = import.meta.env.VITE_NAVI_AI_ENDPOINT as string | undefined;
const CALLBACK_URL = import.meta.env.VITE_NAVI_CALLBACK_URL as string | undefined;

function inferIntent(prompt: string): NaviGeneratedResponse["intent"] {
  const p = prompt.toLowerCase();
  if (p.includes("schedule") || p.includes("book") || p.includes("reschedule")) return "schedule";
  if (p.includes("appointment") || p.includes("check in")) return "appointments";
  if (p.includes("prepare") || p.includes("prep") || p.includes("bring")) return "prep";
  if (p.includes("summary") || p.includes("result") || p.includes("after visit")) return "summary";
  return "general";
}

function localFallback(prompt: string): NaviGeneratedResponse {
  const intent = inferIntent(prompt);
  const byIntent: Record<NaviGeneratedResponse["intent"], NaviGeneratedResponse> = {
    schedule: {
      text: "I can help you schedule or reschedule with Dr. Brooks. Want me to take you to available time slots now?",
      intent,
      followUps: ["Show available slots", "Find earliest opening", "Reschedule current visit"],
      source: "local-fallback",
    },
    appointments: {
      text: "I found your upcoming visit details. I can open appointments, help with check-in steps, or send reminder guidance.",
      intent,
      followUps: ["Open appointments", "Start check-in", "What should I bring?"],
      source: "local-fallback",
    },
    prep: {
      text: "For visit prep: bring your ID, insurance card, medication list, and any recent symptom notes. I can generate a quick checklist.",
      intent,
      followUps: ["Create prep checklist", "Explain check-in flow", "Open visit details"],
      source: "local-fallback",
    },
    summary: {
      text: "I can provide a plain-language summary and next steps from your recent visit, including follow-up reminders.",
      intent,
      followUps: ["Show summary", "List next steps", "Set follow-up reminder"],
      source: "local-fallback",
    },
    general: {
      text: "I can help with scheduling, visit prep, check-in, and summaries. Tell me what you need and I will guide you step by step.",
      intent,
      followUps: ["Schedule a visit", "Prepare for my appointment", "Explain last visit summary"],
      source: "local-fallback",
    },
  };
  return byIntent[intent];
}

async function postCallback(prompt: string, response: NaviGeneratedResponse, context?: string) {
  if (!CALLBACK_URL) return;
  try {
    await fetch(CALLBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        prompt,
        context: context ?? null,
        response,
      }),
    });
  } catch {
    // Callback transport failure should not break user experience.
  }
}

export async function generateNaviResponse({
  prompt,
  context,
  signal,
  onResponse,
}: GenerateOptions): Promise<NaviGeneratedResponse> {
  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) {
    const fallback = localFallback("general help");
    onResponse?.(fallback);
    return fallback;
  }

  try {
    if (!API_URL) throw new Error("Missing endpoint");

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: cleanPrompt, context }),
      signal,
    });

    if (!res.ok) throw new Error(`AI endpoint returned ${res.status}`);
    const json = (await res.json()) as Partial<NaviGeneratedResponse> & { text?: string };
    const response: NaviGeneratedResponse = {
      text: json.text || localFallback(cleanPrompt).text,
      intent: json.intent || inferIntent(cleanPrompt),
      followUps: json.followUps?.length ? json.followUps : localFallback(cleanPrompt).followUps,
      source: "remote",
    };
    onResponse?.(response);
    await postCallback(cleanPrompt, response, context);
    return response;
  } catch {
    const fallback = localFallback(cleanPrompt);
    onResponse?.(fallback);
    await postCallback(cleanPrompt, fallback, context);
    return fallback;
  }
}
