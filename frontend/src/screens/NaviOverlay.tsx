import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NaviMascot } from "../components/NaviMascot";
import { generateNaviResponse, type NaviGeneratedResponse } from "../lib/navi-ai";

type LocState = { mode?: "listening" | "thinking"; prompt?: string; context?: string };

type MedicalWatchItem = {
  panel?: string;
  name?: string;
  value?: string;
  status?: string;
};

type MedicalSummary = {
  vitals?: Record<string, string>;
  abnormal_or_watch_items?: MedicalWatchItem[];
  care_gaps?: string[];
  safety_note?: string;
};

type SlotSummary = {
  slot_start_ts?: string;
  provider_name?: string;
  clinic_name?: string;
  modality?: string;
  score?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getMedicalSummary(response: NaviGeneratedResponse): MedicalSummary | null {
  const structured = response.structured;
  if (!isRecord(structured)) return null;
  const summary = structured.medical_context_summary;
  return isRecord(summary) ? (summary as MedicalSummary) : null;
}

function getAppointmentSlots(response: NaviGeneratedResponse): SlotSummary[] {
  const structured = response.structured;
  if (!isRecord(structured) || !Array.isArray(structured.available_time_slots)) return [];
  return structured.available_time_slots.filter(isRecord).map((item) => item as SlotSummary).slice(0, 3);
}

function prettyTime(value?: string) {
  if (!value) return "Time pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NaviOverlay() {
  const navigate = useNavigate();
  const loc = useLocation();
  const state = (loc.state || {}) as LocState;
  const mode = state.mode || "thinking";
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<NaviGeneratedResponse | null>(null);

  const prompt = useMemo(() => state.prompt?.trim() || "", [state.prompt]);

  useEffect(() => {
    if (mode !== "thinking" || !prompt) {
      setLoading(false);
      setResponse(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setResponse(null);

    void generateNaviResponse({
      prompt,
      context: state.context,
      signal: controller.signal,
      onResponse: (next) => setResponse(next),
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });

    return () => controller.abort();
  }, [mode, prompt, state.context]);

  const handleFollowUp = (choice: string) => {
    const c = choice.toLowerCase();
    if (c.includes("schedule") || c.includes("slot") || c.includes("follow-up") || c.includes("follow up")) {
      navigate("/schedule");
      return;
    }
    if (c.includes("check-in") || c.includes("check in")) {
      navigate("/check-in");
      return;
    }
    if (c.includes("appointment") || c.includes("direction")) {
      navigate("/appointments");
      return;
    }
    navigate("/navi", {
      replace: true,
      state: { mode: "thinking", prompt: `${choice} for Michael Carter PT0141`, context: state.context },
    });
  };

  const renderResponseCards = (next: NaviGeneratedResponse) => {
    const medical = getMedicalSummary(next);
    const slots = getAppointmentSlots(next);

    return (
      <>
        {medical?.vitals ? (
          <div className="nm-card" style={{ marginTop: 10, padding: 12, boxShadow: "none" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--nm-blue)", marginBottom: 8 }}>
              Current vitals
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {Object.entries(medical.vitals)
                .filter(([key]) => key !== "recorded_at")
                .map(([key, value]) => (
                  <div key={key} style={{ borderRadius: 10, background: "#fff", padding: 9 }}>
                    <div style={{ fontSize: "0.68rem", color: "var(--nm-muted)", textTransform: "capitalize" }}>
                      {key.replaceAll("_", " ")}
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800 }}>{value}</div>
                  </div>
                ))}
            </div>
          </div>
        ) : null}

        {medical?.abnormal_or_watch_items?.length ? (
          <div className="nm-card" style={{ marginTop: 10, padding: 12, boxShadow: "none" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#b45309", marginBottom: 8 }}>
              Items to review
            </div>
            {medical.abnormal_or_watch_items.map((item) => (
              <div
                key={`${item.panel}-${item.name}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "8px 0",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.86rem" }}>{item.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--nm-muted)" }}>{item.panel}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.86rem" }}>{item.value}</div>
                  <div style={{ fontSize: "0.7rem", color: "#b45309", textTransform: "capitalize" }}>
                    {(item.status || "").replaceAll("_", " ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {medical?.care_gaps?.length ? (
          <div className="nm-card" style={{ marginTop: 10, padding: 12, boxShadow: "none" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--nm-teal)", marginBottom: 8 }}>
              Recommended next steps
            </div>
            <ul style={{ margin: "0 0 0 16px", padding: 0, fontSize: "0.82rem", lineHeight: 1.45 }}>
              {medical.care_gaps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {slots.length ? (
          <div className="nm-card" style={{ marginTop: 10, padding: 12, boxShadow: "none" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--nm-blue)", marginBottom: 8 }}>
              Appointment options
            </div>
            {slots.map((slot) => (
              <button
                key={`${slot.provider_name}-${slot.slot_start_ts}`}
                type="button"
                onClick={() => navigate("/schedule")}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  border: "1px solid #dbeafe",
                  borderRadius: 12,
                  background: "#fff",
                  padding: 10,
                  marginTop: 8,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>{slot.provider_name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--nm-muted)" }}>{slot.clinic_name}</div>
                <div style={{ fontSize: "0.78rem", marginTop: 4 }}>
                  {prettyTime(slot.slot_start_ts)} · {slot.modality?.replace("_", " ")}
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 60,
        padding: 20,
      }}
    >
      <div
        className="nm-card"
        style={{
          width: "min(360px, 100%)",
          marginBottom: 24,
          textAlign: "center",
          maxHeight: "calc(100dvh - 40px)",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <NaviMascot size={64} pulse={mode === "listening"} />
        </div>
        <h2 className="nm-h2">{mode === "listening" ? "Listening…" : "Navi is thinking…"}</h2>
        <p className="nm-muted">
          {mode === "listening"
            ? "Speak or type when you’re ready."
            : "I can help with scheduling, check-in, labs, medications, and visit summaries."}
        </p>
        {mode === "thinking" ? (
          <p style={{ fontSize: "0.72rem", color: "var(--nm-muted)", marginTop: 8, lineHeight: 1.4 }}>
            Care navigation only. Navi does not diagnose, prescribe, or replace emergency care.
          </p>
        ) : null}
        {state.prompt ? (
          <p style={{ fontSize: "0.875rem", marginTop: 12, fontStyle: "italic", color: "var(--nm-muted)" }}>
            “{state.prompt}”
          </p>
        ) : null}
        {mode === "thinking" && loading ? (
          <p style={{ marginTop: 14, fontSize: "0.9rem", color: "var(--nm-muted)" }}>Generating response…</p>
        ) : null}
        {response ? (
          <div
            style={{
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 12,
              textAlign: "left",
              background: "var(--nm-blue-soft)",
              border: "1px solid #c9d8ff",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.5 }}>{response.text}</p>
            {renderResponseCards(response)}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
              <button type="button" className="nm-btn nm-btn-primary" style={{ padding: "10px 8px" }} onClick={() => navigate("/schedule")}>
                Schedule
              </button>
              <button type="button" className="nm-btn nm-btn-ghost" style={{ padding: "10px 8px", border: "1px solid #c9d8ff" }} onClick={() => navigate("/postvisit/test-results")}>
                View labs
              </button>
            </div>
            {response.structured ? (
              <details style={{ marginTop: 10 }}>
                <summary style={{ cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                  Follow-up JSON
                </summary>
                <pre
                  style={{
                    margin: "8px 0 0",
                    padding: 10,
                    borderRadius: 8,
                    background: "#0f172a",
                    color: "#dbeafe",
                    fontSize: "0.73rem",
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(response.structured, null, 2)}
                </pre>
              </details>
            ) : null}
            {response.evidence ? (
              <details style={{ marginTop: 8 }}>
                <summary style={{ cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                  Evidence snapshot
                </summary>
                <pre
                  style={{
                    margin: "8px 0 0",
                    padding: 10,
                    borderRadius: 8,
                    background: "#0b1220",
                    color: "#bae6fd",
                    fontSize: "0.72rem",
                    overflowX: "auto",
                  }}
                >
                  {JSON.stringify(response.evidence, null, 2)}
                </pre>
              </details>
            ) : null}
            <div className="nm-chip-row" style={{ marginTop: 8 }}>
              {response.followUps.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  className="nm-chip"
                  style={{ border: "none", cursor: "pointer" }}
                  onClick={() => handleFollowUp(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ marginTop: 20 }}
          onClick={() => navigate(-1)}
        >
          Close
        </button>
        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            type="button"
            className="nm-btn nm-btn-ghost"
            style={{ width: "auto", flex: 1 }}
            onClick={() =>
              navigate("/navi", {
                replace: true,
                state: { mode: "thinking", prompt: "I feel sick. Review Michael Carter PT0141 chart context." },
              })
            }
          >
            Talk to Navi
          </button>
          <button
            type="button"
            className="nm-btn nm-btn-ghost"
            style={{ width: "auto", flex: 1 }}
            onClick={() =>
              navigate("/navi", {
                replace: true,
                state: { mode: "thinking", prompt: "What can you help Michael Carter PT0141 with today?" },
              })
            }
          >
            Ask Navi
          </button>
        </div>
      </div>
    </div>
  );
}
