import { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { LanguageSelector } from "@/components/LanguageSelector";

export function PageHeader({ right }: { right?: ReactNode }) {
  return (
    <header className="dashboard-header">
      <div className="header-logo">
        <Logo width={40} />
      </div>
      <div className="header-actions"><LanguageSelector compact />{right}</div>
    </header>
  );
}
