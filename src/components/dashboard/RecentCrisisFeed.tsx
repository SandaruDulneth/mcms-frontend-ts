"use client";

import Link from "next/link";
import type { UserReportRecord } from "@/types/user-report";

type RecentCrisisFeedProps = {
  reports: UserReportRecord[];
};

export default function RecentCrisisFeed({ reports }: RecentCrisisFeedProps) {
  const recentReports = (reports || []).slice(0, 5);

  if (!recentReports.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-950">Recent Crisis Reports</h3>
        <div className="mt-4 flex h-32 items-center justify-center rounded border border-dashed border-slate-200 text-xs text-slate-500">
          No recent reports found
        </div>
      </div>
    );
  }

  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-950">Recent Crisis Reports</h3>
        <Link
          href="/reports"
          className="text-xs font-semibold text-red-700 hover:text-red-800 hover:underline"
        >
          View all ({reports.length})
        </Link>
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        {recentReports.map((report) => {
          const formattedDate = report.createdAt
            ? new Date(report.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recently";

          return (
            <div key={report._id} className="py-3">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-semibold ${getUrgencyBadge(
                    report.urgencyLevel
                  )}`}
                >
                  {report.urgencyLevel || "Normal"}
                </span>
                <span className="text-xs font-bold text-slate-900 capitalize">
                  {report.crisisType ? report.crisisType.replace(/_/g, " ") : "Incident"}
                </span>
                <span className="text-[11px] text-slate-500 ml-auto">{formattedDate}</span>
              </div>
              <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {report.message}
              </p>
              {report.location && (
                <p className="mt-1 text-[11px] font-medium text-slate-500 truncate">
                  📍 {report.location}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
