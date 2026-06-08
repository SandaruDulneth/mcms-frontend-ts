import type { CrisisReportRecord } from "@/types/crisis-report";
import UrgencyBadge from "./UrgencyBadge";

export default function AlertCard({ report }: { report: CrisisReportRecord }) {
  return (
    <article className="rounded-lg border border-red-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">
            {report.location || "Location not provided"}
          </h3>
          <p className="mt-1 text-sm text-slate-700">
            {report.originalMessage}
          </p>
        </div>
        <UrgencyBadge value={report.urgencyLevel} />
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
        {report.category || "Pending classification"} |{" "}
        {report.createdAt
          ? new Date(report.createdAt).toLocaleString()
          : "Time unavailable"}
      </p>
    </article>
  );
}
