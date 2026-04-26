import { useNavigate, useParams } from "react-router-dom";
import { AskNaviBar } from "../components/AskNaviBar";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";
import { visualAssets } from "../visual-assets";

export function Home() {
  const navigate = useNavigate();
  const { state } = useParams();

  const mode: "no-appt" | "has-appt" | "visit-complete" =
    state === "no-appt" || state === "visit-complete" ? state : "has-appt";

  const topCard =
    mode === "no-appt"
      ? {
          text: "No upcoming visits.",
          cta: "Schedule",
          onClick: () => navigate("/schedule"),
        }
      : mode === "visit-complete"
        ? {
            text: "Dr. Brooks has posted a visit summary.",
            cta: "View",
            onClick: () => navigate("/postvisit/summary"),
          }
        : {
            text: "You have a visit with Dr. Brooks tomorrow.",
            cta: "View",
            onClick: () => navigate("/visit/upcoming"),
          };

  return (
    <ScreenChrome title="Home">
      <div
        className="nm-scroll"
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: 8 }}
      >
        <CoreFlowPills active="home" />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, marginBottom: 16 }}>
          <img
            src={visualAssets.logo}
            alt="NaviMed"
            style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>Hello, Michael</div>
            <p className="nm-muted" style={{ margin: 0, fontSize: "0.85rem" }}>Here is your care at a glance</p>
          </div>
        </div>

        <div className="nm-card" style={{ marginBottom: 12, background: "linear-gradient(120deg,#dff7f6,#f8fbff)" }}>
          <img
            src={visualAssets.reminders}
            alt="Patient reminder workflow"
            style={{ width: "100%", borderRadius: 14, marginBottom: 12 }}
          />
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nm-teal)", textTransform: "uppercase", marginBottom: 8 }}>
            {mode === "no-appt" ? "No upcoming visits" : "Next visit"}
          </div>
          <p className="nm-muted" style={{ margin: "0 0 10px", fontWeight: 600 }}>{topCard.text}</p>
          <button type="button" className="nm-btn nm-btn-primary" style={{ maxWidth: 120 }} onClick={topCard.onClick}>
            {topCard.cta}
          </button>
        </div>

        <div className="nm-card" style={{ marginBottom: 10, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <NaviMascot size={42} />
          </div>
          <h3 className="nm-h2" style={{ marginBottom: 4 }}>
            {mode === "has-appt"
              ? "Need to check in or reschedule a visit?"
              : mode === "visit-complete"
                ? "Have questions about your visit?"
                : "How can I help you today?"}
          </h3>
          <div className="nm-chip-row" style={{ marginTop: 8, justifyContent: "center" }}>
            {(mode === "has-appt"
              ? ["Get Directions", "Compare Dr. Visit Form", "Reschedule"]
              : mode === "visit-complete"
                ? ["View test results", "Schedule a follow-up", "Message provider"]
                : ["Schedule visit", "View my balance", "View clinics"]).map((x) => (
              <span key={x} className="nm-chip">
                {x}
              </span>
            ))}
          </div>
        </div>

        <AskNaviBar context="home-dashboard PT0141" />
      </div>
    </ScreenChrome>
  );
}
