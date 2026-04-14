import { useState, type ReactNode } from "react";
import { PhoneShell } from "./PhoneShell";
import { SideMenu } from "./SideMenu";

type Props = {
  title: string;
  children: ReactNode;
  right?: ReactNode;
};

export function ScreenChrome({ title, children, right }: Props) {
  const [menu, setMenu] = useState(false);
  return (
    <PhoneShell>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px 4px",
          background: "var(--nm-bg)",
          borderBottom: "1px solid var(--nm-border)",
        }}
      >
        <button
          type="button"
          className="nm-btn nm-btn-ghost"
          style={{ width: 44, padding: 8, fontSize: "1.25rem" }}
          aria-label="Open menu"
          onClick={() => setMenu(true)}
        >
          {"\u2630"}
        </button>
        <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{title}</span>
        <div style={{ width: 44, textAlign: "right" }}>{right}</div>
      </div>
      <SideMenu open={menu} onClose={() => setMenu(false)} />
      {children}
    </PhoneShell>
  );
}
