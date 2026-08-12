import UrgencyBadge from "@/components/UrgencyBadge";
import UrgencyGauge from "@/components/UrgencyGauge";
import ResponderButton from "@/components/ResponderButton";
import type { UserReportRecord, CredibilityLabel } from "@/types/user-report";

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

function DetailChips({
  emptyLabel,
  items,
}: {
  emptyLabel: string;
  items?: string[];
}) {
  if (!items || items.length === 0) {
    return <p className="mt-2 text-sm font-bold text-slate-950">{emptyLabel}</p>;
  }
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

// ── Credibility badge ─────────────────────────────────────────────────────────
const CREDIBILITY_STYLES: Record<CredibilityLabel, { bg: string; text: string; icon: string }> = {
  High  : { bg: 'bg-green-50  border-green-200', text: 'text-green-700', icon: '✅' },
  Medium: { bg: 'bg-amber-50  border-amber-200', text: 'text-amber-700', icon: '⚠️' },
  Low   : { bg: 'bg-red-50    border-red-200',   text: 'text-red-700',   icon: '❌' },
};

function CredibilityBadge({ report }: { report: UserReportRecord }) {
  // If credibility hasn't been calculated yet, show nothing
  if (report.credibilityScore === undefined || !report.credibilityLabel) return null;

  const style   = CREDIBILITY_STYLES[report.credibilityLabel];
  const sources = report.credibilitySources;

  return (
    <div className={`mt-3 rounded-lg border p-3 ${style.bg}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className={`text-xs font-semibold uppercase tracking-wide ${style.text}`}>
            Credibility
          </p>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${style.bg} ${style.text}`}>
            {style.icon} {report.credibilityLabel} — {report.credibilityScore}/100
          </span>
        </div>
      </div>

      {/* Credibility source indicators */}
      {sources && (
        <div className="mt-2 flex flex-wrap gap-2">
          {/* News match */}
          {sources.newsHeadline ? (
            <a
              href={sources.newsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-blue-600 hover:underline"
            >
              📰 {sources.newsHeadline.length > 50
                ? `${sources.newsHeadline.slice(0, 50)}…`
                : sources.newsHeadline}
            </a>
          ) : (
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-400">
              📰 No matching news found
            </span>
          )}

          {/* ReliefWeb match */}
          {sources.reliefWebMatch ? (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              🌐 ReliefWeb: {sources.reliefWebMatch}
            </span>
          ) : (
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-400">
              🌐 No ReliefWeb declaration
            </span>
          )}

          {/* Similar reports */}
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            sources.similarReports > 0
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-slate-200 bg-white text-slate-400'
          }`}>
            👥 {sources.similarReports > 0
              ? `${sources.similarReports} similar report${sources.similarReports > 1 ? 's' : ''} in 48h`
              : 'No similar reports'}
          </span>
        </div>
      )}
    </div>
  );
}

type ReportCardProps = {
  report: UserReportRecord;
};

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* ── Top section ─────────────────────────────────────────────── */}
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

      {/* ── Detail chips ─────────────────────────────────────────────── */}
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
            User location
          </p>
          <p className="mt-1 text-sm font-bold text-slate-950">
            {report.location ?? "Not provided"}
          </p>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Communities
          </p>
          <DetailChips
            emptyLabel="None identified"
            items={report.affectedCommunities}
          />
        </div>
      </div>

      {/* ── AI extracted locations ───────────────────────────────────── */}
      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          AI extracted locations
        </p>
        <DetailChips emptyLabel="None detected" items={report.extractedLocations} />
      </div>

      {/* ── Credibility badge ────────────────────────────────────────── */}
      <CredibilityBadge report={report} />

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>Source: {report.sourceType}</span>
        <span>Created: {formatDate(report.createdAt)}</span>
      </div>

      {/* ── Responder section ────────────────────────────────────────── */}
      <ResponderButton reportId={report._id} status={report.status} />
    </article>
  );
}
