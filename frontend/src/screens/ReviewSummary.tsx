import { useNavigate } from "react-router-dom";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";

export function ReviewSummary() {
  const navigate = useNavigate();
  return (
    <ScreenChrome title="Review Summary">
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CoreFlowPills active="previsit" />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <NaviMascot size={42} />
        </div>
        <h2 className="nm-h2" style={{ marginTop: 14, textAlign: "center", fontSize: "1.3rem" }}>
          Let's make sure
          <br />
          everything looks right.
        </h2>
        <div className="nm-card" style={{ marginTop: 14 }}>
          <div style={{ background: "#99f6e4", borderRadius: 10, padding: 10, marginBottom: 8 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>Primary concerns</div>
            <div style={{ fontSize: "0.84rem" }}>Chest pressure after eating (3 days)</div>
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 10, padding: 10, marginBottom: 8 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>Details</div>
            <div style={{ fontSize: "0.84rem" }}>Mild pressure, intermittent</div>
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 10, padding: 10, marginBottom: 8 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>Medical context</div>
            <div style={{ fontSize: "0.84rem" }}>Hypertension, family history</div>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: 10 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>Summary</div>
            <div style={{ fontSize: "0.84rem" }}>
              Symptoms are organized and ready for provider review before the appointment.
            </div>
          </div>
        </div>
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ marginTop: "auto" }}
          onClick={() => navigate("/postvisit/summary")}
        >
          Send to Provider
        </button>
      </div>
    </ScreenChrome>
  );
}
