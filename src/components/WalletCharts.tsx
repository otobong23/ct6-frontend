"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

const data = [
  { a: 40, b: 30 },
  { a: 32, b: 45 },
  { a: 48, b: 38 },
  { a: 36, b: 52 },
  { a: 55, b: 40 },
  { a: 42, b: 60 },
  { a: 60, b: 48 },
  { a: 50, b: 65 },
  { a: 68, b: 55 },
  { a: 58, b: 70 },
  { a: 72, b: 62 },
  { a: 64, b: 78 },
];

function EndDot(props: any) {
  const { cx, cy, index } = props;
  if (index !== data.length - 1) return null;
  return <circle cx={cx} cy={cy} r={4} fill="#fff" stroke="#2ecc71" strokeWidth={2} />;
}

export function WalletChart() {
  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data}>
          <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
          <Line
            type="monotone"
            dataKey="a"
            stroke="#4d8bff"
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={1200}
          />
          <Line
            type="monotone"
            dataKey="b"
            stroke="#2ecc71"
            strokeWidth={2}
            dot={<EndDot />}
            isAnimationActive
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}