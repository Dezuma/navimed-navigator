import { Link } from "react-router-dom";

type Props = { open: boolean; onClose: () => void };

export function SideMenu({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.35)",
          border: "none",
          zIndex: 40,
        }}
      />
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "min(280px, 86vw)",
          height: "100%",
          background: "#fff",
          zIndex: 50,
          padding: "24px 20px",
          boxShadow: "8px 0 40px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: 24, color: "var(--nm-blue)" }}>
          NaviMed
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {[
            ["/home/has-appt", "Home"],
            ["/check-in", "Check-in"],
            ["/previsit/concerns", "Pre-Visit"],
            ["/postvisit/summary", "Post-Visit"],
            ["/appointments", "Appointments"],
            ["/schedule", "Schedule"],
            ["/privacy", "Privacy & HIPAA"],
            ["/demo-scenes", "Demo Scenes"],
            ["/splash", "Restart demo"],
          ].map(([to, label]) => (
            <li key={to} style={{ marginBottom: 12 }}>
              <Link
                to={to}
                onClick={onClose}
                style={{ fontWeight: 500, color: "var(--nm-text)" }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
