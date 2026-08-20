"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type IncidentTrendChartProps = {
  data: Array<{ date: string; count: number }>;
};

export default function IncidentTrendChart({ data }: IncidentTrendChartProps) {
  const formattedData = (data || []).map((item) => {
    const d = new Date(item.date);
    const dayLabel = isNaN(d.getTime())
      ? item.date
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return {
      dateLabel: dayLabel,
      rawDate: item.date,
      count: item.count,
    };
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-950">Incident Timeline (Last 7 Days)</h3>
        <p className="mt-0.5 text-xs text-slate-500">Daily disaster reports submitted</p>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="dateLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded border border-slate-200 bg-white p-2.5 shadow-md text-xs text-slate-900">
                      <p className="font-bold text-slate-950">{item.rawDate}</p>
                      <p className="mt-0.5 text-blue-700 font-semibold">
                        Reports: {item.count}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#incidentGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
