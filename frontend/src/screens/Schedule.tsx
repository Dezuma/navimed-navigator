import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { ScreenChrome } from "../components/ScreenChrome";

const SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "2:00 PM", "3:30 PM"];

export function Schedule() {
  const navigate = useNavigate();
  const [day, setDay] = useState(2);
  const [slot, setSlot] = useState<string | null>("10:30 AM");

  const days = useMemo(() => {
    const out: { label: string; sub: string }[] = [];
    const base = new Date(2026, 3, 14);
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      out.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        sub: String(d.getDate()),
      });
    }
    return out;
  }, []);

  return (
    <ScreenChrome title="Schedule visit">
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CoreFlowPills active="scheduling" />
        <p className="nm-muted" style={{ marginTop: 8 }}>
          Select a time with <strong>Dr. Brooks</strong>
        </p>

        <div className="nm-date-strip">
          {days.map((d, i) => (
            <button
              key={d.sub}
              type="button"
              className={"nm-date-pill" + (i === day ? " selected" : "")}
              onClick={() => setDay(i)}
            >
              {d.label}
              <small>Apr {d.sub}</small>
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {SLOTS.map((t, idx) => (
            <button
              key={t}
              type="button"
              className={"nm-slot" + (slot === t ? " selected" : "")}
              disabled={idx === 1 || idx === 5}
              onClick={() => setSlot(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="nm-muted" style={{ fontSize: "0.8rem" }}>
          Grayed slots are unavailable (demo).
        </p>

        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ marginTop: "auto" }}
          disabled={!slot}
          onClick={() => navigate("/booked")}
        >
          Schedule visit
        </button>
      </div>
    </ScreenChrome>
  );
}
