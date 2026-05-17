import Link from "next/link";
import AlertCard from "@/components/AlertCard";
import DisasterTable from "@/components/DisasterTable";
import StatCard from "@/components/StatCard";
import { mockDisasters } from "@/data/mockDisasters";

export default function DashboardPage() {
  const critical = mockDisasters.filter(
    (report) => report.urgency === "Critical",
  );
  const active = mockDisasters.filter((report) => report.status === "Active");
  const resolved = mockDisasters.filter(
    (report) => report.status === "Resolved",
  );

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Live prototype overview of multilingual crisis reports and response
          status.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Reports"
          value={mockDisasters.length}
          detail="Processed today"
        />
        <StatCard
          title="Critical Alerts"
          value={critical.length}
          detail="Immediate action required"
          tone="red"
        />
        <StatCard
          title="Active Disasters"
          value={active.length}
          detail="Open incidents"
          tone="amber"
        />
        <StatCard
          title="Resolved Reports"
          value={resolved.length}
          detail="Closed by authorities"
          tone="green"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-950">
              Disaster summary
            </h3>
            <Link
              href="/disasters"
              className="text-sm font-semibold text-slate-800 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-slate-950"
            >
              View all
            </Link>
          </div>
          <DisasterTable reports={mockDisasters.slice(0, 4)} />
        </div>

        <aside className="space-y-4">
          <h3 className="text-lg font-bold text-slate-950">
            Recent critical alerts
          </h3>
          {critical.map((report) => (
            <AlertCard key={report.id} report={report} />
          ))}
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="font-bold text-slate-950">Quick actions</h3>
            <div className="mt-4 grid gap-3">
              <Link
                className="rounded-md bg-red-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
                href="/add-report"
              >
                Add new report
              </Link>
              <Link
                className="rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-950 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                href="/map"
              >
                Open crisis map
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
