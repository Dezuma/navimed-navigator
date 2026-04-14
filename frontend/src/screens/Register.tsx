import { useNavigate } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

export function Register() {
  const navigate = useNavigate();
  return (
    <PhoneShell>
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <button
          type="button"
          className="nm-btn nm-btn-ghost"
          style={{ width: "auto", alignSelf: "flex-start", padding: "8px 0" }}
          onClick={() => navigate("/auth")}
        >
          ← Back
        </button>
        <h1 className="nm-h1">Create account</h1>
        <p className="nm-muted">Patient profile (demo)</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="nm-field" style={{ flex: 1 }} placeholder="First name" />
          <input className="nm-field" style={{ flex: 1 }} placeholder="Last name" />
        </div>
        <input className="nm-field" placeholder="Email" type="email" />
        <input className="nm-field" placeholder="Date of birth" type="text" />
        <input className="nm-field" placeholder="Phone" type="tel" />
        <button type="button" className="nm-btn nm-btn-primary" onClick={() => navigate("/privacy")}>
          Next
        </button>
      </div>
    </PhoneShell>
  );
}
