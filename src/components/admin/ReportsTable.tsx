"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CredibilityLabel, ReportStatus, UserReportRecord } from "@/types/user-report";
import { reportStatuses, reportUrgencyLevels } from "@/types/user-report";
import { deleteReport, updateReportStatus, getAdminReports } from "@/lib/adminApi";
import StatusDropdown from "@/components/admin/StatusDropdown";

type ReportsTableProps = {
  initialReports: UserReportRecord[];
};

const STATUS_TABS = ["All", ...reportStatuses] as const;

const urgencyStyles: Record<string, string> = {
  Critical: "border-red-700 bg-red-50 text-red-800",
  High: "border-red-600 bg-red-50 text-red-700",
  Medium: "border-amber-600 bg-amber-50 text-amber-700",
  Low: "border-green-700 bg-green-50 text-green-700",
};

const credibilityStyles: Record<CredibilityLabel, string> = {
  High: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-red-200 bg-red-50 text-red-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatLabel(value?: string) {
  if (!value) return "Pending analysis";
  return value.replaceAll("_", " ");
}

function CredibilityCell({ report }: { report: UserReportRecord }) {
  if (report.credibilityScore === undefined || !report.credibilityLabel) {
    return (
      <div className="space-y-1">
        <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-500">
          Waiting
        </span>
        <p className="text-xs text-slate-400">AI/credibility not ready</p>
      </div>
    );
  }

  const sources = report.credibilitySources;

  return (
    <div className="space-y-1.5">
      <span
        className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-bold ${
          credibilityStyles[report.credibilityLabel]
        }`}
      >
        {report.credibilityLabel} · {report.credibilityScore}/100
      </span>
      {sources ? (
        <div className="space-y-0.5 text-xs text-slate-500">
          <p>{sources.newsHeadline ? "News match found" : "No news match"}</p>
          <p>{sources.gdacsMatch ? "GDACS alert found" : "No GDACS alert"}</p>
          <p>{sources.similarReports} similar report{sources.similarReports === 1 ? "" : "s"}</p>
        </div>
      ) : null}
    </div>
  );
}

export default function ReportsTable({ initialReports }: ReportsTableProps) {
  const router = useRouter();
  const [reports, setReports] = useState<UserReportRecord[]>(initialReports);
  const [activeTab, setActiveTab] = useState<string>("Pending");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const refreshTable = useCallback(async () => {
    try {
      const latest = await getAdminReports();
      setReports(latest);
    } catch {
      // Keep existing reports if network error occurs
    }
  }, []);

  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  useEffect(() => {
    // Auto-poll every 5 seconds for new reports
    const interval = setInterval(refreshTable, 5000);
    const onFocus = () => refreshTable();

    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshTable]);

  const filtered = reports.filter((report) => {
    if (activeTab !== "All" && report.status !== activeTab) return false;
    if (urgencyFilter !== "All" && report.urgencyLevel !== urgencyFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchMsg = report.message.toLowerCase().includes(q);
      const matchTrans = report.translatedText?.toLowerCase().includes(q);
      if (!matchMsg && !matchTrans) return false;
    }
    return true;
  });

  async function handleStatusChange(id: string, newStatus: ReportStatus) {
    await updateReportStatus(id, newStatus);
    await refreshTable();
    router.refresh();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report? This action cannot be undone.",
    );
    if (!confirmed) return;

    await deleteReport(id);
    await refreshTable();
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-semibold">Admin review flow</p>
        <p className="mt-1 text-blue-700">
          New reports stay Pending. Check credibility and AI details, then approve real disasters by setting status to Active.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="All">All Urgency</option>
            {reportUrgencyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <div className="relative">
            <svg
              className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-48 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-700">No reports found</p>
            <p className="mt-1 text-sm text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Crisis Type</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Credibility</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((report) => (
                <tr key={report._id} className="transition-colors hover:bg-slate-50/50">
                  <td className="max-w-md px-4 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      {report.wasTranslated && (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">
                          🌐 {report.detectedLanguage || "Translated"}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">
                        {report.location ?? report.extractedLocations?.join(", ") ?? "No location"}
                      </span>
                    </div>
                    <p className="font-medium text-slate-800 line-clamp-2">{report.message}</p>
                    {report.wasTranslated && report.translatedText && (
                      <div className="mt-1.5 rounded-md border border-blue-100 bg-blue-50/70 p-2 text-xs text-slate-700 italic">
                        <span className="font-bold text-blue-800 not-italic">EN: </span>
                        "{report.translatedText}"
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="whitespace-nowrap capitalize text-slate-700">
                      {formatLabel(report.crisisType)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {report.urgencyLevel ? (
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
                          urgencyStyles[report.urgencyLevel] ?? "border-slate-300 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {report.urgencyLevel}
                      </span>
                    ) : (
                      <span className="text-slate-400">Pending</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <CredibilityCell report={report} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown
                      currentStatus={report.status}
                      options={reportStatuses}
                      onStatusChange={(status) => handleStatusChange(report._id, status as ReportStatus)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {report.status === "Pending" ? (
                        <button
                          onClick={() => handleStatusChange(report._id, "Active")}
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                        >
                          Approve
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleDelete(report._id)}
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Showing {filtered.length} of {reports.length} reports
      </p>
    </div>
  );
}

