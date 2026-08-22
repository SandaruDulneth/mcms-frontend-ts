"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Globe,
  Users,
  ArrowLeft,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/external-disasters", label: "External Intel", icon: Globe },
  { href: "/admin/responders", label: "Responders", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* ── Admin Pinned Sidebar ────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 bg-slate-950 text-white h-full border-r border-slate-800 select-none">
        {/* Header Branding (No Icon Logo) */}
        <div className="border-b border-slate-800 p-5">
          <Link
            href="/admin"
            className="block focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-1"
          >
            <span className="text-xl font-extrabold tracking-tight text-white block leading-tight">
              MCMS
            </span>
            <span className="text-xs text-slate-400 block font-medium mt-0.5">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Admin Navigation Links */}
        <nav
          aria-label="Admin navigation"
          className="flex-1 space-y-1.5 p-3 overflow-y-auto"
        >
          {adminNavItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-colors duration-150 ${
                  active
                    ? "bg-slate-800 text-white shadow-sm border-l-4 border-red-600"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active ? "text-red-500" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to main app link */}
        <div className="border-t border-slate-800 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-900 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main App
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area — independent scroll ────────────────────── */}
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
        {/* Admin Topbar */}
        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Administration
              </p>
              <h1 className="text-xl font-bold text-slate-950">
                MCMS Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span>System Online</span>
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
