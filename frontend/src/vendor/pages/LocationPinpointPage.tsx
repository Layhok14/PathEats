import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import imgMapBg from "../../imports/LocationPinpointLight-2/0f478ac5ca927ac7d563427fb2c70efb55537682.png";
import svgPaths from "../../imports/LocationPinpointLight-2/svg-h5bymgvxa7";
import { useStalls } from "../../shared/hooks/useStalls";

// Centre of the map (Phnom Penh area)
const MAP_CENTER = { lat: 11.5564, lng: 104.9282 };
const MAP_RANGE = { lat: 0.12, lng: 0.18 }; // degrees visible across the map

function pinToCoords(xPct: number, yPct: number) {
  return {
    lat: parseFloat((MAP_CENTER.lat + (0.5 - yPct / 100) * MAP_RANGE.lat).toFixed(4)),
    lng: parseFloat((MAP_CENTER.lng + (xPct / 100 - 0.5) * MAP_RANGE.lng).toFixed(4)),
  };
}

function coordsToPin(lat: number, lng: number) {
  return {
    x: ((lng - MAP_CENTER.lng) / MAP_RANGE.lng + 0.5) * 100,
    y: (-(lat - MAP_CENTER.lat) / MAP_RANGE.lat + 0.5) * 100,
  };
}

// SVG pin icon (location marker)
function PinIcon() {
  return (
    <svg width="20" height="25" viewBox="0 0 20 25" fill="none">
      <path d={svgPaths.p27200f00} fill="white" />
    </svg>
  );
}

// Location icon for coordinates display
function LocationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 21.9 21.9" fill="none">
      <path d={svgPaths.p3488f2a0} fill="#565E74" />
    </svg>
  );
}

export function LocationPinpointPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getStall, updateStall } = useStalls();

  const stall = id ? getStall(id) : null;

  // Initial pin position from stall's saved coordinates
  const initialPin = stall
    ? coordsToPin(stall.location.latitude, stall.location.longitude)
    : { x: 50, y: 45 };

  const [pin, setPin] = useState(initialPin);
  const [dragging, setDragging] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const coords = pinToCoords(pin.x, pin.y);

  function getRelativePos(e: React.MouseEvent | MouseEvent) {
    const rect = mapRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    };
  }

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if (dragging) return;
    setPin(getRelativePos(e));
  }

  function onPinMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    setDragging(true);
  }

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !mapRef.current) return;
    setPin(getRelativePos(e));
  }, [dragging]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging, onMouseMove, onMouseUp]);

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
    <div
      className="relative overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* ── Map area ── */}
      <div
        ref={mapRef}
        className="absolute inset-0"
        style={{
          background: "#eff4ff",
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,0.05) 2.5%, rgba(0,0,0,0) 2.5%), linear-gradient(rgba(0,0,0,0.05) 2.5%, rgba(0,0,0,0) 2.5%), linear-gradient(90deg, rgb(226,232,240) 0%, rgb(226,232,240) 100%)",
          cursor: dragging ? "grabbing" : "crosshair",
        }}
        onClick={handleMapClick}
      >
        {/* Map background image */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ mixBlendMode: "multiply", opacity: 0.6 }}
        >
          <img
            alt="map"
            src={imgMapBg}
            style={{ position: "absolute", top: "-2.08%", left: 0, width: "100%", height: "104.17%", maxWidth: "none" }}
          />
        </div>

        {/* Draggable pin */}
        <div
          style={{
            position: "absolute",
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            transform: "translate(-50%, -100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: dragging ? "grabbing" : "grab",
            filter: "drop-shadow(0px 2px 1px rgba(0,0,0,0.06)) drop-shadow(0px 4px 1.5px rgba(0,0,0,0.07))",
            userSelect: "none",
          }}
          onMouseDown={onPinMouseDown}
        >
          {/* Green pin circle */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "9999px",
              background: "#006e2f",
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 1px 1px rgba(0,0,0,0.05)",
            }}
          >
            <PinIcon />
          </div>
          {/* Shadow dot below */}
          <div style={{ paddingTop: "4px", width: "8px", height: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "9999px",
                background: "rgba(11,28,48,0.3)",
                filter: "blur(0.5px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Floating action panel — bottom-left ── */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "32px",
          width: "400px",
          background: "#f8f9ff",
          borderRadius: "12px",
          border: "1px solid #bccbb9",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 10,
        }}
      >
        {/* Title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "20px", fontWeight: 500, color: "#0b1c30", margin: 0 }}>
            Set Stall Location
          </p>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", color: "#565e74", margin: 0, lineHeight: "24px" }}>
            Drag the pin to your stall's exact location on the path.
          </p>
        </div>

        {/* Coordinates display */}
        <div
          style={{
            background: "#e5eeff",
            border: "1px solid #bccbb9",
            borderRadius: "8px",
            padding: "17px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <LocationIcon />
          <div>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "#565e74", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 2px 0" }}>
              CURRENT SELECTION
            </p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500, color: "#0b1c30", margin: 0 }}>
              {coords.lat}° N, {coords.lng}° E
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ paddingTop: "12px", display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: "13px 17px",
              borderRadius: "4px",
              border: "1px solid #6d7b6c",
              background: "#f8f9ff",
              color: "#0b1c30",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: "13px 16px",
              borderRadius: "4px",
              border: "none",
              background: "#22c55e",
              color: "white",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0px 1px 1px rgba(0,0,0,0.05)",
            }}
          >
            Confirm Location
          </button>
        </div>
      </div>

      {/* Hint overlay */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.55)",
          color: "white",
          fontFamily: "Poppins, sans-serif",
          fontSize: "13px",
          padding: "7px 16px",
          borderRadius: "20px",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        Click anywhere on the map or drag the pin to set location
      </div>
    </div>
  );
}
