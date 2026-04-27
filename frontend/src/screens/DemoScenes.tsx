import { Link } from "react-router-dom";
import { ScreenChrome } from "../components/ScreenChrome";

const scenes = [
  ["/home/has-appt", "Home (has appointment)"],
  ["/home/no-appt", "Home (no appointment)"],
  ["/home/visit-complete", "Home (visit complete)"],
  ["/schedule/reschedule", "Reschedule"],
  ["/visit/checkedin", "Visit detail (checked in)"],
  ["/overlay/keyboard", "Overlay: keyboard"],
  ["/overlay/mic", "Overlay: mic"],
  ["/overlay/thinking", "Overlay: thinking"],
  ["/overlay/preparing", "Overlay: preparing"],
  ["/overlay/booked", "Overlay: booked"],
  ["/overlay/sent", "Overlay: summary sent"],
  ["/provider/mobile", "Provider mobile"],
  ["/provider/tablet", "Provider tablet"],
  ["/admin", "Admin dashboard"],
] as const;

export function DemoScenes() {
  return (
    <ScreenChrome title="Screen Library">
      <div className="nm-scroll" style={{ flex: 1 }}>
        <p className="nm-muted" style={{ margin: "10px 0 12px" }}>
          Non-linear screens for walkthroughs and QA.
        </p>
        <div className="nm-card" style={{ padding: 12 }}>
          {scenes.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              style={{
                display: "block",
                padding: "10px 12px",
                borderRadius: 10,
                color: "var(--nm-text)",
                fontWeight: 600,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </ScreenChrome>
  );
}
