import { useNavigate } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

export function Privacy() {
  const navigate = useNavigate();
  return (
    <PhoneShell>
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h1 className="nm-h1">Your privacy</h1>
        <p className="nm-muted">HIPAA-aware design (demo copy)</p>
        <div className="nm-card" style={{ marginTop: 16, fontSize: "0.9rem", color: "var(--nm-muted)" }}>
          <p style={{ marginTop: 0 }}>
            NaviMed is built so your health information stays protected. We use industry-standard encryption,
            least-privilege access for staff, and clear audit trails.
          </p>
          <p>
            Navi, your in-app assistant, helps with logistics—scheduling, reminders, check-in, and plain-language
            summaries—not clinical diagnosis or emergency triage. Always call your clinician or emergency services
            when something feels urgent.
          </p>
        </div>
        <button type="button" className="nm-btn nm-btn-primary" style={{ marginTop: "auto" }} onClick={() => navigate("/navi-intro")}>
          I understand
        </button>
      </div>
    </PhoneShell>
  );
}
