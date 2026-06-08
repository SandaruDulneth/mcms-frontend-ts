"use client";

import { useMemo, useState } from "react";
import type { CrisisReportRecord } from "@/types/crisis-report";
import DisasterTable from "./DisasterTable";

const selectClass =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950";

function uniqueValues(values: Array<string | undefined>) {
  return [
    ...new Set(values.filter((value): value is string => Boolean(value))),
  ];
}

export default function DisasterReportList({
  reports,
}: {
  reports: CrisisReportRecord[];
}) {
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [status, setStatus] = useState("");

  const categories = useMemo(
    () => uniqueValues(reports.map((report) => report.category)),
    [reports],
  );
  const urgencies = useMemo(
    () => uniqueValues(reports.map((report) => report.urgencyLevel)),
    [reports],
  );
  const statuses = useMemo(
    () => uniqueValues(reports.map((report) => report.status)),
    [reports],
  );
  const filteredReports = useMemo(
    () =>
      reports.filter(
        (report) =>
          (!category || report.category === category) &&
          (!urgency || report.urgencyLevel === urgency) &&
          (!status || report.status === status),
      ),
    [category, reports, status, urgency],
  );

  return (
    <>
      <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
        <div>
          <label
            htmlFor="category"
            className="text-sm font-semibold text-slate-900"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={selectClass}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="urgency"
            className="text-sm font-semibold text-slate-900"
          >
            Urgency
          </label>
          <select
            id="urgency"
            value={urgency}
            onChange={(event) => setUrgency(event.target.value)}
            className={selectClass}
          >
            <option value="">All urgency levels</option>
            {urgencies.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="text-sm font-semibold text-slate-900"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={selectClass}
          >
            <option value="">All statuses</option>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>
      <DisasterTable reports={filteredReports} />
    </>
  );
}
