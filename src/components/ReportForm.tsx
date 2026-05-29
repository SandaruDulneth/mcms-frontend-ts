"use client";

import { useState } from "react";
import {
  type ClassificationResult,
  classifyMessage,
} from "@/lib/classifyMessage";
import UrgencyBadge from "./UrgencyBadge";

const inputClass =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950";

export default function ReportForm() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("English");
  const [source, setSource] = useState("Citizen SMS");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleAnalyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage(null);
    setSaveError(null);
    setResult(classifyMessage(message, language));
  }

  async function handleSaveReport() {
    const analysis = result ?? classifyMessage(message, language);

    setResult(analysis);
    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const response = await fetch("/api/crisis-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalMessage: message,
          detectedLanguage: analysis.detectedLanguage,
          translatedMessage: analysis.translatedMessage,
          location,
          sourceType: source,
          contactInfo: contact,
          category: analysis.category,
          urgencyLevel: analysis.urgency,
          assignedAuthority: analysis.suggestedAuthority,
          status: "Active",
        }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        report?: { _id?: string };
      };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Failed to save crisis report.");
      }

      setSaveMessage(
        data.report?._id
          ? `Report saved. Reference ID: ${data.report._id}`
          : "Report saved.",
      );
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to save crisis report.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <form
        onSubmit={handleAnalyze}
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
          <div>
            <label
              htmlFor="language"
              className="text-sm font-semibold text-slate-900"
            >
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className={inputClass}
            >
              <option>English</option>
              <option>Sinhala</option>
              <option>Tamil</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="source"
              className="text-sm font-semibold text-slate-900"
            >
              Source type
            </label>
            <select
              id="source"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className={inputClass}
            >
              <option>Citizen SMS</option>
              <option>Mobile App</option>
              <option>Hotline</option>
              <option>Agency Portal</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="contact"
              className="text-sm font-semibold text-slate-900"
            >
              Contact info optional
            </label>
            <input
              id="contact"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              className={inputClass}
              placeholder="Phone or reference number"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-md bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2"
        >
          Analyze report
        </button>
      </form>

      <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Analysis result</h2>
        {result ? (
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-slate-600">
                Detected language
              </dt>
              <dd className="mt-1 text-slate-950">{result.detectedLanguage}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">
                Translated message
              </dt>
              <dd className="mt-1 text-slate-950">
                {result.translatedMessage}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">Category</dt>
              <dd className="mt-1 text-slate-950">{result.category}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">Urgency level</dt>
              <dd className="mt-2">
                <UrgencyBadge value={result.urgency} />
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-600">
                Suggested authority
              </dt>
              <dd className="mt-1 text-slate-950">
                {result.suggestedAuthority}
              </dd>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={handleSaveReport}
                disabled={isSaving}
                className="w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSaving ? "Saving report..." : "Submit report"}
              </button>
              {saveMessage ? (
                <p className="mt-3 rounded-md border border-green-700 bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">
                  {saveMessage}
                </p>
              ) : null}
              {saveError ? (
                <p className="mt-3 rounded-md border border-red-700 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
                  {saveError}
                </p>
              ) : null}
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            Submit a message to classify crisis category, urgency, and
            responsible authority using prototype keyword logic.
          </p>
        )}
      </aside>
    </div>
  );
}
