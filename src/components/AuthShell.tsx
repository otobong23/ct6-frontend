"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { Logo } from "@/components/Logo";

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
        <Logo width={68} />
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
  return (
    <Link href={href} className="pill">
      <Icon icon="lucide:arrow-left" width="14" /> Back
    </Link>
  );
}

export function LanguagePill() {
  return (
    <button type="button" className="pill">
      <Icon icon="lucide:globe" width="14" /> English
    </button>
  );
}