import ExternalDisasterFeedView from "@/components/ExternalDisasterFeed";
import { getExternalDisasters } from "@/lib/externalDisasterApi";

export default async function ReportsPage() {
  try {
    const feed = await getExternalDisasters();

    return (
      <main className="space-y-6 px-5 py-6 md:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
            External disaster intelligence
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            {feed.country} Disaster Reports
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            Current disaster signals collected from GDACS and NewsAPI for {feed.country}. This helps compare real-world events against citizen reports before operational decisions are made.
          </p>
        </section>

        <ExternalDisasterFeedView feed={feed} />
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load external disaster reports.";

    return (
      <main className="px-5 py-6 md:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-bold text-red-800">Failed to load external reports</p>
          <p className="mt-2 text-sm text-red-600">{message}</p>
        </div>
      </main>
    );
  }
}

