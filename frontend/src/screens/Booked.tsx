import { useNavigate } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";
import { visualAssets } from "../visual-assets";

export function Booked() {
  const navigate = useNavigate();
  return (
    <PhoneShell>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 28,
          textAlign: "center",
        }}
      >
        <img
          src={visualAssets.scheduling}
          alt="Appointment confirmed"
          style={{ width: "100%", maxWidth: 280, borderRadius: 22, marginBottom: 20, background: "#fff" }}
        />
        <h1 className="nm-h1">You&apos;re booked!</h1>
        <p className="nm-muted">Dr. Brooks · Wed, Apr 16 at 10:30 AM</p>
        <div className="nm-card" style={{ marginTop: 20, width: "100%", textAlign: "left" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--nm-muted)" }}>Location</div>
          <div style={{ fontWeight: 600 }}>Main Clinic — Suite 300</div>
          <div style={{ fontSize: "0.8rem", color: "var(--nm-muted)", marginTop: 12 }}>What&apos;s next</div>
          <div>Navi can send reminders and help you check in on the day of your visit.</div>
        </div>
        <button type="button" className="nm-btn nm-btn-primary" style={{ marginTop: 24 }} onClick={() => navigate("/visit/upcoming")}>
          View appointment
        </button>
        <button type="button" className="nm-btn nm-btn-ghost" onClick={() => navigate("/home")}>
          Back to home
        </button>
      </div>
    </PhoneShell>
  );
}
