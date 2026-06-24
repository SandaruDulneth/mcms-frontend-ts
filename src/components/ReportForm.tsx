"use client";

import Link from "next/link";
import { useState } from "react";
import ReportCard from "@/components/ReportCard";
import { createReport } from "@/lib/reportApi";
import type { UserReportRecord } from "@/types/user-report";

const inputClass =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950";

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
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="message"
            className="text-sm font-semibold text-slate-900"
          >
            Crisis message
          </label>
          <textarea
            id="message"
            required
            rows={6}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={inputClass}
            placeholder="Describe the incident, damage, needs, and visible risks."
          />
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="location"
              className="text-sm font-semibold text-slate-900"
            >
              Location
            </label>
            <input
              id="location"
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className={inputClass}
              placeholder="District, city, or landmark"
            />
          </div>
          <div className="rounded-md border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-sm font-semibold text-blue-950">
              AI analysis enabled
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-800">
              Submitting will classify disaster type, message type, and urgency
              through the Python backend before saving the report.
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 rounded-md bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Analyzing report..." : "Submit report"}
        </button>

        {errorMessage ? (
          <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
            {errorMessage}
          </p>
        ) : null}
      </form>

      <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Processing status</h2>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          The report will be sent to the Express backend, analyzed by the
          Python AI service, saved in MongoDB, and returned with disaster,
          message, and urgency classifications.
        </p>
        {createdReport ? (
          <div className="mt-5 space-y-4">
            <p className="rounded-md border border-green-700 bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">
              Report saved with AI analysis.
            </p>
            <Link
              href="/reports"
              className="inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              View all reports
            </Link>
          </div>
        ) : null}
      </aside>

      {createdReport ? (
        <section className="xl:col-span-2">
          <h2 className="mb-3 text-lg font-bold text-slate-950">
            Latest analyzed report
          </h2>
          <ReportCard report={createdReport} />
        </section>
      ) : null}
    </div>
  );
}
