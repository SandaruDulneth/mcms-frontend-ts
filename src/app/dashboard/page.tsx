"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import DisasterTypeChart from "@/components/analytics/DisasterTypeChart";
import IncidentTrendChart from "@/components/analytics/IncidentTrendChart";
import RecentCrisisFeed from "@/components/dashboard/RecentCrisisFeed";
import { getAdminStats, getAdminReports } from "@/lib/adminApi";
import type { AdminStats } from "@/types/admin-stats";
import type { UserReportRecord } from "@/types/user-report";

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<UserReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [statsData, reportsData] = await Promise.all([
        getAdminStats().catch(() => null),
        getAdminReports().catch(() => []),
      ]);

      if (statsData) {
        setStats(statsData);
      } else {
        const byUrgency = { High: 0, Medium: 0, Low: 0, Critical: 0 };
        const byStatus = { Pending: 0, Active: 0, "In Progress": 0, Resolved: 0 };
        const byCrisisType: Record<string, number> = {};

        reportsData.forEach((r) => {
          if (r.urgencyLevel && r.urgencyLevel in byUrgency) {
            byUrgency[r.urgencyLevel as keyof typeof byUrgency]++;
          }
          if (r.status && r.status in byStatus) {
            byStatus[r.status as keyof typeof byStatus]++;
          }
          if (r.crisisType) {
            byCrisisType[r.crisisType] = (byCrisisType[r.crisisType] || 0) + 1;
          }
        });

        setStats({
          totalReports: reportsData.length,
          byUrgency,
          byStatus,
          byCrisisType,
          totalResponders: 0,
          reportsLast7Days: [],
        });
      }

      setReports(reportsData);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const criticalCount = (stats?.byUrgency?.Critical ?? 0) + (stats?.byUrgency?.High ?? 0);
  const activeCount = (stats?.byStatus?.Active ?? 0) + (stats?.byStatus?.["In Progress"] ?? 0);
  const resolvedCount = stats?.byStatus?.Resolved ?? 0;

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      {/* ── Page Header & Primary Action Buttons ───────────────────────────── */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-600">
            Real-time disaster reports and Express backend summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/add-report"
            className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800 transition-colors"
          >
            Add report
          </Link>
          <Link
            href="/analytics"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
          >
            View analytics
          </Link>
        </div>
      </section>

      {/* Error alert if backend issue */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          {error}
        </div>
      )}

      {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={loading ? "--" : (stats?.totalReports ?? reports.length)}
          detail="Total logged MongoDB reports"
          tone="navy"
        />
        <StatCard
          title="Critical Alerts"
          value={loading ? "--" : criticalCount}
          detail="High priority emergency alerts"
          tone="red"
        />
        <StatCard
          title="Active Disasters"
          value={loading ? "--" : activeCount}
          detail="Ongoing active response items"
          tone="amber"
        />
        <StatCard
          title="Resolved Reports"
          value={loading ? "--" : resolvedCount}
          detail="Completed & resolved reports"
          tone="green"
        />
      </section>

      {/* ── Quick Navigation Section ─────────────────────────────────────────── */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-950">Quick Navigation</h3>
        <p className="mt-1 text-xs text-slate-600">
          Shortcuts to core emergency operations modules.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/add-report"
            className="rounded-md bg-red-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-800 transition-colors"
          >
            + Add crisis report
          </Link>
          <Link
            href="/disasters"
            className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
          >
            Ongoing Disasters
          </Link>
          <Link
            href="/map"
            className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
          >
            Crisis Map
          </Link>
          <Link
            href="/authorities"
            className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
          >
            Authorities
          </Link>
          <Link
            href="/analytics"
            className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
          >
            Analytics
          </Link>
          <Link
            href="/reports"
            className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
          >
            GDACS Reports
          </Link>
        </div>
      </section>

      {/* ── Main Dashboard Content Grid ───────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          <DisasterTypeChart data={stats?.byCrisisType ?? {}} />
          <IncidentTrendChart data={stats?.reportsLast7Days ?? []} />
        </div>

        <div className="space-y-6 lg:col-span-5 xl:col-span-4">
          <RecentCrisisFeed reports={reports} />
        </div>
      </section>
    </main>
  );
}
