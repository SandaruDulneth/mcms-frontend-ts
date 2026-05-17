type StatCardProps = {
  title: string;
  value: string | number;
  detail: string;
  tone?: "navy" | "red" | "amber" | "green";
};

const toneStyles = {
  navy: "border-slate-300 text-slate-950",
  red: "border-red-300 text-red-800",
  amber: "border-amber-300 text-amber-800",
  green: "border-green-300 text-green-800",
};

export default function StatCard({
  title,
  value,
  detail,
  tone = "navy",
}: StatCardProps) {
  return (
    <article
      className={`rounded-lg border bg-white p-5 shadow-sm ${toneStyles[tone]}`}
    >
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </article>
  );
}
