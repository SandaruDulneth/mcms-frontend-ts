import AuthorityCard from "@/components/AuthorityCard";
import { loadCrisisReports } from "@/lib/crisis-reports";

export const dynamic = "force-dynamic";

export default async function AuthoritiesPage() {
  const { reports, error } = await loadCrisisReports();
  const authorities = reports.reduce<
    Map<string, { categories: Set<string>; incidentCount: number }>
  >((items, report) => {
    if (!report.assignedAuthority) {
      return items;
    }

    const existing = items.get(report.assignedAuthority) ?? {
      categories: new Set<string>(),
      incidentCount: 0,
    };

    if (report.category) {
      existing.categories.add(report.category);
    }

    existing.incidentCount += 1;
    items.set(report.assignedAuthority, existing);
    return items;
  }, new Map());

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Authorities</h2>
        <p className="mt-1 text-sm text-slate-600">
          Authorities currently assigned to stored crisis reports.
        </p>
      </section>
      {error ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </p>
      ) : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...authorities.entries()].map(([name, data]) => (
          <AuthorityCard
            key={name}
            name={name}
            category={[...data.categories].join(", ") || "Unclassified"}
            incidentCount={data.incidentCount}
          />
        ))}
        {authorities.size === 0 ? (
          <p className="text-sm text-slate-600">
            No authorities have been assigned to reports yet.
          </p>
        ) : null}
      </section>
    </main>
  );
}
