import { useNavigate, useParams } from "react-router-dom";
import { PhoneShell } from "../components/PhoneShell";

const SLIDES = [
  {
    title: "Fast, frictionless scheduling",
    body: "Book and reschedule without phone tag—right from your phone.",
    art: "\u{1F4F1}",
  },
  {
    title: "Smarter visit prep",
    body: "Share concerns ahead of time so your care team is ready for you.",
    art: "\u{1F9D1}\u200D\u{2695}\uFE0F",
  },
  {
    title: "Stay on track",
    body: "Reminders, visit summaries, and clear next steps after every appointment.",
    art: "\u{1F514}",
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
      <div className="nm-scroll" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {SLIDES.map((_, j) => (
            <div
              key={j}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 4,
                background: j <= i ? "var(--nm-blue)" : "var(--nm-border)",
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
            paddingTop: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 280,
              height: 200,
              borderRadius: 24,
              background: "linear-gradient(180deg, var(--nm-blue-soft), #fff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
              marginBottom: 28,
            }}
          >
            {slide.art}
          </div>
          <h1 className="nm-h1">{slide.title}</h1>
          <p className="nm-muted" style={{ maxWidth: 300 }}>
            {slide.body}
          </p>
        </div>
        <button
          type="button"
          className="nm-btn nm-btn-primary"
          onClick={() => (last ? navigate("/auth") : navigate(`/onboarding/${i + 1}`))}
        >
          {last ? "Get started" : "Continue"}
        </button>
        {!last ? (
          <button type="button" className="nm-btn nm-btn-ghost" onClick={() => navigate("/auth")}>
            Skip
          </button>
        ) : null}
      </div>
    </PhoneShell>
  );
}
