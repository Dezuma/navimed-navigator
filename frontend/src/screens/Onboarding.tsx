import { useNavigate, useParams } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

const SLIDES = [
  {
    title: "Fast, Frictionless Scheduling",
    body: "Book or reschedule care in under a minute.",
    art: "schedule",
  },
  {
    title: "Smarter Visit Prep",
    body: "Share symptoms ahead of time. We summarize them for your doctor.",
    art: "prep",
  },
  {
    title: "Stay on track",
    body: "Get reminders, clear summaries, and simple next steps.",
    art: "track",
  },
];

export function Onboarding() {
  const { step } = useParams();
  const navigate = useNavigate();
  const i = Math.min(2, Math.max(0, Number(step) || 0));
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

  const renderArt = () => {
    if (slide.art === "schedule") {
      return (
        <div style={{ position: "relative", width: 220, height: 140 }}>
          <div
            style={{
              position: "absolute",
              left: 26,
              top: 22,
              width: 60,
              height: 100,
              borderRadius: 18,
              background: "#1e293b",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 20,
              top: 18,
              width: 120,
              height: 84,
              borderRadius: 14,
              background: "#fff",
              border: "1px solid #dbeafe",
              boxShadow: "0 6px 20px rgba(30,78,216,0.12)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 28,
              top: 30,
              width: 104,
              height: 8,
              borderRadius: 999,
              background: "#dbeafe",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 28,
              top: 46,
              width: 70,
              height: 8,
              borderRadius: 999,
              background: "#bfdbfe",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 28,
              top: 64,
              width: 52,
              height: 20,
              borderRadius: 999,
              background: "#2563eb",
            }}
          />
        </div>
      );
    }
    if (slide.art === "prep") {
      return (
        <div style={{ position: "relative", width: 220, height: 140 }}>
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 24,
              width: 72,
              height: 88,
              borderRadius: 999,
              background: "linear-gradient(180deg,#22d3ee,#3b82f6)",
              opacity: 0.2,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 28,
              top: 22,
              width: 132,
              height: 92,
              borderRadius: 16,
              background: "#fff",
              border: "1px solid #dbeafe",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 38,
              top: 34,
              width: 108,
              height: 8,
              borderRadius: 999,
              background: "#dbeafe",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 38,
              top: 50,
              width: 82,
              height: 8,
              borderRadius: 999,
              background: "#bfdbfe",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 38,
              top: 67,
              width: 96,
              height: 8,
              borderRadius: 999,
              background: "#bfdbfe",
            }}
          />
        </div>
      );
    }
    return (
      <div style={{ position: "relative", width: 220, height: 140 }}>
        {[0, 1, 2].map((n) => (
          <div
            key={n}
            style={{
              position: "absolute",
              right: 24,
              top: 24 + n * 30,
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: "2px solid #22d3ee",
              background: "#fff",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 34,
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "linear-gradient(140deg,#60a5fa,#2563eb)",
            opacity: 0.2,
          }}
        />
      </div>
    );
  };

  return (
    <PhoneShell>
      <div className="nm-scroll" style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: 6 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {SLIDES.map((_, j) => (
            <div
              key={j}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 4,
                background: j === i ? "var(--nm-blue)" : "#e2e8f0",
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            paddingTop: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 286,
              height: 188,
              borderRadius: 22,
              background: "linear-gradient(180deg, #eff6ff, #ffffff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            {renderArt()}
          </div>
          <h1 className="nm-h1" style={{ fontSize: "2rem", marginBottom: 10 }}>
            {slide.title}
          </h1>
          <p className="nm-muted" style={{ maxWidth: 298, fontSize: "1rem" }}>
            {slide.body}
          </p>
        </div>
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          style={{ marginTop: "auto" }}
          onClick={() => (last ? navigate("/auth") : navigate(`/onboarding/${i + 1}`))}
        >
          {last ? "Get Started" : "Continue"}
        </button>
        {!last ? (
          <button type="button" className="nm-btn nm-btn-ghost" style={{ fontWeight: 700 }} onClick={() => navigate("/auth")}>
            Skip
          </button>
        ) : null}
      </div>
    </PhoneShell>
  );
}
