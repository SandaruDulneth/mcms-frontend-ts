"use client";

import { useMemo, useState } from "react";
import UrgencyBadge from "@/components/UrgencyBadge";
import { mockDisasters, type ReportStatus } from "@/data/mockDisasters";

const statuses: Array<ReportStatus | "All"> = [
  "All",
  "Active",
  "Monitoring",
  "Resolved",
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReportStatus | "All">("All");

  const reports = useMemo(
    () =>
      mockDisasters.filter((report) => {
        const matchesSearch =
          `${report.message} ${report.location} ${report.category}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return matchesSearch && (status === "All" || report.status === status);
      }),
    [search, status],
  );

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Processed Reports
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Search, filter, and export processed crisis reports.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            type="button"
          >
            Export CSV
          </button>
          <button
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
            type="button"
          >
            Export PDF
          </button>
        </div>
      </section>

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
            placeholder="Search by message, location, or category"
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
            onChange={(event) =>
              setStatus(event.target.value as ReportStatus | "All")
            }
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950"
          >
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
              {reports.map((report) => (
                <tr key={report.id} className="align-top hover:bg-slate-50">
                  <td className="px-4 py-4 font-semibold text-slate-950">
                    {report.id}
                  </td>
                  <td className="max-w-md px-4 py-4 text-slate-800">
                    {report.message}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {report.language}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{report.source}</td>
                  <td className="px-4 py-4 text-slate-700">
                    {report.authority}
                  </td>
                  <td className="px-4 py-4">
                    <UrgencyBadge value={report.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
