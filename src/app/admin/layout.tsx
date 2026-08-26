"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, removeAdminToken } from "@/lib/auth";
import {
  LayoutDashboard,
  FileText,
  Globe,
  Users,
  ArrowLeft,
  LogOut,
  Loader2,
  ShieldCheck,
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
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authed, setAuthed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    const check = isAuthenticated();
    if (!check) {
      setAuthed(false);
      setCheckingAuth(false);
      router.replace("/admin/login");
    } else {
      setAuthed(true);
      setCheckingAuth(false);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    removeAdminToken();
    setAuthed(false);
    router.replace("/admin/login");
  };

  // If on login route, render login content directly without sidebar shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading indicator while resolving auth check
  if (checkingAuth || !authed) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="text-xs font-semibold text-slate-400">
            Verifying Administrator Authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* ── Admin Pinned Sidebar ────────────────────────────────────────── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 bg-slate-950 text-white h-full border-r border-slate-800 select-none">
        {/* Header Branding (No Icon Logo) */}
        <div className="border-b border-slate-800 p-5 flex items-center justify-between">
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-400 border border-red-800/50">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </span>
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

        {/* Bottom Actions: Back to App & Logout */}
        <div className="border-t border-slate-800 p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-900 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main App
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 transition-colors hover:bg-red-950/50 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Sign Out (Logout)
          </button>
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span>System Online</span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50 hover:border-red-200 transition-colors"
                title="Logout from admin session"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
