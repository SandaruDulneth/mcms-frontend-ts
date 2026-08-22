"use client";

import Link from "next/link";
import { useState } from "react";
import ReportCard from "@/components/ReportCard";
import { createReport } from "@/lib/reportApi";
import type { UserReportRecord } from "@/types/user-report";
import {
  FileText,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HelpCircle,
  ShieldAlert,
} from "lucide-react";

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-950 focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950";

export default function ReportForm() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [createdReport, setCreatedReport] = useState<UserReportRecord | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setCreatedReport(null);
    setIsSubmitting(true);

    try {
      const report = await createReport({
        message,
        location: location || undefined,
        sourceType: "User Report",
      });

      setCreatedReport(report);
      setMessage("");
      setLocation("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit report. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      {/* ── Main Report Form ─────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
      >
        <div>
          <label
            htmlFor="message"
            className="flex items-center gap-2 text-sm font-semibold text-slate-900"
          >
            <FileText className="h-4 w-4 text-slate-600" />
            Crisis Message
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={inputClass}
            placeholder="Describe the incident, damage, needs, and visible risks in detail..."
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="flex items-center gap-2 text-sm font-semibold text-slate-900"
          >
            <MapPin className="h-4 w-4 text-red-600" />
            Location (Optional)
          </label>
          <input
            id="location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            className={inputClass}
            placeholder="District, city, street, or nearby landmark"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-md bg-red-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 shadow-sm"
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting Report..." : "Submit Report"}
        </button>

        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p>{errorMessage}</p>
          </div>
        )}
      </form>

      {/* ── User Guidance Card ───────────────────────────────── */}
      <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Reporting Guidelines
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Help emergency teams respond faster by providing accurate information.
          </p>
        </div>

        <div className="space-y-3 pt-1 text-xs">
          <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800 text-[11px]">
              1
            </span>
            <div>
              <p className="font-bold text-slate-900">Be Specific</p>
              <p className="text-slate-500">Describe visible damage, hazards, or immediate dangers clearly.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800 text-[11px]">
              2
            </span>
            <div>
              <p className="font-bold text-slate-900">Specify Location</p>
              <p className="text-slate-500">Provide the city, district, or landmark to guide rescue units.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-800 text-[11px]">
              3
            </span>
            <div>
              <p className="font-bold text-slate-900">Urgent Needs</p>
              <p className="text-slate-500">Mention if medical aid, evacuation, or rescue boats are required.</p>
            </div>
          </div>
        </div>

        {createdReport && (
          <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 pt-4">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              Report submitted successfully!
            </div>
            <Link
              href="/reports"
              className="inline-flex items-center gap-1.5 rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm"
            >
              View all reports
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </aside>

      {/* ── Created Report Preview Section ─────────────────────────────────── */}
      {createdReport && (
        <section className="xl:col-span-2 space-y-3">
          <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Submitted Crisis Record
          </h3>
          <ReportCard report={createdReport} />
        </section>
      )}
    </div>
  );
}
