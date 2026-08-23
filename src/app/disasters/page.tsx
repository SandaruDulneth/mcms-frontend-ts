"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import ReportCard from "@/components/ReportCard";
import { getReports } from "@/lib/reportApi";
import type { UserReportRecord } from "@/types/user-report";
import { FileText, AlertTriangle, Layers, RefreshCw, Radio } from "lucide-react";

export default function DisastersPage() {
  const [reports, setReports] = useState<UserReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchDisasters = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const allReports = await getReports();
      const activeReports = allReports.filter((report) => report.status !== "Resolved");
      setReports(activeReports);
      setErrorMessage(null);
    } catch (error) {
      if (!isSilent) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load ongoing disasters.",
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDisasters(false);

    // Auto-poll every 5 seconds for live real-time updates
    const interval = setInterval(() => {
      fetchDisasters(true);
    }, 5000);

    // Re-fetch instantly when tab comes back into focus
    const onFocus = () => fetchDisasters(true);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchDisasters]);

  const highAlertsCount = reports.filter(
    (report) => report.urgencyLevel === "High" || report.urgencyLevel === "Critical",
  ).length;

  const activeDisasterTypes = new Set(
    reports
      .map((report) => report.crisisType)
      .filter((crisisType): crisisType is string => Boolean(crisisType)),
  ).size;

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Ongoing Disasters
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Active crisis reports from MongoDB, enriched with AI disaster,
            message, and urgency classification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDisasters(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            title="Refresh reports"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
            Refresh
          </button>
          <Link
            href="/add-report"
            className="inline-flex rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 shadow-sm"
          >
            Add crisis report
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Ongoing reports"
          value={reports.length}
          detail="Active incidents requiring attention"
          tone="navy"
          icon={FileText}
        />
        <StatCard
          title="High priority alerts"
          value={highAlertsCount}
          detail="Urgent high priority reports"
          tone="red"
          icon={AlertTriangle}
        />
        <StatCard
          title="Disaster categories"
          value={activeDisasterTypes}
          detail="Unique ongoing crisis types"
          tone="blue"
          icon={Layers}
        />
      </section>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-800">
          {errorMessage}
        </div>
      ) : null}

      {!loading && !errorMessage && reports.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">
            No ongoing disasters
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            When reports are submitted, active crisis items will appear here automatically.
          </p>
          <Link
            href="/add-report"
            className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Submit report
          </Link>
        </div>
      ) : null}

      <section className="space-y-4">
        {reports.map((report) => (
          <ReportCard key={report._id} report={report} />
        ))}
      </section>
    </main>
  );
}
