"use client";

import { useEffect, useState } from "react";
import ExternalDisasterFeedView from "@/components/ExternalDisasterFeed";
import { getExternalDisasters } from "@/lib/externalDisasterApi";
import type { ExternalDisasterFeed } from "@/types/external-disaster";
import { Loader2, RefreshCw } from "lucide-react";

export default function AdminExternalDisastersPage() {
  const [feed, setFeed] = useState<ExternalDisasterFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExternalIntel = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExternalDisasters();
      setFeed(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to load external disaster intelligence.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExternalIntel();
  }, []);

  if (error && !feed) {
    return (
      <main className="px-5 py-6 md:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-bold text-red-800">
            Failed to load external intelligence
          </p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={fetchExternalIntel}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (loading && !feed) {
    return (
      <main className="px-5 py-6 md:px-8">
        <div className="flex h-48 items-center justify-center gap-2 text-sm font-semibold text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-red-500" />
          Loading external hazard intelligence...
        </div>
      </main>
    );
  }

  if (!feed) return null;

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            External intelligence
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">
            Verified Disaster Signals
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            Admin view of NewsAPI and GDACS signals for {feed.country}. Use this
            as evidence when reviewing pending user reports and deciding
            whether to activate a disaster report.
          </p>
        </div>

        <button
          onClick={fetchExternalIntel}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-600" : ""}`}
          />
          Refresh
        </button>
      </section>

      <ExternalDisasterFeedView feed={feed} variant="admin" />
    </main>
  );
}
