import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 8787);

/** @type {Array<{timestamp:string,prompt:string,context:string|null,response:unknown}>} */
const callbackEvents = [];

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  });
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
        text: "Prep checklist: photo ID, insurance card, medications, and your top 2-3 questions for the clinician.",
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

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    return json(res, 204, {});
  }

  if (req.method === "GET" && url.pathname === "/health") {
    return json(res, 200, { ok: true, service: "mock-navi-ai", callbacksStored: callbackEvents.length });
  }

  if (req.method === "GET" && url.pathname === "/navi/callbacks") {
    return json(res, 200, { total: callbackEvents.length, events: callbackEvents.slice(-50).reverse() });
  }

  if (req.method === "POST" && url.pathname === "/navi/respond") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");

    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      return json(res, 400, { error: "Invalid JSON" });
    }

    const prompt = String(payload.prompt || "");
    const intent = inferIntent(prompt);
    const template = responseFromIntent(intent);

    return json(res, 200, {
      text: template.text,
      intent,
      followUps: template.followUps,
    });
  }

  if (req.method === "POST" && url.pathname === "/navi/callback") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");

    try {
      const payload = raw ? JSON.parse(raw) : {};
      callbackEvents.push({
        timestamp: String(payload.timestamp || new Date().toISOString()),
        prompt: String(payload.prompt || ""),
        context: payload.context == null ? null : String(payload.context),
        response: payload.response ?? null,
      });
      if (callbackEvents.length > 200) callbackEvents.splice(0, callbackEvents.length - 200);
      return json(res, 200, { ok: true, stored: callbackEvents.length });
    } catch {
      return json(res, 400, { error: "Invalid JSON" });
    }
  }

  return json(res, 404, { error: "Not found", path: url.pathname });
}).listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock Navi AI server running on http://127.0.0.1:${PORT}`);
});
