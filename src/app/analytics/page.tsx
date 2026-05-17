import { mockDisasters } from "@/data/mockDisasters";

function countBy(field: "category" | "urgency" | "language") {
  return mockDisasters.reduce<Record<string, number>>((accumulator, report) => {
    accumulator[report[field]] = (accumulator[report[field]] ?? 0) + 1;
    return accumulator;
  }, {});
}

function BarList({
  title,
  data,
  tone,
}: {
  title: string;
  data: Record<string, number>;
  tone: "red" | "amber" | "green";
}) {
  const max = Math.max(...Object.values(data));
  const color = {
    red: "bg-red-700",
    amber: "bg-amber-600",
    green: "bg-green-700",
  }[tone];

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-5 space-y-4">
        {Object.entries(data).map(([label, value]) => (
          <div key={label}>
            <div className="flex justify-between gap-4 text-sm">
              <span className="font-medium text-slate-800">{label}</span>
              <span className="font-semibold text-slate-950">{value}</span>
            </div>
            <div className="mt-2 h-3 rounded-sm bg-slate-200">
              <div
                className={`h-3 rounded-sm ${color}`}
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function AnalyticsPage() {
  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Analytics</h2>
        <p className="mt-1 text-sm text-slate-600">
          Simple div-based charts for report category, urgency, and language
          trends.
        </p>
      </section>
      <section className="grid gap-5 xl:grid-cols-3">
        <BarList
          title="Reports by category"
          data={countBy("category")}
          tone="red"
        />
        <BarList
          title="Urgency distribution"
          data={countBy("urgency")}
          tone="amber"
        />
        <BarList
          title="Reports by language"
          data={countBy("language")}
          tone="green"
        />
      </section>
    </main>
  );
}
