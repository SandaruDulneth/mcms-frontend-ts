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
import { TrendingUp, Calendar } from "lucide-react";

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

  const totalWeeklyIncidents = formattedData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Incident Timeline & Velocity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Daily incoming disaster reports (Last 7 Days)</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5" />
            {totalWeeklyIncidents} Incident Reports
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            <Calendar className="h-3.5 w-3.5" />
            Last 7 Days
          </span>
        </div>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incidentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="dateLabel"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl text-xs font-medium text-slate-900">
                      <p className="font-bold text-slate-950">{item.rawDate}</p>
                      <p className="mt-1 text-blue-600 font-semibold">
                        Disaster Reports: <span className="font-bold text-slate-900">{item.count}</span>
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
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#incidentGradient)"
              activeDot={{ r: 6, fill: "#1d4ed8", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
