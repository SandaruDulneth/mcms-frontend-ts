import { getAdminReports } from "@/lib/adminApi";
import ReportsTable from "@/components/admin/ReportsTable";

export default async function AdminReportsPage() {
  let reports;
  try {
    reports = await getAdminReports();
  } catch {
    return (
      <main className="px-5 py-6 md:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-bold text-red-800">
            Failed to load reports
          </p>
          <p className="mt-2 text-sm text-red-600">
            Make sure the backend server is running and accessible.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Manage Reports</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review credibility, approve real disasters, update status, and delete reports
        </p>
      </section>

      <ReportsTable initialReports={reports} />
    </main>
  );
}
