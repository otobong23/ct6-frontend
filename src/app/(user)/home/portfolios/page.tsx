"use client";
import { useTranslation } from "react-i18next";
import { Logo } from '@/components/Logo'
import { CoinMarketList } from '@/components/CoinMarketList'
import { Icon } from '@iconify/react'
import Link from 'next/link'

export default function Portfolios() {
  const { t } = useTranslation();
  return (
    <div className="dashboard-shell">
      <div className="section-header my-8!">
        <h1 className="header-logo">
          <Logo width={40} />
        </h1>
        <Link href={"/home"} className="pill">
          <Icon icon="heroicons-outline:arrow-narrow-left" width="14" /> {t("Back")}
        </Link>
      </div>

      <CoinMarketList />
    </div>
  )
}
