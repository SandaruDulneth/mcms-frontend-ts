import MapPlaceholder from "@/components/MapPlaceholder";
import { loadCrisisReports } from "@/lib/crisis-reports";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const { reports, error } = await loadCrisisReports();

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Crisis Map</h2>
        <p className="mt-1 text-sm text-slate-600">
          Location overview generated from stored crisis reports.
        </p>
      </section>
      {error ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      <MapPlaceholder reports={reports} />
    </main>
  );
}
