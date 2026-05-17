"use client";

import { useMemo, useState } from "react";
import DisasterTable from "@/components/DisasterTable";
import {
  type DisasterCategory,
  mockDisasters,
  type ReportStatus,
  type UrgencyLevel,
} from "@/data/mockDisasters";

const categories: Array<DisasterCategory | "All"> = [
  "All",
  "Flood",
  "Fire",
  "Earthquake",
  "Infrastructure Damage",
  "Medical Emergency",
  "Other",
];
const urgencies: Array<UrgencyLevel | "All"> = [
  "All",
  "Critical",
  "High",
  "Medium",
  "Low",
];
const statuses: Array<ReportStatus | "All"> = [
  "All",
  "Active",
  "Monitoring",
  "Resolved",
];

const selectClass =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950";

export default function DisastersPage() {
  const [category, setCategory] = useState<DisasterCategory | "All">("All");
  const [urgency, setUrgency] = useState<UrgencyLevel | "All">("All");
  const [status, setStatus] = useState<ReportStatus | "All">("All");

  const filteredReports = useMemo(
    () =>
      mockDisasters.filter(
        (report) =>
          (category === "All" || report.category === category) &&
          (urgency === "All" || report.urgency === urgency) &&
          (status === "All" || report.status === status),
      ),
    [category, urgency, status],
  );

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Ongoing Disasters</h2>
        <p className="mt-1 text-sm text-slate-600">
          Filter active reports by category, urgency, and response status.
        </p>
      </section>

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
            onChange={(event) =>
              setCategory(event.target.value as DisasterCategory | "All")
            }
            className={selectClass}
          >
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
            onChange={(event) =>
              setUrgency(event.target.value as UrgencyLevel | "All")
            }
            className={selectClass}
          >
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
            onChange={(event) =>
              setStatus(event.target.value as ReportStatus | "All")
            }
            className={selectClass}
          >
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </section>

      <DisasterTable reports={filteredReports} />
    </main>
  );
}
