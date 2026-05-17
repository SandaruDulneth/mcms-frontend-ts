import Link from "next/link";

export default function Home() {
  return (
    <main className="px-5 py-8 md:px-8">
      <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700">
          Emergency response 
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-slate-950">
          Multilingual Crisis Management System for coordinated disaster
          response
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
          MCMS collects public crisis messages, classifies incident category and
          urgency, translates multilingual reports for operators, and routes
          each case to the responsible authority using a clear operations
          dashboard.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/add-report"
            className="rounded-md border border-red-700 bg-white px-5 py-3 text-sm font-semibold text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
          >
            Add Crisis Report
          </Link>
        </div>
      </section>
    </main>
  );
}
