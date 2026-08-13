"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/reports", label: "Reports", icon: "📋" },
  { href: "/admin/external-disasters", label: "External Intel", icon: "🌐" },
  { href: "/admin/responders", label: "Responders", icon: "🤝" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      {/* ── Admin sidebar ───────────────────────────────────────────── */}
      <aside className="bg-slate-950 text-white lg:min-h-screen lg:w-72">
        <div className="border-b border-slate-800 p-5">
          <Link
            href="/admin"
            className="block focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="text-xl font-bold tracking-tight">MCMS</span>
            <span className="mt-1 block text-sm text-slate-300">
              Admin Panel
            </span>
          </Link>
        </div>

        <nav
          aria-label="Admin navigation"
          className="flex gap-2 overflow-x-auto p-3 lg:block"
        >
          {adminNavItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white lg:mb-1 ${
                  active
                    ? "bg-white text-slate-950"
                    : "text-slate-200 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to main app link */}
        <div className="border-t border-slate-800 p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Main App
          </Link>
        </div>
      </aside>

      {/* ── Main content area ───────────────────────────────────────── */}
      <div className="min-w-0 flex-1">
        {/* Admin topbar */}
        <header className="border-b border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Administration
              </p>
              <h1 className="text-xl font-bold text-slate-950">
                MCMS Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-700" />
              </span>
              <span>System Online</span>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
