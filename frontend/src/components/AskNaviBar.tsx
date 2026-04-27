import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NaviMascot } from "./NaviMascot";

type Props = {
  placeholder?: string;
  context?: string;
};

/** Bottom chat bar aligned with Figma “Ask Navi” — scheduling, prep, check-in, summaries (no clinical triage). */
export function AskNaviBar({ placeholder = "Ask Navi…", context }: Props) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const send = () => {
    const prompt = q.trim();
    const t = prompt.toLowerCase();
    if (!prompt) return;
    if (t === "schedule a visit" || t === "book appointment") navigate("/schedule");
    else if (t === "appointments") navigate("/appointments");
    else navigate("/navi", { state: { mode: "thinking", prompt, context } });
    setQ("");
  };

  const ask = (prompt: string) => {
    navigate("/navi", { state: { mode: "thinking", prompt, context } });
  };

  return (
    <div
      style={{
        marginTop: "auto",
        padding: "14px 0 8px",
        borderTop: "1px solid #dbeafe",
        background: "linear-gradient(180deg, transparent, #f8fbff 18%)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 10 }}>
        <NaviMascot size={34} />
        <p className="nm-muted" style={{ fontSize: "0.8rem", margin: "6px 0 0" }}>
          Need help with your visit?
        </p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="nm-field"
          style={{ marginBottom: 0, flex: 1, borderRadius: 999, paddingTop: 10, paddingBottom: 10 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder || "Ask Navi"}
          maxLength={2000}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ width: "auto", padding: "10px 16px", borderRadius: 999 }}
          onClick={send}
        >
          Ask
        </button>
      </div>
      <div className="nm-chip-row">
        {["Explain labs", "Review meds list", "Schedule follow-up"].map((c) => (
          <button
            key={c}
            type="button"
            className="nm-chip"
            style={{ border: "none", cursor: "pointer" }}
            onClick={() => ask(`${c} for Michael Carter PT0141`)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
