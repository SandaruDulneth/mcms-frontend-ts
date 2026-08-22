import Link from "next/link";
import ReportForm from "@/components/ReportForm";
import { ArrowLeft } from "lucide-react";

export default function AddReportPage() {
  return (
    <main className="space-y-6 px-5 py-6 md:px-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Add Crisis Report</h2>
          <p className="mt-1 text-sm text-slate-600">
            Submit a crisis message to report emergencies, hazards, or immediate relief needs.
          </p>
        </div>
        <Link
          href="/disasters"
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          View ongoing disasters
        </Link>
      </section>

      <ReportForm />
    </main>
  );
}
