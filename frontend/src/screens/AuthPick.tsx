import { Link } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

export function AuthPick() {
  return (
    <PhoneShell>
      <div style={{ height: 12, background: "linear-gradient(90deg,#06b6d4,#0284c7)" }} />
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ textAlign: "center", margin: "24px 0 32px" }}>
          <div className="nm-logo" style={{ margin: "0 auto 16px" }}>
            +
          </div>
          <h1 className="nm-h1">Welcome</h1>
          <p className="nm-muted">Choose how you’d like to sign in</p>
        </div>
        <Link to="/login/patient" className="nm-btn nm-btn-primary" style={{ marginBottom: 12 }}>
          Patient login
        </Link>
        <Link to="/login/provider" className="nm-btn nm-btn-primary" style={{ background: "var(--nm-teal)" }}>
          Provider login
        </Link>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.9rem", color: "var(--nm-muted)" }}>
          New here?{" "}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create account
          </Link>
        </p>
      </div>
    </PhoneShell>
  );
}
