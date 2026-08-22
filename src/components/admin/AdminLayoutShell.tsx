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
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Pinned Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area — independent vertical scroll */}
      <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
        <Topbar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
