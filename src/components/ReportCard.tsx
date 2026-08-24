import UrgencyBadge from "@/components/UrgencyBadge";
import ResponderButton from "@/components/ResponderButton";
import type { UserReportRecord, CredibilityLabel } from "@/types/user-report";
import { Languages } from "lucide-react";

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

// ── Detail chips ──────────────────────────────────────────────────────────────
function DetailChips({
  emptyLabel,
  items,
}: {
  emptyLabel: string;
  items?: string[];
}) {
  if (!items || items.length === 0) {
    return <p className="mt-1.5 text-sm font-semibold text-slate-400 italic">{emptyLabel}</p>;
  }
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-sm"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

// ── Urgency accent colours ────────────────────────────────────────────────────
const URGENCY_ACCENT: Record<string, string> = {
  Critical: "border-l-red-700",
  High    : "border-l-orange-600",
  Medium  : "border-l-amber-500",
  Low     : "border-l-emerald-600",
};

// ── Urgency horizontal bar gauge ──────────────────────────────────────────────
const URGENCY_GAUGE_CONFIG: Record<
  string,
  { label: string; widthPct: number; fillBg: string; trackBg: string }
> = {
  Low: {
    label: "Low",
    widthPct: 25,
    fillBg: "bg-emerald-600",
    trackBg: "bg-emerald-100",
  },
  Medium: {
    label: "Medium",
    widthPct: 55,
    fillBg: "bg-amber-500",
    trackBg: "bg-amber-100",
  },
  High: {
    label: "High",
    widthPct: 78,
    fillBg: "bg-orange-600",
    trackBg: "bg-orange-100",
  },
  Critical: {
    label: "Critical",
    widthPct: 100,
    fillBg: "bg-red-600",
    trackBg: "bg-red-100",
  },
};

function UrgencyBarGauge({ level, confidence }: { level?: string; confidence?: number }) {
  const config = level ? URGENCY_GAUGE_CONFIG[level] : undefined;
  const widthPct = config?.widthPct ?? 10;
  const fillBg = config?.fillBg ?? "bg-slate-500";
  const trackBg = config?.trackBg ?? "bg-slate-200";

  return (
    <div className="w-full sm:w-56 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 space-y-2 shadow-xs sm:shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500">
          URGENCY
        </span>
        <span className="text-sm font-extrabold text-slate-900">
          {config?.label ?? level ?? "Pending"}
        </span>
      </div>

      <div className={`h-3 w-full overflow-hidden rounded-full ${trackBg}`}>
        <div
          className={`h-full rounded-full ${fillBg} transition-all duration-500 ease-out`}
          style={{ width: `${widthPct}%` }}
        />
      </div>

      <div className="text-[11px] font-normal text-slate-500">
        {typeof confidence === "number" ? `${confidence.toFixed(1)}% confidence` : "Confidence --"}
      </div>
    </div>
  );
}

// ── Credibility badge ─────────────────────────────────────────────────────────
const CREDIBILITY_STYLES: Record<CredibilityLabel, { bg: string; text: string; icon: string }> = {
  High  : { bg: "bg-green-50  border-green-200", text: "text-green-700", icon: "✅" },
  Medium: { bg: "bg-amber-50  border-amber-200", text: "text-amber-700", icon: "⚠️" },
  Low   : { bg: "bg-red-50    border-red-200",   text: "text-red-700",   icon: "❌" },
};

function CredibilityBadge({ report }: { report: UserReportRecord }) {
  if (report.credibilityScore === undefined || !report.credibilityLabel) return null;

  const style   = CREDIBILITY_STYLES[report.credibilityLabel];
  const sources = report.credibilitySources;

  return (
    <div className={`mt-4 rounded-lg border p-3.5 ${style.bg}`}>
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

      {sources && (
        <div className="mt-2.5 flex flex-wrap gap-2">
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

          {sources.gdacsMatch ? (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              🌐 GDACS: {sources.gdacsMatch}
            </span>
          ) : (
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-400">
              🌐 No GDACS alert
            </span>
          )}

          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            sources.similarReports > 0
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-slate-200 bg-white text-slate-400"
          }`}>
            👥 {sources.similarReports > 0
              ? `${sources.similarReports} similar report${sources.similarReports > 1 ? "s" : ""} in 48h`
              : "No similar reports"}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────
type ReportCardProps = {
  report: UserReportRecord;
  showCredibility?: boolean;
};

export default function ReportCard({ report, showCredibility = false }: ReportCardProps) {
  const accentBorder = URGENCY_ACCENT[report.urgencyLevel ?? ""] ?? "border-l-slate-300";

  return (
    <article
      className={`rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 border-l-4 ${accentBorder} overflow-hidden`}
    >
      {/* ── Header section ────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <UrgencyBadge value={report.urgencyLevel} />
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {report.status}
              </span>
              {report.wasTranslated && (
                <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  <Languages className="h-3 w-3" />
                  {report.detectedLanguage || "Translated"}
                </span>
              )}
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-950 leading-snug">
              {formatLabel(report.crisisType)}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
              {report.message}
            </p>
            {report.wasTranslated && report.translatedText && (
              <div className="mt-3 rounded-lg border border-blue-200/80 bg-blue-50/70 p-3 text-xs shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                  <Languages className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>English Translation ({report.detectedLanguage || "Translated"}):</span>
                </div>
                <p className="leading-relaxed text-slate-800 italic">
                  "{report.translatedText}"
                </p>
              </div>
            )}
          </div>

          {/* Urgency bar gauge (right side) */}
          <UrgencyBarGauge
            level={report.urgencyLevel}
            confidence={report.urgencyConfidence}
          />
        </div>
      </div>

      {/* ── AI Intelligence section ───────────────────────────────────── */}
      <div className="border-t border-slate-100 bg-slate-50/40 px-5 py-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          AI Classification
        </p>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {/* Disaster type */}
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Disaster Type
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-900 truncate">
              {formatLabel(report.crisisType)}
            </p>
            {typeof report.crisisConfidence === "number" && (
              <p className="mt-0.5 text-[11px] text-slate-500">
                {report.crisisConfidence.toFixed(1)}% confidence
              </p>
            )}
          </div>

          {/* Message type */}
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Message Type
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-900 truncate">
              {formatLabel(report.messageType)}
            </p>
            {typeof report.messageTypeConfidence === "number" && (
              <p className="mt-0.5 text-[11px] text-slate-500">
                {report.messageTypeConfidence.toFixed(1)}% confidence
              </p>
            )}
          </div>

          {/* User location */}
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              User Location
            </p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {report.location ?? "Not provided"}
            </p>
          </div>

          {/* Communities */}
          <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Communities
            </p>
            <DetailChips
              emptyLabel="None identified"
              items={report.affectedCommunities}
            />
          </div>
        </div>

        {/* AI extracted locations */}
        <div className="mt-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            AI Extracted Locations
          </p>
          <DetailChips emptyLabel="None detected" items={report.extractedLocations} />
        </div>
      </div>

      {/* ── Credibility badge ────────────────────────────────────────── */}
      {showCredibility ? (
        <div className="px-5">
          <CredibilityBadge report={report} />
        </div>
      ) : null}

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <div className="border-t border-slate-100 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>{formatDate(report.createdAt)}</span>
          </div>
          {report.latencyMs !== undefined && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              ⚡ {report.latencyMs}ms
            </span>
          )}
        </div>

        {/* Responder section */}
        <ResponderButton reportId={report._id} status={report.status} />
      </div>
    </article>
  );
}


