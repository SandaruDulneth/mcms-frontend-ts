export default function AdminDashboardLoading() {
  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      {/* Page header skeleton */}
      <section>
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
      </section>

      {/* Stat cards skeleton */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm"
          />
        ))}
      </section>

      {/* Two-column breakdown skeleton */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="h-52 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
        <div className="h-52 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
      </section>

      {/* Bar chart skeleton */}
      <div className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
      <div className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
    </main>
  );
}
