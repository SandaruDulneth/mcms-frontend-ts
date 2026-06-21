import Link from "next/link";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Frontend shell ready for the Express backend.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Reports"
          value="--"
          detail="Connect Express API"
        />
        <StatCard
          title="Critical Alerts"
          value="--"
          detail="Pending backend data"
          tone="red"
        />
        <StatCard
          title="Active Disasters"
          value="--"
          detail="Pending backend data"
          tone="amber"
        />
        <StatCard
          title="Resolved Reports"
          value="--"
          detail="Pending backend data"
          tone="green"
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950">
          Backend connection removed
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          This dashboard no longer loads MongoDB data inside the Next app. We
          can plug the Express API into this UI later.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/add-report"
            className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Add report
          </Link>
          <Link
            href="/analytics"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100"
          >
            View analytics
          </Link>
        </div>
      </section>
    </main>
  );
}
