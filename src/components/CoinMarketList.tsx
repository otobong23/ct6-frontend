"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { coins } from "@/lib/coins";

type Market = Record<string, { usd: number; usd_24h_change: number }>;

const coinIds = coins.map(({ id }) => id).join(",");
const money = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 7,
});

export function CoinMarketList({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const [market, setMarket] = useState<Market>({});
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("Could not load market prices");
        const data = (await response.json()) as Market;
        if (active) {
          setMarket(data);
          setUpdatedAt(new Date());
        }
      } catch {
        // Retain the most recent successful quote if the provider is temporarily unavailable.
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    const interval = window.setInterval(load, 5_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="coin-list">
        {coins.map((coin) => {
          const quote = market[coin.id];
          const change = quote?.usd_24h_change;
          return (
            <div className="coin-row" key={coin.id}>
              <span className="coin-icon">
                {coin.icon ? <Image src={coin.icon} alt="" width={30} /> : coin.symbol.slice(0, 2)}
              </span>
              <div className="coin-info">
                <p className="coin-name">{coin.name}</p>
                <p className="coin-symbol">{coin.symbol}</p>
              </div>
              <div className="coin-value">
                <p className="coin-price">{quote ? money.format(quote.usd) : loading ? t("Loading...") : "—"}</p>
                {compact && coin.symbol === "BTC" ? (
                  <Link href="/deposit" className="add-funds-link">+{t("Add Funds")}</Link>
                ) : change != null ? (
                  <p className={`coin-change${change < 0 ? " coin-change--negative" : ""}`}>
                    {change > 0 ? "+" : ""}{change.toFixed(2)}%
                  </p>
                ) : (
                  <p className="coin-change">{t("24h change unavailable")}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="market-updated" aria-live="polite">
        {updatedAt ? `${t("Prices updated")}: ${updatedAt.toLocaleTimeString()}` : t("Prices supplied by CoinGecko")}
      </p>
    </>
  );
}
