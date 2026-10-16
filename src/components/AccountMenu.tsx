"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

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
          <button type="button" className="account-menu-item">
            {t("General Settings")}
          </button>
          <button type="button" className="account-menu-item">
            {t("Bank Settings")}
          </button>
          <button type="button" className="account-menu-item">
            {t("Profile")}
          </button>
          <button type="button" className="account-menu-item">
            {t("Logout")}
          </button>
        </div>
      )}
    </div>
  );
}
