type AdminStatCardProps = {
  icon: string;
  label: string;
  value: string | number;
  colour?: "slate" | "red" | "amber" | "green" | "blue";
};

const colourMap = {
  slate: "border-slate-200 bg-gradient-to-br from-white to-slate-50",
  red: "border-red-200 bg-gradient-to-br from-white to-red-50",
  amber: "border-amber-200 bg-gradient-to-br from-white to-amber-50",
  green: "border-green-200 bg-gradient-to-br from-white to-green-50",
  blue: "border-blue-200 bg-gradient-to-br from-white to-blue-50",
};

const valueColourMap = {
  slate: "text-slate-950",
  red: "text-red-700",
  amber: "text-amber-700",
  green: "text-green-700",
  blue: "text-blue-700",
};

export default function AdminStatCard({
  icon,
  label,
  value,
  colour = "slate",
}: AdminStatCardProps) {
  return (
    <article
      className={`rounded-xl border p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${colourMap[colour]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
      <p
        className={`mt-3 text-3xl font-bold tracking-tight ${valueColourMap[colour]}`}
      >
        {value}
      </p>
    </article>
  );
}
