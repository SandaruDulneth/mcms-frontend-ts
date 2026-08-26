"use client";

import { useEffect, useState, useCallback } from "react";
import { getAllResponders } from "@/lib/adminApi";
import RespondersTable from "@/components/admin/RespondersTable";
import type { Responder } from "@/types/responder";
import { Loader2, RefreshCw } from "lucide-react";

export default function AdminRespondersPage() {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllResponders();
      setResponders(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load responders";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResponders();
  }, [fetchResponders]);

  if (error && responders.length === 0) {
    return (
      <main className="px-5 py-6 md:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-bold text-red-800">
            Failed to load responders
          </p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={fetchResponders}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (loading && responders.length === 0) {
    return (
      <main className="px-5 py-6 md:px-8">
        <div className="flex h-48 items-center justify-center gap-2 text-sm font-semibold text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-red-500" />
          Loading responders directory...
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Manage Responders
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            View all responders across crisis reports and manage their status
          </p>
        </div>

        <button
          onClick={fetchResponders}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-red-600" : ""}`} />
          Refresh
        </button>
      </section>

      <RespondersTable initialResponders={responders} />
    </main>
  );
}
