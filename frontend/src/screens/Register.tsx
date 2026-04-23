import { useNavigate } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

export function Register() {
  const navigate = useNavigate();
  return (
    <PhoneShell>
      <div style={{ height: 12, background: "linear-gradient(90deg,#06b6d4,#0284c7)" }} />
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <button
          type="button"
          className="nm-btn nm-btn-ghost"
          style={{ width: "auto", alignSelf: "flex-start", padding: "8px 0" }}
          onClick={() => navigate("/auth")}
        >
          ← Back
        </button>
        <div className="nm-card" style={{ marginTop: 8, borderRadius: 18 }}>
          <div className="nm-logo" style={{ margin: "0 auto 14px", width: 58, height: 58, fontSize: 22 }}>
            +
          </div>
          <h1 className="nm-h1" style={{ textAlign: "center", fontSize: "1.45rem" }}>Create Account</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="nm-field" style={{ flex: 1 }} placeholder="First Name" />
            <input className="nm-field" style={{ flex: 1 }} placeholder="Last Name" />
          </div>
          <input className="nm-field" placeholder="Email" type="email" />
          <input className="nm-field" placeholder="MM-DD-YYYY" type="text" />
          <input className="nm-field" placeholder="(123) 456-7890" type="tel" />
          <input className="nm-field" placeholder="Password" type="password" />
          <button type="button" className="nm-btn nm-btn-primary" onClick={() => navigate("/privacy")}>
            Continue
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}
