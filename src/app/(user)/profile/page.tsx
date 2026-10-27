// this has to do with the profile section

"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/PageHeader";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { label: "History", href: "/profile/history", icon: "mingcute:history-fill" },
  { label: "Profile settings", href: "/profile/profile-settings", icon: "solar:settings-bold" },
  { label: "Notification", href: "/profile/notifications", icon: "reicon:notification-status-filled" },
  { label: "Security", href: "/profile/security", icon: "reicon:security-user-filled" },
  { label: "Help & Support", href: "/profile/help", icon: "streamline-plump:customer-support-3-solid" },
  { label: "Terms & Conditions", href: "/profile/terms", icon: "reicon:doc-filled" },
  { label: "Logout", href: "/login", icon: "solar:logout-3-bold" },
];

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [copyMessage, setCopyMessage] = useState("");
  const money = (amount: number | undefined) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount ?? 0);

  async function copyUserId() {
    if (!user?.userID) return;
    try {
      await navigator.clipboard.writeText(user.userID);
      setCopyMessage(t("Copied"));
      window.setTimeout(() => setCopyMessage(""), 1600);
    } catch {
      setCopyMessage(t("Could not copy to clipboard"));
    }
  }

  async function handleLogout() {
    await logout().catch(() => {});
    router.replace("/");
  }

  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />

      <div className="profile-box">
        <div className="profile-banner">
          <div className="profile-avatar">{user?.firstName?.charAt(0)?.toUpperCase() || t("M")}</div>
          <div>
            <div className="flex items-center gap-1">
              <p className="profile-name">{loading ? t("Loading...") : [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || t("Profile")}</p>
              <button type="button" onClick={copyUserId} aria-label={t("Copy user ID")}>
                <Icon icon="fa7-solid:copy" width={20} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <p className="profile-id">ID:{user?.userID || "—"}</p>
              <p className="profile-phone">{user?.phone || user?.email || "—"}</p>
            </div>
            {copyMessage && <p className="text-muted" role="status">{copyMessage}</p>}
          </div>
        </div>

        <div className="assets-card mt-6! bg-transparent! bg-linear-to-b! from-[#0A0A1B]! to-[rgba(10,10,27,0)]! rounded-b-none! py-10!" style={{ marginTop: 16 }}>
          <span className="assets-pill">{t("Total Assets")}</span>
          <p className="assets-value">{money(user?.balance)}</p>
          <p className="assets-meta text-wrap">{t("Total Deposit:")} <span className="text-[#6FBAFC]">{money(user?.totalDeposit)}</span> &ensp; {t("Total Withdrawal:")} <span className="text-[#188F0D]">{money(user?.totalWithdraw)}</span></p>
          <div className="profile-actions-row">
            <Link href="/deposit" className="btn-primary btn-primary--half btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70% rounded-full!">
              {t("Deposit")}
            </Link>
            <Link href="/withdraw" className="btn-primary btn-primary--half btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70% rounded-full!">
              {t("Withdraw")}
            </Link>
          </div>
        </div>

        <div className="menu-list">
          {menuItems.map(({ label, href, icon }) => (
            label === "Logout" ? (
              <button type="button" key={label} onClick={handleLogout} className="menu-row w-full text-left">
                <span className="menu-row-icon"><Icon icon={icon} width="30" /></span>
                <span className="menu-row-label">{t(label)}</span>
                <Icon icon="lucide:chevron-right" width="16" className="menu-row-chevron" />
              </button>
            ) : (
              <Link href={href} key={label} className="menu-row">
                <span className="menu-row-icon"><Icon icon={icon} width="30" /></span>
                <span className="menu-row-label">{t(label)}</span>
                <Icon icon="lucide:chevron-right" width="16" className="menu-row-chevron" />
              </Link>
            )
          ))}
        </div>
      </div>

      <p className="footer-copyright pb-10!">{t("2026, CT6 Copyright")}</p>

      <BottomNav />
    </div>
  );
}
