"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const items = [
  { href: "/home", label: "Home", icon: "solar:home-bold" },
  { href: "/models", label: "Models", icon: "streamline-flex:graph-bar-increase-square-solid" },
  { href: "/ai-trade", label: "AI trade", icon: "material-symbols:candlestick-chart-rounded", center: true },
  { href: "/team", label: "Team", icon: "fluent:people-team-28-filled" },
  { href: "/profile", label: "Profile", icon: "reicon:profile-circle-filled" },
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
              <Icon icon={icon} width={center ? 50 : 28} style={{color: center && active ? "#04170f": ""}} />
            </span>
            <span className="nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}