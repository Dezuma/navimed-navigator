import { Link, useNavigate, useParams } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

export function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const patient = role === "patient";

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
        <h1 className="nm-h1" style={{ marginTop: 8 }}>
          {patient ? "Patient login" : "Provider login"}
        </h1>
        <p className="nm-muted">Demo — use any values</p>
        <input className="nm-field" placeholder="Email" type="email" autoComplete="email" />
        <input className="nm-field" placeholder="Password" type="password" autoComplete="current-password" />
        <button type="button" className="nm-btn nm-btn-primary" onClick={() => navigate("/privacy")}>
          Continue
        </button>
        <p style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </PhoneShell>
  );
}
