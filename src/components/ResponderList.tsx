'use client';

import { useCallback, useEffect, useState } from 'react';
import { getResponders } from '@/lib/responderApi';
import type { Responder } from '@/types/responder';
import { RESPONSE_TYPE_META, RESPONDER_STATUS_META } from '@/types/responder';

interface ResponderListProps {
  reportId  : string;
  refreshKey?: number;   // increment to trigger a manual refresh
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ResponderList({ reportId, refreshKey }: ResponderListProps) {
  const [responders, setResponders] = useState<Responder[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getResponders(reportId);
      setResponders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load responders');
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  // Initial load + refresh when refreshKey changes
  useEffect(() => { load(); }, [load, refreshKey]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <div className="mt-3 space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="mt-2 text-xs text-red-500">{error}</p>
    );
  }

  if (responders.length === 0) {
    return (
      <p className="mt-3 text-xs text-slate-400 italic">
        No responders yet — be the first to offer help.
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {responders.map((r) => {
        const typeMeta   = RESPONSE_TYPE_META[r.responseType];
        const statusMeta = RESPONDER_STATUS_META[r.status];
        return (
          <div
            key={r._id}
            className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
          >
            {/* Top row — name, badges, time */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-semibold text-slate-800">
                {r.name}
              </span>
              {r.organization && (
                <span className="text-xs text-slate-500">· {r.organization}</span>
              )}

              {/* Response type badge */}
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${typeMeta.colour}`}>
                {typeMeta.emoji} {typeMeta.label}
              </span>

              {/* Status badge */}
              <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusMeta.colour}`}>
                {statusMeta.label}
              </span>

              <span className="ml-auto text-xs text-slate-400">
                {timeAgo(r.createdAt)}
              </span>
            </div>

            {/* Message */}
            <p className="mt-1 text-sm text-slate-600">{r.message}</p>

            {/* Contact info */}
            {r.contactInfo && (
              <p className="mt-0.5 text-xs text-slate-400">
                📞 {r.contactInfo}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
