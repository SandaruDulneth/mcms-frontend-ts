import type { ReportUrgencyLevel } from "@/types/user-report";

const urgencyMeta: Record<
  ReportUrgencyLevel,
  { label: string; percentage: number; color: string; track: string }
> = {
  Low: {
    label: "Low",
    percentage: 25,
    color: "bg-emerald-600",
    track: "bg-emerald-100",
  },
  Medium: {
    label: "Medium",
    percentage: 55,
    color: "bg-amber-500",
    track: "bg-amber-100",
  },
  High: {
    label: "High",
    percentage: 78,
    color: "bg-orange-600",
    track: "bg-orange-100",
  },
  Critical: {
    label: "Critical",
    percentage: 100,
    color: "bg-red-700",
    track: "bg-red-100",
  },
};

type UrgencyGaugeProps = {
  level?: ReportUrgencyLevel;
  confidence?: number;
};

export default function UrgencyGauge({
  level,
  confidence,
}: UrgencyGaugeProps) {
  const meta = level ? urgencyMeta[level] : undefined;
  const percentage = meta?.percentage ?? 8;
  const confidenceLabel =
    typeof confidence === "number" ? `${confidence.toFixed(1)}% confidence` : null;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Urgency
        </span>
        <span className="text-sm font-bold text-slate-950">
          {meta?.label ?? "Pending"}
        </span>
      </div>
      <div
        className={`h-3 overflow-hidden rounded-full ${meta?.track ?? "bg-slate-100"}`}
      >
        <div
          className={`h-full rounded-full ${meta?.color ?? "bg-slate-400"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {confidenceLabel ? (
        <p className="mt-2 text-xs text-slate-500">{confidenceLabel}</p>
      ) : null}
    </div>
  );
}
