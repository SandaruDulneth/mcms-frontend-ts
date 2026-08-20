type StatCardProps = {
  title: string;
  value: string | number;
  detail: string;
  tone?: "navy" | "red" | "amber" | "green" | "blue" | "purple";
};

const toneStyles = {
  navy: "border-slate-200 bg-white",
  red: "border-red-200 bg-white",
  amber: "border-amber-200 bg-white",
  green: "border-emerald-200 bg-white",
  blue: "border-blue-200 bg-white",
  purple: "border-purple-200 bg-white",
};

export default function StatCard({
  title,
  value,
  detail,
  tone = "navy",
}: StatCardProps) {
  const currentTone = toneStyles[tone] || toneStyles.navy;

  return (
    <article
      className={`rounded-lg border p-5 shadow-sm ${currentTone}`}
    >
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-xs font-medium text-slate-500">{detail}</p>
    </article>
  );
}
