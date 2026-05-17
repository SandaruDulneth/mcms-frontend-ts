import AuthorityCard from "@/components/AuthorityCard";
import { mockDisasters } from "@/data/mockDisasters";

const authorities = [
  { name: "Disaster Management Centre", category: "Flood, Earthquake" },
  { name: "Fire Department", category: "Fire" },
  { name: "Police", category: "Security and public order" },
  { name: "Hospitals / Ambulance", category: "Medical Emergency" },
  { name: "Local Council", category: "Infrastructure Damage" },
];

export default function AuthoritiesPage() {
  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Authorities</h2>
        <p className="mt-1 text-sm text-slate-600">
          Operational contacts and mock incident assignments by agency.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {authorities.map((authority) => (
          <AuthorityCard
            key={authority.name}
            name={authority.name}
            category={authority.category}
            incidentCount={
              mockDisasters.filter(
                (report) => report.authority === authority.name,
              ).length
            }
          />
        ))}
      </section>
    </main>
  );
}
