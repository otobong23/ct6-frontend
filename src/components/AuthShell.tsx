"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { Logo } from "@/components/Logo";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";

export function AuthShell({
  topSlot,
  title,
  subtitle,
  children,
  footer,
}: {
  topSlot?: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="auth-shell">
      <div className="auth-logo">
        <Logo width={81} />
      </div>
      <div className="auth-top">{topSlot}</div>
      <section className="auth-card">
        <h2 className="auth-title">{title}</h2>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </section>
    </main>
  );
}

export function BackPill({ href = "/login" }: { href?: string }) {
  const { t } = useTranslation();
  return (
    <Link href={href} className="pill">
      <Icon icon="heroicons-outline:arrow-narrow-left" width="14" /> {t("Back")}
    </Link>
  );
}

export function LanguagePill() {
  return (
    <div className="pill"><Icon icon="lucide:globe" width="14" /> <LanguageSelector compact /></div>
  );
}
