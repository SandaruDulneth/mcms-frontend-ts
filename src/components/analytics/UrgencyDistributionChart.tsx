"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AlertTriangle } from "lucide-react";

type UrgencyDistributionChartProps = {
  data: {
    Critical?: number;
    High?: number;
    Medium?: number;
    Low?: number;
  };
};

const URGENCY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  Critical: { label: "Critical", color: "#dc2626", bg: "bg-red-50 text-red-700 border-red-200" },
  High: { label: "High Urgency", color: "#f97316", bg: "bg-orange-50 text-orange-700 border-orange-200" },
  Medium: { label: "Medium", color: "#eab308", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  Low: { label: "Low Urgency", color: "#10b981", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function UrgencyDistributionChart({ data }: UrgencyDistributionChartProps) {
  const chartData = [
    { name: "Critical", count: data.Critical ?? 0, color: URGENCY_CONFIG.Critical.color },
    { name: "High", count: data.High ?? 0, color: URGENCY_CONFIG.High.color },
    { name: "Medium", count: data.Medium ?? 0, color: URGENCY_CONFIG.Medium.color },
    { name: "Low", count: data.Low ?? 0, color: URGENCY_CONFIG.Low.color },
  ];

  const total = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Incident Severity Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">Classification by AI-detected urgency levels</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5" />
          Urgency Matrix
        </span>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl text-xs font-medium text-slate-900">
                      <p className="font-bold text-slate-950" style={{ color: item.color }}>
                        {item.name} Severity
                      </p>
                      <p className="mt-1 text-slate-600">
                        Reports: <span className="font-bold">{item.count}</span> ({pct}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={38}>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {chartData.map((item) => {
          const cfg = URGENCY_CONFIG[item.name] || URGENCY_CONFIG.Low;
          return (
            <div
              key={item.name}
              className={`rounded-xl border p-3 text-center transition-all ${cfg.bg}`}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                {item.name}
              </p>
              <p className="mt-1 text-xl font-extrabold">{item.count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
