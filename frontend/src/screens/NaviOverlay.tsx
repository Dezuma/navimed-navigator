import { useLocation, useNavigate } from "react-router-dom";
import { NaviMascot } from "../components/NaviMascot";

type LocState = { mode?: "listening" | "thinking"; prompt?: string };

export function NaviOverlay() {
  const navigate = useNavigate();
  const loc = useLocation();
  const state = (loc.state || {}) as LocState;
  const mode = state.mode || "thinking";

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
