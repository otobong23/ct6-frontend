"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();
    const { logout } = useAuth();

  async function handleLogout() {
    await logout().catch(() => {});
    router.replace("/");
  }

  return (
    <div className="account-menu-wrap">
      <div className="header-icons">
        <button className="icon-btn" type="button" aria-label={t("Wallet")}>
          <Icon icon="reicon:notification-status-filled" width="24" />
        </button>
        <button
          className="icon-btn"
          type="button"
          aria-label={t("Settings")}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon icon="reicon:setting-filled" width="24" />
        </button>
      </div>

      {open && (
        <div className="account-menu">
          <Link href="/profile/profile-settings" type="button" className="account-menu-item">
            {t("Profile Settings")}
          </Link>
          <Link href="/profile/security" type="button" className="account-menu-item">
            {t("Security")}
          </Link>
          <Link href="/copy-trading" type="button" className="account-menu-item">
            {t("My trades")}
          </Link>
          <button type="button" onClick={handleLogout} className="account-menu-item">
            {t("Logout")}
          </button>
        </div>
      )}
    </div>
  );
}
