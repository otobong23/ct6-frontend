"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import "@/app/RadarChartWidget.css";

const data = [
  { coin: "BTC", A: 95, B: 80, C: 100 },
  { coin: "ADA", A: 55, B: 45, C: 50 },
  { coin: "BAND", A: 85, B: 95, C: 35 },
  { coin: "ETH", A: 70, B: 65, C: 55 },
  { coin: "TRX", A: 60, B: 45, C: 75 },
  { coin: "USDT", A: 90, B: 70, C: 25 },
];

const RadarChartWidget = () => {
  return (
    <div className="radar-glow">
      <RadarChart
        className="radar-chart"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "500px",
          aspectRatio: 1,
        }}
        responsive
        data={data}
        outerRadius="78%"
      > <PolarGrid
          gridType="polygon"
          stroke="#34404d"
          fill="#171d25"
          fillOpacity={1}
        />
        <PolarAngleAxis
          dataKey="coin"
          tick={{
            fill: "rgba(255, 255, 255, 0.6)",
            fontSize: 11,
            fontWeight: 400,
          }}
          tickLine={false}
          axisLine={false}
        />

        <PolarRadiusAxis
          domain={[0, 100]}
          tick={false}
          axisLine={false}
          tickCount={5}
        />

        <Radar
          name="Market A"
          dataKey="A"
          stroke="#2998ff"
          strokeWidth={1}
          fill="none"
          dot={false}
          isAnimationActive={false}
        />

        <Radar
          name="Market B"
          dataKey="B"
          stroke="#32ffd0"
          strokeWidth={1}
          fill="none"
          dot={false}
          isAnimationActive={false}
        />

        <Radar
          name="Market C"
          dataKey="C"
          stroke="#a6e9ff"
          strokeWidth={1}
          fill="none"
          dot={false}
          isAnimationActive={false}
        />
      </RadarChart>
    </div>
  );
};

export default RadarChartWidget;
