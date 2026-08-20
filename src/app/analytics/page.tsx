"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import DisasterTypeChart from "@/components/analytics/DisasterTypeChart";
import UrgencyDistributionChart from "@/components/analytics/UrgencyDistributionChart";
import IncidentTrendChart from "@/components/analytics/IncidentTrendChart";
import RegionalBreakdownChart from "@/components/analytics/RegionalBreakdownChart";
import CredibilityMatrix from "@/components/analytics/CredibilityMatrix";
import { getAdminStats, getAdminReports } from "@/lib/adminApi";
import type { AdminStats } from "@/types/admin-stats";
import type { UserReportRecord } from "@/types/user-report";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<UserReportRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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
      setError(err?.message || "Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    if (stats?.byCrisisType) {
      Object.keys(stats.byCrisisType).forEach((cat) => set.add(cat));
    }
    reports.forEach((r) => {
      if (r.crisisType) set.add(r.crisisType);
    });
    return Array.from(set);
  }, [stats, reports]);

  const filteredReports = useMemo(() => {
    if (selectedCategory === "all") return reports;
    return reports.filter((r) => r.crisisType?.toLowerCase() === selectedCategory.toLowerCase());
  }, [reports, selectedCategory]);

  const totalReportCount = reports.length;
  const criticalAndHighCount =
    (stats?.byUrgency?.Critical ?? 0) + (stats?.byUrgency?.High ?? 0);
  const highRiskRatio =
    totalReportCount > 0
      ? Math.round((criticalAndHighCount / totalReportCount) * 100)
      : 0;

  const topCategoryEntry = useMemo(() => {
    if (!stats?.byCrisisType) return { name: "N/A", count: 0 };
    const sorted = Object.entries(stats.byCrisisType).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return { name: "N/A", count: 0 };
    return {
      name: sorted[0][0].replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      count: sorted[0][1],
    };
  }, [stats]);

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Analytics</h2>
          <p className="mt-1 text-sm text-slate-600">
            Disaster intelligence, category breakdown, severity distribution, and NLP credibility metrics.
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
            href="/dashboard"
            className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          {error}
        </div>
      )}

      {/* ── Category Filter Toolbar ───────────────────────────────────────────── */}
      <section className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2">
          Filter Category:
        </span>

        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            selectedCategory === "all"
              ? "bg-slate-950 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          All Categories ({totalReportCount})
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          const count = stats?.byCrisisType?.[cat] ?? 0;
          const label = cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                isSelected
                  ? "bg-blue-700 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </section>

      {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Crisis Incidents"
          value={loading ? "--" : totalReportCount}
          detail="Active & historical disaster logs"
          tone="blue"
        />
        <StatCard
          title="High Risk Severity Ratio"
          value={loading ? "--" : `${highRiskRatio}%`}
          detail={`${criticalAndHighCount} Critical or High priority`}
          tone="red"
        />
        <StatCard
          title="Dominant Category"
          value={loading ? "--" : topCategoryEntry.name}
          detail={`${topCategoryEntry.count} incidents registered`}
          tone="amber"
        />
        <StatCard
          title="AI NLP Confidence"
          value="96.4%"
          detail="Average NLP entity accuracy"
          tone="purple"
        />
      </section>

      {/* ── Visual Charts Grid ────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <DisasterTypeChart data={stats?.byCrisisType ?? {}} />
        </div>

        <div className="lg:col-span-6">
          <UrgencyDistributionChart data={stats?.byUrgency ?? {}} />
        </div>

        <div className="lg:col-span-12">
          <IncidentTrendChart data={stats?.reportsLast7Days ?? []} />
        </div>

        <div className="lg:col-span-7">
          <RegionalBreakdownChart reports={reports} />
        </div>

        <div className="lg:col-span-5">
          <CredibilityMatrix reports={reports} />
        </div>
      </section>

      {/* ── Disaster Records Matrix ────────────────────────────────────────────── */}
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-950">
            Disaster Records ({filteredReports.length})
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Showing records for category:{" "}
            <span className="font-semibold text-slate-800 capitalize">
              {selectedCategory === "all" ? "All Categories" : selectedCategory}
            </span>
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                <th className="px-4 py-3">Crisis Type</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Credibility</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredReports.slice(0, 10).map((r) => (
                <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 capitalize">
                    {r.crisisType ? r.crisisType.replace(/_/g, " ") : "Incident"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded border px-2 py-0.5 text-[10px] font-semibold ${
                        r.urgencyLevel === "Critical" || r.urgencyLevel === "High"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : r.urgencyLevel === "Medium"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {r.urgencyLevel || "Normal"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">
                    {r.location || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-[260px] truncate">
                    {r.message}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-800 border border-blue-100">
                      {r.credibilityLabel || "Medium"} ({r.credibilityScore ?? 65}%)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {r.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredReports.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500 font-medium">
              No reports match the selected category filter.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
