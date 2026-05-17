import type { ReportStatus, UrgencyLevel } from "@/data/mockDisasters";

type BadgeValue = UrgencyLevel | ReportStatus;

const styles: Record<BadgeValue, string> = {
  Critical: "border-red-700 bg-red-50 text-red-800",
  High: "border-red-600 bg-red-50 text-red-800",
  Medium: "border-amber-600 bg-amber-50 text-amber-800",
  Low: "border-green-700 bg-green-50 text-green-800",
  Active: "border-red-700 bg-red-50 text-red-800",
  Monitoring: "border-amber-600 bg-amber-50 text-amber-800",
  Resolved: "border-green-700 bg-green-50 text-green-800",
};

export default function UrgencyBadge({ value }: { value: BadgeValue }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${styles[value]}`}
    >
      {value}
    </span>
  );
}
