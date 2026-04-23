import { useNavigate } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

export function Privacy() {
  const navigate = useNavigate();
  return (
    <PhoneShell>
      <div style={{ height: 12, background: "linear-gradient(90deg,#06b6d4,#0284c7)" }} />
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h1 className="nm-h1" style={{ textAlign: "center" }}>Your Privacy</h1>
        <div className="nm-card" style={{ marginTop: 8, fontSize: "0.9rem", color: "var(--nm-muted)", textAlign: "center" }}>
          <div className="nm-logo" style={{ margin: "0 auto 14px", width: 58, height: 58, fontSize: 20 }}>
            +
          </div>
          <p style={{ marginTop: 0 }}>
            At NaviMed, we are committed to protecting your privacy.
          </p>
          <p>
            We follow HIPAA standards to protect your information. Only your care team can access your data at any time.
          </p>
        </div>
        <button type="button" className="nm-btn nm-btn-primary" style={{ marginTop: "auto" }} onClick={() => navigate("/navi-intro")}>
          Continue
        </button>
      </div>
    </PhoneShell>
  );
}
