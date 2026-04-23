import { Link, useNavigate, useParams } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

export function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const patient = role === "patient";

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
        <div
          className="nm-card"
          style={{ marginTop: 8, textAlign: "center", borderRadius: 18, paddingTop: 24, paddingBottom: 22 }}
        >
          <div className="nm-logo" style={{ margin: "0 auto 14px", width: 64, height: 64, fontSize: 22 }}>
            +
          </div>
          <h1 className="nm-h1" style={{ marginTop: 0, fontSize: "1.55rem" }}>
            {patient ? "Patient Login" : "Provider Login"}
          </h1>
          <input className="nm-field" placeholder={patient ? "Email" : "Provider ID"} type="text" autoComplete="email" />
          <input className="nm-field" placeholder="Password" type="password" autoComplete="current-password" />
          <button type="button" className="nm-btn nm-btn-primary" onClick={() => navigate("/privacy")}>
            Login
          </button>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: "0.85rem", color: "var(--nm-muted)" }}>
            New user? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </PhoneShell>
  );
}
