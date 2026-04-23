import { useNavigate, useParams } from "react-router-dom";
import { AskNaviBar } from "../components/AskNaviBar";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { ScreenChrome } from "../components/ScreenChrome";

export function VisitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const upcoming = id === "upcoming";
  const checkedIn = id === "checkedin";

  return (
    <ScreenChrome title="Visit detail">
      <div
        className="nm-scroll"
        style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, paddingBottom: 8 }}
      >
        <CoreFlowPills active={upcoming || checkedIn ? "checkin" : "postvisit"} />
        <div className="nm-card" style={{ marginTop: 12, padding: 14 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0f766e", textTransform: "uppercase" }}>
            {checkedIn ? "Checked In" : upcoming ? "Upcoming" : "Completed"}
          </div>
          <h2 className="nm-h2" style={{ marginTop: 6 }}>
            {upcoming ? "Dr. Brooks" : "Dr. Patel"}
          </h2>
          <p className="nm-muted" style={{ margin: 0, fontSize: "0.82rem" }}>
            {checkedIn
              ? "August 2nd at 9:30 AM · Dr. Jane Brooks · Cardiology"
              : upcoming
                ? "Wed, Apr 16 · 10:30 AM · Main Clinic"
                : "Mar 2 · 9:00 AM · Main Clinic"}
          </p>
          {checkedIn ? (
            <p className="nm-muted" style={{ marginTop: 8, fontSize: "0.76rem" }}>
              Location: NaviMed Medical Center, 1450 Health Ave, Nashville, TN 37203
            </p>
          ) : null}
        </div>

        {upcoming ? (
          <button type="button" className="nm-btn nm-btn-primary" style={{ marginTop: 16 }} onClick={() => navigate("/check-in")}>
            Check in
          </button>
        ) : checkedIn ? (
          <></>
        ) : (
          <button type="button" className="nm-btn nm-btn-primary" style={{ marginTop: 16 }} onClick={() => navigate("/postvisit/summary")}>
            View summary
          </button>
        )}

        {!checkedIn ? (
          <div className="nm-card" style={{ marginTop: 16 }}>
            <h3 className="nm-h2">Need help with your visit?</h3>
            <p className="nm-muted" style={{ fontSize: "0.9rem", margin: 0 }}>
              Ask Navi for scheduling changes, what to bring, or a plain-language recap after your visit.
            </p>
          </div>
        ) : null}

        <AskNaviBar
          placeholder={
            checkedIn
              ? "Ask Navi"
              : upcoming
                ? "Ask Navi about this visit…"
                : "Ask Navi to explain my summary…"
          }
          context={checkedIn ? "visit-checkedin PT0141" : upcoming ? "visit-upcoming PT0141" : "visit-past PT0141"}
        />
        {checkedIn ? (
          <div className="nm-chip-row" style={{ justifyContent: "center", marginTop: 8 }}>
            {["Cancel appointment", "Reschedule visit", "Get directions", "Complete pre-visit forms"].map((x) => (
              <span key={x} className="nm-chip">
                {x}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </ScreenChrome>
  );
}
