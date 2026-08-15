import ExternalDisasterFeedView from "@/components/ExternalDisasterFeed";
import { getExternalDisasters } from "@/lib/externalDisasterApi";

export default async function AdminExternalDisastersPage() {
  try {
    const feed = await getExternalDisasters();

    return (
      <main className="space-y-6 px-5 py-6 md:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            External intelligence
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Verified Disaster Signals
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            Admin view of NewsAPI and GDACS signals for {feed.country}. Use this as evidence when reviewing pending user reports and deciding whether to activate a disaster report.
          </p>
        </section>

        <ExternalDisasterFeedView feed={feed} variant="admin" />
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load external disaster intelligence.";

    return (
      <main className="px-5 py-6 md:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-bold text-red-800">Failed to load external intelligence</p>
          <p className="mt-2 text-sm text-red-600">{message}</p>
        </div>
      </main>
    );
  }
}

