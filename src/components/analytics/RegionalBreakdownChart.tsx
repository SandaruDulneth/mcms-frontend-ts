"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MapPin, Navigation } from "lucide-react";
import type { UserReportRecord } from "@/types/user-report";

type RegionalBreakdownChartProps = {
  reports: UserReportRecord[];
};

export default function RegionalBreakdownChart({ reports }: RegionalBreakdownChartProps) {
  // Aggregate location mentions from reports
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
    .slice(0, 7);

  if (!sortedLocations.length) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Regional Incident Breakdown</h3>
          <MapPin className="h-4 w-4 text-slate-400" />
        </div>
        <div className="flex h-52 items-center justify-center text-xs font-medium text-slate-500">
          No region location data extracted yet
        </div>
      </div>
    );
  }

  const COLORS = ["#0284c7", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Top Affected Locations</h3>
          <p className="text-xs text-slate-500 mt-0.5">Most frequent crisis locations extracted by NLP</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          <Navigation className="h-3.5 w-3.5 text-blue-600" />
          {sortedLocations.length} Regions Highlighted
        </span>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedLocations}
            margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis
              dataKey="location"
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
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xl text-xs font-medium text-slate-900">
                      <p className="font-bold text-slate-950 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-red-500" />
                        {item.location}
                      </p>
                      <p className="mt-1 text-slate-600">
                        Disaster Reports: <span className="font-bold text-blue-600">{item.count}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
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
