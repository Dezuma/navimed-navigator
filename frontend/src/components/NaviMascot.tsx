type Props = { size?: number; pulse?: boolean };

export function NaviMascot({ size = 56, pulse = false }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(160deg, #2563eb, #60a5fa)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 10px 30px rgba(37, 99, 235, 0.35)",
        animation: pulse ? "nm-pulse 1.4s ease-in-out infinite" : undefined,
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 32 32" fill="none" aria-hidden>
        <ellipse cx="11" cy="14" rx="2.2" ry="3" fill="white" />
        <ellipse cx="21" cy="14" rx="2.2" ry="3" fill="white" />
        <path
          d="M12 22c2.5 2 5.5 2 8 0"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <style>{`
        @keyframes nm-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.92; }
        }
      `}</style>
    </div>
  );
}
