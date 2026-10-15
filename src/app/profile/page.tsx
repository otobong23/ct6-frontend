import Link from "next/link";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/PageHeader";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";

const menuItems = [
  { label: "History", href: "/profile/history", icon: "mingcute:history-fill" },
  { label: "Bank details", href: "/profile/bank-details", icon: "mynaui:bank-solid" },
  { label: "Notification", href: "/profile/notifications", icon: "reicon:notification-status-filled" },
  { label: "Security", href: "/profile/security", icon: "reicon:security-user-filled" },
  { label: "Help & Support", href: "/profile/help", icon: "streamline-plump:customer-support-3-solid" },
  { label: "Terms & Conditions", href: "/profile/terms", icon: "reicon:doc-filled" },
  { label: "Logout", href: "/login", icon: "solar:logout-3-bold" },
];

export default function ProfilePage() {
  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />

      <div className="profile-box">
        <div className="profile-banner">
          <div className="profile-avatar">M</div>
          <div>
            <div className="flex items-center gap-1">
              <p className="profile-name">Ma*****om </p>
              <button>
                <Icon icon="fa7-solid:copy" width={20} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <p className="profile-id">ID:34C769</p>
              <p className="profile-phone">+91 9444977118</p>
            </div>
          </div>
        </div>

        <div className="assets-card mt-6! bg-transparent! bg-linear-to-b! from-[#0A0A1B]! to-[rgba(10,10,27,0)]! rounded-b-none! py-10!" style={{ marginTop: 16 }}>
          <span className="assets-pill">Total Assets</span>
          <p className="assets-value">$134,876</p>
          <p className="assets-meta">TWM: <span className="text-[#6FBAFC]">$130,000</span> &ensp; NTP: <span className="text-[#188F0D]">+2.30%</span></p>
          <div className="profile-actions-row">
            <Link href="/deposit" className="btn-primary btn-primary--half btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70% rounded-full!">
              Deposit
            </Link>
            <Link href="/withdraw" className="btn-primary btn-primary--half btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70% rounded-full!">
              Withdraw
            </Link>
          </div>
        </div>

        <div className="menu-list">
          {menuItems.map(({ label, href, icon }) => (
            <Link href={href} key={label} className="menu-row">
              <span className="menu-row-icon">
                <Icon icon={icon} width="30" />
              </span>
              <span className="menu-row-label">{label}</span>
              <Icon icon="lucide:chevron-right" width="16" className="menu-row-chevron" />
            </Link>
          ))}
        </div>
      </div>

      <p className="footer-copyright pb-10!">2026, CT6 Copyright</p>

      <BottomNav />
    </div>
  );
}