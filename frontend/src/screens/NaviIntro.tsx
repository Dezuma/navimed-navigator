import { useNavigate } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";
import { NaviMascot } from "../components/NaviMascot";

export function NaviIntro() {
  const navigate = useNavigate();
  return (
    <PhoneShell>
      <div style={{ height: 12, background: "linear-gradient(90deg,#06b6d4,#0284c7)" }} />
      <div
        className="nm-scroll"
        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}
      >
        <div style={{ margin: "32px 0 20px" }}>
          <NaviMascot size={88} />
        </div>
        <h1 className="nm-h1">Hi, I'm Navi</h1>
        <p className="nm-muted" style={{ maxWidth: 320 }}>
          I'll help you navigate your care. When you see me, you can type or tap the mic to talk.
        </p>
        <ul
          style={{
            textAlign: "left",
            alignSelf: "stretch",
            paddingLeft: 20,
            color: "var(--nm-muted)",
            fontSize: "0.95rem",
          }}
        >
          <li style={{ marginBottom: 8 }}>I can help with scheduling, re-visit prep, check-ins, and test results.</li>
        </ul>
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ marginTop: "auto", width: "100%" }}
          onClick={() => navigate("/home")}
        >
          Continue
        </button>
      </div>
    </PhoneShell>
  );
}
