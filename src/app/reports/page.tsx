import ProcessedReports from "@/components/ProcessedReports";
import { loadCrisisReports } from "@/lib/crisis-reports";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { reports, error } = await loadCrisisReports();

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Processed Reports
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Search and filter reports stored in MongoDB.
          </p>
        </div>
      </section>
      {error ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      <ProcessedReports reports={reports} />
    </main>
  );
}
