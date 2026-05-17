type AuthorityCardProps = {
  name: string;
  category: string;
  incidentCount: number;
};

export default function AuthorityCard({
  name,
  category,
  incidentCount,
}: AuthorityCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {category}
      </p>
      <h2 className="mt-2 text-lg font-bold text-slate-950">{name}</h2>
      <p className="mt-3 text-sm text-slate-700">
        Assigned incidents:{" "}
        <span className="font-semibold text-slate-950">{incidentCount}</span>
      </p>
      <button
        type="button"
        className="mt-5 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
      >
        Contact authority
      </button>
    </article>
  );
}
