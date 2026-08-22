import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  detail: string;
  tone?: "navy" | "red" | "amber" | "green" | "blue" | "purple";
  icon?: LucideIcon;
  trend?: string;
  trendUp?: boolean;
};

const toneStyles = {
  navy: {
    card: "border-slate-200 bg-white shadow-sm",
    iconBg: "bg-slate-100 text-slate-700",
    valueText: "text-slate-950",
  },
  red: {
    card: "border-red-200 bg-white shadow-sm",
    iconBg: "bg-red-50 text-red-700",
    valueText: "text-red-800",
  },
  amber: {
    card: "border-amber-200 bg-white shadow-sm",
    iconBg: "bg-amber-50 text-amber-700",
    valueText: "text-amber-800",
  },
  green: {
    card: "border-emerald-200 bg-white shadow-sm",
    iconBg: "bg-emerald-50 text-emerald-700",
    valueText: "text-emerald-800",
  },
  blue: {
    card: "border-blue-200 bg-white shadow-sm",
    iconBg: "bg-blue-50 text-blue-700",
    valueText: "text-blue-900",
  },
  purple: {
    card: "border-purple-200 bg-white shadow-sm",
    iconBg: "bg-purple-50 text-purple-700",
    valueText: "text-purple-900",
  },
};

export default function StatCard({
  title,
  value,
  detail,
  tone = "navy",
  icon: Icon,
  trend,
  trendUp,
}: StatCardProps) {
  const currentTone = toneStyles[tone] || toneStyles.navy;

  return (
    <article className={`rounded-xl border p-5 bg-white shadow-sm ${currentTone.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight ${currentTone.valueText}`}>
              {value}
            </span>
            {trend && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  trendUp ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`rounded-lg p-2.5 ${currentTone.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </article>
  );
}
