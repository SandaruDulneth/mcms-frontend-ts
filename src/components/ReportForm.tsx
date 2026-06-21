"use client";

import { useState } from "react";

const inputClass =
  "mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 focus:border-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950";

export default function ReportForm() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [contact, setContact] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveMessage(null);
    setSaveMessage("Report prepared locally. Connect Express to persist it.");
    setMessage("");
    setLocation("");
    setSource("");
    setContact("");
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
          <div>
            <label
              htmlFor="source"
              className="text-sm font-semibold text-slate-900"
            >
              Source type
            </label>
            <select
              id="source"
              required
              value={source}
              onChange={(event) => setSource(event.target.value)}
              className={inputClass}
            >
              <option value="">Select source</option>
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
          className="mt-6 rounded-md bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Submit report
        </button>
      </form>

      <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Processing status</h2>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          The report is kept local for now. Language detection, translation,
          category, urgency, and authority assignment will be determined later
          by the AI services.
        </p>
        {saveMessage ? (
          <p className="mt-5 rounded-md border border-green-700 bg-green-50 px-3 py-2 text-sm font-semibold text-green-800">
            {saveMessage}
          </p>
        ) : null}
      </aside>
    </div>
  );
}
