"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  UserReportRecord,
  ReportStatus,
  ReportUrgencyLevel,
} from "@/types/user-report";
import { reportStatuses, reportUrgencyLevels } from "@/types/user-report";
import { updateReportStatus, deleteReport } from "@/lib/adminApi";
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ReportsTable({ initialReports }: ReportsTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("All");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Filtering ──────────────────────────────────────────────────
  const filtered = initialReports.filter((report) => {
    if (activeTab !== "All" && report.status !== activeTab) return false;
    if (
      urgencyFilter !== "All" &&
      report.urgencyLevel !== urgencyFilter
    )
      return false;
    if (
      searchQuery &&
      !report.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  // ── Handlers ───────────────────────────────────────────────────
  async function handleStatusChange(id: string, newStatus: ReportStatus) {
    await updateReportStatus(id, newStatus);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report? This action cannot be undone.",
    );
    if (!confirmed) return;

    await deleteReport(id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* ── Filters bar ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Urgency filter */}
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

          {/* Search */}
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

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-700">
              No reports found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Crisis Type</th>
                <th className="px-4 py-3">Urgency</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((report) => (
                <tr
                  key={report._id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="max-w-xs px-4 py-3">
                    <p className="truncate font-medium text-slate-800">
                      {report.message}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="whitespace-nowrap capitalize text-slate-700">
                      {report.crisisType?.replaceAll("_", " ") ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {report.urgencyLevel ? (
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${urgencyStyles[report.urgencyLevel] ?? "border-slate-300 bg-slate-50 text-slate-600"}`}
                      >
                        {report.urgencyLevel}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown
                      currentStatus={report.status}
                      options={reportStatuses}
                      onStatusChange={(s) =>
                        handleStatusChange(report._id, s as ReportStatus)
                      }
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Results count ────────────────────────────────────────── */}
      <p className="text-xs text-slate-500">
        Showing {filtered.length} of {initialReports.length} reports
      </p>
    </div>
  );
}
