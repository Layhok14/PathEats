import { useEffect, useMemo, useRef } from "react";
import { MapPin } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LIGHT_VECTOR_STYLE } from "../../shared/constants/appConfig";
import type { Stall } from "../../shared/types";

interface StallMapViewProps {
  stalls: Stall[];
  loading?: boolean;
  onPinClick: (id: string) => void;
}

export function StallMapView({ stalls, loading = false, onPinClick }: StallMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const mappableStalls = useMemo(() => stalls.filter((stall) =>
    Number.isFinite(stall.location?.latitude) &&
    Number.isFinite(stall.location?.longitude)
  ), [stalls]);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mappableStalls.length === 0) return;

    if (!mapRef.current) {
      const first = mappableStalls[0];
      mapRef.current = new maplibregl.Map({
        container,
        style: LIGHT_VECTOR_STYLE,
        center: [first.location.longitude, first.location.latitude],
        zoom: 13,
        attributionControl: false,
      });
      mapRef.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    }

    const map = mapRef.current;
    if (!map) return;
    let cancelled = false;

    const refreshMarkers = () => {
      if (cancelled) return;

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const bounds = new maplibregl.LngLatBounds();
      mappableStalls.forEach((stall) => {
        const el = document.createElement("div");
        const isOpen = stall.status === "open";
        const color = isOpen ? "#006e2f" : "#d4183d";
        el.innerHTML = `<svg width="28" height="36" viewBox="0 0 24 36" fill="none"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 28 12 28s12-19 12-28C24 5.4 18.6 0 12 0z" fill="${color}" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`;
        const markerElement = el.firstElementChild as HTMLElement;
        markerElement.style.cursor = "pointer";
        markerElement.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";
        markerElement.title = stall.name;
        markerElement.addEventListener("click", () => onPinClick(stall.id));

        const lngLat: [number, number] = [stall.location.longitude, stall.location.latitude];
        const marker = new maplibregl.Marker({ element: markerElement })
          .setLngLat(lngLat)
          .addTo(map);

        bounds.extend(lngLat);
        markersRef.current.push(marker);
      });

      if (mappableStalls.length === 1) {
        const only = mappableStalls[0];
        map.setCenter([only.location.longitude, only.location.latitude]);
        map.setZoom(14);
      } else {
        map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 0 });
      }
      map.resize();
    };

    if (map.loaded()) {
      refreshMarkers();
    } else {
      map.once("load", refreshMarkers);
    }

    return () => {
      cancelled = true;
      map.off("load", refreshMarkers);
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [mappableStalls, onPinClick]);

  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mappableStalls.length > 0) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    mapRef.current?.remove();
    mapRef.current = null;
  }, [mappableStalls.length]);

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 rounded-[var(--radius-lg)] border"
        style={{ background: "var(--muted)", borderColor: "var(--border)" }}
      >
        <div className="w-6 h-6 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
          Loading stalls from database...
        </p>
      </div>
    );
  }

  if (stalls.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 rounded-[var(--radius-lg)] border"
        style={{ background: "var(--muted)", borderColor: "var(--border)" }}
      >
        <MapPin size={36} style={{ color: "var(--muted-foreground)" }} />
        <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
          No stalls to display on map.
        </p>
      </div>
    );
  }

  if (mappableStalls.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 rounded-[var(--radius-lg)] border"
        style={{ background: "var(--muted)", borderColor: "var(--border)" }}
      >
        <MapPin size={36} style={{ color: "var(--muted-foreground)" }} />
        <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
          No pinned stall locations match this view.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div
        className="flex items-center gap-5 px-4 py-2 border-b text-xs"
        style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--muted-foreground)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#006e2f" }} />
          Open
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "#d4183d" }} />
          Closed
        </div>
        <span className="ml-auto">Click a pin to manage the stall</span>
      </div>
      <div ref={mapContainerRef} className="w-full min-h-[360px] md:min-h-[420px]" />
    </div>
  );
}
