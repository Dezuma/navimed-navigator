import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CoreFlowPills } from "../components/CoreFlowPills";
import { NaviMascot } from "../components/NaviMascot";
import { ScreenChrome } from "../components/ScreenChrome";
import { visualAssets } from "../visual-assets";

const SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "2:00 PM", "3:30 PM"];

export function Schedule() {
  const navigate = useNavigate();
  const { mode } = useParams();
  const reschedule = mode === "reschedule";
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
    <ScreenChrome title={reschedule ? "Reschedule Visit" : "Schedule Visit"}>
      <div className="nm-scroll" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CoreFlowPills active="scheduling" />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 8, marginBottom: 10 }}>
          <NaviMascot size={40} />
        </div>
        <h3 className="nm-h2" style={{ textAlign: "center", marginBottom: 4 }}>
          {reschedule
            ? "Got it! Let's find a better time for you."
            : "Here's the next available appointments with Dr. Brooks."}
        </h3>
        <img
          src={visualAssets.scheduling}
          alt="Patient scheduling an appointment"
          style={{ width: "100%", borderRadius: 18, margin: "10px 0 14px", background: "#fff" }}
        />

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
        <div className="nm-chip-row" style={{ marginTop: 6 }}>
          {(reschedule
            ? ["Need to leave by 3pm", "Can’t do mornings", "Prefer afternoons"]
            : ["Need to leave by 3pm", "Prefer in person", "Change provider"])
            .map((x) => (
              <span key={x} className="nm-chip">
                {x}
              </span>
            ))}
        </div>

        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ marginTop: "auto" }}
          disabled={!slot}
          onClick={() => navigate("/booked")}
        >
          {reschedule ? "Reschedule Visit" : "Schedule Visit"}
        </button>
      </div>
    </ScreenChrome>
  );
}
