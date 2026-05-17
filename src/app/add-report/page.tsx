import ReportForm from "@/components/ReportForm";

export default function AddReportPage() {
  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section>
        <h2 className="text-2xl font-bold text-slate-950">Add Crisis Report</h2>
        <p className="mt-1 text-sm text-slate-600">
          Analyze a multilingual crisis message and route it to the correct
          authority.
        </p>
      </section>
      <ReportForm />
    </main>
  );
}
