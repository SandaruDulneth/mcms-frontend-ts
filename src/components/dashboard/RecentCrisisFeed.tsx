"use client";

import Link from "next/link";
import { AlertCircle, MapPin, Clock, ArrowRight, ShieldAlert } from "lucide-react";
import type { UserReportRecord } from "@/types/user-report";

type RecentCrisisFeedProps = {
  reports: UserReportRecord[];
};

export default function RecentCrisisFeed({ reports }: RecentCrisisFeedProps) {
  const recentReports = (reports || []).slice(0, 5);

  if (!recentReports.length) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5">
        <h3 className="text-base font-bold text-slate-900">Recent Crisis Reports</h3>
        <div className="mt-4 flex h-36 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
          No recent reports found
        </div>
      </div>
    );
  }

  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200 animate-pulse";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-600" />
            Live Crisis Stream
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Most recent disaster alerts submitted to MCMS</p>
        </div>
        <Link
          href="/disasters"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          View All ({reports.length})
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-slate-100 space-y-1">
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
            <div
              key={report._id}
              className="group py-4 transition-colors hover:bg-slate-50/80 rounded-xl px-3"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold ${getUrgencyBadge(
                      report.urgencyLevel
                    )}`}
                  >
                    {report.urgencyLevel || "Normal"}
                  </span>
                  {report.wasTranslated && (
                    <span className="inline-flex items-center rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                      🌐 {report.detectedLanguage || "Translated"}
                    </span>
                  )}
                  <span className="text-xs font-bold text-slate-800 capitalize">
                    {report.crisisType ? report.crisisType.replace(/_/g, " ") : "Incident"}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {formattedDate}
                  </span>
                </div>

                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-normal">
                  {report.message}
                </p>

                {report.wasTranslated && report.translatedText && (
                  <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-2.5 text-xs text-slate-700 leading-relaxed shadow-xs">
                    <span className="font-bold text-blue-800 not-italic">EN: </span>
                    <span className="italic">"{report.translatedText}"</span>
                  </div>
                )}

                {report.location && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 pt-0.5">
                    <MapPin className="h-3 w-3 text-red-500 shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
