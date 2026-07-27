"use client";

import { useRouter } from "next/navigation";
import type { Responder, ResponderStatus } from "@/types/responder";
import { RESPONSE_TYPE_META, RESPONDER_STATUS_META } from "@/types/responder";
import { updateResponderStatus } from "@/lib/adminApi";
import StatusDropdown from "@/components/admin/StatusDropdown";

type RespondersTableProps = {
  initialResponders: Responder[];
};

const RESPONDER_STATUS_OPTIONS: readonly ResponderStatus[] = [
  "offered",
  "en_route",
  "arrived",
  "completed",
];

const RESPONDER_STATUS_LABELS: Record<ResponderStatus, string> = {
  offered: "Offered",
  en_route: "En Route",
  arrived: "Arrived",
  completed: "Completed",
};

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function RespondersTable({
  initialResponders,
}: RespondersTableProps) {
  const router = useRouter();

  async function handleStatusChange(
    reportId: string,
    responderId: string,
    newStatus: ResponderStatus,
  ) {
    await updateResponderStatus(reportId, responderId, newStatus);
    router.refresh();
  }

  if (initialResponders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-700">
          No responders yet
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Responders will appear here once people offer help on crisis reports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Response Type</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Report ID</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialResponders.map((resp) => {
              const typeMeta = RESPONSE_TYPE_META[resp.responseType];
              return (
                <tr
                  key={resp._id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                    {resp.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {resp.organization || (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${typeMeta.colour}`}
                    >
                      <span aria-hidden="true">{typeMeta.emoji}</span>
                      {typeMeta.label}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <p className="truncate text-slate-600">{resp.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                      {resp.reportId.slice(-8)}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <StatusDropdown
                      currentStatus={resp.status}
                      options={RESPONDER_STATUS_OPTIONS}
                      labels={RESPONDER_STATUS_LABELS}
                      onStatusChange={(s) =>
                        handleStatusChange(
                          resp.reportId,
                          resp._id,
                          s as ResponderStatus,
                        )
                      }
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {timeAgo(resp.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">
        Showing {initialResponders.length} responder
        {initialResponders.length === 1 ? "" : "s"}
      </p>
    </div>
  );
}
