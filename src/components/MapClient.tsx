"use client";

import dynamic from "next/dynamic";
import type { UserReportRecord } from "@/types/user-report";

const DisasterMap = dynamic(() => import("@/components/DisasterMap"), {
  ssr    : false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-500">
      Loading map…
    </div>
  ),
});

interface MapClientProps {
  reports: UserReportRecord[];
}

export default function MapClient({ reports }: MapClientProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <DisasterMap reports={reports} />
    </section>
  );
}
