"use client";

import { useMemo, useState } from "react";
import type { CrisisReportRecord } from "@/types/crisis-report";
import UrgencyBadge from "./UrgencyBadge";

export default function ProcessedReports({
  reports,
}: {
  reports: CrisisReportRecord[];
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const statuses = useMemo(
    () => [...new Set(reports.map((report) => report.status).filter(Boolean))],
    [reports],
  );
  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const text = [
          report.originalMessage,
          report.location,
          report.category,
          report.assignedAuthority,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          text.includes(search.toLowerCase()) &&
          (!status || report.status === status)
        );
      }),
    [reports, search, status],
  );

  return (
    <>
      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <label
            htmlFor="report-search"
            className="text-sm font-semibold text-slate-900"
          >
            Search reports
          </label>
          <input
            id="report-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
            placeholder="Search by message, location, category, or authority"
          />
        </div>
        <div>
          <label
            htmlFor="report-status"
            className="text-sm font-semibold text-slate-900"
          >
            Status filter
          </label>
          <select
            id="report-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
          >
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-700">
              <tr>
                <th className="px-4 py-3">Report ID</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Authority</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="align-top hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-slate-950">
                    {report.id}
                  </td>
                  <td className="max-w-md px-4 py-4 text-slate-800">
                    {report.originalMessage}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {report.detectedLanguage ||
                      report.reportedLanguage ||
                      "Pending"}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {report.sourceType || "Not provided"}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {report.assignedAuthority || "Unassigned"}
                  </td>
                  <td className="px-4 py-4">
                    <UrgencyBadge value={report.status} />
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-slate-600"
                  >
                    No reports match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
