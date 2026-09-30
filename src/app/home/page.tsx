import Link from "next/link";
import { Icon } from "@iconify/react";
import { AccountMenu } from "@/components/AccountMenu";
import { WalletChart } from "@/components/WalletCharts";
import { BottomNav } from "@/components/BottomNav";
import { coins, coinIconColors } from "@/lib/coins";

const actions = [
  { label: "Recharge", icon: "lucide:wallet" },
  { label: "withdraw", icon: "lucide:arrow-down-to-line" },
  { label: "Help", icon: "lucide:headphones" },
  { label: "Team", icon: "lucide:users" },
  { label: "My bank", icon: "lucide:landmark" },
  { label: "AI Trade", icon: "lucide:line-chart" },
  { label: "Portfolio", icon: "lucide:layers" },
  { label: "The How", icon: "lucide:book-open" },
];

export default function HomePage() {
  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <h1 className="header-logo">CT6</h1>
        <AccountMenu />
      </header>

      <section className="banner">
        <p className="banner-eyebrow">Welcome CTSix</p>
        <p className="banner-title">Make you first Investment today</p>
        <button type="button" className="banner-btn">
          Invest Today
        </button>
      </section>

      <section className="assets-card">
        <span className="assets-pill">Total Assets</span>
        <p className="assets-value">$134,876</p>
        <p className="assets-meta">
          Return: <span className="text-accent">$3,000</span> NTP :{" "}
          <span className="text-accent">+2.30%</span>
        </p>
        <div className="lang-chip-row">
          <span className="lang-chip">English</span>
          <span className="lang-chip">English</span>
          <span className="lang-chip">English</span>
        </div>
        <WalletChart />
      </section>

      <section className="action-grid">
        {actions.map(({ label, icon }) => (
          <button type="button" key={label} className="action-item">
            <span className="action-icon">
              <Icon icon={icon} width="18" />
            </span>
            {label}
          </button>
        ))}
      </section>

      <section className="section-block">
        <div className="section-header">
          <h2 className="section-title">Trending Portfolios</h2>
          <Link href="/home/portfolios" className="see-all-link">
            See all
          </Link>
        </div>

        <div className="coin-list">
          {coins.map((coin, i) => (
            <div className="coin-row" key={i}>
              <span
                className="coin-icon"
                style={{ background: coinIconColors[coin.symbol] }}
              >
                {coin.symbol[0]}
              </span>
              <div className="coin-info">
                <p className="coin-name">{coin.name}</p>
                <p className="coin-symbol">{coin.symbol}</p>
              </div>
              <div className="coin-value">
                <p className="coin-price">{coin.price}</p>
                {coin.addFunds ? (
                  <p className="add-funds-link">+Add Funds</p>
                ) : (
                  <p className="coin-change">{coin.change}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="footer-copyright">2026, CT6 Copyright</p>
      </section>

      <BottomNav />
    </div>
  );
}