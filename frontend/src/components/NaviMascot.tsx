import { visualAssets } from "../visual-assets";

type Props = { size?: number; pulse?: boolean };

export function NaviMascot({ size = 56, pulse = false }: Props) {
  return (
    <img
      src={visualAssets.assistant}
      alt="Navi assistant"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        background: "#fff",
        boxShadow: "0 10px 30px rgba(37, 99, 235, 0.35)",
        animation: pulse ? "nm-pulse 1.4s ease-in-out infinite" : undefined,
      }}
    />
  );
}
