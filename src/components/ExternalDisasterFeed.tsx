import StatCard from "@/components/StatCard";
import { Globe, Newspaper } from "lucide-react";
import type { ExternalDisasterFeed, ExternalDisasterItem } from "@/types/external-disaster";

type ExternalDisasterFeedProps = {
  feed: ExternalDisasterFeed;
  variant?: "public" | "admin";
};

const sourceStyles: Record<string, string> = {
  GDACS: "border-blue-200 bg-blue-50 text-blue-700",
  NewsAPI: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatType(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function SourceHealth({ feed }: { feed: ExternalDisasterFeed }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard
        title="GDACS Feeds"
        value={feed.sources.gdacs.itemCount}
        detail={feed.sources.gdacs.enabled ? "Global Disaster Alert System (Active)" : "Not Configured"}
        tone="blue"
        icon={Globe}
        trend={feed.sources.gdacs.enabled ? "Active" : "Disabled"}
        trendUp={feed.sources.gdacs.enabled}
      />
      <StatCard
        title="NewsAPI Intelligence"
        value={feed.sources.newsApi.itemCount}
        detail={feed.sources.newsApi.enabled ? "International News Feeds (Active)" : "Not Configured"}
        tone="green"
        icon={Newspaper}
        trend={feed.sources.newsApi.enabled ? "Active" : "Disabled"}
        trendUp={feed.sources.newsApi.enabled}
      />
    </div>
  );
}

function ExternalDisasterCard({ item, variant }: { item: ExternalDisasterItem; variant: "public" | "admin" }) {
  const sourceClass = sourceStyles[item.source] ?? "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${sourceClass}`}>
              {item.source}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {formatType(item.disasterType)}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
              {item.status}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {item.description || "No additional description was provided by this source."}
          </p>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm lg:w-72">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
          <p className="mt-1 font-bold text-slate-950">{item.location}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Published</p>
          <p className="mt-1 text-slate-700">{formatDate(item.publishedAt)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>Source: {item.sourceName}</span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          {variant === "admin" ? "Open source evidence" : "Read source"}
        </a>
      </div>
    </article>
  );
}

export default function ExternalDisasterFeedView({ feed, variant = "public" }: ExternalDisasterFeedProps) {
  const gdacsCount = feed.sources.gdacs.itemCount;
  const newsCount = feed.sources.newsApi.itemCount;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">External signals</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{feed.items.length}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-blue-800">GDACS global alerts</p>
          <p className="mt-2 text-3xl font-bold text-blue-950">{gdacsCount}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-emerald-800">NewsAPI articles</p>
          <p className="mt-2 text-3xl font-bold text-emerald-950">{newsCount}</p>
        </div>
      </section>

      {variant === "admin" ? <SourceHealth feed={feed} /> : null}

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-semibold text-slate-950">
          {variant === "admin" ? "Operator note" : "How to use this page"}
        </p>
        <p className="mt-1 leading-6">
          These are external disaster signals from NewsAPI and GDACS for {feed.country}. Use them as supporting evidence together with user-submitted reports and credibility scores.
        </p>
        <p className="mt-2 text-xs text-slate-500">Last checked: {formatDate(feed.fetchedAt)}</p>
      </section>

      {feed.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">No active external disaster signals found</h3>
          <p className="mt-2 text-sm text-slate-600">
            Check the backend logs, GDACS availability, or NEWS_API_KEY configuration if you expected results.
          </p>
        </div>
      ) : (
        <section className="space-y-4">
          {feed.items.map((item) => (
            <ExternalDisasterCard key={`${item.source}-${item.id}`} item={item} variant={variant} />
          ))}
        </section>
      )}
    </div>
  );
}

