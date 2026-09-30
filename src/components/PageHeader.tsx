import { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export function PageHeader({ right }: { right?: ReactNode }) {
  return (
    <header className="dashboard-header">
      <div className="header-logo">
        <Logo width={40} />
      </div>
      {right}
    </header>
  );
}