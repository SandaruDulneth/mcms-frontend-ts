import Link from "next/link";
import ReportCard from "@/components/ReportCard";
import { getReports } from "@/lib/reportApi";
import type { UserReportRecord } from "@/types/user-report";

export default function ReportsPage() {
  return <ReportsContent />;
}

async function ReportsContent() {
  let reports: UserReportRecord[] = [];
  let errorMessage: string | null = null;

  try {
    reports = await getReports();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load reports from backend.";
  }

  const criticalCount = reports.filter(
    (report) => report.urgencyLevel === "Critical",
  ).length;
  const highCount = reports.filter((report) => report.urgencyLevel === "High")
    .length;

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Processed Reports
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Saved MongoDB reports with AI disaster type, message type, and
            urgency analysis.
          </p>
        </div>
        <Link
          href="/add-report"
          className="inline-flex rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
        >
          Add new report
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total reports</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {reports.length}
          </p>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-orange-800">High urgency</p>
          <p className="mt-2 text-3xl font-bold text-orange-950">
            {highCount}
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-red-800">Critical alerts</p>
          <p className="mt-2 text-3xl font-bold text-red-950">
            {criticalCount}
          </p>
        </div>
      </section>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-800">
          {errorMessage}
        </div>
      ) : null}

      {!errorMessage && reports.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">No reports yet</h3>
          <p className="mt-2 text-sm text-slate-600">
            Submit a crisis report to see AI disaster, message, and urgency
            details here.
          </p>
          <Link
            href="/add-report"
            className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Create first report
          </Link>
        </div>
      ) : null}

      <section className="space-y-4">
        {reports.map((report) => (
          <ReportCard key={report._id} report={report} />
        ))}
      </section>
    </main>
  );
}
