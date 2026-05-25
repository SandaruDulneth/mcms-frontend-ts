export default function Topbar() {
  return (
    <header className="border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Emergency Operations Centre
          </p>
          <h1 className="text-xl font-bold text-slate-950">
            Multilingual Crisis Management System
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="relative flex h-3 w-3" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-700" />
          </span>
          <span className="sr-only">System online</span>

        </div>
      </div>
    </header>
  );
}
