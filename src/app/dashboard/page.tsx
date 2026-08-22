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
import {
  FileText,
  AlertTriangle,
  Activity,
  CheckCircle2,
  PlusCircle,
  BarChart3,
  MapPin,
  RefreshCw,
  Zap,
  Shield,
  Clock,
  Radio,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<UserReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [statsData, reportsData] = await Promise.all([
        getAdminStats().catch(() => null),
        getAdminReports().catch(() => []),
      ]);

      if (statsData) {
        setStats(statsData);
      } else {
        // Build stats directly from reports fallback if admin/stats has issue
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
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data from backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto polling every 30 seconds
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const criticalAndHighCount =
    (stats?.byUrgency?.Critical ?? 0) + (stats?.byUrgency?.High ?? 0);
  const activeCount =
    (stats?.byStatus?.Active ?? 0) + (stats?.byStatus?.["In Progress"] ?? 0);
  const resolvedCount = stats?.byStatus?.Resolved ?? 0;

  return (
    <main className="min-h-screen space-y-8 px-4 py-6 sm:px-6 md:px-8 bg-slate-50/50">
      {/* ── Top Header Section ─────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Express API Connected
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Real-time emergency operations and disaster analytics from Express API.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/add-report"
            className="inline-flex items-center gap-2 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add report
          </Link>

          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 shadow-sm"
          >
            <BarChart3 className="h-4 w-4" />
            View analytics
          </Link>
        </div>
      </section>

      {/* Error alert banner if any */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <p className="font-bold">Connection Warning</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* ── Key Metrics Stat Cards Grid ────────────────────────────────────────── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={loading ? "--" : (stats?.totalReports ?? reports.length)}
          detail="Total incidents logged in MongoDB"
          tone="navy"
          icon={FileText}
          trend="+Live"
          trendUp={true}
        />
        <StatCard
          title="Critical & High Alerts"
          value={loading ? "--" : criticalAndHighCount}
          detail={`${stats?.byUrgency?.High ?? 0} High | ${stats?.byUrgency?.Critical ?? 0} Critical`}
          tone="red"
          icon={AlertTriangle}
          trend={criticalAndHighCount > 0 ? "Action Needed" : "Stable"}
          trendUp={criticalAndHighCount === 0}
        />
        <StatCard
          title="Active Disasters"
          value={loading ? "--" : activeCount}
          detail="Ongoing emergency responses"
          tone="amber"
          icon={Activity}
          trend="Real-time"
          trendUp={false}
        />
        <StatCard
          title="Resolved Reports"
          value={loading ? "--" : resolvedCount}
          detail="Incidents successfully mitigated"
          tone="green"
          icon={CheckCircle2}
          trend={`${stats?.byStatus?.Resolved ?? 0} Closed`}
          trendUp={true}
        />
      </section>

      {/* ── Charts & Main Operational Widgets ─────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Disaster Category & Velocity Timeline */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          <DisasterTypeChart data={stats?.byCrisisType ?? {}} />
          <IncidentTrendChart data={stats?.reportsLast7Days ?? []} />
        </div>

        {/* Right Column: Live Stream Feed & Navigation Cards */}
        <div className="space-y-6 lg:col-span-5 xl:col-span-4">
          <RecentCrisisFeed reports={reports} />

          {/* Quick Hub Navigation Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Emergency Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/map"
                className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm"
              >
                <MapPin className="h-6 w-6 text-blue-600 transition-transform group-hover:scale-110" />
                <span className="mt-2 text-xs font-bold text-slate-800">Crisis Map</span>
                <span className="text-[10px] text-slate-500">Spatial Geolocation</span>
              </Link>

              <Link
                href="/authorities"
                className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/50 hover:shadow-sm"
              >
                <Radio className="h-6 w-6 text-emerald-600 transition-transform group-hover:scale-110" />
                <span className="mt-2 text-xs font-bold text-slate-800">Authorities</span>
                <span className="text-[10px] text-slate-500">Responder Contacts</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
