"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

export function AccountMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="account-menu-wrap">
      <div className="header-icons">
        <button className="icon-btn" type="button" aria-label="Wallet">
          <Icon icon="reicon:notification-status-filled" width="24" />
        </button>
        <button
          className="icon-btn"
          type="button"
          aria-label="Settings"
          onClick={() => setOpen((o) => !o)}
        >
          <Icon icon="reicon:setting-filled" width="24" />
        </button>
      </div>

      {open && (
        <div className="account-menu">
          <button type="button" className="account-menu-item">
            General Settings
          </button>
          <button type="button" className="account-menu-item">
            Bank Settings
          </button>
          <button type="button" className="account-menu-item">
            Profile
          </button>
          <button type="button" className="account-menu-item">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}