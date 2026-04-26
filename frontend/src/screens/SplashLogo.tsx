import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";
import { visualAssets } from "../visual-assets";

export function SplashLogo() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/onboarding/0"), 1100);
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
        <img
          src={visualAssets.wordmark}
          alt="NaviMed"
          style={{ width: "min(280px, 88%)", marginBottom: 16 }}
        />
        <p className="nm-muted" style={{ marginTop: 6, fontSize: "0.85rem" }}>
          Navigate your care
        </p>
      </div>
    </PhoneShell>
  );
}
