import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";
import phoneHome from "../assets/phone-home.png";

export function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/splash-logo"), 1200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <PhoneShell status={false}>
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <img
          src={phoneHome}
          alt="Phone home screen with NaviMed app"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(2,6,23,0.08) 0%, rgba(2,6,23,0.2) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            bottom: 30,
            borderRadius: 14,
            background: "rgba(255,255,255,0.22)",
            border: "1px solid rgba(255,255,255,0.35)",
            padding: "10px 12px",
            backdropFilter: "blur(6px)",
            color: "#fff",
            fontSize: "0.88rem",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          Opening NaviMed...
        </div>
      </div>
    </PhoneShell>
  );
}
