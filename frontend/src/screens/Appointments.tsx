import { useNavigate } from "react-router-dom";
import { ScreenChrome } from "../components/ScreenChrome";

export function Appointments() {
  const navigate = useNavigate();
  return (
    <ScreenChrome title="Appointments">
      <div className="nm-scroll" style={{ flex: 1 }}>
        <h2 className="nm-h2" style={{ marginTop: 12 }}>
          Upcoming
        </h2>
        <button
          type="button"
          className="nm-card"
          style={{ width: "100%", textAlign: "left", marginBottom: 12, cursor: "pointer", border: "none" }}
          onClick={() => navigate("/visit/upcoming")}
        >
          <div style={{ fontWeight: 700 }}>Dr. Brooks</div>
          <p className="nm-muted" style={{ margin: "6px 0 0", fontSize: "0.9rem" }}>
            Wed, Apr 16 · 10:30 AM · Follow-up
          </p>
        </button>

        <h2 className="nm-h2">Past</h2>
        <div className="nm-card" style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>Dr. Patel</div>
          <p className="nm-muted" style={{ margin: "6px 0 0", fontSize: "0.9rem" }}>
            Mar 2 · 9:00 AM · Annual physical
          </p>
          <button type="button" className="nm-btn nm-btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate("/visit/past")}>
            View summary
          </button>
        </div>
      </div>
    </ScreenChrome>
  );
}
