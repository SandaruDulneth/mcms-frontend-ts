"use client";

import { useEffect, useRef } from "react";
import type { UserReportRecord } from "@/types/user-report";

const URGENCY_COLOUR: Record<string, string> = {
  Critical: "#991b1b",
  High    : "#b91c1c",
  Medium  : "#d97706",
  Low     : "#15803d",
};

function urgencyColour(level?: string): string {
  return URGENCY_COLOUR[level ?? ""] ?? "#475569";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

interface DisasterMapProps {
  reports: UserReportRecord[];
}

export default function DisasterMap({ reports }: DisasterMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((L) => {
      // biome-ignore lint/suspicious/noExplicitAny: Leaflet internal
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl      : "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl    : "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [7.8731, 80.7718],
        zoom  : 7,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom    : 18,
      }).addTo(map);

      mapRef.current = map;
      addPins(L, map, reports);
    });

    return () => {
      if (mapRef.current) {
        // biome-ignore lint/suspicious/noExplicitAny: Leaflet map
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      // biome-ignore lint/suspicious/noExplicitAny: Leaflet map
      const map = mapRef.current as any;
      map.eachLayer((layer: unknown) => {
        // biome-ignore lint/suspicious/noExplicitAny: Leaflet layer
        if ((layer as any) instanceof L.Marker) map.removeLayer(layer);
      });
      addPins(L, map, reports);
    });
  }, [reports]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <div
        ref={containerRef}
        style={{ height: "100%", width: "100%", minHeight: "480px" }}
      />
    </>
  );
}

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

      const crisisType = report.crisisType ? escapeHtml(report.crisisType) : "";
      const messageType = report.messageType ? escapeHtml(report.messageType.replace(/_/g, " ")) : "";
      const affectedCommunities = report.affectedCommunities.length > 0
        ? escapeHtml(report.affectedCommunities.join(", "))
        : "";
      const messagePreview = escapeHtml(
        `${report.message.slice(0, 100)}${report.message.length > 100 ? "..." : ""}`,
      );
      const translatedPreview = report.wasTranslated && report.translatedText
        ? escapeHtml(`${report.translatedText.slice(0, 120)}${report.translatedText.length > 120 ? "..." : ""}`)
        : "";

      marker.bindPopup(`
        <div style="font-family:sans-serif;font-size:13px;min-width:200px">
          <div style="font-weight:700;font-size:14px;margin-bottom:6px">
            Location: ${escapeHtml(geo.name)}
          </div>
          <div style="margin-bottom:4px">
            <strong>Urgency:</strong> ${escapeHtml(report.urgencyLevel ?? "Unknown")}
          </div>
          ${crisisType ? `<div style="margin-bottom:4px"><strong>Type:</strong> ${crisisType}</div>` : ""}
          ${messageType ? `<div style="margin-bottom:4px"><strong>Info:</strong> ${messageType}</div>` : ""}
          ${affectedCommunities ? `<div style="margin-bottom:4px"><strong>Affected:</strong> ${affectedCommunities}</div>` : ""}
          ${report.wasTranslated && report.detectedLanguage ? `<div style="margin-bottom:4px"><strong>Language:</strong> ${escapeHtml(report.detectedLanguage)}</div>` : ""}
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid #e2e8f0;font-size:11px;color:#64748b">
            ${new Date(report.createdAt).toLocaleString()}
          </div>
          <div style="margin-top:4px;font-size:11px;color:#334155;font-weight:500">
            ${messagePreview}
          </div>
          ${translatedPreview ? `
            <div style="margin-top:4px;font-size:11px;color:#0369a1;font-style:italic;background:#f0f9ff;padding:4px 6px;border-radius:4px;border:1px solid #e0f2fe">
              <strong>EN:</strong> "${translatedPreview}"
            </div>
          ` : ""}
        </div>
      `);

      marker.addTo(map);
    }
  }
}