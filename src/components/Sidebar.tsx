"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/disasters", label: "Ongoing Disasters" },
  { href: "/add-report", label: "Add Crisis Report" },
  { href: "/map", label: "Crisis Map" },
  { href: "/authorities", label: "Authorities" },
  { href: "/analytics", label: "Analytics" },
  { href: "/reports", label: "Reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-slate-950 text-white lg:min-h-screen lg:w-72">
      <div className="border-b border-slate-800 p-5">
        <Link
          href="/"
          className="block focus:outline-none focus:ring-2 focus:ring-white"
        >
          <span className="text-xl font-bold tracking-tight">MCMS</span>
          <span className="mt-1 block text-sm text-slate-300">
            Crisis Management System
          </span>
        </Link>
      </div>
      <nav
        aria-label="Main navigation"
        className="flex gap-2 overflow-x-auto p-3 lg:block"
      >
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white lg:mb-1 ${
                active
                  ? "bg-white text-slate-950"
                  : "text-slate-200 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
