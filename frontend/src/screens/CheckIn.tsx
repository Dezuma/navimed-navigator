import { useNavigate } from "react-router-dom";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";

export function CheckIn() {
  const navigate = useNavigate();
  return (
    <ScreenChrome title="Check In">
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CoreFlowPills active="checkin" />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
          <NaviMascot size={42} />
        </div>
        <h2 className="nm-h2" style={{ marginTop: 16, textAlign: "center", fontSize: "1.4rem" }}>
          You're checked in!
        </h2>
        <p className="nm-muted" style={{ textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
          Next, I'll help you prepare for your visit.
          <br />
          This will only take a minute.
        </p>
        <div className="nm-card" style={{ marginTop: 16 }}>
          <div style={{ fontSize: "0.72rem", color: "#0f766e", fontWeight: 700 }}>August 2nd at 9:30 AM</div>
          <div style={{ fontWeight: 600, marginTop: 4 }}>Dr. Jane Brooks</div>
          <div className="nm-muted" style={{ marginTop: 6, fontSize: "0.8rem" }}>
            Cardiology
          </div>
          <div style={{ marginTop: 10, fontSize: "0.8rem", color: "#334155" }}>
            Location: NaviMed Medical Center, 1450 Health Ave, Nashville, TN 37203
          </div>
        </div>
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ marginTop: "auto" }}
          onClick={() => navigate("/previsit/concerns")}
        >
          Start Pre-Visit
        </button>
      </div>
    </ScreenChrome>
  );
}
