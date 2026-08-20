"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type UrgencyDistributionChartProps = {
  data: {
    Critical?: number;
    High?: number;
    Medium?: number;
    Low?: number;
  };
};

const URGENCY_CONFIG: Record<string, { label: string; color: string }> = {
  Critical: { label: "Critical", color: "#dc2626" },
  High: { label: "High", color: "#ea580c" },
  Medium: { label: "Medium", color: "#d97706" },
  Low: { label: "Low", color: "#16a34a" },
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
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-950">Incident Severity Breakdown</h3>
        <p className="mt-0.5 text-xs text-slate-500">Urgency level distribution</p>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="rounded border border-slate-200 bg-white p-2.5 shadow-md text-xs text-slate-900">
                      <p className="font-bold text-slate-950">{item.name} Severity</p>
                      <p className="mt-0.5 text-slate-600">
                        Reports: <span className="font-semibold">{item.count}</span> ({pct}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={36}>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
