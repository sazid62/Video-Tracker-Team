import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface HeatmapProps {
  pv: number[];
  show?: boolean;
  color?: string;
  height?: number | string;
  className?: string;
  strokeColor?: string;
  gradientId?: string;
}

export default function Heatmap({
  pv,
  show = true,
  color = "#8884d8",
  height = 48,
  className = "",
  strokeColor = "#8884d8",
  gradientId = "colorUv",
}: HeatmapProps) {
  if (!show) return null;

  const data = pv.map((val, i) => ({ name: i, views: val }));

  return (
    <div
      className={` ${className}`}
      style={{ height: typeof height === "number" ? `${height}px` : height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="views"
            stroke={strokeColor}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
