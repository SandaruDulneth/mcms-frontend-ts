"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

type DisasterTypeChartProps = {
  data: Record<string, number>;
};

const COLOR_MAP: Record<string, { fill: string; border: string }> = {
  flood: { fill: "#2563eb", border: "#1d4ed8" },       // Royal Blue
  tsunami: { fill: "#0ea5e9", border: "#0284c7" },     // Sky Blue
  earthquake: { fill: "#f59e0b", border: "#d97706" },  // Amber
  landslide: { fill: "#d97706", border: "#b45309" },   // Bronze
  storm: { fill: "#8b5cf6", border: "#7c3aed" },       // Purple
  fire: { fill: "#ef4444", border: "#dc2626" },
  not_crisis: { fill: "#64748b", border: "#475569" },  // Slate
};

const FALLBACK_PALETTE = [
  { fill: "#2563eb", border: "#1d4ed8" },
  { fill: "#f59e0b", border: "#d97706" },
  { fill: "#0ea5e9", border: "#0284c7" },
  { fill: "#8b5cf6", border: "#7c3aed" },
  { fill: "#ef4444", border: "#dc2626" },
  { fill: "#64748b", border: "#475569" },
];

export default function DisasterTypeChart({ data }: DisasterTypeChartProps) {
  const chartData = Object.entries(data || {})
    .map(([key, val]) => ({
      name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      rawKey: key,
      value: val,
    }))
    .filter((item) => item.value > 0);

  const totalCount = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (!chartData.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-950">Disaster Category Distribution</h3>
        <div className="mt-4 flex h-56 items-center justify-center text-xs font-medium text-slate-500">
          No disaster category data recorded yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-950">Disaster Category Distribution</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Real-time incident classification breakdown
          </p>
        </div>
        <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {totalCount} Total Incidents
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        {/* Pie/Donut Chart Container */}
        <div className="relative flex h-60 items-center justify-center lg:col-span-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => {
                  const palette = COLOR_MAP[entry.rawKey] || FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];
                  return (
                    <Cell
                      key={`cell-${entry.rawKey}`}
                      fill={palette.fill}
                    />
                  );
                })}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const percent = totalCount > 0 ? ((Number(data.value) / totalCount) * 100).toFixed(1) : 0;
                    const palette = COLOR_MAP[data.payload.rawKey] || FALLBACK_PALETTE[0];

                    return (
                      <div className="rounded-md border border-slate-200 bg-slate-900 px-3 py-2 text-xs text-white shadow-xl">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: palette.fill }}
                          />
                          <p className="font-bold">{data.name}</p>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-300">
                          Count: <span className="font-bold text-white">{data.value}</span> ({percent}%)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center metric indicator in donut hole */}
          <div className="pointer-events-none absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-slate-950">{totalCount}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Reports</span>
          </div>
        </div>

        {/* Category Legend & Breakdown List */}
        <div className="space-y-2.5 lg:col-span-6">
          {chartData.map((item, idx) => {
            const palette = COLOR_MAP[item.rawKey] || FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];
            const percentage = totalCount > 0 ? Math.round((item.value / totalCount) * 100) : 0;

            return (
              <div
                key={item.rawKey}
                className="rounded-md border border-slate-200 bg-slate-50/70 p-2.5 transition-colors hover:bg-slate-100/80"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <span
                      className="h-3 w-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: palette.fill }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-950">
                    <span>{item.value}</span>
                    <span className="text-[11px] font-normal text-slate-500">({percentage}%)</span>
                  </div>
                </div>

                {/* Percentage Bar */}
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: palette.fill,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
