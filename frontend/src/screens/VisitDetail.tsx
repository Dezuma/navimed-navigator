import { useNavigate, useParams } from "react-router-dom";
import { AskNaviBar } from "../components/AskNaviBar";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { ScreenChrome } from "../components/ScreenChrome";

export function VisitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const upcoming = id === "upcoming";

  return (
    <ScreenChrome title="Visit detail">
      <div
        className="nm-scroll"
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: 8 }}
      >
        <CoreFlowPills active={upcoming ? "checkin" : "postvisit"} />
        <div className="nm-card" style={{ marginTop: 12 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--nm-muted)", textTransform: "uppercase" }}>
            {upcoming ? "Upcoming" : "Completed"}
          </div>
          <h2 className="nm-h2" style={{ marginTop: 8 }}>
            {upcoming ? "Dr. Brooks" : "Dr. Patel"}
          </h2>
          <p className="nm-muted" style={{ margin: 0 }}>
            {upcoming ? "Wed, Apr 16 · 10:30 AM · Main Clinic" : "Mar 2 · 9:00 AM · Main Clinic"}
          </p>
        </div>

        {upcoming ? (
          <button type="button" className="nm-btn nm-btn-primary" style={{ marginTop: 16 }} onClick={() => navigate("/navi", { state: { mode: "listening" } })}>
            Check in
          </button>
        ) : (
          <button type="button" className="nm-btn nm-btn-primary" style={{ marginTop: 16 }}>
            View summary
          </button>
        )}

        <div className="nm-card" style={{ marginTop: 16 }}>
          <h3 className="nm-h2">Need help with your visit?</h3>
          <p className="nm-muted" style={{ fontSize: "0.9rem", margin: 0 }}>
            Ask Navi for scheduling changes, what to bring, or a plain-language recap after your visit.
          </p>
        </div>

        <AskNaviBar
          placeholder={upcoming ? "Ask Navi about this visit…" : "Ask Navi to explain my summary…"}
          context={upcoming ? "visit-upcoming PT0141" : "visit-past PT0141"}
        />
      </div>
    </ScreenChrome>
  );
}
