import { useNavigate } from "react-router-dom";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";

export function PatientHistory() {
  const navigate = useNavigate();
  const rows = [
    ["Medications", "Atorvastatin"],
    ["Allergies", "Shellfish"],
    ["Conditions", "Hypertension Stage I"],
  ];
  return (
    <ScreenChrome title="Update Information">
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CoreFlowPills active="previsit" />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <NaviMascot size={42} />
        </div>
        <h2 className="nm-h2" style={{ marginTop: 16, textAlign: "center", fontSize: "1.35rem" }}>
          Need to make any updates
          <br />
          to your information?
        </h2>
        <div className="nm-chip-row" style={{ justifyContent: "center", marginBottom: 8 }}>
          <span className="nm-chip">...</span>
        </div>
        <div className="nm-card">
          {rows.map(([k, v]) => (
            <div
              key={k}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}
            >
              <div>
                <div style={{ fontSize: "0.78rem", color: "#475569", fontWeight: 700 }}>{k}</div>
                <div style={{ fontSize: "0.85rem" }}>{v}</div>
              </div>
              <span style={{ color: "#64748b" }}>›</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ marginTop: "auto" }}
          onClick={() => navigate("/previsit/review")}
        >
          Continue
        </button>
      </div>
    </ScreenChrome>
  );
}
