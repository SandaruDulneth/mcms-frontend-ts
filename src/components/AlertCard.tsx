import type { DisasterReport } from "@/data/mockDisasters";
import UrgencyBadge from "./UrgencyBadge";

export default function AlertCard({ report }: { report: DisasterReport }) {
  return (
    <article className="rounded-lg border border-red-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{report.location}</h3>
          <p className="mt-1 text-sm text-slate-700">{report.message}</p>
        </div>
        <UrgencyBadge value={report.urgency} />
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
        {report.category} • {report.timestamp}
      </p>
    </article>
  );
}
