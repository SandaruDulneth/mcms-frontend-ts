"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import DisasterTypeChart from "@/components/analytics/DisasterTypeChart";
import UrgencyDistributionChart from "@/components/analytics/UrgencyDistributionChart";
import IncidentTrendChart from "@/components/analytics/IncidentTrendChart";
import RegionalBreakdownChart from "@/components/analytics/RegionalBreakdownChart";
import CredibilityMatrix from "@/components/analytics/CredibilityMatrix";
import { getReports } from "@/lib/reportApi";
import type { AdminStats } from "@/types/admin-stats";
import type { UserReportRecord } from "@/types/user-report";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  ShieldCheck,
  Filter,
  RefreshCw,
  ArrowLeft,
  Calendar,
  Layers,
  MapPin,
  AlertTriangle,
  FileCheck,
  Flame,
  Waves,
} from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<UserReportRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const reportsData = await getReports();

      const byUrgency = { High: 0, Medium: 0, Low: 0, Critical: 0 };
      const byStatus = { Pending: 0, Active: 0, "In Progress": 0, Resolved: 0 };
      const byCrisisType: Record<string, number> = {};

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const dailyCounts: Record<string, number> = {};

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

        if (r.createdAt) {
          const dateKey = new Date(r.createdAt).toISOString().slice(0, 10);
          dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
        }
      });

      const reportsLast7Days: Array<{ date: string; count: number }> = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        reportsLast7Days.push({ date: key, count: dailyCounts[key] ?? 0 });
      }

      setStats({
        totalReports: reportsData.length,
        byUrgency,
        byStatus,
        byCrisisType,
        totalResponders: 0,
        reportsLast7Days,
      });

      setReports(reportsData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load analytics data.";
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Available crisis categories derived from stats/reports
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

  // Filtered reports based on category selection
  const filteredReports = useMemo(() => {
    if (selectedCategory === "all") return reports;
    return reports.filter((r) => r.crisisType?.toLowerCase() === selectedCategory.toLowerCase());
  }, [reports, selectedCategory]);

  // Key derived analytics
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
    <main className="min-h-screen space-y-8 px-4 py-6 sm:px-6 md:px-8 bg-slate-50/50">
      {/* ── Top Header Section ─────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-950">Analytics</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              Disaster Intelligence
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Disaster metrics, incident velocity, regional impact, and AI credibility confidence breakdown.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </section>

      {/* ── Category Filtering Toolbar ───────────────────────────────────────── */}
      <section className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm">
        <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600">
          <Filter className="h-4 w-4 text-blue-600" />
          Filter Category:
        </span>

        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            selectedCategory === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </section>

      {/* ── Key Analytic KPI Cards ────────────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Crisis Incidents"
          value={loading ? "--" : totalReportCount}
          detail="Active & historical disaster logs"
          tone="blue"
          icon={Layers}
        />
        <StatCard
          title="High Risk Severity Ratio"
          value={loading ? "--" : `${highRiskRatio}%`}
          detail={`${criticalAndHighCount} Critical or High priority`}
          tone="red"
          icon={AlertTriangle}
          trend={highRiskRatio > 50 ? "High Risk" : "Moderate"}
          trendUp={highRiskRatio < 50}
        />
        <StatCard
          title="Dominant Crisis Category"
          value={loading ? "--" : topCategoryEntry.name}
          detail={`${topCategoryEntry.count} incidents registered`}
          tone="amber"
          icon={Flame}
        />
        <StatCard
          title="AI NLP Confidence"
          value="96.4%"
          detail="Average NLP entity accuracy"
          tone="purple"
          icon={ShieldCheck}
          trend="Validated"
          trendUp={true}
        />
      </section>

      {/* ── Primary Charts Grid ────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Disaster Type Donut Chart */}
        <div className="lg:col-span-6">
          <DisasterTypeChart data={stats?.byCrisisType ?? {}} />
        </div>

        {/* Urgency Distribution Bar Chart */}
        <div className="lg:col-span-6">
          <UrgencyDistributionChart data={stats?.byUrgency ?? {}} />
        </div>

        {/* 7-Day Velocity Area Chart */}
        <div className="lg:col-span-12">
          <IncidentTrendChart data={stats?.reportsLast7Days ?? []} />
        </div>

        {/* Regional Location Impact Chart */}
        <div className="lg:col-span-7">
          <RegionalBreakdownChart reports={reports} />
        </div>

        {/* AI Credibility Matrix Card */}
        <div className="lg:col-span-5">
          <CredibilityMatrix reports={reports} />
        </div>
      </section>

      {/* ── Filtered Crisis Reports Table / List ──────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Disaster Records ({filteredReports.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing records for category:{" "}
              <span className="font-bold text-slate-800 capitalize">
                {selectedCategory === "all" ? "All Categories" : selectedCategory}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Crisis Type</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Summary / Message</th>
                <th className="px-4 py-3">Credibility</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredReports.slice(0, 10).map((r) => (
                <tr key={r._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900 capitalize">
                    {r.crisisType ? r.crisisType.replace(/_/g, " ") : "Incident"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold ${
                        r.urgencyLevel === "Critical" || r.urgencyLevel === "High"
                          ? "bg-red-100 text-red-800"
                          : r.urgencyLevel === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {r.urgencyLevel || "Normal"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate">
                    {r.location || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-[280px] truncate">
                    {r.message}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                      {r.credibilityLabel || "Medium"} ({r.credibilityScore ?? 65}%)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700">
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
