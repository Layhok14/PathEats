import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Check } from "lucide-react";
import { PhotoUpload } from "../components/PhotoUpload";
import { toast } from "sonner";
import { MenuItemSelector } from "../components/MenuItemSelector";
import { StepIndicator } from "../components/StepIndicator";
import { useStalls } from "../../shared/hooks/useStalls";
import { useMenuItems } from "../../shared/hooks/useMenuItems";
import { formatPrice } from "../../shared/utils/formatters";
import { STALL_CATEGORIES } from "../../shared/constants/categories";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LIGHT_VECTOR_STYLE } from "../../shared/constants/appConfig";
import type { StallFormData, StallCategory } from "../../shared/types";

const STEPS = [{ label: "Stall Info" }, { label: "Menu Items" }, { label: "Review" }];
const EMPTY: StallFormData = {
  name: "", photoUrl: "",   category: "Rice", description: "",
  operatingHours: { weekdays: { open: "09:00 AM", close: "09:00 PM" }, weekends: { open: "10:00 AM", close: "08:00 PM" } },
  status: "open", location: { landmark: "", latitude: 11.5564, longitude: 104.9282 }, menuItemIds: [],
};

function to12h(t: string) {
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr);
  const p = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12; if (h === 0) h = 12;
  return `${String(h).padStart(2, "0")}:${mStr} ${p}`;
}
function to24h(t: string) {
  const m = t.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!m) return "09:00";
  let h = parseInt(m[1]);
  if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
  if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

// Step 1: Stall Info form — has inline MapLibre map with draggable pin
function StallInfoForm({ form, onChange }: { form: StallFormData; onChange: (f: StallFormData) => void }) {
  const inp: React.CSSProperties = { width: "100%", border: "1px solid var(--brand-input-border)", borderRadius: "4px", padding: "10px 14px", fontSize: "14px", fontFamily: "Poppins, sans-serif", color: "var(--brand-text-dark)", background: "var(--card)", outline: "none" };
  const lbl: React.CSSProperties = { fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 500, color: "var(--brand-text-dark)", display: "block", marginBottom: "6px" };

  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;
    const map = new maplibregl.Map({
      container: mapDivRef.current,
      style: LIGHT_VECTOR_STYLE,
      center: [form.location.longitude, form.location.latitude],
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
        .setLngLat([form.location.longitude, form.location.latitude])
        .addTo(map);
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        onChange({ ...form, location: { ...form.location, latitude: lngLat.lat, longitude: lngLat.lng } });
      });
      markerRef.current = marker;
    });
    map.on("click", (e) => {
      if (markerRef.current) {
        markerRef.current.setLngLat(e.lngLat);
        onChange({ ...form, location: { ...form.location, latitude: e.lngLat.lat, longitude: e.lngLat.lng } });
      }
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label style={lbl}>Stall Name *</label>
        <input type="text" required placeholder="e.g. Spice & Wok Haven" value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} style={inp} />
      </div>
      <div>
        <label style={lbl}>Stall Photo</label>
        <PhotoUpload
          value={form.photoUrl}
          onChange={(url) => onChange({ ...form, photoUrl: url })}
          label="Click or drag to upload stall photo"
        />
      </div>
      <div>
        <label style={lbl}>Primary Category</label>
        <div className="flex flex-wrap gap-2">
          {STALL_CATEGORIES.map((cat) => {
            const sel = form.category === cat;
            return <button key={cat} type="button" onClick={() => onChange({ ...form, category: cat as StallCategory })} style={{ padding: "5px 14px", borderRadius: "9999px", border: sel ? "none" : "1px solid var(--brand-card-border)", background: sel ? "var(--brand-green)" : "var(--card)", color: sel ? "white" : "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "13px", cursor: "pointer" }}>{cat}</button>;
          })}
        </div>
      </div>
      <div>
        <label style={lbl}>Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} style={{ ...inp, resize: "vertical" }} placeholder="Describe your stall..." />
      </div>

      {/* Operating Hours */}
      <div>
        <label style={lbl}>Operating Hours</label>
        {(["weekdays", "weekends"] as const).map((part) => (
          <div key={part} className="flex items-center gap-3 mb-2">
            <span style={{ width: "90px", fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", flexShrink: 0 }}>{part === "weekdays" ? "Mon–Fri" : "Sat–Sun"}</span>
            <input type="time" value={to24h(form.operatingHours[part].open)} onChange={(e) => onChange({ ...form, operatingHours: { ...form.operatingHours, [part]: { ...form.operatingHours[part], open: to12h(e.target.value) } } })} style={{ ...inp, flex: 1, width: "auto", padding: "8px 10px" }} />
            <span style={{ color: "var(--brand-text-muted)" }}>-</span>
            <input type="time" value={to24h(form.operatingHours[part].close)} onChange={(e) => onChange({ ...form, operatingHours: { ...form.operatingHours, [part]: { ...form.operatingHours[part], close: to12h(e.target.value) } } })} style={{ ...inp, flex: 1, width: "auto", padding: "8px 10px" }} />
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange({ ...form, status: form.status === "open" ? "closed" : "open" })} style={{ width: "44px", height: "24px", borderRadius: "9999px", border: "none", background: form.status === "open" ? "var(--brand-green)" : "#cbced4", cursor: "pointer", position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: "2px", left: form.status === "open" ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "9999px", background: "white", transition: "left 0.2s" }} />
        </button>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-dark)" }}>Currently {form.status === "open" ? "Open" : "Closed"}</span>
      </div>

      {/* Location */}
      <div>
        <label style={{ ...lbl, marginBottom: "10px" }}>Location</label>
        <div ref={mapDivRef} style={{
          height: "180px", borderRadius: "8px", border: "1px solid var(--brand-card-border)",
          marginBottom: "10px", position: "relative", overflow: "hidden",
        }} />
        <input type="text" placeholder="Landmark / Station" value={form.location.landmark} onChange={(e) => onChange({ ...form, location: { ...form.location, landmark: e.target.value } })} style={{ ...inp, marginBottom: "8px" }} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={lbl}>Latitude</label>
            <input type="number" step="0.0001" value={form.location.latitude} onChange={(e) => onChange({ ...form, location: { ...form.location, latitude: parseFloat(e.target.value) || 0 } })} style={inp} />
          </div>
          <div>
            <label style={lbl}>Longitude</label>
            <input type="number" step="0.0001" value={form.location.longitude} onChange={(e) => onChange({ ...form, location: { ...form.location, longitude: parseFloat(e.target.value) || 0 } })} style={inp} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function StallCreatePage() {
  const navigate = useNavigate();
  const { createStall, loading } = useStalls();
  const { allItems } = useMenuItems();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<StallFormData>(EMPTY);

  function toggleItem(id: string) {
    setForm((f) => ({ ...f, menuItemIds: f.menuItemIds.includes(id) ? f.menuItemIds.filter((x) => x !== id) : [...f.menuItemIds, id] }));
  }

  async function handleConfirm() {
    try {
      await createStall(form);
      toast.success(`"${form.name}" registered successfully!`);
      navigate("/vendor/stalls");
    } catch {
      toast.error("Failed to register stall. Check your connection and try again.");
    }
  }

  const selectedItems = allItems.filter((i) => form.menuItemIds.includes(i.id));
  const cardStyle: React.CSSProperties = { background: "var(--card)", border: "1px solid var(--brand-card-border)", borderRadius: "10px", padding: "24px" };
  const btnPrimary: React.CSSProperties = { padding: "11px 24px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" };
  const btnOutline: React.CSSProperties = { padding: "11px 24px", borderRadius: "6px", border: "1px solid var(--brand-card-border)", background: "var(--card)", color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "14px", cursor: "pointer" };

  return (
    <div className="p-6 flex flex-col gap-5 max-w-3xl">
      <button onClick={() => navigate("/vendor/stalls")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
        <ChevronLeft size={16} /> Back to My Stalls
      </button>

      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "26px", fontWeight: 700, color: "var(--brand-text-dark)" }}>Register New Stall</h1>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginTop: "4px" }}>Set up your stall details, pin your location, and pick menu items.</p>
      </div>

      <StepIndicator steps={STEPS} currentStep={step} />

      <div style={cardStyle}>
        {step === 0 && (
          <>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "20px" }}>Stall Information</h2>
            <StallInfoForm form={form} onChange={setForm} />
          </>
        )}

        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "6px" }}>Select Menu Items</h2>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginBottom: "20px" }}>Choose items for your stall. You can change these anytime.</p>
            <MenuItemSelector selectedIds={form.menuItemIds} onToggle={toggleItem} />
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "20px" }}>Review & Confirm</h2>
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border p-4 flex flex-col gap-2" style={{ borderColor: "var(--brand-card-border)" }}>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "11px", color: "var(--brand-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Stall Details</p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)" }}>{form.name || "—"}</p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>{form.category} · {form.status === "open" ? "Open" : "Closed"}</p>
                {form.description && <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>{form.description}</p>}
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>📍 {form.location.landmark || "No landmark"} · {form.location.latitude.toFixed(4)}°N, {form.location.longitude.toFixed(4)}°E</p>
              </div>
              <div className="rounded-lg border p-4 flex flex-col gap-2" style={{ borderColor: "var(--brand-card-border)" }}>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "11px", color: "var(--brand-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Menu Items ({selectedItems.length})</p>
                {selectedItems.length === 0 ? (
                  <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>None selected</p>
                ) : selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-dark)" }}>{item.name}</span>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between">
        <button style={btnOutline} onClick={() => step === 0 ? navigate("/vendor/stalls") : setStep(step - 1)}>
          {step === 0 ? "Cancel" : "Back"}
        </button>
        {step < 2 ? (
          <button style={{ ...btnPrimary, opacity: step === 0 && !form.name.trim() ? 0.5 : 1, cursor: step === 0 && !form.name.trim() ? "not-allowed" : "pointer" }} onClick={() => setStep(step + 1)} disabled={step === 0 && !form.name.trim()}>
            {step === 0 ? "Next: Select Menu Items" : "Review & Confirm"}
          </button>
        ) : (
          <button style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: "8px" }} onClick={handleConfirm} disabled={loading}>
            <Check size={16} /> {loading ? "Registering..." : "Confirm & Register Stall"}
          </button>
        )}
      </div>
    </div>
  );
}
