"use client";

import { useEffect } from "react";
import type { ReportStatus, UserReportRecord } from "@/types/user-report";
import { reportStatuses } from "@/types/user-report";
import StatusDropdown from "@/components/admin/StatusDropdown";
import {
  X,
  FileText,
  AlertTriangle,
  Globe,
  MapPin,
  ShieldCheck,
  ExternalLink,
  Clock,
  Sparkles,
  Users,
  Trash2,
  CheckCircle,
} from "lucide-react";

type ReportOverviewModalProps = {
  report: UserReportRecord | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: ReportStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

const urgencyStyles: Record<string, string> = {
  Critical: "border-red-700 bg-red-100 text-red-900 font-bold",
  High: "border-red-600 bg-red-50 text-red-800 font-bold",
  Medium: "border-amber-600 bg-amber-50 text-amber-800 font-semibold",
  Low: "border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(new Date(value));
}

function formatLabel(value?: string) {
  if (!value) return "Unclassified";
  return value.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function ReportOverviewModal({
  report,
  onClose,
  onStatusChange,
  onDelete,
}: ReportOverviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!report) return null;

  const sources = report.credibilitySources;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150">
        {/* ── Modal Header ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Report Overview</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                    report.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : report.status === "Pending"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : report.status === "In Progress"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {report.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ID: <span className="font-mono text-slate-300">{report._id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Modal Scrollable Body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ── Full Original & Translated Message Card ────────────── */}
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-700" />
                Full Crisis Message Text
              </span>

              {report.wasTranslated && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                  <Globe className="h-3.5 w-3.5" />
                  Language: {report.detectedLanguage || "Translated"}
                </span>
              )}
            </div>

            {/* Original Message Box */}
            <div className="rounded-lg border border-slate-200 bg-white p-3.5 text-sm font-medium leading-relaxed text-slate-900">
              {report.message}
            </div>

            {/* Translated Message Box */}
            {report.wasTranslated && report.translatedText && (
              <div className="space-y-1 rounded-lg border border-blue-200 bg-blue-50/80 p-3.5 text-xs text-slate-800">
                <p className="font-bold text-blue-900 flex items-center gap-1">
                  <span>English Translation:</span>
                </p>
                <p className="italic leading-relaxed">"{report.translatedText}"</p>
              </div>
            )}
          </div>

          {/* ── AI NLP & Categorization Breakdown ─────────────────────── */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              AI Intelligence Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Crisis Category */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                <p className="text-[11px] font-semibold text-slate-500">Crisis Type</p>
                <p className="mt-1 text-sm font-bold text-slate-900 capitalize">
                  {formatLabel(report.crisisType)}
                </p>
                {report.crisisConfidence && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Confidence: {Math.round(report.crisisConfidence * 100)}%
                  </p>
                )}
              </div>

              {/* Urgency Level */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                <p className="text-[11px] font-semibold text-slate-500">Urgency Level</p>
                <div className="mt-1">
                  {report.urgencyLevel ? (
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${
                        urgencyStyles[report.urgencyLevel] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {report.urgencyLevel}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Pending</span>
                  )}
                </div>
                {report.urgencyConfidence && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Confidence: {Math.round(report.urgencyConfidence * 100)}%
                  </p>
                )}
              </div>

              {/* Message Intent / Type */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                <p className="text-[11px] font-semibold text-slate-500">Report Intent</p>
                <p className="mt-1 text-sm font-bold text-slate-900 capitalize">
                  {formatLabel(report.messageType || "Incident Report")}
                </p>
                {report.messageTypeConfidence && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Confidence: {Math.round(report.messageTypeConfidence * 100)}%
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Extracted Locations & Affected Communities ─────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Extracted Geolocation */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-red-600" />
                Extracted Locations
              </span>
              <p className="text-xs font-semibold text-slate-800">
                {report.location || report.extractedLocations?.join(", ") || "No location specified"}
              </p>

              {report.extractedLocationsGeo && report.extractedLocationsGeo.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {report.extractedLocationsGeo.map((geo, i) => (
                    <div
                      key={i}
                      className="rounded bg-slate-50 border border-slate-200 p-2 text-[11px] text-slate-600 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-900">{geo.displayName || geo.name}</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Affected Communities & Needs */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-blue-600" />
                Affected Communities / Impact
              </span>
              {report.affectedCommunities && report.affectedCommunities.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {report.affectedCommunities.map((comm, idx) => (
                    <span
                      key={idx}
                      className="inline-flex rounded-md bg-blue-50 border border-blue-200 px-2 py-1 text-xs font-semibold text-blue-800"
                    >
                      {comm}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">General public incident report</p>
              )}
            </div>
          </div>

          {/* ── Credibility & External Evidence Verification ──────────── */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Credibility Assessment
              </span>

              {report.credibilityLabel && (
                <span
                  className={`inline-flex rounded-md border px-2.5 py-0.5 text-xs font-bold ${
                    report.credibilityLabel === "High"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : report.credibilityLabel === "Medium"
                      ? "border-amber-300 bg-amber-50 text-amber-800"
                      : "border-red-300 bg-red-50 text-red-800"
                  }`}
                >
                  {report.credibilityLabel} Confidence ({report.credibilityScore ?? 0}/100)
                </span>
              )}
            </div>

            {sources ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* News Article Verification */}
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-1">
                  <p className="font-bold text-slate-700">News API Verification</p>
                  {sources.newsHeadline ? (
                    <div>
                      <p className="text-slate-800 line-clamp-2 font-medium">"{sources.newsHeadline}"</p>
                      {sources.newsUrl && (
                        <a
                          href={sources.newsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                        >
                          View Article <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No matching news articles found</p>
                  )}
                </div>

                {/* GDACS Verification */}
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-1">
                  <p className="font-bold text-slate-700">GDACS Disaster Alert</p>
                  {sources.gdacsMatch ? (
                    <div>
                      <p className="text-slate-800 line-clamp-2 font-medium">"{sources.gdacsMatch}"</p>
                      {sources.gdacsUrl && (
                        <a
                          href={sources.gdacsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline"
                        >
                          View GDACS Alert <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No matching GDACS alert</p>
                  )}
                </div>

                {/* Similar Reports Verification */}
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-1">
                  <p className="font-bold text-slate-700">Cross-Report Cluster</p>
                  <p className="text-slate-800 font-semibold">
                    {sources.similarReports} similar report{sources.similarReports === 1 ? "" : "s"}
                  </p>
                  <p className="text-[10px] text-slate-500">Submitted in past 48 hours</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Credibility verification in progress...</p>
            )}
          </div>

          {/* Submission Timestamp */}
          <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Submitted on: {formatDate(report.createdAt)}</span>
          </div>
        </div>

        {/* ── Modal Footer Controls ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Update Status:</span>
            <StatusDropdown
              currentStatus={report.status}
              options={reportStatuses}
              onStatusChange={(status) => onStatusChange(report._id, status as ReportStatus)}
            />
          </div>

          <div className="flex items-center gap-2">
            {report.status === "Pending" && (
              <button
                onClick={async () => {
                  await onStatusChange(report._id, "Active");
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Approve as Active Disaster
              </button>
            )}

            <button
              onClick={async () => {
                await onDelete(report._id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Report
            </button>

            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
