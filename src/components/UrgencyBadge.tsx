const styles: Record<string, string> = {
  Critical: "border-red-700 bg-red-50 text-red-800",
  High: "border-red-600 bg-red-50 text-red-800",
  Medium: "border-amber-600 bg-amber-50 text-amber-800",
  Low: "border-green-700 bg-green-50 text-green-800",
  Active: "border-red-700 bg-red-50 text-red-800",
  Monitoring: "border-amber-600 bg-amber-50 text-amber-800",
  Resolved: "border-green-700 bg-green-50 text-green-800",
};

export default function UrgencyBadge({ value }: { value?: string }) {
  const label = value || "Pending";
  const style = styles[label] ?? "border-slate-400 bg-slate-50 text-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}
