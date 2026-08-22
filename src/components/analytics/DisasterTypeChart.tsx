"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Layers } from "lucide-react";

type DisasterTypeChartProps = {
  data: Record<string, number>;
};

const COLOR_MAP: Record<string, string> = {
  flood: "#0284c7",       // Sky Blue
  tsunami: "#2563eb",     // Royal Blue
  earthquake: "#d97706",  // Amber / Warm Gold
  landslide: "#b45309",   // Brown
  storm: "#7c3aed",       // Purple
  fire: "#dc2626",        // Red
  not_crisis: "#64748b",  // Slate
};

const FALLBACK_COLORS = ["#0284c7", "#2563eb", "#d97706", "#b45309", "#7c3aed", "#64748b"];

export default function DisasterTypeChart({ data }: DisasterTypeChartProps) {
  const chartData = Object.entries(data || {})
    .map(([key, val]) => ({
      name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      rawKey: key,
      value: val,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalCount = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (!chartData.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-slate-500">
        <p className="text-sm font-medium">No disaster category data recorded yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-950">Disaster Categories</h3>
          <p className="text-xs text-slate-500 mt-0.5">Incident distribution across crisis types</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          <Layers className="h-3.5 w-3.5 text-blue-600" />
          {totalCount} Total Reports
        </span>
      </div>

      {/* Bar Chart Visualization */}
      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              width={100}
              tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const pct = totalCount > 0 ? ((item.value / totalCount) * 100).toFixed(1) : 0;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs font-medium text-slate-900">
                      <p className="font-bold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-slate-600">
                        Reports: <span className="font-bold text-blue-600">{item.value}</span> ({pct}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${entry.rawKey}`}
                  fill={COLOR_MAP[entry.rawKey] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Clean Category Legend Cards */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {chartData.map((item, idx) => {
          const color = COLOR_MAP[item.rawKey] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
          const percentage = totalCount > 0 ? Math.round((item.value / totalCount) * 100) : 0;
          return (
            <div
              key={item.rawKey}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-semibold text-slate-700 truncate">{item.name}</span>
              </div>
              <span className="font-bold text-slate-900 shrink-0 ml-1">
                {item.value} <span className="text-[10px] font-medium text-slate-500">({percentage}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
