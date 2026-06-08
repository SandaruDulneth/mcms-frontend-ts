import type { CrisisReportRecord } from "@/types/crisis-report";
import UrgencyBadge from "./UrgencyBadge";

export default function DisasterTable({
  reports,
}: {
  reports: CrisisReportRecord[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-700">
            <tr>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Urgency</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reports.map((report) => (
              <tr key={report.id} className="align-top hover:bg-slate-50">
                <td className="max-w-md px-4 py-4 text-slate-800">
                  {report.originalMessage}
                </td>
                <td className="px-4 py-4 font-medium text-slate-950">
                  {report.category || "Pending"}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {report.location || "Not provided"}
                </td>
                <td className="px-4 py-4">
                  <UrgencyBadge value={report.urgencyLevel} />
                </td>
                <td className="px-4 py-4">
                  <UrgencyBadge value={report.status} />
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {report.createdAt
                    ? new Date(report.createdAt).toLocaleString()
                    : "Unavailable"}
                </td>
              </tr>
            ))}
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-600"
                >
                  No crisis reports found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
