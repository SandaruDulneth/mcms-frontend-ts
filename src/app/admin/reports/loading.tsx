export default function AdminReportsLoading() {
  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      {/* Header skeleton */}
      <section>
        <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200" />
      </section>

      {/* Filters skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-20 animate-pulse rounded-lg bg-slate-200"
            />
          ))}
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Table header */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-4 py-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-3 w-20 flex-1 animate-pulse rounded bg-slate-200"
            />
          ))}
        </div>
        {/* Table rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="flex items-center border-b border-slate-50 px-4 py-4"
          >
            <div className="h-4 flex-1 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
