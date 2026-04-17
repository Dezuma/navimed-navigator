import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NaviMascot } from "../components/NaviMascot";
import { generateNaviResponse, type NaviGeneratedResponse } from "../lib/navi-ai";

type LocState = { mode?: "listening" | "thinking"; prompt?: string; context?: string };

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
    if (c.includes("slot") || c.includes("schedule") || c.includes("reschedule")) {
      navigate("/schedule");
      return;
    }
    if (c.includes("appointment") || c.includes("check-in") || c.includes("check in")) {
      navigate("/appointments");
      return;
    }
    navigate("/navi", { replace: true, state: { mode: "thinking", prompt: choice, context: state.context } });
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
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <NaviMascot size={64} pulse={mode === "listening"} />
        </div>
        <h2 className="nm-h2">{mode === "listening" ? "Listening…" : "Navi is thinking…"}</h2>
        <p className="nm-muted">
          {mode === "listening"
            ? "Speak or type when you’re ready."
            : "I can help with scheduling, check-in, and visit summaries—not medical triage."}
        </p>
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
            <p style={{ margin: "8px 0 0", fontSize: "0.74rem", color: "var(--nm-muted)" }}>
              Source: {response.source === "remote" ? "AI endpoint" : "Smart fallback"}
            </p>
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
            onClick={() => navigate("/navi", { replace: true, state: { mode: "listening" } })}
          >
            Mic demo
          </button>
          <button
            type="button"
            className="nm-btn nm-btn-ghost"
            style={{ width: "auto", flex: 1 }}
            onClick={() => navigate("/navi", { replace: true, state: { mode: "thinking" } })}
          >
            Thinking demo
          </button>
        </div>
      </div>
    </div>
  );
}
