import { getAllResponders } from "@/lib/adminApi";
import RespondersTable from "@/components/admin/RespondersTable";

export default async function AdminRespondersPage() {
  let responders;
  try {
    responders = await getAllResponders();
  } catch {
    return (
      <main className="px-5 py-6 md:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-bold text-red-800">
            Failed to load responders
          </p>
          <p className="mt-2 text-sm text-red-600">
            Make sure the backend server is running and accessible.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">
          Manage Responders
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          View all responders across crisis reports and manage their status
        </p>
      </section>

      <RespondersTable initialResponders={responders} />
    </main>
  );
}
