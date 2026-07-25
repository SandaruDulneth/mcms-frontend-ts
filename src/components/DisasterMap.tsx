"use client";

import { useEffect, useRef } from "react";
import type { UserReportRecord } from "@/types/user-report";

// Urgency colours — matches your existing UrgencyBadge palette
const URGENCY_COLOUR: Record<string, string> = {
  Critical: "#991b1b",  // red-800
  High    : "#b91c1c",  // red-700
  Medium  : "#d97706",  // amber-600
  Low     : "#15803d",  // green-700
};

function urgencyColour(level?: string): string {
  return URGENCY_COLOUR[level ?? ""] ?? "#475569"; // slate-600 fallback
}

interface DisasterMapProps {
  reports: UserReportRecord[];
}

export default function DisasterMap({ reports }: DisasterMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);  // holds the Leaflet map instance

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Leaflet must be imported client-side only (no SSR)
    import("leaflet").then((L) => {
      // Fix default marker icon paths broken by Next.js asset pipeline
      // biome-ignore lint/suspicious/noExplicitAny: Leaflet internal
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl      : "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl    : "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Centre on Sri Lanka
      const map = L.map(containerRef.current!, {
        center: [7.8731, 80.7718],
        zoom  : 7,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom    : 18,
      }).addTo(map);

      mapRef.current = map;

      // Render initial pins
      addPins(L, map, reports);
    });

    return () => {
      if (mapRef.current) {
        // biome-ignore lint/suspicious/noExplicitAny: Leaflet map
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render pins whenever reports data changes
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      // biome-ignore lint/suspicious/noExplicitAny: Leaflet map
      const map = mapRef.current as any;
      // Remove old pins before re-adding
      map.eachLayer((layer: unknown) => {
        // biome-ignore lint/suspicious/noExplicitAny: Leaflet layer
        if ((layer as any) instanceof L.Marker) map.removeLayer(layer);
      });
      addPins(L, map, reports);
    });
  }, [reports]);

  return (
    <>
      {/* Leaflet CSS — loaded inline so no _document.tsx change needed */}
      {/* biome-ignore lint/style/noUnusedTemplateLiteral: needed for next/head */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        // biome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: external CDN
        crossOrigin=""
      />
      <div
        ref={containerRef}
        style={{ height: "100%", width: "100%", minHeight: "480px" }}
      />
    </>
  );
}

// ── Helper — add coloured circle markers with popups ─────────────────────────
function addPins(
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet namespace
  L: any,
  // biome-ignore lint/suspicious/noExplicitAny: Leaflet map
  map: any,
  reports: UserReportRecord[],
): void {
  for (const report of reports) {
    for (const geo of report.extractedLocationsGeo ?? []) {
      const colour = urgencyColour(report.urgencyLevel);

      const marker = L.circleMarker([geo.lat, geo.lng], {
        radius     : 10,
        fillColor  : colour,
        color      : "#fff",
        weight     : 2,
        opacity    : 1,
        fillOpacity: 0.85,
      });

      const urgencyEmoji =
        report.urgencyLevel === "Critical" || report.urgencyLevel === "High"
          ? "🔴"
          : report.urgencyLevel === "Medium"
            ? "🟠"
            : "🟢";

      // Popup content
      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;min-width:200px">
          <div style="font-weight:700;font-size:14px;margin-bottom:6px">
            📍 ${geo.name}
          </div>
          <div style="margin-bottom:4px">
            ${urgencyEmoji} <strong>Urgency:</strong> ${report.urgencyLevel ?? "Unknown"}
          </div>
          ${report.crisisType ? `<div style="margin-bottom:4px">⚠️ <strong>Type:</strong> ${report.crisisType}</div>` : ""}
          ${report.messageType ? `<div style="margin-bottom:4px">📋 <strong>Info:</strong> ${report.messageType.replace(/_/g, " ")}</div>` : ""}
          ${report.affectedCommunities.length > 0 ? `<div style="margin-bottom:4px">👥 <strong>Affected:</strong> ${report.affectedCommunities.join(", ")}</div>` : ""}
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b">
            ${new Date(report.createdAt).toLocaleString()}
          </div>
          <div style="margin-top:4px;font-size:11px;color:#94a3b8">
            ${report.message.slice(0, 100)}${report.message.length > 100 ? "…" : ""}
          </div>
        </div>
      `);

      marker.addTo(map);
    }
  }
}
