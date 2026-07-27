"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Admin pages use their own dedicated layout — skip main sidebar/topbar
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        {children}
      </div>
    </div>
  );
}
