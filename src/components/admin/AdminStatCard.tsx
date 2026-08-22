import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  icon?: LucideIcon | string;
  label: string;
  value: string | number;
  colour?: "slate" | "red" | "amber" | "green" | "blue";
};

const colourMap = {
  slate: {
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
};

export default function AdminStatCard({
  icon: Icon,
  label,
  value,
  colour = "slate",
}: AdminStatCardProps) {
  const currentStyle = colourMap[colour] || colourMap.slate;

  return (
    <article className={`rounded-xl border p-5 bg-white shadow-sm ${currentStyle.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className={`mt-2 text-3xl font-bold tracking-tight ${currentStyle.valueText}`}>
            {value}
          </p>
        </div>
        {Icon && typeof Icon !== "string" && (
          <div className={`rounded-lg p-2.5 ${currentStyle.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        {typeof Icon === "string" && (
          <span className="text-2xl" aria-hidden="true">
            {Icon}
          </span>
        )}
      </div>
    </article>
  );
}
