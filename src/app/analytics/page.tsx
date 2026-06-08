import { loadCrisisReports } from "@/lib/crisis-reports";
import type { CrisisReportRecord } from "@/types/crisis-report";

export const dynamic = "force-dynamic";

function countBy(
  reports: CrisisReportRecord[],
  field: "category" | "urgencyLevel" | "detectedLanguage",
) {
  return reports.reduce<Record<string, number>>((counts, report) => {
    const value = report[field];

    if (value) {
      counts[value] = (counts[value] ?? 0) + 1;
    }

    return counts;
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
  const values = Object.values(data);
  const max = values.length > 0 ? Math.max(...values) : 0;
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
                style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }}
              />
            </div>
          </div>
        ))}
        {values.length === 0 ? (
          <p className="text-sm text-slate-600">No processed data available.</p>
        ) : null}
      </div>
    </article>
  );
}

export default async function AnalyticsPage() {
  const { reports, error } = await loadCrisisReports();

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Analytics</h2>
        <p className="mt-1 text-sm text-slate-600">
          Aggregated report category, urgency, and language data.
        </p>
      </section>
      {error ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      <section className="grid gap-5 xl:grid-cols-3">
        <BarList
          title="Reports by category"
          data={countBy(reports, "category")}
          tone="red"
        />
        <BarList
          title="Urgency distribution"
          data={countBy(reports, "urgencyLevel")}
          tone="amber"
        />
        <BarList
          title="Reports by language"
          data={countBy(reports, "detectedLanguage")}
          tone="green"
        />
      </section>
    </main>
  );
}
