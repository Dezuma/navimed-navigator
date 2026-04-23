import { useNavigate } from "react-router-dom";
import { AskNaviBar } from "../components/AskNaviBar";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";

export function PostVisitSummary() {
  const navigate = useNavigate();
  return (
    <ScreenChrome title="Visit Summary">
      <div
        className="nm-scroll"
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: 8 }}
      >
        <CoreFlowPills active="postvisit" />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <NaviMascot size={42} />
        </div>
        <h2 className="nm-h2" style={{ marginTop: 14, textAlign: "center", fontSize: "1.3rem" }}>
          Here's what your
          <br />
          provider shared.
        </h2>
        <div className="nm-card" style={{ marginTop: 14 }}>
          <div style={{ background: "#7dd3c7", borderRadius: 8, padding: 8, marginBottom: 6 }}>
            <div style={{ fontSize: "0.73rem", fontWeight: 700 }}>Key takeaway</div>
            <div style={{ fontSize: "0.8rem" }}>Mild GI-related chest symptoms. No urgent risk markers.</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 8, marginBottom: 6 }}>
            <div style={{ fontSize: "0.73rem", fontWeight: 700 }}>What was discussed</div>
            <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "0.78rem", lineHeight: 1.3 }}>
              <li>Chest discomfort after eating</li>
              <li>Symptom pattern and triggers</li>
              <li>Medication and history review</li>
            </ul>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 8 }}>
            <div style={{ fontSize: "0.73rem", fontWeight: 700 }}>Next steps</div>
            <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "0.78rem", lineHeight: 1.3 }}>
              <li>Practice reduced-acid diet for 2 weeks</li>
              <li>Continue current medications</li>
              <li>Contact clinic if symptoms worsen</li>
            </ul>
          </div>
        </div>
        <button type="button" className="nm-btn nm-btn-primary" style={{ marginTop: 12 }} onClick={() => navigate("/schedule")}>
          Schedule Follow-up
        </button>
        <button
          type="button"
          className="nm-btn nm-btn-ghost"
          style={{ border: "1px solid var(--nm-border)" }}
          onClick={() => navigate("/postvisit/test-results")}
        >
          Set Reminders
        </button>
        <AskNaviBar context="postvisit-summary PT0141" />
      </div>
    </ScreenChrome>
  );
}
