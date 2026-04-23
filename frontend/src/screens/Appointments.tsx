import { useNavigate } from "react-router-dom";
import { ScreenChrome } from "../components/ScreenChrome";

export function Appointments() {
  const navigate = useNavigate();
  const upcoming = [
    ["May 8th at 10:30 AM", "Dr. Perry Sim"],
    ["August 2nd at 9:30 AM", "Dr. Jane Brooks"],
  ];
  const recent = [["April 6th", "Dr. Velz Patel"]];
  return (
    <ScreenChrome title="Visits">
      <div className="nm-scroll" style={{ flex: 1 }}>
        <h2 className="nm-h2" style={{ marginTop: 12, fontSize: "0.9rem", textTransform: "uppercase", color: "var(--nm-muted)" }}>
          Upcoming Visits
        </h2>
        {upcoming.map(([date, dr]) => (
          <button
            key={date}
            type="button"
            className="nm-card"
            style={{ width: "100%", textAlign: "left", marginBottom: 10, cursor: "pointer", border: "none", padding: 14 }}
            onClick={() => navigate("/visit/upcoming")}
          >
            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{date}</div>
            <p className="nm-muted" style={{ margin: "4px 0 0", fontSize: "0.8rem" }}>{dr}</p>
          </button>
        ))}

        <h2 className="nm-h2" style={{ fontSize: "0.9rem", textTransform: "uppercase", color: "var(--nm-muted)", marginTop: 4 }}>
          Recent Visits
        </h2>
        {recent.map(([date, dr]) => (
          <button
            key={date}
            type="button"
            className="nm-card"
            style={{ width: "100%", textAlign: "left", marginBottom: 10, cursor: "pointer", border: "none", padding: 14 }}
            onClick={() => navigate("/visit/past")}
          >
            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{date}</div>
            <p className="nm-muted" style={{ margin: "4px 0 0", fontSize: "0.8rem" }}>{dr}</p>
          </button>
        ))}
      </div>
    </ScreenChrome>
  );
}
