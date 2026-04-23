import { useNavigate, useParams } from "react-router-dom";
import { NaviMascot } from "../components/NaviMascot";
import { PhoneShell } from "../components/PhoneShell";

export function OverlayStates() {
  const { kind } = useParams();
  const navigate = useNavigate();
  const mode = kind || "thinking";

  const modalCard = (title: string, action: string) => (
    <div
      style={{
        width: "min(300px, 100%)",
        background: "#fff",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 16px 40px rgba(2,6,23,0.35)",
      }}
    >
      <div style={{ fontWeight: 700, textAlign: "center", marginBottom: 12 }}>{title}</div>
      <div className="nm-card" style={{ padding: 12 }}>
        <div style={{ fontSize: "0.8rem", fontWeight: 700 }}>August 2nd at 9:30 AM</div>
        <div style={{ fontSize: "0.78rem", marginTop: 4 }}>Dr. Jane Brooks</div>
      </div>
      <button
        type="button"
        className="nm-btn nm-btn-primary"
        style={{ marginTop: 12 }}
        onClick={() => navigate("/home/has-appt")}
      >
        {action}
      </button>
    </div>
  );

  return (
    <PhoneShell>
      <div
        className="nm-scroll"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: mode === "booked" || mode === "sent" ? "#020617" : undefined,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="nm-h2" style={{ margin: 0 }}>
            Overlay: {mode}
          </h2>
          <button type="button" className="nm-btn nm-btn-ghost" style={{ width: "auto" }} onClick={() => navigate("/home/has-appt")}>
            Close
          </button>
        </div>

        {mode === "keyboard" ? (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <NaviMascot size={44} />
            </div>
            <input className="nm-field" placeholder="Ask Navi" />
            <div
              className="nm-card"
              style={{
                marginTop: "auto",
                textAlign: "center",
                color: "var(--nm-muted)",
                fontSize: "0.85rem",
                padding: 12,
              }}
            >
              iOS keyboard placeholder
            </div>
          </>
        ) : null}

        {mode === "mic" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <NaviMascot size={44} />
            <p style={{ margin: "12px 0 4px", fontWeight: 600 }}>Listening</p>
            <div style={{ fontSize: "2rem", color: "var(--nm-muted)" }}>🎤</div>
          </div>
        ) : null}

        {mode === "thinking" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <NaviMascot size={44} pulse />
            <p style={{ marginTop: 12, fontWeight: 600 }}>Thinking</p>
          </div>
        ) : null}

        {mode === "preparing" ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <NaviMascot size={44} pulse />
            <p style={{ marginTop: 12, fontWeight: 600, textAlign: "center" }}>
              Preparing
              <br />
              Summary
            </p>
          </div>
        ) : null}

        {mode === "booked" ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {modalCard("You're booked!", "View Appointment")}
          </div>
        ) : null}

        {mode === "sent" ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {modalCard("Summary sent to your provider.", "Done")}
          </div>
        ) : null}
      </div>
    </PhoneShell>
  );
}
