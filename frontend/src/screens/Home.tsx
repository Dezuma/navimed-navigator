import { useNavigate } from "react-router-dom";
import { AskNaviBar } from "../components/AskNaviBar";
import { ScreenChrome } from "../components/ScreenChrome";

export function Home() {
  const navigate = useNavigate();

  return (
    <ScreenChrome title="Home">
      <div
        className="nm-scroll"
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: 8 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, marginBottom: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #94a3b8, #cbd5e1)",
            }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>Hello, Michael</div>
            <p className="nm-muted" style={{ margin: 0, fontSize: "0.85rem" }}>Here is your care at a glance</p>
          </div>
        </div>

        <div className="nm-card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nm-teal)", textTransform: "uppercase" }}>
            Next visit
          </div>
          <h2 className="nm-h2" style={{ marginTop: 8 }}>
            Dr. Brooks — Follow-up
          </h2>
          <p className="nm-muted" style={{ margin: "0 0 12px" }}>
            Wed, Apr 16 · 10:30 AM · Main Clinic, Suite 300
          </p>
          <button type="button" className="nm-btn nm-btn-primary" onClick={() => navigate("/visit/upcoming")}>
            View appointment
          </button>
        </div>

        <div className="nm-card">
          <h3 className="nm-h2">Quick actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button type="button" className="nm-btn nm-btn-ghost" style={{ border: "1px solid var(--nm-border)" }} onClick={() => navigate("/schedule")}>
              Schedule or reschedule
            </button>
            <button
              type="button"
              className="nm-btn nm-btn-ghost"
              style={{ border: "1px solid var(--nm-border)" }}
              onClick={() => navigate("/appointments")}
            >
              All appointments
            </button>
          </div>
        </div>

        <AskNaviBar />
      </div>
    </ScreenChrome>
  );
}
