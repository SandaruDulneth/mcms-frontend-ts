import AdminStatCard from "@/components/admin/AdminStatCard";
import DisasterTypeChart from "@/components/analytics/DisasterTypeChart";
import IncidentTrendChart from "@/components/analytics/IncidentTrendChart";
import UrgencyDistributionChart from "@/components/analytics/UrgencyDistributionChart";
import { getAdminStats } from "@/lib/adminApi";
import { FileText, AlertTriangle, Users, CheckCircle2 } from "lucide-react";

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

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      {/* ── Page Header ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Admin Overview</h2>
          <p className="mt-1 text-sm text-slate-600">
            System incident management, responder metrics, and live hazard data.
          </p>
        </div>
      </section>

      {/* ── Stat Cards Grid ───────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          icon={FileText}
          label="Total Reports"
          value={stats.totalReports}
          colour="blue"
        />
        <AdminStatCard
          icon={AlertTriangle}
          label="Critical & High"
          value={stats.byUrgency.Critical + stats.byUrgency.High}
          colour="red"
        />
        <AdminStatCard
          icon={Users}
          label="Total Responders"
          value={stats.totalResponders}
          colour="amber"
        />
        <AdminStatCard
          icon={CheckCircle2}
          label="Resolved Reports"
          value={stats.byStatus.Resolved}
          colour="green"
        />
      </section>

      {/* ── Status & Urgency Breakdown Grid ─────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Status Pills Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-950">Reports by Status</h3>
          <p className="text-xs text-slate-500 mt-0.5">Operational lifecycle stage of incoming reports</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              {
                label: "Pending",
                value: stats.byStatus.Pending,
                colour: "bg-slate-50 text-slate-800 border-slate-200",
              },
              {
                label: "Active",
                value: stats.byStatus.Active,
                colour: "bg-red-50 text-red-800 border-red-200",
              },
              {
                label: "In Progress",
                value: stats.byStatus["In Progress"],
                colour: "bg-amber-50 text-amber-800 border-amber-200",
              },
              {
                label: "Resolved",
                value: stats.byStatus.Resolved,
                colour: "bg-emerald-50 text-emerald-800 border-emerald-200",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-lg border p-4 ${item.colour}`}
              >
                <p className="text-xs font-semibold">{item.label}</p>
                <p className="mt-1.5 text-2xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Distribution Bar Chart */}
        <UrgencyDistributionChart data={stats.byUrgency} />
      </section>

      {/* ── Disaster Category & Velocity Timeline ───────────────── */}
      <section className="grid gap-6 lg:grid-cols-2">
        <DisasterTypeChart data={stats.byCrisisType} />
        <IncidentTrendChart data={stats.reportsLast7Days} />
      </section>
    </main>
  );
}
