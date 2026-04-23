import { AskNaviBar } from "../components/AskNaviBar";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";

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
            Cholesterol Panel - July 28
          </div>
          <ul style={{ margin: "0 0 8px 16px", padding: 0, fontSize: "0.78rem", lineHeight: 1.35 }}>
            <li>Total Cholesterol: 176 mg/dL</li>
            <li>LDL: 94 mg/dL</li>
            <li>HDL: 54 mg/dL</li>
            <li>All values within expected range</li>
          </ul>
          <div style={{ background: "#7dd3c7", borderRadius: 8, padding: 8, fontSize: "0.78rem", fontWeight: 700 }}>
            Liver Function Test - June 21
          </div>
        </div>
        <AskNaviBar context="test-results PT0141" />
      </div>
    </ScreenChrome>
  );
}
