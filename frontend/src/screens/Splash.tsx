import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

export function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/onboarding/0"), 1600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <PhoneShell status={false}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          background: "#fff",
        }}
      >
        <div className="nm-logo" style={{ marginBottom: 20 }}>
          +
        </div>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
          NaviMed
        </h1>
        <p className="nm-muted" style={{ marginTop: 8 }}>
          Navigate your care with confidence
        </p>
      </div>
    </PhoneShell>
  );
}
