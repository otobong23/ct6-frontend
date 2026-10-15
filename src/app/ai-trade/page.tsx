import { PageHeader } from "@/components/PageHeader";
import { AccountMenu } from "@/components/AccountMenu";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";
import RadarChartWidget from "@/components/RadarChartWidget";

export default function AiTradePage() {
  return (
    <div className="dashboard-shell">
      <PageHeader right={<AccountMenu />} />
      <div className="assets-card mt-6! bg-transparent! bg-linear-to-b! from-[#0A0A1B]! to-[rgba(10,10,27,0)]! rounded-b-none! py-10!" style={{ marginTop: 16 }}>
        <span className="assets-pill">Total Assets</span>
        <p className="assets-value">$134,876</p>
        <p className="assets-meta">TWM: <span className="text-[#6FBAFC]">$130,000</span> &ensp; NTP: <span className="text-[#188F0D]">+2.30%</span></p>
        <div className="flex justify-center items-center flex-col mt-12">
          <RadarChartWidget />
          <p className="assets-pill mb-2.25 mt-12">Trading</p>
          <p className="text-sm">Time Remaining: <span className="text-[#33A721]">23 : 30 : 41</span></p>
        </div>

        <div className="profile-actions-row">
          <Link href="/deposit" className="btn-primary btn-primary--half btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70% rounded-full!">
            Deposit
          </Link>
          <Link href="/withdraw" className="btn-primary btn-primary--half btn-link bg-transparent! bg-linear-to-r! from-[#35D7A2] to-[#04A180] to-70% rounded-full!">
            Withdraw
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}