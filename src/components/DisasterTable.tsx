import type { DisasterReport } from "@/data/mockDisasters";
import UrgencyBadge from "./UrgencyBadge";

export default function DisasterTable({
  reports,
}: {
  reports: DisasterReport[];
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
                  {report.message}
                </td>
                <td className="px-4 py-4 font-medium text-slate-950">
                  {report.category}
                </td>
                <td className="px-4 py-4 text-slate-700">{report.location}</td>
                <td className="px-4 py-4">
                  <UrgencyBadge value={report.urgency} />
                </td>
                <td className="px-4 py-4">
                  <UrgencyBadge value={report.status} />
                </td>
                <td className="px-4 py-4 text-slate-600">{report.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
