import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStalls } from "../../shared/hooks/useStalls";
import { PHNOM_PENH_CENTER, LIGHT_VECTOR_STYLE } from "../../shared/constants/appConfig";

export function LocationPinpointPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getStall, updateStall } = useStalls();

  const stall = id ? getStall(id) : null;
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const initialLng = stall?.location?.longitude ?? 104.9282;
  const initialLat = stall?.location?.latitude ?? 11.5564;

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;

    const map = new maplibregl.Map({
      container: mapDivRef.current,
      style: LIGHT_VECTOR_STYLE,
      center: [initialLng, initialLat],
      zoom: 15,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;

    map.on("load", () => {
      const el = document.createElement("div");
      el.innerHTML = `<svg width="28" height="40" viewBox="0 0 24 40" fill="none"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 28 12 28s12-19 12-28C24 5.4 18.6 0 12 0z" fill="#006e2f" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`;
      el.style.cursor = "grab";
      el.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";

      const marker = new maplibregl.Marker({ element: el.firstElementChild as HTMLElement, draggable: true })
        .setLngLat([initialLng, initialLat])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setCoords({ lat: lngLat.lat, lng: lngLat.lng });
      });

      markerRef.current = marker;
    });

    map.on("click", (e) => {
      if (markerRef.current) {
        markerRef.current.setLngLat(e.lngLat);
        setCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  async function handleConfirm() {
    if (id && stall) {
      await updateStall(id, {
        ...stall,
        location: { ...stall.location, latitude: coords.lat, longitude: coords.lng },
      });
      toast.success("Location confirmed.");
    }
    navigate(-1);
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="relative overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
      {/* Map */}
      <div ref={mapDivRef} className="absolute inset-0" />

      {/* Floating action panel */}
      <div
        style={{
          position: "absolute", bottom: "32px", left: "32px", width: "400px",
          background: "#f8f9ff", borderRadius: "12px",
          border: "1px solid #bccbb9", padding: "25px",
          display: "flex", flexDirection: "column", gap: "16px", zIndex: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px", fontWeight: 500, color: "#0b1c30", margin: 0 }}>
            Set Stall Location
          </p>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#565e74", margin: 0, lineHeight: "24px" }}>
            Drag the pin or click on the map to set your stall's exact location.
          </p>
        </div>

        <div style={{
          background: "#e5eeff", border: "1px solid #bccbb9", borderRadius: "8px",
          padding: "17px", display: "flex", alignItems: "center", gap: "12px",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#565E74" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "#565e74", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 2px 0" }}>
              CURRENT SELECTION
            </p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500, color: "#0b1c30", margin: 0 }}>
              {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
            </p>
          </div>
        </div>

        <div style={{ paddingTop: "12px", display: "flex", gap: "12px", justifyContent: "center" }}>
          <button onClick={handleCancel}
            style={{
              flex: 1, padding: "13px 17px", borderRadius: "4px",
              border: "1px solid #6d7b6c", background: "#f8f9ff", color: "#0b1c30",
              fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500, cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button onClick={handleConfirm}
            style={{
              flex: 1, padding: "13px 16px", borderRadius: "4px", border: "none",
              background: "#22c55e", color: "white", fontFamily: "Poppins, sans-serif",
              fontSize: "14px", fontWeight: 700, cursor: "pointer",
              boxShadow: "0px 1px 1px rgba(0,0,0,0.05)",
            }}
          >
            Confirm Location
          </button>
        </div>
      </div>

      {/* Hint */}
      <div
        style={{
          position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.55)", color: "white", fontFamily: "Poppins, sans-serif",
          fontSize: "13px", padding: "7px 16px", borderRadius: "20px",
          pointerEvents: "none", zIndex: 10,
        }}
      >
        Drag the pin or click on the map to set location
      </div>
    </div>
  );
}
