import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import {
  PHNOM_PENH_CENTER,
  LIGHT_VECTOR_STYLE,
  DARK_VECTOR_STYLE,
} from "../../shared/constants/appConfig";
import { scoreColor } from "../../shared/utils/geoUtils";
import { PRICE_LABELS } from "../../shared/constants/appConfig";
import {
  attachMapContextRecovery,
  removeMapSafely,
  safeSetMapStyle,
} from "../../shared/utils/maplibreLifecycle";

const ROUTE_LAYER_ID = "route-line";
const ROUTE_HITBOX_LAYER_ID = "route-hitbox";

function styleUrl(dark) {
  return dark ? DARK_VECTOR_STYLE : LIGHT_VECTOR_STYLE;
}

function makeVendorElement(rank, score, selected, isFavorite) {
  const el = document.createElement("div");
  const bg = selected ? "#3B82F6" : scoreColor(score);
  el.style.width = "32px";
  el.style.height = "32px";
  el.style.background = bg;
  el.style.border = "2px solid rgba(255,255,255,0.9)";
  el.style.borderRadius = "50% 50% 50% 0";
  el.style.transform = "rotate(-45deg)";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.cursor = "pointer";

  // Build box-shadow: selection ring + favorite ring + drop shadow
  const shadows = [];
  if (selected) {
    shadows.push("0 0 0 4px rgba(59,130,246,0.35)");
  }
  if (isFavorite && !selected) {
    shadows.push("0 0 0 4px rgba(245,158,11,0.35)");
  }
  shadows.push("0 3px 12px rgba(0,0,0,0.5)");
  el.style.boxShadow = shadows.join(",");

  const span = document.createElement("span");
  span.style.transform = "rotate(45deg)";
  span.style.color = "white";
  span.style.fontSize = "12px";
  span.style.fontWeight = "800";
  span.style.fontFamily = "system-ui";
  span.style.lineHeight = "1";
  span.textContent = String(rank);
  el.appendChild(span);

  // Small star indicator for favorites
  if (isFavorite) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.style.position = "absolute";
    star.style.top = "-6px";
    star.style.right = "-6px";
    star.style.fontSize = "10px";
    star.style.color = "#f59e0b";
    star.style.transform = "rotate(45deg)";
    star.style.textShadow = "0 1px 3px rgba(0,0,0,0.4)";
    el.appendChild(star);
  }

  return el;
}

function makeEndpointElement(bg, label) {
  const el = document.createElement("div");
  el.style.width = "28px";
  el.style.height = "28px";
  el.style.background = bg;
  el.style.border = "3px solid white";
  el.style.borderRadius = "50%";
  el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.5)";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.color = "white";
  el.style.fontSize = "11px";
  el.style.fontWeight = "800";
  el.style.fontFamily = "system-ui";
  el.textContent = label;
  return el;
}

function makeUserLocationElement() {
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.width = "26px";
  wrapper.style.height = "26px";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.cursor = "default";
  wrapper.title = "Your current location";

  const ring = document.createElement("div");
  ring.style.position = "absolute";
  ring.style.inset = "0";
  ring.style.borderRadius = "999px";
  ring.style.background = "rgba(249,115,22,0.24)";
  ring.style.animation = "pulse-ring 1.8s ease-out infinite";

  const dot = document.createElement("div");
  dot.style.position = "relative";
  dot.style.width = "15px";
  dot.style.height = "15px";
  dot.style.borderRadius = "999px";
  dot.style.background = "#f97316";
  dot.style.border = "3px solid white";
  dot.style.boxShadow = "0 2px 10px rgba(124,45,18,0.35)";

  wrapper.appendChild(ring);
  wrapper.appendChild(dot);
  return wrapper;
}

export function useMaplibreMap({
  darkMode,
  routePoints,
  routeReady,
  editRouteMode,
  scoredVendors,
  selectedVendorId,
  onSelectVendor,
  onWaypointAdded,
  onEndpointDrag,
  debugPlaces = [],
  userLocation = null,
  favorites = new Set(),
}) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const vendorMarkersRef = useRef(new Map());
  const popupRef = useRef(null);
  const endpointMarkersRef = useRef([]);
  const ghostMarkerRef = useRef(null);
  const editModeRef = useRef(false);
  const routeListenersRef = useRef(null);
  const debugMarkersRef = useRef([]);
  const userMarkRef = useRef(null);
  const currentStyleUrlRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [styleVersion, setStyleVersion] = useState(0);
  const [mapRecovering, setMapRecovering] = useState(false);
  const selectedVendorRef = useRef(selectedVendorId);

  useEffect(() => {
    selectedVendorRef.current = selectedVendorId;
  }, [selectedVendorId]);

  useEffect(() => {
    editModeRef.current = editRouteMode;
  }, [editRouteMode]);

  // Initialize map
  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;
    const initialStyle = styleUrl(darkMode);
    const map = new maplibregl.Map({
      container: mapDivRef.current,
      style: initialStyle,
      center: [PHNOM_PENH_CENTER[1], PHNOM_PENH_CENTER[0]],
      zoom: 14,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;
    currentStyleUrlRef.current = initialStyle;

    const detachRecoveryHandlers = attachMapContextRecovery(map, {
      onLost: () => setMapRecovering(true),
      onRestored: () => {
        setMapRecovering(false);
        setMapReady(true);
        setStyleVersion((version) => version + 1);
      },
    });

    map.on("load", () => {
      setMapReady(true);
      setMapRecovering(false);
      map.resize();
      if (!document.getElementById("pl-pulse-style")) {
        const s = document.createElement("style");
        s.id = "pl-pulse-style";
        s.textContent = `@keyframes pulse-ring { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }`;
        document.head.appendChild(s);
      }
    });
    return () => {
      detachRecoveryHandlers();
      removeMapSafely(mapRef);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update style on darkMode toggle
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const nextStyle = styleUrl(darkMode);
    if (currentStyleUrlRef.current === nextStyle) return;

    return safeSetMapStyle(map, {
      nextStyle,
      currentStyleRef: currentStyleUrlRef,
      onStyleReady: () => setStyleVersion((version) => version + 1),
      onStyleError: (error) => {
        console.error("[useMaplibreMap] Failed to update map style:", error);
        setMapRecovering(false);
      },
    });
  }, [darkMode]);

  const toLngLat = (pt) => [pt[1], pt[0]];

  // Route polyline
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;

    // Cleanup previous listeners
    if (routeListenersRef.current) {
      const { mousemove, mousedown, mouseup, mouseleave, mapMouseMove, mapMouseUp } = routeListenersRef.current;
      map.off("mousemove", ROUTE_HITBOX_LAYER_ID, mousemove);
      map.off("mousedown", ROUTE_HITBOX_LAYER_ID, mousedown);
      map.off("mouseup", ROUTE_HITBOX_LAYER_ID, mouseup);
      map.off("mouseleave", ROUTE_HITBOX_LAYER_ID, mouseleave);
      map.off("mousemove", ROUTE_LAYER_ID, mousemove);
      map.off("mousedown", ROUTE_LAYER_ID, mousedown);
      map.off("mouseup", ROUTE_LAYER_ID, mouseup);
      map.off("mouseleave", ROUTE_LAYER_ID, mouseleave);
      map.off("mousemove", mapMouseMove);
      map.off("mouseup", mapMouseUp);
      routeListenersRef.current = null;
    }

    if (!routePoints || routePoints.length < 2) {
      if (map.getLayer(ROUTE_HITBOX_LAYER_ID)) map.removeLayer(ROUTE_HITBOX_LAYER_ID);
      if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
      if (map.getSource("route")) map.removeSource("route");
      return;
    }

    const coords = routePoints.map((p) => toLngLat(p));

    // Add or update route source+layer
    if (map.getSource("route")) {
      map.getSource("route").setData({
        type: "Feature",
        geometry: { type: "LineString", coordinates: coords },
      });
    } else {
      map.addSource("route", {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "LineString", coordinates: coords } },
      });
      map.addLayer({
        id: ROUTE_LAYER_ID,
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#3B82F6", "line-width": 4, "line-opacity": 0.85 },
      });
      map.addLayer({
        id: ROUTE_HITBOX_LAYER_ID,
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#000000", "line-width": 24, "line-opacity": 0 },
      });
    }

    // Endpoint markers
    endpointMarkersRef.current.forEach((m) => m.remove());
    endpointMarkersRef.current = [];
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (!first || !last || isNaN(first[0]) || isNaN(first[1]) || isNaN(last[0]) || isNaN(last[1])) {
      console.warn("[useMaplibreMap] Skipping endpoint markers — invalid coordinates");
      return;
    }
    const Ael = makeEndpointElement("#10b981", "A");
    const Bel = makeEndpointElement("#ef4444", "B");
    const A = new maplibregl.Marker(Ael, { draggable: editRouteMode }).setLngLat(first).addTo(map);
    const B = new maplibregl.Marker(Bel, { draggable: editRouteMode }).setLngLat(last).addTo(map);

    A.on("dragend", () => {
      if (onEndpointDrag) {
        const lngLat = A.getLngLat();
        onEndpointDrag("origin", lngLat.lat, lngLat.lng);
      }
    });
    B.on("dragend", () => {
      if (onEndpointDrag) {
        const lngLat = B.getLngLat();
        onEndpointDrag("dest", lngLat.lat, lngLat.lng);
      }
    });

    endpointMarkersRef.current = [A, B];

    // Ghost marker for hover when editing
    if (ghostMarkerRef.current) {
      ghostMarkerRef.current.remove();
      ghostMarkerRef.current = null;
    }
    const ghostEl = document.createElement("div");
    ghostEl.style.width = "14px";
    ghostEl.style.height = "14px";
    ghostEl.style.borderRadius = "50%";
    ghostEl.style.background = "#f59e0b";
    ghostEl.style.opacity = "0.85";
    ghostEl.style.border = "2px solid #f59e0b";
    const ghostMarker = new maplibregl.Marker(ghostEl).setLngLat(coords[0]);
    ghostMarkerRef.current = ghostMarker;

    let isDragging = false;

    const onMouseMove = (e) => {
      if (!editModeRef.current) return;
      map.getCanvas().style.cursor = isDragging ? "grabbing" : "grab";
      ghostMarker.setLngLat(e.lngLat);
      if (!ghostMarker._map) ghostMarker.addTo(map);
    };
    const onMouseDown = (e) => {
      if (!editModeRef.current) return;
      e.preventDefault?.();
      e.originalEvent?.preventDefault?.();
      isDragging = true;
      ghostMarker.setLngLat(e.lngLat);
      if (!ghostMarker._map) ghostMarker.addTo(map);
      map.getCanvas().style.cursor = "grabbing";
    };
    const onMouseUp = (e) => {
      if (!editModeRef.current || !isDragging) return;
      isDragging = false;
      onWaypointAdded(e.lngLat.lat, e.lngLat.lng);
      ghostMarker.remove();
    };
    const onMouseLeave = () => {
      if (isDragging) return;
      map.getCanvas().style.cursor = "";
      ghostMarker.remove();
    };

    const onMapMouseMove = (e) => {
      if (!editModeRef.current || !isDragging) return;
      map.getCanvas().style.cursor = "grabbing";
      ghostMarker.setLngLat(e.lngLat);
      if (!ghostMarker._map) ghostMarker.addTo(map);
    };

    const onMapMouseUp = (e) => {
      if (!editModeRef.current || !isDragging) return;
      isDragging = false;
      onWaypointAdded(e.lngLat.lat, e.lngLat.lng);
      ghostMarker.remove();
    };

    map.on("mousemove", ROUTE_HITBOX_LAYER_ID, onMouseMove);
    map.on("mousedown", ROUTE_HITBOX_LAYER_ID, onMouseDown);
    map.on("mouseup", ROUTE_HITBOX_LAYER_ID, onMouseUp);
    map.on("mouseleave", ROUTE_HITBOX_LAYER_ID, onMouseLeave);
    map.on("mousemove", onMapMouseMove);
    map.on("mouseup", onMapMouseUp);
    routeListenersRef.current = { mousemove: onMouseMove, mousedown: onMouseDown, mouseup: onMouseUp, mouseleave: onMouseLeave, mapMouseMove: onMapMouseMove, mapMouseUp: onMapMouseUp };

    // Fit bounds
    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new maplibregl.LngLatBounds(coords[0], coords[0]),
    );
    map.fitBounds(bounds, { padding: 40 });
  }, [mapReady, routePoints, styleVersion, editRouteMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Vendor markers — marker pool with ID-based diffing, popups, hover, and fly-to
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (!routeReady || editRouteMode) {
      vendorMarkersRef.current.forEach((entry) => entry.marker.remove());
      vendorMarkersRef.current.clear();
      if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }
      return;
    }

    const map = mapRef.current;
    const prev = vendorMarkersRef.current;
    const ids = new Set(scoredVendors.map((v) => v.id));
    const vendorMap = new Map(scoredVendors.map((v) => [v.id, v]));

    selectedVendorRef.current = selectedVendorId;

    // Remove stale markers
    prev.forEach((entry, id) => {
      if (!ids.has(id)) {
        entry.marker.remove();
        prev.delete(id);
      }
    });

    const bounds = new maplibregl.LngLatBounds();

    // Add/update current vendors
    scoredVendors.forEach((v, i) => {
      const existing = prev.get(v.id);
      const isSelected = selectedVendorId === v.id;
      const bg = isSelected ? "#3B82F6" : scoreColor(v.final_score);
      const lngLat = [v.lng, v.lat];

      const isFavorite = favorites.has(String(v.id));

      if (existing) {
        existing.marker.setLngLat(lngLat);
        const el = existing.marker.getElement();
        if (el.style.background !== bg) el.style.background = bg;
        const shadows = [];
        if (isSelected) shadows.push("0 0 0 4px rgba(59,130,246,0.35)");
        else if (isFavorite) shadows.push("0 0 0 4px rgba(245,158,11,0.35)");
        shadows.push("0 3px 12px rgba(0,0,0,0.5)");
        el.style.boxShadow = shadows.join(",");
        const span = el.querySelector("span");
        if (span) span.textContent = String(i + 1);
        // Update favorite star
        const starEl = el.querySelector("[data-fav-star]");
        if (isFavorite && !starEl) {
          const star = document.createElement("span");
          star.setAttribute("data-fav-star", "");
          star.textContent = "★";
          star.style.position = "absolute";
          star.style.top = "-6px";
          star.style.right = "-6px";
          star.style.fontSize = "10px";
          star.style.color = "#f59e0b";
          star.style.transform = "rotate(45deg)";
          star.style.textShadow = "0 1px 3px rgba(0,0,0,0.4)";
          el.appendChild(star);
        } else if (!isFavorite && starEl) {
          starEl.remove();
        }
        if (isSelected && selectedVendorId !== existing.lastFlewId) {
          map.flyTo({ center: lngLat, zoom: 16, duration: 600 });
          existing.lastFlewId = selectedVendorId;
        }
      } else {
        const el = makeVendorElement(i + 1, v.final_score, isSelected, isFavorite);
        const marker = new maplibregl.Marker(el).setLngLat(lngLat).addTo(map);

        // Hover
        el.addEventListener("mouseenter", () => {
          el.style.transform = "rotate(-45deg) scale(1.15)";
          el.style.transition = "transform 0.15s ease";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "rotate(-45deg) scale(1)";
        });

        // Click
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectVendor(v);
          if (popupRef.current) popupRef.current.remove();
          const overallScore = Math.round((v.final_score / 0.85) * 100);
          const popupHtml = `
            <div style="font-family:system-ui;padding:6px 8px;min-width:150px">
              <div style="font-weight:700;font-size:14px;margin-bottom:4px;color:#1e293b">${v.name}</div>
              <div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#64748b">
                <span>${v.cuisine}</span>
                <span>·</span>
                <span>${PRICE_LABELS[v.price_range]}</span>
                <span>·</span>
                <span style="font-weight:700;color:${scoreColor(v.final_score)}">${overallScore}</span>
              </div>
            </div>`;
          const popup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, offset: [0, -16] })
            .setLngLat(lngLat)
            .setHTML(popupHtml)
            .addTo(map);
          popupRef.current = popup;
          map.flyTo({ center: lngLat, zoom: 16, duration: 400 });
        });

        prev.set(v.id, { marker, lastFlewId: null });
      }

      bounds.extend(lngLat);
    });

    // Fit map to show all vendors on first load only
    if (scoredVendors.length > 0 && !bounds.isEmpty() && !selectedVendorId && !prev.size) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 16 });
    }
  }, [mapReady, scoredVendors, selectedVendorId, routeReady, editRouteMode, favorites]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debug places — grey dots for all vendors
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;

    debugMarkersRef.current.forEach((m) => m.remove());
    debugMarkersRef.current = [];

    if (debugPlaces.length === 0) return;

    debugPlaces.forEach((v) => {
      if (!v.lat || !v.lng) return;
      const dot = document.createElement("div");
      dot.style.width = "10px";
      dot.style.height = "10px";
      dot.style.borderRadius = "50%";
      dot.style.background = "#94a3b8";
      dot.style.border = "2px solid rgba(255,255,255,0.7)";
      dot.style.boxShadow = "0 1px 4px rgba(0,0,0,0.25)";
      dot.style.cursor = "default";
      const marker = new maplibregl.Marker(dot).setLngLat([v.lng, v.lat]).addTo(map);
      debugMarkersRef.current.push(marker);
    });
  }, [mapReady, debugPlaces]);

  // User location marker — blue dot
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;

    if (userMarkRef.current) {
      userMarkRef.current.remove();
      userMarkRef.current = null;
    }

    if (!userLocation) return;

    const marker = new maplibregl.Marker(makeUserLocationElement())
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(map);
    userMarkRef.current = marker;
  }, [mapReady, userLocation, styleVersion]);

  // Click on empty map area deselects the vendor
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;

    const handleClick = () => {
      if (!editModeRef.current && selectedVendorRef.current) {
        onSelectVendor(null);
      }
    };

    map.on("click", handleClick);
    return () => { map.off("click", handleClick); };
  }, [mapReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Lock/unlock map panning based on edit mode
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    if (editRouteMode) {
      map.dragPan.disable();
      map.boxZoom.disable();
      map.doubleClickZoom.disable();
      map.keyboard.disable();
      map.getCanvas().style.cursor = "default";
    } else {
      map.dragPan.enable();
      map.boxZoom.enable();
      map.doubleClickZoom.enable();
      map.keyboard.enable();
    }
  }, [editRouteMode, mapReady]);

  return { mapDivRef, mapReady, mapRecovering };
}
