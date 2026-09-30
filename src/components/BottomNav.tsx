"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const items = [
  { href: "/home", label: "Home", icon: "lucide:home" },
  { href: "/models", label: "Models", icon: "lucide:bar-chart-3" },
  { href: "/ai-trade", label: "AI trade", icon: "lucide:arrow-left-right", center: true },
  { href: "/team", label: "Team", icon: "lucide:users" },
  { href: "/profile", label: "Profile", icon: "lucide:user" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map(({ href, label, icon, center }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`nav-item ${active ? "nav-item--active" : ""}`}
          >
            <span className={center ? "nav-icon nav-icon--center" : "nav-icon"}>
              <Icon icon={icon} width={center ? 20 : 18} />
            </span>
            <span className="nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}