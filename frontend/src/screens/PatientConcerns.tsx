import { useNavigate } from "react-router-dom";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";

export function PatientConcerns() {
  const navigate = useNavigate();
  return (
    <ScreenChrome title="Patient Concerns">
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CoreFlowPills active="previsit" />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <NaviMascot size={42} />
        </div>
        <h2 className="nm-h2" style={{ marginTop: 16, textAlign: "center", fontSize: "1.4rem" }}>
          What concerns would
          <br />
          you like to discuss with
          <br />
          your provider today?
        </h2>
        <textarea
          className="nm-field"
          rows={5}
          placeholder="Describe your symptoms or concerns. I'll organize them for your provider."
          style={{ marginTop: 14, resize: "none" }}
        />
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ marginTop: "auto" }}
          onClick={() => navigate("/previsit/history")}
        >
          Continue
        </button>
      </div>
    </ScreenChrome>
  );
}
