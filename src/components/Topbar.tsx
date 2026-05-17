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
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-md border border-green-700 bg-green-50 px-3 py-1.5 font-semibold text-green-800">
            System Online
          </span>

        </div>
      </div>
    </header>
  );
}
