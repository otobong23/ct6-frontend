"use client";

import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  YAxis,
  XAxis,
} from "recharts";

const data = [
  { month: "Jan", deposits: 3200, balance: 2800 },
  { month: "Feb", deposits: 3600, balance: 3400 },
  { month: "Mar", deposits: 3350, balance: 3100 },
  { month: "Apr", deposits: 4100, balance: 3900 },
  { month: "May", deposits: 3850, balance: 3600 },
  { month: "Jun", deposits: 4500, balance: 4200 },
  { month: "Jul", deposits: 4300, balance: 4000 },
  { month: "Aug", deposits: 5100, balance: 4800 },
  { month: "Sep", deposits: 4750, balance: 4500 },
  { month: "Oct", deposits: 5600, balance: 5200 },
  { month: "Nov", deposits: 5300, balance: 4900 },
  { month: "Dec", deposits: 6200, balance: 5800 },
];

export function WalletChart() {
  return (<div className="chart-wrap"> <ResponsiveContainer width="100%" height={280}>
    <AreaChart
      data={data}
      margin={{ top: 10, right: 8, bottom: 0, left: 0 }}
    > <defs> <linearGradient id="depositGradient" x1="0" y1="0" x2="0" y2="1"> <stop offset="0%" stopColor="#4d8bff" stopOpacity={0.3} /> <stop offset="100%" stopColor="#4d8bff" stopOpacity={0.02} /> </linearGradient>
        <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2ecc71" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#2ecc71" stopOpacity={0.02} />
        </linearGradient>
      </defs>

      <CartesianGrid
        stroke="#343747"
        strokeDasharray="3 3"
        vertical
        horizontal
      />

      <XAxis
        dataKey="month"
        tick={{ fill: "#85899a", fontSize: 10 }}
        axisLine={{ stroke: "#343747" }}
        tickLine={false}
        interval={1}
      />

      <YAxis
        tick={{ fill: "#85899a", fontSize: 10 }}
        axisLine={{ stroke: "#343747" }}
        domain={[
          (min: number) => min - 500,
          (max: number) => max + 500,
        ]}
      />

      <Area
        type="stepAfter"
        dataKey="deposits"
        stroke="#36F097"
        strokeWidth={2}
        fill="url(#depositGradient)"
        dot={false}
        activeDot={false}
        isAnimationActive={false}
      />

      {/* <Area
        type="linear"
        dataKey="balance"
        stroke="#4d8bff"
        strokeWidth={2}
        fill="url(#balanceGradient)"
        dot={false}
        activeDot={false}
        isAnimationActive={false}
      /> */}
    </AreaChart>
  </ResponsiveContainer>
  </div>
  );
}
