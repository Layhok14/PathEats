import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useStalls } from "../../shared/hooks/useStalls";
import { SuccessModal } from "../../shared/components/SuccessModal";
import { PHNOM_PENH_CENTER, LIGHT_VECTOR_STYLE } from "../../shared/constants/appConfig";

export function LocationPinpointPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { getStall, updateStall, stalls } = useStalls();
  const [showSuccess, setShowSuccess] = useState(false);

  const isCreateMode = !id;
  const stall = id ? getStall(id) : null;

  const initialLat = isCreateMode
    ? parseFloat(searchParams.get("lat") || "11.5564")
    : stall?.location?.latitude ?? 11.5564;
  const initialLng = isCreateMode
    ? parseFloat(searchParams.get("lng") || "104.9282")
    : stall?.location?.longitude ?? 104.9282;

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const otherMarkersRef = useRef<maplibregl.Marker[]>([]);

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

      map.on("click", (e) => {
        if (markerRef.current) {
          markerRef.current.setLngLat(e.lngLat);
          setCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        }
      });
    });

    return () => {
      otherMarkersRef.current.forEach((m) => m.remove());
      otherMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;
    const refreshOtherMarkers = () => {
      if (cancelled) return;

      otherMarkersRef.current.forEach((m) => m.remove());
      otherMarkersRef.current = [];

      stalls.forEach((s) => {
        if (s.id === id) return;
        if (!Number.isFinite(s.location?.latitude) || !Number.isFinite(s.location?.longitude)) return;
        const dot = document.createElement("div");
        dot.style.width = "12px";
        dot.style.height = "12px";
        dot.style.borderRadius = "50%";
        dot.style.background = "#94a3b8";
        dot.style.border = "2px solid white";
        dot.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
        const m = new maplibregl.Marker(dot)
          .setLngLat([s.location.longitude, s.location.latitude])
          .addTo(map);
        otherMarkersRef.current.push(m);
      });
    };

    if (map.loaded()) {
      refreshOtherMarkers();
    } else {
      map.once("load", refreshOtherMarkers);
    }

    return () => {
      cancelled = true;
      map.off("load", refreshOtherMarkers);
      otherMarkersRef.current.forEach((m) => m.remove());
      otherMarkersRef.current = [];
    };
  }, [stalls, id]);

  useEffect(() => {
    if (isCreateMode || !stall) return;
    const nextCoords = {
      lat: stall.location?.latitude ?? 11.5564,
      lng: stall.location?.longitude ?? 104.9282,
    };

    setCoords(nextCoords);
    markerRef.current?.setLngLat([nextCoords.lng, nextCoords.lat]);
    mapRef.current?.setCenter([nextCoords.lng, nextCoords.lat]);
  }, [isCreateMode, stall]);

  async function handleConfirm() {
    try {
      if (isCreateMode) {
        sessionStorage.setItem("stall_create_location", JSON.stringify(coords));
        navigate("/vendor/stalls/new");
      } else if (id && stall) {
        await updateStall(id, {
          ...stall,
          location: { ...stall.location, latitude: coords.lat, longitude: coords.lng },
        });
        setShowSuccess(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not update stall location.");
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="relative overflow-hidden" style={{ height: "100%" }}>
      <div ref={mapDivRef} className="absolute inset-0" />

      <div
        className="absolute left-4 right-4 bottom-4 z-10 sm:left-8 sm:right-auto sm:bottom-8 sm:w-[400px]"
        style={{
          background: "#f8f9ff", borderRadius: "12px",
          border: "1px solid #bccbb9", padding: "25px",
          display: "flex", flexDirection: "column", gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px", fontWeight: 500, color: "#0b1c30", margin: 0 }}>
            {isCreateMode ? "Set Location" : "Set Stall Location"}
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
              {coords.lat.toFixed(4)}\u00b0 N, {coords.lng.toFixed(4)}\u00b0 E
            </p>
          </div>
        </div>

        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "11px", color: "#94a3b8", fontStyle: "italic", margin: 0 }}>
          Grey dots show your other stalls.
        </p>

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
            {isCreateMode ? "Use This Location" : "Confirm Location"}
          </button>
        </div>
      </div>

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

      {showSuccess && (
        <SuccessModal
          message="Location confirmed successfully!"
          onContinue={() => setShowSuccess(false)}
          onGoBack={() => { if (id) { navigate("/vendor/stalls"); } else { navigate(-1); } }}
          backLabel="Go to My Stalls"
        />
      )}
    </div>
  );
}
