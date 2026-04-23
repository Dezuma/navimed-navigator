type Props = {
  active: "home" | "scheduling" | "checkin" | "previsit" | "postvisit" | "reentry";
};

const STEPS: Array<{ id: Props["active"]; label: string }> = [
  { id: "home", label: "Home" },
  { id: "scheduling", label: "Scheduling" },
  { id: "checkin", label: "Check-in" },
  { id: "previsit", label: "Pre-Visit" },
  { id: "postvisit", label: "Post-Visit" },
  { id: "reentry", label: "Re-entry" },
];

export function CoreFlowPills({ active }: Props) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "var(--nm-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 6,
        }}
      >
        Core Flow
      </div>
      <div className="nm-flow-pills">
        {STEPS.map((step) => (
          <span key={step.id} className={"nm-flow-pill" + (step.id === active ? " active" : "")}>
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}
