import { useNavigate, useParams } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";
import { visualAssets } from "../visual-assets";

const SLIDES = [
  {
    title: "Fast, Frictionless Scheduling",
    body: "Book or reschedule care in under a minute.",
    art: visualAssets.scheduling,
  },
  {
    title: "Smarter Visit Prep",
    body: "Share symptoms ahead of time. We summarize them for your doctor.",
    art: visualAssets.providerVisit,
  },
  {
    title: "Stay on track",
    body: "Get reminders, clear summaries, and simple next steps.",
    art: visualAssets.reminders,
  },
];

export function Onboarding() {
  const { step } = useParams();
  const navigate = useNavigate();
  const i = Math.min(2, Math.max(0, Number(step) || 0));
  const slide = SLIDES[i];
  const last = i === SLIDES.length - 1;

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
            <img
              src={slide.art}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 18 }}
            />
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
