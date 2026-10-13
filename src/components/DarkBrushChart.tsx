
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  ResponsiveContainer,
} from 'recharts';

// Sample data (replace with your real data)
const data = [
  { date: '2021-01-01', value: 3100 },
  { date: '2021-01-15', value: 2800 },
  { date: '2021-02-01', value: 3200 },
  // ... more points
  { date: '2021-12-01', value: 900 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#1a1a1a',
        border: '1px solid #333',
        padding: '8px 12px',
        borderRadius: 6,
        color: '#fff',
        fontSize: 13,
      }}>
        <p style={{ margin: 0 }}>{label}</p>
        <p style={{ margin: '4px 0 0', color: '#00e676' }}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function DarkBrushChart() {
  return (
    <div style={{
      background: '#0d1117',          // almost black
      borderRadius: 12,
      padding: '20px 10px 10px',
      width: '100%',
      height: 420,
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          {/* Horizontal grid only */}
          <CartesianGrid
            stroke="#1f2937"
            strokeDasharray="0"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => {
              // Format as 2021-01, 2021-06, 2021-12
              const d = new Date(value);
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            }}
            minTickGap={60}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            domain={[0, 5000]}
            ticks={[0, 1000, 2000, 3000, 4000, 5000]}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#00e676"           // bright green
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#00e676' }}
          />

          {/* This is the small overview + brush at the bottom */}
          <Brush
            dataKey="date"
            height={40}
            stroke="#00e676"
            fill="#0d1117"
            travellerWidth={8}
            tickFormatter={() => ''}   // hide ticks on brush
          >
            <LineChart>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00e676"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </Brush>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}