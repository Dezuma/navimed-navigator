import { PhoneShell } from "../components/PhoneShell";

export function ProviderDashboardMobile() {
  return (
    <PhoneShell>
      <div style={{ height: 12, background: "linear-gradient(90deg,#06b6d4,#0284c7)" }} />
      <div className="nm-scroll" style={{ flex: 1 }}>
        <div className="nm-card" style={{ minHeight: 620, background: "#f1f5f9" }}>
          <h2 className="nm-h2">Provider Dashboard - Mobile</h2>
        </div>
      </div>
    </PhoneShell>
  );
}

export function ProviderDashboardTablet() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: 20 }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          minHeight: 740,
          border: "2px solid #38bdf8",
          background: "#f1f5f9",
          borderRadius: 6,
          padding: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Provider Dashboard - Tablet</h2>
      </div>
    </div>
  );
}

export function AdminDashboardDesktop() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", padding: 20 }}>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          minHeight: 420,
          background: "#f1f5f9",
          borderRadius: 6,
          padding: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Admin Dashboard - Desktop</h2>
      </div>
    </div>
  );
}
