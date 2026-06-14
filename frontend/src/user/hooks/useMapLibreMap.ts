import { useRef, useEffect, useCallback, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { PHNOM_PENH_CENTER } from "../../shared/constants/appConfig";
import { scoreColor } from "../../shared/utils/geoUtils";

const TILE_URL = "https://tiles.openfreemap.org/styles/liberty";

export function useMapLibreMap({ darkMode, routePoints, routeReady, editRouteMode, scoredVendors, selectedVendorId, onSelectVendor, onWaypointAdded }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const routeSourceRef = useRef(null);
  const markersRef = useRef([]);
  const editModeRef = useRef(false);

  useEffect(() => { editModeRef.current = editRouteMode; }, [editRouteMode]);

  // Map init
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: TILE_URL,
      center: PHNOM_PENH_CENTER,
      zoom: 14,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    mapRef.current = map;
    map.on("load", () => setMapReady(true));
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Route line
  useEffect(() => {
    if (!mapReady || !mapRef.current || routePoints.length < 2) return;
    const map = mapRef.current;
    const coords = routePoints.map(([lat, lng]) => [lng, lat]);
    const geojson = { type: "Feature", geometry: { type: "LineString", coordinates: coords } };

    if (map.getSource("route")) {
      (map.getSource("route") as any).setData(geojson);
    } else {
      map.addSource("route", { type: "geojson", data: geojson as any });
      map.addLayer({ id: "route-line", type: "line", source: "route", paint: { "line-color": "#3B82F6", "line-width": 4, "line-opacity": 0.85 } });
    }
  }, [mapReady, routePoints]);

  // Vendor markers
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (!routeReady || editRouteMode) return;

    scoredVendors.forEach((v, i) => {
      const color = selectedVendorId === v.id ? "#3B82F6" : scoreColor(v.final_score);
      const el = document.createElement("div");
      el.className = "vendor-marker";
      el.innerHTML = `<div style="width:32px;height:32px;background:${color};border:2px solid rgba(255,255,255,0.9);border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 3px 12px rgba(0,0,0,0.5);"><span style="transform:rotate(45deg);color:white;font-size:12px;font-weight:800;font-family:system-ui;line-height:1;">${i+1}</span></div>`;
      el.addEventListener("click", () => onSelectVendor(v));
      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([v.lng, v.lat]).addTo(mapRef.current);
      markersRef.current.push(marker);
    });
  }, [mapReady, scoredVendors, selectedVendorId, routeReady, editRouteMode]);

  return { mapContainerRef, mapReady };
}
