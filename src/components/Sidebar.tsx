"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  PlusCircle,
  MapPin,
  Radio,
  BarChart3,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/disasters", label: "Ongoing Disasters", icon: AlertTriangle },
  { href: "/add-report", label: "Add Crisis Report", icon: PlusCircle },
  { href: "/map", label: "Crisis Map", icon: MapPin },
  { href: "/authorities", label: "Authorities", icon: Radio },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 bg-slate-950 text-white h-full border-r border-slate-800 select-none">
      {/* ── Sidebar Header (No Icon Logo) ─────────────────────────────────── */}
      <div className="border-b border-slate-800 p-5">
        <Link
          href="/"
          className="block focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-1"
        >
          <span className="text-xl font-extrabold tracking-tight text-white block leading-tight">
            MCMS
          </span>
          <span className="text-xs text-slate-400 block font-medium mt-0.5">
            Crisis Management System
          </span>
        </Link>
      </div>

      {/* ── Navigation Links ──────────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-1.5 p-3 overflow-y-auto"
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
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

      {/* ── Sidebar Footer / Status ───────────────────────────────────────── */}
      <div className="border-t border-slate-800 p-4">
        <div className="rounded-lg bg-slate-900 p-3">
          <p className="text-[11px] font-bold text-slate-200">MCMS Active Hub</p>
          <p className="text-[10px] text-slate-400">Emergency Network Online</p>
        </div>
      </div>
    </aside>
  );
}
