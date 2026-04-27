import { AskNaviBar } from "../components/AskNaviBar";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";
import { patientMedicalProfile } from "../demo-medical-data";

export function TestResults() {
  return (
    <ScreenChrome title="Test Results">
      <div
        className="nm-scroll"
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: 8 }}
      >
        <CoreFlowPills active="postvisit" />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <NaviMascot size={42} />
        </div>
        <h2 className="nm-h2" style={{ marginTop: 14, textAlign: "center", fontSize: "1.25rem" }}>
          Here's an overview
          <br />
          of your test results.
        </h2>
        <div className="nm-card" style={{ marginTop: 12 }}>
          <div style={{ background: "#7dd3c7", borderRadius: 8, padding: 8, marginBottom: 8, fontSize: "0.78rem", fontWeight: 700 }}>
            Medical snapshot — {patientMedicalProfile.patientId}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--nm-muted)", marginBottom: 8 }}>
            {patientMedicalProfile.safetyNote}
          </div>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, marginBottom: 4 }}>Vitals</div>
          <ul style={{ margin: "0 0 10px 16px", padding: 0, fontSize: "0.78rem", lineHeight: 1.35 }}>
            {patientMedicalProfile.vitals.map(([label, value]) => (
              <li key={label}>{label}: {value}</li>
            ))}
          </ul>
          <div style={{ background: "#7dd3c7", borderRadius: 8, padding: 8, fontSize: "0.78rem", fontWeight: 700 }}>
            Watch items
          </div>
          <ul style={{ margin: "8px 0 10px 16px", padding: 0, fontSize: "0.78rem", lineHeight: 1.35 }}>
            {patientMedicalProfile.watchItems.map(([name, value, status, ref]) => (
              <li key={name}>{name}: {value} — {status} (ref {ref})</li>
            ))}
          </ul>
          <div style={{ fontSize: "0.76rem", fontWeight: 700, marginBottom: 4 }}>In range</div>
          <ul style={{ margin: "0 0 8px 16px", padding: 0, fontSize: "0.78rem", lineHeight: 1.35 }}>
            {patientMedicalProfile.inRangeLabs.map(([name, value, ref]) => (
              <li key={name}>{name}: {value} (ref {ref})</li>
            ))}
          </ul>
        </div>
        <AskNaviBar context="test-results PT0141" />
      </div>
    </ScreenChrome>
  );
}
