import UrgencyBadge from "@/components/UrgencyBadge";
import UrgencyGauge from "@/components/UrgencyGauge";
import type { UserReportRecord } from "@/types/user-report";

function formatLabel(value?: string) {
  if (!value) return "Pending analysis";

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type ReportCardProps = {
  report: UserReportRecord;
};

export default function ReportCard({ report }: ReportCardProps) {
  const communities =
    report.affectedCommunities.length > 0
      ? report.affectedCommunities.join(", ")
      : "null";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <UrgencyBadge value={report.urgencyLevel} />
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {report.status}
            </span>
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-950">
            {formatLabel(report.crisisType)}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">
            {report.message}
          </p>
        </div>

        <div className="w-full rounded-lg bg-slate-50 p-4 lg:w-72">
          <UrgencyGauge
            level={report.urgencyLevel}
            confidence={report.urgencyConfidence}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Disaster type
          </p>
          <p className="mt-1 text-sm font-bold text-slate-950">
            {formatLabel(report.crisisType)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {report.crisisConfidence?.toFixed(1) ?? "0.0"}% confidence
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Message type
          </p>
          <p className="mt-1 text-sm font-bold text-slate-950">
            {formatLabel(report.messageType)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {report.messageTypeConfidence?.toFixed(1) ?? "0.0"}% confidence
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Location
          </p>
          <p className="mt-1 text-sm font-bold text-slate-950">
            {report.location ?? "Unknown"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Communities
          </p>
          <p className="mt-1 text-sm font-bold text-slate-950">{communities}</p>
        </div>
      </div>

      {report.summary ? (
        <p className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-950">
          {report.summary}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>Source: {report.sourceType}</span>
        <span>Created: {formatDate(report.createdAt)}</span>
      </div>
    </article>
  );
}
