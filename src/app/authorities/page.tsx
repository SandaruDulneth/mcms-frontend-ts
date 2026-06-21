import AuthorityCard from "@/components/AuthorityCard";

const authorities = [
  {
    name: "Disaster Management Centre",
    category: "Crisis response",
    incidentCount: 0,
  },
  { name: "Fire Department", category: "Fire response", incidentCount: 0 },
  { name: "Police", category: "Public safety", incidentCount: 0 },
  {
    name: "Hospitals / Ambulance",
    category: "Medical response",
    incidentCount: 0,
  },
  { name: "Local Council", category: "Infrastructure", incidentCount: 0 },
];

export default function AuthoritiesPage() {
  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Authorities</h2>
        <p className="mt-1 text-sm text-slate-600">
          Authority placeholders for the future Express backend.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {authorities.map((authority) => (
          <AuthorityCard
            key={authority.name}
            name={authority.name}
            category={authority.category}
            incidentCount={authority.incidentCount}
          />
        ))}
      </section>
    </main>
  );
}
