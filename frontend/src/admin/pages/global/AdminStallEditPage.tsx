import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, Check, MapPin } from "lucide-react";
import { PhotoUpload } from "../../../vendor/components/PhotoUpload";
import { SuccessModal } from "../../../shared/components/SuccessModal";
import { toast } from "sonner";
import { MenuItemSelector } from "../../../vendor/components/MenuItemSelector";
import { StepIndicator } from "../../../vendor/components/StepIndicator";
import { useStalls } from "../../../shared/hooks/useStalls";
import { useMenuItems } from "../../../shared/hooks/useMenuItems";
import { formatPrice } from "../../../shared/utils/formatters";
import { getStallManagementOptions, type StallManagementOptions } from "../../services/adminDashboardService";
import { STALL_CATEGORIES } from "../../../shared/constants/categories";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LIGHT_VECTOR_STYLE } from "../../../shared/constants/appConfig";
import type { StallFormData } from "../../../shared/types";

const STEPS = [{ label: "Stall Info" }, { label: "Menu Items" }, { label: "Location" }, { label: "Review" }];

function to12h(t: string) {
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr);
  const p = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
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

function StallInfoForm({ form, onChange, vendors, categories }: { form: StallFormData; onChange: (f: StallFormData) => void; vendors: Array<{ id: string; name: string; email: string }>; categories: Array<{ id: string; name: string }> }) {
  const inp: React.CSSProperties = { width: "100%", border: "1px solid var(--brand-input-border)", borderRadius: "4px", padding: "10px 14px", fontSize: "14px", fontFamily: "Poppins, sans-serif", color: "var(--brand-text-dark)", background: "var(--card)", outline: "none" };
  const lbl: React.CSSProperties = { fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 500, color: "var(--brand-text-dark)", display: "block", marginBottom: "6px" };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label style={lbl}>Vendor (Owner) *</label>
        <select required value={form.vendorId || ""} onChange={(e) => onChange({ ...form, vendorId: e.target.value })} style={inp}>
          <option value="">Select vendor...</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>{v.name} ({v.email})</option>
          ))}
        </select>
      </div>
      <div>
        <label style={lbl}>Stall Name *</label>
        <input required placeholder="e.g. Spice & Wok Haven" value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} style={inp} />
      </div>
      <div>
        <label style={lbl}>Stall Photo</label>
        <PhotoUpload value={form.photoUrl} onChange={(url) => onChange({ ...form, photoUrl: url })} label="Click or drag to upload stall photo" />
      </div>
      <div>
        <label style={lbl}>Primary Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const sel = form.category === cat.name;
            return <button key={cat.id} type="button" onClick={() => onChange({ ...form, category: cat.name as StallCategory })} style={{ padding: "5px 14px", borderRadius: "9999px", border: sel ? "none" : "1px solid var(--brand-card-border)", background: sel ? "var(--brand-green)" : "var(--card)", color: sel ? "white" : "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "13px", cursor: "pointer" }}>{cat.name}</button>;
          })}
        </div>
      </div>
      <div>
        <label style={lbl}>Description</label>
        <textarea rows={3} value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} style={{ ...inp, resize: "vertical" }} placeholder="Describe your stall..." />
      </div>
      <div>
        <label style={lbl}>Operating Hours</label>
        {(["weekdays", "weekends"] as const).map((part) => (
          <div key={part} className="flex items-center gap-3 mb-2">
            <span style={{ width: "90px", fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "var(--brand-text-muted)", flexShrink: 0 }}>{part === "weekdays" ? "Mon\u2013Fri" : "Sat\u2013Sun"}</span>
            <input type="time" value={to24h(form.operatingHours[part].open)} onChange={(e) => onChange({ ...form, operatingHours: { ...form.operatingHours, [part]: { ...form.operatingHours[part], open: to12h(e.target.value) } } })} style={{ ...inp, flex: 1, width: "auto", padding: "8px 10px" }} />
            <span style={{ color: "var(--brand-text-muted)" }}>-</span>
            <input type="time" value={to24h(form.operatingHours[part].close)} onChange={(e) => onChange({ ...form, operatingHours: { ...form.operatingHours, [part]: { ...form.operatingHours[part], close: to12h(e.target.value) } } })} style={{ ...inp, flex: 1, width: "auto", padding: "8px 10px" }} />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange({ ...form, status: form.status === "open" ? "closed" : "open" })} style={{ width: "44px", height: "24px", borderRadius: "9999px", border: "none", background: form.status === "open" ? "var(--brand-green)" : "#cbced4", cursor: "pointer", position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", top: "2px", left: form.status === "open" ? "22px" : "2px", width: "20px", height: "20px", borderRadius: "9999px", background: "white", transition: "left 0.2s" }} />
        </button>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-dark)" }}>Currently {form.status === "open" ? "Open" : "Closed"}</span>
      </div>
      <div>
        <label style={lbl}>Landmark</label>
        <input type="text" placeholder="e.g. Near the entrance" value={form.location.landmark} onChange={(e) => onChange({ ...form, location: { ...form.location, landmark: e.target.value } })} style={inp} />
      </div>
    </div>
  );
}

function LocationStep({ form, onChange }: { form: StallFormData; onChange: (f: StallFormData) => void }) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const initialCoords = { lat: form.location.latitude, lng: form.location.longitude };
  const [coords, setCoords] = useState(initialCoords);

  const syncCoords = (lat: number, lng: number) => {
    onChange({
      ...form,
      location: { ...form.location, latitude: lat, longitude: lng },
    });
  };

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;
    const map = new maplibregl.Map({
      container: mapDivRef.current,
      style: LIGHT_VECTOR_STYLE,
      center: [initialCoords.lng, initialCoords.lat],
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
        .setLngLat([initialCoords.lng, initialCoords.lat])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setCoords({ lat: lngLat.lat, lng: lngLat.lng });
        syncCoords(lngLat.lat, lngLat.lng);
      });
      markerRef.current = marker;

      map.on("click", (e) => {
        markerRef.current.setLngLat(e.lngLat);
        setCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        syncCoords(e.lngLat.lat, e.lngLat.lng);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-4">
      <div style={{ position: "relative" }}>
        <div ref={mapDivRef} style={{ height: "400px", borderRadius: "8px", border: "1px solid var(--brand-card-border)", overflow: "hidden" }} />
      </div>
      <div style={{ background: "#e5eeff", border: "1px solid #bccbb9", borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <MapPin size={18} style={{ color: "#006e2f" }} />
        <div>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "11px", color: "#565e74", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>Current Selection</p>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 500, color: "#0b1c30", margin: 0 }}>
            {coords.lat.toFixed(4)}\u00b0 N, {coords.lng.toFixed(4)}\u00b0 E
          </p>
        </div>
      </div>
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "#64748b", fontStyle: "italic", margin: 0 }}>
        Drag the green pin or click the map to set location.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 500, color: "var(--brand-text-dark)", display: "block", marginBottom: "4px" }}>Latitude</label>
          <input type="number" step="0.0001" value={coords.lat} onChange={(e) => { const v = parseFloat(e.target.value) || 0; setCoords({ ...coords, lat: v }); syncCoords(v, coords.lng); if (markerRef.current) markerRef.current.setLngLat([coords.lng, v]); }} style={{ width: "100%", border: "1px solid var(--brand-input-border)", borderRadius: "4px", padding: "8px 12px", fontSize: "13px", outline: "none" }} />
        </div>
        <div>
          <label style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 500, color: "var(--brand-text-dark)", display: "block", marginBottom: "4px" }}>Longitude</label>
          <input type="number" step="0.0001" value={coords.lng} onChange={(e) => { const v = parseFloat(e.target.value) || 0; setCoords({ ...coords, lng: v }); syncCoords(coords.lat, v); if (markerRef.current) markerRef.current.setLngLat([v, coords.lat]); }} style={{ width: "100%", border: "1px solid var(--brand-input-border)", borderRadius: "4px", padding: "8px 12px", fontSize: "13px", outline: "none" }} />
        </div>
      </div>
    </div>
  );
}

export default function AdminStallEditPage() {
  const navigate = useNavigate();
  const { stallId } = useParams<{ stallId: string }>();
  const { stall, loading: stallLoading } = useStalls();
  const { allItems } = useMenuItems();
  const { allCategories } = useCategories();
  const { allVendors } = useUsers();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<StallFormData>({
    name: "", photoUrl: "", category: "Rice", description: "",
    operatingHours: { weekdays: { open: "09:00 AM", close: "09:00 PM" }, weekends: { open: "10:00 AM", close: "08:00 PM" } },
    status: "open", location: { landmark: "", latitude: 11.5564, longitude: 104.9282 }, menuItemIds: [],
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (stallLoading || !stall) return;
    setForm({
      name: stall.name || "",
      photoUrl: stall.photoUrl || "",
      category: stall.category?.name || "Rice",
      description: stall.description || "",
      operatingHours: { weekdays: { open: "09:00 AM", close: "09:00 PM" }, weekends: { open: "10:00 AM", close: "08:00 PM" } },
      status: stall.isOpen ? "open" : "closed",
      location: {
        landmark: stall.address || "",
        latitude: stall.location?.coordinates?.[1] ?? 11.5564,
        longitude: stall.location?.coordinates?.[0] ?? 104.9282,
      },
      menuItemIds: [],
      vendorId: stall.ownerId || "",
    });
  }, [stallLoading, stall]);

  function toggleItem(id: string) {
    setForm((f) => ({ ...f, menuItemIds: f.menuItemIds.includes(id) ? f.menuItemIds.filter((x) => x !== id) : [...f.menuItemIds, id] }));
  }

  async function handleConfirm() {
    if (!stallId || !stall) return;
    try {
      await api.put(`/admin/stalls/${stallId}`, form);
      setShowSuccess(true);
    } catch (err) {
      console.error("[AdminStallEditPage] Failed to update stall:", err);
      toast.error("Failed to update stall. Check your connection and try again.");
    }
  }

  const selectedItems = allItems.filter((i) => form.menuItemIds.includes(i.id));
  const cardStyle: React.CSSProperties = { background: "var(--card)", border: "1px solid var(--brand-card-border)", borderRadius: "10px", padding: "24px" };
  const btnPrimary: React.CSSProperties = { padding: "11px 24px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" };
  const btnOutline: React.CSSProperties = { padding: "11px 24px", borderRadius: "6px", border: "1px solid var(--brand-card-border)", background: "var(--card)", color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "14px", cursor: "pointer" };

  const handleNextFromLocation = () => {
    setForm((f) => ({ ...f }));
    setStep(3);
  };

  if (stallLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-[13px] text-[#94a3b8]">Loading stall details...</p>
      </div>
    );
  }

  if (!stall) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-[13px] text-[#94a3b8]">Stall not found.</p>
        <button onClick={() => navigate("/admin/restaurants")} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white">Back to Restaurants</button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-5 max-w-3xl">
      <button onClick={() => navigate(`/admin/restaurants/stall/${stallId}`)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
        <ChevronLeft size={16} /> Back to Stall Details
      </button>

      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "26px", fontWeight: 700, color: "var(--brand-text-dark)" }}>Edit Stall</h1>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginTop: "4px" }}>Update stall information, menu items, and location.</p>
      </div>

      <StepIndicator steps={STEPS} currentStep={step} />

      <div style={cardStyle}>
        {step === 0 && (
          <>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "20px" }}>Stall Information</h2>
            <StallInfoForm form={form} onChange={setForm} vendors={options?.vendors || []} />
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
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "6px" }}>Set Stall Location</h2>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginBottom: "16px" }}>
              Pin your stall on the map.
            </p>
            <LocationStep form={form} onChange={setForm} />
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "20px" }}>Review & Confirm</h2>
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border p-4 flex flex-col gap-2" style={{ borderColor: "var(--brand-card-border)" }}>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "11px", color: "var(--brand-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Stall Details</p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "16px", fontWeight: 600, color: "var(--brand-text-dark)" }}>{form.name || "\u2014"}</p>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>{form.category} \u00B7 {form.status === "open" ? "Open" : "Closed"}</p>
                {form.description && <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>{form.description}</p>}
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)" }}>
                  \ud83d\udccd {form.location.landmark || "No landmark"} \u00B7 {form.location.latitude.toFixed(4)}\u00b0N, {form.location.longitude.toFixed(4)}\u00b0E
                </p>
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
        <button style={btnOutline} onClick={() => navigate(`/admin/restaurants/stall/${stallId}`)}>
          Cancel
        </button>
        {step < 3 ? (
          <button
            style={{
              ...btnPrimary,
              opacity: step === 0 && !form.name.trim() ? 0.5 : 1,
              cursor: step === 0 && !form.name.trim() ? "not-allowed" : "pointer",
            }}
            onClick={() => {
              if (step === 2) { handleNextFromLocation(); return; }
              setStep(step + 1);
            }}
            disabled={step === 0 && !form.name.trim()}
          >
            {step === 0 ? "Next: Menu Items" : step === 1 ? "Next: Set Location" : "Review & Confirm"}
          </button>
        ) : (
          <button style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: "8px" }} onClick={handleConfirm}>
            <Check size={16} /> {loading ? "Updating..." : "Save Changes"}
          </button>
        )}
      </div>

      {showSuccess && (
        <SuccessModal
          message={`"${form.name}" updated successfully!`}
          onContinue={() => { setShowSuccess(false); setForm({ name: "", photoUrl: "", category: "Rice", description: "", operatingHours: { weekdays: { open: "09:00 AM", close: "09:00 PM" }, weekends: { open: "10:00 AM", close: "08:00 PM" } }, status: "open", location: { landmark: "", latitude: 11.5564, longitude: 104.9282 }, menuItemIds: [] }); setStep(0); }}
          onGoBack={() => navigate(`/admin/restaurants/stall/${stallId}`)}
          backLabel="Back to Stall Details"
          continueLabel="Edit Another"
        />
      )}
    </div>
  );
}