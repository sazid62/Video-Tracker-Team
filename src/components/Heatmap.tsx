import { AreaChart, Area, ResponsiveContainer } from "recharts";
interface HeatmapProps {
  pv: number[];
}
export default function Heatmap({ pv }: HeatmapProps) {
  console.log(pv);

  const data = pv.map((val: number, i: number) => ({ name: i, views: val }));
  return (
    <div className="h-30 mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="views"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
