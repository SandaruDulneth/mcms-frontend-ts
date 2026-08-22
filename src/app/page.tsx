import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  Globe,
  MapPin,
  MessageSquareWarning,
  ShieldCheck,
  Zap,
  ArrowRight,
  Radio,
} from "lucide-react";

const features = [
  {
    icon: MessageSquareWarning,
    title: "Multilingual Reporting",
    description:
      "Citizens submit crisis reports in any language. Our NLP pipeline classifies, translates, and routes every message automatically.",
    tone: "text-red-700 bg-red-50",
  },
  {
    icon: Zap,
    title: "Real-Time Classification",
    description:
      "Automatic urgency and crisis type detection ensures high-priority incidents get immediate attention from emergency coordinators.",
    tone: "text-amber-700 bg-amber-50",
  },
  {
    icon: MapPin,
    title: "Location Intelligence",
    description:
      "AI-powered geocoding extracts locations from unstructured text and places them on an interactive crisis map.",
    tone: "text-blue-700 bg-blue-50",
  },
  {
    icon: ShieldCheck,
    title: "Credibility Verification",
    description:
      "Cross-references reports against GDACS alerts, news sources, and similar submissions to verify credibility.",
    tone: "text-emerald-700 bg-emerald-50",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Disaster intelligence hub with interactive charts for urgency distribution, incident trends, and regional breakdowns.",
    tone: "text-violet-700 bg-violet-50",
  },
  {
    icon: Radio,
    title: "Authority Coordination",
    description:
      "Routes active incidents to the responsible agencies and tracks responder mobilisation in real time.",
    tone: "text-sky-700 bg-sky-50",
  },
];

const quickLinks = [
  {
    href: "/dashboard",
    label: "Operations Dashboard",
    description: "Live KPIs, recent crisis feed, and system overview",
    icon: BarChart3,
  },
  {
    href: "/disasters",
    label: "Ongoing Disasters",
    description: "Browse and filter active crisis reports by category",
    icon: AlertTriangle,
  },
  {
    href: "/map",
    label: "Crisis Map",
    description: "Interactive map with geocoded incident locations",
    icon: Globe,
  },
  {
    href: "/analytics",
    label: "Analytics Hub",
    description: "Disaster intelligence with interactive Recharts plots",
    icon: BarChart3,
  },
];

export default function Home() {
  return (
    <main className="space-y-10 px-5 py-8 md:px-8">
      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-800">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
              Emergency Response Platform
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Multilingual Crisis Management System
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              MCMS collects public crisis messages in any language, classifies
              incident category and urgency using AI, translates multilingual
              reports for operators, and routes each case to the responsible
              authority through a unified operations dashboard.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/add-report"
                className="inline-flex items-center gap-2 rounded-lg border border-red-700/40 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-100 hover:border-red-700 transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                Report a Crisis
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3 lg:w-72 lg:shrink-0">
            <div className="rounded-lg border border-red-200 bg-white p-4 text-center">
              <p className="text-xs font-semibold text-slate-600">Active Alerts</p>
              <p className="mt-1 text-2xl font-bold text-red-800">Live</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-white p-4 text-center">
              <p className="text-xs font-semibold text-slate-600">Languages</p>
              <p className="mt-1 text-2xl font-bold text-blue-800">Multi</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-white p-4 text-center">
              <p className="text-xs font-semibold text-slate-600">AI Powered</p>
              <p className="mt-1 text-2xl font-bold text-emerald-800">NLP</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white p-4 text-center">
              <p className="text-xs font-semibold text-slate-600">Verification</p>
              <p className="mt-1 text-2xl font-bold text-amber-800">GDACS</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Access Cards ─────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-slate-950">Quick Access</h2>
        <p className="mt-0.5 text-sm text-slate-500">Navigate to key operational areas</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-950">{link.label}</h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {link.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Platform Features Grid ─────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-slate-950">Platform Capabilities</h2>
        <p className="mt-0.5 text-sm text-slate-500">End-to-end crisis intelligence pipeline</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            const [textColor, bgColor] = feature.tone.split(" ");
            return (
              <article
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className={`inline-flex rounded-lg p-2.5 ${bgColor}`}>
                  <Icon className={`h-5 w-5 ${textColor}`} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-950">MCMS</p>
            <p className="text-xs text-slate-500">
              Multilingual Crisis Management System — Final Year Project
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            All Systems Operational
          </div>
        </div>
      </footer>
    </main>
  );
}
