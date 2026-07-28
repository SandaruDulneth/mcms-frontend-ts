import AdminStatCard from "@/components/admin/AdminStatCard";
import { getAdminStats } from "@/lib/adminApi";

export default async function AdminDashboardPage() {
  let stats;
  try {
    stats = await getAdminStats();
  } catch {
    return (
      <main className="px-5 py-6 md:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-bold text-red-800">
            Failed to load dashboard stats
          </p>
          <p className="mt-2 text-sm text-red-600">
            Make sure the backend server is running and accessible.
          </p>
        </div>
      </main>
    );
  }

  const maxDaily = Math.max(...stats.reportsLast7Days.map((d) => d.count), 1);
  const crisisEntries = Object.entries(stats.byCrisisType);
  const maxCrisis = Math.max(...crisisEntries.map(([, v]) => v), 1);

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      {/* ── Page header ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          System overview and report statistics
        </p>
      </section>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          icon="📄"
          label="Total Reports"
          value={stats.totalReports}
          colour="blue"
        />
        <AdminStatCard
          icon="🚨"
          label="Critical Reports"
          value={stats.byUrgency.Critical + stats.byUrgency.High}
          colour="red"
        />
        <AdminStatCard
          icon="🤝"
          label="Total Responders"
          value={stats.totalResponders}
          colour="amber"
        />
        <AdminStatCard
          icon="✅"
          label="Resolved"
          value={stats.byStatus.Resolved}
          colour="green"
        />
      </section>

      {/* ── Status breakdown ─────────────────────────────────────── */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Status pills */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Reports by Status
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(
              [
                {
                  label: "Pending",
                  value: stats.byStatus.Pending,
                  colour: "bg-slate-100 text-slate-700 border-slate-200",
                },
                {
                  label: "Active",
                  value: stats.byStatus.Active,
                  colour: "bg-red-50 text-red-700 border-red-200",
                },
                {
                  label: "In Progress",
                  value: stats.byStatus["In Progress"],
                  colour: "bg-amber-50 text-amber-700 border-amber-200",
                },
                {
                  label: "Resolved",
                  value: stats.byStatus.Resolved,
                  colour: "bg-green-50 text-green-700 border-green-200",
                },
              ] as const
            ).map((item) => (
              <div
                key={item.label}
                className={`rounded-lg border p-3 ${item.colour}`}
              >
                <p className="text-xs font-medium">{item.label}</p>
                <p className="mt-1 text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Reports by Urgency
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {(
              [
                {
                  label: "Critical",
                  value: stats.byUrgency.Critical,
                  colour: "bg-red-100 text-red-800 border-red-300",
                },
                {
                  label: "High",
                  value: stats.byUrgency.High,
                  colour: "bg-red-50 text-red-700 border-red-200",
                },
                {
                  label: "Medium",
                  value: stats.byUrgency.Medium,
                  colour: "bg-amber-50 text-amber-700 border-amber-200",
                },
                {
                  label: "Low",
                  value: stats.byUrgency.Low,
                  colour: "bg-green-50 text-green-700 border-green-200",
                },
              ] as const
            ).map((item) => (
              <div
                key={item.label}
                className={`rounded-lg border p-3 ${item.colour}`}
              >
                <p className="text-xs font-medium">{item.label}</p>
                <p className="mt-1 text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Crisis type breakdown (horizontal bars) ──────────────── */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Reports by Crisis Type
        </h3>
        {crisisEntries.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400 italic">
            No crisis types recorded yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {crisisEntries.map(([type, count]) => {
              const pct = Math.round((count / maxCrisis) * 100);
              return (
                <div key={type}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium capitalize text-slate-700">
                      {type.replaceAll("_", " ")}
                    </span>
                    <span className="font-bold text-slate-950">{count}</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Last 7 days bar chart (CSS-only) ─────────────────────── */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Reports — Last 7 Days
        </h3>
        <div className="mt-4 flex items-end gap-2" style={{ height: 160 }}>
          {stats.reportsLast7Days.map((day) => {
            const heightPct = maxDaily > 0 ? (day.count / maxDaily) * 100 : 0;
            const dayLabel = new Date(day.date + "T00:00:00").toLocaleDateString(
              "en",
              { weekday: "short" },
            );
            return (
              <div
                key={day.date}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="text-xs font-bold text-slate-700">
                  {day.count}
                </span>
                <div className="w-full flex-1 rounded-t-md bg-slate-100 relative">
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-blue-600 transition-all duration-500"
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{dayLabel}</span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
