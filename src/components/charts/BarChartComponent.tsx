"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

interface BarChartComponentProps {
  data: { date: string; value: number; color?: string; [key: string]: unknown }[];
  height?: number;
  dataKey?: string;
  color?: string;
  showColors?: boolean;
}

export function BarChartComponent({
  data,
  height = 250,
  dataKey = "value",
  color = "#ff8c00",
  showColors = false,
}: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis dataKey="date" stroke="#888" fontSize={10} tickLine={false} />
        <YAxis stroke="#888" fontSize={10} tickLine={false} width={60} />
        <Tooltip
          contentStyle={{
            background: "#111",
            border: "1px solid #333",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
          }}
          labelStyle={{ color: "#ff8c00" }}
        />
        <Bar dataKey={dataKey} radius={[2, 2, 0, 0]}>
          {showColors
            ? data.map((entry, i) => (
                <Cell key={i} fill={entry.color || (entry.value >= 0 ? "#00d26a" : "#ff3b3b")} />
              ))
            : data.map((_, i) => <Cell key={i} fill={color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
