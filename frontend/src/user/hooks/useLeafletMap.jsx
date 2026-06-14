// Encapsulates all Leaflet lifecycle: init, tile swapping, route drawing, vendor markers.

import { useRef, useEffect, useCallback, useState } from "react";
import L from "leaflet";
import {
  PHNOM_PENH_CENTER,
  ROADMAP_TILE,
  DARK_TILE,
} from "../../shared/constants/appConfig";
import { scoreColor } from "../../shared/utils/geoUtils";

// Factories called inside effects — never at module level so Leaflet DOM is ready
function makeVendorIcon(rank, score, selected) {
  const bg = selected ? "#3B82F6" : scoreColor(score);
  const shadow = selected
    ? "box-shadow:0 0 0 4px rgba(59,130,246,0.35),0 3px 12px rgba(0,0,0,0.6);"
    : "box-shadow:0 3px 12px rgba(0,0,0,0.5);";
  return L.divIcon({
    className: "",
    html: `<div style="width:32px;height:32px;background:${bg};border:2px solid rgba(255,255,255,0.9);border-radius:50% 50% 50% 0;transform:rotate(-45deg);${shadow}display:flex;align-items:center;justify-content:center;cursor:pointer;"><span style="transform:rotate(45deg);color:white;font-size:12px;font-weight:800;font-family:system-ui;line-height:1;">${rank}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [4, 32],
  });
}

function makeEndpointIcon(bg, label) {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;background:${bg};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:800;font-family:system-ui;">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export function useLeafletMap({
  darkMode,
  routePoints,
  routeReady,
  editRouteMode,
  scoredVendors,
  selectedVendorId,
  onSelectVendor,
  onWaypointAdded,
}) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const tileRef = useRef(null);
  const routeLayerRef = useRef(null);
  const vendorMarkersRef = useRef([]);
  const endpointMarkersRef = useRef([]);
  const ghostRef = useRef(null);
  const editModeRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    editModeRef.current = editRouteMode;
  }, [editRouteMode]);

  // Map init — runs once after the div mounts
  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;
    const map = L.map(mapDivRef.current, {
      zoomControl: false,
      attributionControl: false,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    const tile = L.tileLayer(darkMode ? DARK_TILE : ROADMAP_TILE, {
      maxZoom: 19,
    }).addTo(map);
    map.setView(PHNOM_PENH_CENTER, 14);
    mapRef.current = map;
    tileRef.current = tile;
    setMapReady(true);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    tileRef.current?.setUrl(darkMode ? DARK_TILE : ROADMAP_TILE);
  }, [darkMode]);

  // Route polyline + draggable endpoint markers
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    routeLayerRef.current?.remove();
    endpointMarkersRef.current.forEach((m) => m.remove());
    endpointMarkersRef.current = [];
    ghostRef.current?.remove();
    if (routePoints.length < 2) return;

    const line = L.polyline(routePoints, {
      color: "#3B82F6",
      weight: 4,
      opacity: 0.85,
    }).addTo(map);
    routeLayerRef.current = line;

    // Icons created here so Leaflet is guaranteed to be DOM-ready
    const A = L.marker(routePoints[0], {
      icon: makeEndpointIcon("#10b981", "A"),
      draggable: true,
    }).addTo(map);
    const B = L.marker(routePoints[routePoints.length - 1], {
      icon: makeEndpointIcon("#ef4444", "B"),
      draggable: true,
    }).addTo(map);
    endpointMarkersRef.current = [A, B];

    const ghost = L.circleMarker(routePoints[0], {
      radius: 7,
      color: "#3B82F6",
      fillColor: "#3B82F6",
      fillOpacity: 0.5,
      weight: 2,
    });
    line.on("mousemove", (e) => {
      if (!editModeRef.current) return;
      ghost.setLatLng(e.latlng);
      if (!map.hasLayer(ghost)) ghost.addTo(map);
    });
    line.on("mouseout", () => ghost.remove());
    line.on("click", (e) => {
      if (editModeRef.current) onWaypointAdded(e.latlng.lat, e.latlng.lng);
    });
    ghostRef.current = ghost;

    map.fitBounds(line.getBounds(), { padding: [40, 40] });
  }, [mapReady, routePoints]); // eslint-disable-line react-hooks/exhaustive-deps

  // Vendor pin markers
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    vendorMarkersRef.current.forEach((m) => m.remove());
    vendorMarkersRef.current = [];
    if (!routeReady || editRouteMode) return;

    scoredVendors.forEach((v, i) => {
      const icon = makeVendorIcon(
        i + 1,
        v.final_score,
        selectedVendorId === v.id,
      );
      const marker = L.marker([v.lat, v.lng], { icon })
        .addTo(mapRef.current)
        .on("click", () => onSelectVendor(v));
      vendorMarkersRef.current.push(marker);
    });
  }, [mapReady, scoredVendors, selectedVendorId, routeReady, editRouteMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWaypointAdded = useCallback(
    (lat, lng) => {
      onWaypointAdded(lat, lng);
    },
    [onWaypointAdded],
  );

  return { mapDivRef, mapReady };
}
