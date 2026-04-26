import { useNavigate } from "react-router-dom";
import { AskNaviBar } from "../components/AskNaviBar";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";
import { demoMedicalProfile } from "../demo-medical-data";

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
            <div style={{ fontSize: "0.8rem" }}>
              Demo medical context is available for vitals, labs, conditions, and care gaps.
            </div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 8, marginBottom: 6 }}>
            <div style={{ fontSize: "0.73rem", fontWeight: 700 }}>Medical context used</div>
            <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "0.78rem", lineHeight: 1.3 }}>
              {demoMedicalProfile.conditions.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>Medication: {demoMedicalProfile.medications[0]}</li>
              <li>Allergy: {demoMedicalProfile.allergies[0]}</li>
            </ul>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: 8 }}>
            <div style={{ fontSize: "0.73rem", fontWeight: 700 }}>Data-backed follow-up items</div>
            <ul style={{ margin: "6px 0 0 16px", padding: 0, fontSize: "0.78rem", lineHeight: 1.3 }}>
              {demoMedicalProfile.careGaps.map((item) => (
                <li key={item}>{item}</li>
              ))}
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
