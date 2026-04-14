import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Show fake status bar (off for splash) */
  status?: boolean;
};

export function PhoneShell({ children, status = true }: Props) {
  return (
    <div className="nm-phone" style={{ display: "flex", flexDirection: "column" }}>
      {status ? (
        <div className="nm-status">
          <span>9:41</span>
          <span>NaviMed</span>
          <span>100%</span>
        </div>
      ) : null}
      {children}
    </div>
  );
}
