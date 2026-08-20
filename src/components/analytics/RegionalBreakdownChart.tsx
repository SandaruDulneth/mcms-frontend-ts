"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { UserReportRecord } from "@/types/user-report";

type RegionalBreakdownChartProps = {
  reports: UserReportRecord[];
};

export default function RegionalBreakdownChart({ reports }: RegionalBreakdownChartProps) {
  const locationCounts: Record<string, number> = {};

  (reports || []).forEach((report) => {
    const locs = report.extractedLocations && report.extractedLocations.length > 0
      ? report.extractedLocations
      : report.location ? report.location.split(",").map(l => l.trim()) : [];

    locs.forEach((loc) => {
      if (!loc || loc.length < 2) return;
      const cleanLoc = loc.trim().replace(/\b\w/g, (l) => l.toUpperCase());
      locationCounts[cleanLoc] = (locationCounts[cleanLoc] || 0) + 1;
    });
  });

  const sortedLocations = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (!sortedLocations.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-950">Top Affected Locations</h3>
        <div className="mt-4 flex h-48 items-center justify-center text-xs font-medium text-slate-500">
          No region location data extracted yet
        </div>
      </div>
    );
  }

  const COLORS = ["#0284c7", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-950">Top Affected Locations</h3>
        <p className="mt-0.5 text-xs text-slate-500">Extracted location frequency</p>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedLocations}
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
            <YAxis
              dataKey="location"
              type="category"
              axisLine={false}
              tickLine={false}
              width={90}
              tick={{ fill: "#1e293b", fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded border border-slate-200 bg-white p-2.5 shadow-md text-xs text-slate-900">
                      <p className="font-bold text-slate-950">{item.location}</p>
                      <p className="mt-0.5 text-slate-600">
                        Reports: <span className="font-semibold text-blue-700">{item.count}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
              {sortedLocations.map((entry, index) => (
                <Cell key={`cell-${entry.location}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
