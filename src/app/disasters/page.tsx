import Link from "next/link";
import StatCard from "@/components/StatCard";
import ReportCard from "@/components/ReportCard";
import { getReports } from "@/lib/reportApi";
import type { UserReportRecord } from "@/types/user-report";
import { FileText, AlertTriangle, Layers } from "lucide-react";

export default function DisastersPage() {
  return <OngoingDisastersContent />;
}

async function OngoingDisastersContent() {
  let reports: UserReportRecord[] = [];
  let errorMessage: string | null = null;

  try {
    const allReports = await getReports();
    reports = allReports.filter((report) => report.status !== "Resolved");
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load ongoing disasters.";
  }

  const criticalCount = reports.filter(
    (report) => report.urgencyLevel === "Critical",
  ).length;
  const activeDisasterTypes = new Set(
    reports
      .map((report) => report.crisisType)
      .filter((crisisType): crisisType is string => Boolean(crisisType)),
  ).size;

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Ongoing Disasters
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Active crisis reports from MongoDB, enriched with AI disaster,
            message, and urgency classification.
          </p>
        </div>
        <Link
          href="/add-report"
          className="inline-flex rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
        >
          Add crisis report
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Ongoing reports"
          value={reports.length}
          detail="Active incidents requiring attention"
          tone="navy"
          icon={FileText}
        />
        <StatCard
          title="Critical alerts"
          value={criticalCount}
          detail="Urgent high priority reports"
          tone="red"
          icon={AlertTriangle}
        />
        <StatCard
          title="Disaster categories"
          value={activeDisasterTypes}
          detail="Unique ongoing crisis types"
          tone="blue"
          icon={Layers}
        />
      </section>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-800">
          {errorMessage}
        </div>
      ) : null}

      {!errorMessage && reports.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">
            No ongoing disasters
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            When reports are submitted, active crisis items will appear here.
          </p>
          <Link
            href="/add-report"
            className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Submit report
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
