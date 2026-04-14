import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NaviMascot } from "./NaviMascot";

type Props = {
  placeholder?: string;
};

/** Bottom chat bar aligned with Figma “Ask Navi” — scheduling, prep, check-in, summaries (no clinical triage). */
export function AskNaviBar({ placeholder = "Ask Navi…" }: Props) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const send = () => {
    const t = q.trim().toLowerCase();
    if (t.includes("schedule") || t.includes("book")) navigate("/schedule");
    else if (t.includes("appointment")) navigate("/appointments");
    else navigate("/navi", { state: { mode: "thinking", prompt: q.trim() } });
  };

  return (
    <div
      style={{
        marginTop: "auto",
        padding: "12px 0 8px",
        borderTop: "1px solid var(--nm-border)",
        background: "linear-gradient(180deg, transparent, var(--nm-bg) 18%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <NaviMascot size={40} />
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>Ask Navi</div>
          <p className="nm-muted" style={{ fontSize: "0.8rem", margin: 0 }}>
            Scheduling, visit prep, check-in, and summaries
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="nm-field"
          style={{ marginBottom: 0, flex: 1 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ width: "auto", padding: "14px 18px" }}
          onClick={send}
        >
          Go
        </button>
      </div>
      <div className="nm-chip-row">
        {["Schedule a visit", "Reschedule", "Pre-visit prep"].map((c) => (
          <button
            key={c}
            type="button"
            className="nm-chip"
            style={{ border: "none", cursor: "pointer" }}
            onClick={() => {
              if (c === "Schedule a visit" || c === "Reschedule") navigate("/schedule");
              else setQ("Help me prepare for my visit");
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
