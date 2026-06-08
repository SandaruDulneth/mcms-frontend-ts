import type { CrisisReportRecord } from "@/types/crisis-report";

const pinStyles: Record<string, string> = {
  Critical: "bg-red-700 text-white",
  High: "bg-amber-600 text-slate-950",
  Medium: "bg-amber-500 text-slate-950",
  Low: "bg-green-700 text-white",
};

export default function MapPlaceholder({
  reports,
}: {
  reports: CrisisReportRecord[];
}) {
  return (
    <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">
          Incidents by location
        </h2>
        <ul className="mt-4 space-y-3">
          {reports.map((report) => (
            <li
              key={report.id}
              className="border-b border-slate-200 pb-3 last:border-0"
            >
              <p className="font-semibold text-slate-950">
                {report.location || "Location not provided"}
              </p>
              <p className="text-sm text-slate-600">
                {report.category || "Pending classification"} |{" "}
                {report.urgencyLevel || "Pending urgency"}
              </p>
            </li>
          ))}
          {reports.length === 0 ? (
            <li className="text-sm text-slate-600">No incidents available.</li>
          ) : null}
        </ul>
      </aside>
      <div
        aria-label="Crisis report location overview"
        role="img"
        className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-300 bg-slate-200 shadow-sm"
      >
        <div className="absolute inset-x-0 top-1/3 h-px bg-slate-300" />
        <div className="absolute inset-y-0 left-1/3 w-px bg-slate-300" />
        <div className="absolute inset-y-0 left-2/3 w-px bg-slate-300" />
        <div className="absolute inset-x-0 top-2/3 h-px bg-slate-300" />
        {reports.map((report, index) => {
          const urgency = report.urgencyLevel || "Pending";
          const top = `${20 + ((index * 23) % 65)}%`;
          const left = `${15 + ((index * 31) % 70)}%`;

          return (
            <div
              key={report.id}
              className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-md ${
                pinStyles[urgency] ?? "bg-slate-600 text-white"
              }`}
              style={{ top, left }}
              title={`${report.location || "Unknown location"}: ${urgency}`}
            >
              {urgency[0]}
            </div>
          );
        })}
      </div>
    </section>
  );
}
