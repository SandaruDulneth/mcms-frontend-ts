"use client";

import { useState, useTransition } from "react";

type StatusDropdownProps<T extends string> = {
  currentStatus: T;
  options: readonly T[];
  labels?: Record<T, string>;
  onStatusChange: (newStatus: T) => Promise<void>;
};

export default function StatusDropdown<T extends string>({
  currentStatus,
  options,
  labels,
  onStatusChange,
}: StatusDropdownProps<T>) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState(currentStatus);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as T;
    setOptimistic(newStatus);

    startTransition(async () => {
      try {
        await onStatusChange(newStatus);
      } catch {
        // Revert on error
        setOptimistic(currentStatus);
      }
    });
  }

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <select
        value={optimistic}
        onChange={handleChange}
        disabled={isPending}
        className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-1.5 pr-7 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labels?.[opt] ?? opt}
          </option>
        ))}
      </select>

      {/* Dropdown chevron */}
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>

      {isPending && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      )}
    </div>
  );
}
