"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { AccountMenu } from "@/components/AccountMenu";
import { WalletChart } from "@/components/WalletCharts";
import { BottomNav } from "@/components/BottomNav";
import { coins } from "@/lib/coins";
import { Logo } from "@/components/Logo";
import Image from "next/image";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/context/AuthContext";

const actions = [
  { label: "Recharge", icon: "solar:money-bag-bold", link: "/models" },
  { label: "withdraw", icon: "ion:card", link: "/withdraw" },
  { label: "Help", icon: "streamline-plump:customer-support-3-solid", link: "/profile/help" },
  { label: "Team", icon: "fluent:people-team-28-filled", link: "/team" },
  { label: "Profile settings", icon: "solar:settings-bold", link: "/profile/bank-details" },
  { label: "AI Trade", icon: "ic:round-candlestick-chart", link: "/ai-trade" },
  { label: "Portfolio", icon: "basil:stack-solid", link: "/team" },
  { label: "The How", icon: "mingcute:presentation-1-fill", link: "/profile/how-it-works" },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const money = (amount: number | undefined) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(amount ?? 0);
  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <h1 className="header-logo">
          <Logo width={40} />
        </h1>
        <div className="header-actions"><LanguageSelector compact /><AccountMenu /></div>
      </header>

      <section className="banner">
        <p className="banner-eyebrow">{t("Welcome CTSix")}</p>
        <p className="banner-title">{t("Make you first Investment today")}</p>
        <Link href="/deposit" type="button" className="banner-btn">
          {t("Invest Today")}
        </Link>
      </section>

      <section className="assets-card">
        <span className="assets-pill">{t("Total Assets")}</span>
        <p className="assets-value">{money(user?.balance)}</p>
        <p className="assets-meta text-wrap">
          {t("Total Deposit:")} <span className="text-accent mr-5">{money(user?.totalDeposit)}</span>
          {t("Total Withdrawal:")} <span className="text-[#0AA521]">{money(user?.totalWithdraw)}</span>
        </p>
        <div className="lang-chip-row hidden!">
          <span className="lang-chip">{t("English")}</span>
          <span className="lang-chip">{t("French")}</span>
          <span className="lang-chip">{t("Chinese")}</span>
        </div>
        <WalletChart />
      </section>

      <section className="action-grid">
        {actions.map(({ label, icon, link }) => (
          <Link href={link} type="button" key={label} className="action-item">
            <span className="action-icon">
              <Icon icon={icon} width="38" />
            </span>
            {t(label)}
          </Link>
        ))}
      </section>

      <section className="section-block">
        <div className="section-header">
          <h2 className="section-title">{t("Trending Portfolios")}</h2>
          <Link href="/home/portfolios" className="see-all-link">
            {t("See all")}
          </Link>
        </div>

        <div className="coin-list">
          {coins.map((coin, i) => (
            <div className="coin-row" key={i}>
              <span
                className="coin-icon"
              >
                <Image src={coin.icon} alt={coin.name} width={30} />
              </span>
              <div className="coin-info">
                <p className="coin-name">{coin.name}</p>
                <p className="coin-symbol">{coin.symbol}</p>
              </div>
              <div className="coin-value">
                <p className="coin-price">{coin.price}</p>
                {coin.addFunds ? (
                  <Link href="/deposit" className="add-funds-link">+{t("Add Funds")}</Link>
                ) : (
                  <p className="coin-change">{coin.change}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="footer-copyright">{t("2026, CT6 Copyright")}</p>
      </section>

      <BottomNav />
    </div>
  );
}
