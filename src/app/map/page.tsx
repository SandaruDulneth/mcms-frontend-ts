import { getReportsWithGeo } from "@/lib/reportApi";
import type { UserReportRecord } from "@/types/user-report";
import MapClient from "@/components/MapClient";

// Urgency pill colours — consistent with UrgencyBadge
const URGENCY_PILL: Record<string, string> = {
  Critical: "bg-red-100 text-red-800 border-red-200",
  High    : "bg-red-50  text-red-700  border-red-200",
  Medium  : "bg-amber-50 text-amber-700 border-amber-200",
  Low     : "bg-green-50 text-green-700 border-green-200",
};

function urgencyPill(level?: string) {
  return URGENCY_PILL[level ?? ""] ?? "bg-slate-100 text-slate-600 border-slate-200";
}

function totalPins(reports: UserReportRecord[]): number {
  return reports.reduce((n, r) => n + (r.extractedLocationsGeo?.length ?? 0), 0);
}

export default async function MapPage() {
  let reports: UserReportRecord[] = [];
  let fetchError: string | null = null;

  try {
    reports = await getReportsWithGeo();
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load reports";
  }

  const pins = totalPins(reports);

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Crisis Map</h2>
          <p className="mt-1 text-sm text-slate-500">
            {fetchError
              ? "Could not load map data."
              : pins === 0
                ? "No geocoded reports yet — submit a report to see it on the map."
                : `Showing ${pins} location${pins === 1 ? "" : "s"} from ${reports.length} report${reports.length === 1 ? "" : "s"}.`}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          {(["Critical", "High", "Medium", "Low"] as const).map((lvl) => (
            <span
              key={lvl}
              className={`rounded-full border px-2.5 py-0.5 font-medium ${urgencyPill(lvl)}`}
            >
              {lvl}
            </span>
          ))}
        </div>
      </section>

      {/* ── Error banner ─────────────────────────────────────────────── */}
      {fetchError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {fetchError} — make sure the Express API is running.
        </div>
      )}

      {/* ── Map (client component handles Leaflet + dynamic import) ───── */}
      <MapClient reports={reports} />

      {/* ── Report list below map ─────────────────────────────────────── */}
      {reports.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            Mapped reports
          </h3>
          <div className="space-y-2">
            {reports.map((report) => (
              <div
                key={report._id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${urgencyPill(report.urgencyLevel)}`}>
                    {report.urgencyLevel ?? "—"}
                  </span>
                  {report.crisisType && (
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 capitalize">
                      {report.crisisType}
                    </span>
                  )}
                  {(report.extractedLocationsGeo ?? []).map((geo) => (
                    <span
                      key={geo.name}
                      className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >
                      📍 {geo.name}
                    </span>
                  ))}
                  <span className="ml-auto text-xs text-slate-400">
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">
                  {report.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
