import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import type { Stall } from "../../shared/types";

interface StallMapViewProps {
  stalls: Stall[];
  onPinClick: (id: string) => void;
}

// Normalises lat/lng coordinates to canvas pixel positions
function toCanvasCoords(
  lat: number,
  lng: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
  padding: number
): { x: number; y: number } {
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;
  const x = padding + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * usableW;
  // Latitude increases northward but canvas y increases downward — invert
  const y = padding + (1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * usableH;
  return { x, y };
}

export function StallMapView({ stalls, onPinClick }: StallMapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Store pin hit areas so click handler can identify which stall was clicked
  const pinsRef = useRef<{ id: string; x: number; y: number; r: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const PADDING = 40;

    const lats = stalls.map((s) => s.location.latitude);
    const lngs = stalls.map((s) => s.location.longitude);
    const bounds = {
      minLat: Math.min(...lats) - 0.01,
      maxLat: Math.max(...lats) + 0.01,
      minLng: Math.min(...lngs) - 0.01,
      maxLng: Math.max(...lngs) + 0.01,
    };

    // Background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue("--muted")
      .trim() || "#ececf0";
    ctx.fillRect(0, 0, W, H);

    // Light grid lines to hint at a map
    ctx.strokeStyle = "rgba(0,0,0,0.07)";
    ctx.lineWidth = 1;
    for (let gx = PADDING; gx < W - PADDING; gx += 60) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    for (let gy = PADDING; gy < H - PADDING; gy += 60) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    }

    const pins: typeof pinsRef.current = [];
    const primary = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim() || "#030213";
    const destructive = getComputedStyle(document.documentElement)
      .getPropertyValue("--destructive")
      .trim() || "#d4183d";

    stalls.forEach((stall) => {
      const { x, y } = toCanvasCoords(
        stall.location.latitude,
        stall.location.longitude,
        bounds,
        W,
        H,
        PADDING
      );
      const r = 14;
      const color = stall.status === "open" ? primary : destructive;

      // Pin circle
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // White dot centre
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();

      // Label
      ctx.fillStyle = "#333";
      ctx.font = "11px Poppins, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(stall.name, x, y + r + 14);

      pins.push({ id: stall.id, x, y, r });
    });

    pinsRef.current = pins;
  }, [stalls]);

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = pinsRef.current.find(
      (p) => Math.hypot(mx - p.x, my - p.y) <= p.r + 6
    );
    if (hit) onPinClick(hit.id);
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

  return (
    <div className="rounded-[var(--radius-lg)] border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      {/* Legend */}
      <div
        className="flex items-center gap-5 px-4 py-2 border-b text-xs"
        style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--muted-foreground)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--primary)" }} />
          Open
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: "var(--destructive)" }} />
          Closed
        </div>
        <span className="ml-auto">Click a pin to manage the stall</span>
      </div>
      <canvas
        ref={canvasRef}
        width={900}
        height={420}
        className="w-full cursor-pointer"
        style={{ display: "block" }}
        onClick={handleClick}
        aria-label="Stall map"
      />
    </div>
  );
}
