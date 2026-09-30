import Link from "next/link";
import { Icon } from "@iconify/react";
import { PageHeader } from "@/components/PageHeader";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";

const menuItems = [
  { label: "History", href: "/profile/history", icon: "lucide:history" },
  { label: "Bank details", href: "/profile/bank-details", icon: "lucide:landmark" },
  { label: "Notification", href: "/profile/notifications", icon: "lucide:bell" },
  { label: "Security", href: "/profile/security", icon: "lucide:shield-check" },
  { label: "Help & Support", href: "/profile/help", icon: "lucide:headphones" },
  { label: "Terms & Conditions", href: "/profile/terms", icon: "lucide:file-text" },
  { label: "Logout", href: "/login", icon: "lucide:log-out" },
];

export default function ProfilePage() {
  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />

      <div className="profile-banner">
        <div className="profile-avatar">M</div>
        <div>
          <p className="profile-name">Ma*****om</p>
          <p className="profile-id">ID:34C769</p>
        </div>
      </div>

      <div className="assets-card" style={{ marginTop: 16 }}>
        <span className="assets-pill">Total Assets</span>
        <p className="assets-value">$134,876</p>
        <p className="assets-meta">TWM: $130,000 NTP : +2.30%</p>
        <div className="profile-actions-row">
          <Link href="/deposit" className="btn-primary btn-primary--half btn-link">
            Deposit
          </Link>
          <Link href="/withdraw" className="btn-primary btn-primary--half btn-link">
            Withdraw
          </Link>
        </div>
      </div>

      <div className="menu-list">
        {menuItems.map(({ label, href, icon }) => (
          <Link href={href} key={label} className="menu-row">
            <span className="menu-row-icon">
              <Icon icon={icon} width="16" />
            </span>
            <span className="menu-row-label">{label}</span>
            <Icon icon="lucide:chevron-right" width="16" className="menu-row-chevron" />
          </Link>
        ))}
      </div>

      <p className="footer-copyright">2026, CT6 Copyright</p>

      <BottomNav />
    </div>
  );
}