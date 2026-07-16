import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ChevronLeft, Check, MapPin, AlertTriangle } from "lucide-react";
import { PhotoUpload } from "../../vendor/components/PhotoUpload";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SuccessModal } from "../components/SuccessModal";
import { toast } from "sonner";
import { MenuItemSelector } from "../../vendor/components/MenuItemSelector";
import { StepIndicator } from "../../vendor/components/StepIndicator";
import { useStalls } from "../hooks/useStalls";
import { useMenuItems } from "../hooks/useMenuItems";
import { formatPrice } from "../utils/formatters";
import { STALL_CATEGORIES } from "../constants/categories";
import api from "../services/axiosService";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { LIGHT_VECTOR_STYLE } from "../constants/appConfig";
import {
  attachMapContextRecovery,
  removeMapSafely,
  removeMarkersSafely,
} from "../utils/maplibreLifecycle";
import type { StallFormData, StallCategory } from "../types";
import type { Stall, VendorMenuItem, OperatingSchedule } from "../types";
import {
  getAdminAllStalls,
  getAdminStallById,
  getStallManagementOptions,
  type StallManagementOptions,
} from "../../admin/services/adminDashboardService";
import { portalPath, useManagementPortalBase } from "../../admin/utils/portalPath";

const STEPS = [{ label: "Stall Info" }, { label: "Menu Items" }, { label: "Location" }, { label: "Review" }];
const EMPTY: StallFormData = {
  name: "", photoUrl: "", category: "Rice", description: "",
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

function StallInfoForm({ form, onChange, fieldErrors, clearFieldError, categories = [...STALL_CATEGORIES] }: {
  form: StallFormData;
  onChange: (f: StallFormData) => void;
  fieldErrors: Record<string, string>;
  clearFieldError: (field: string) => void;
  categories?: string[];
}) {
  const inp: React.CSSProperties = { width: "100%", border: "1px solid var(--brand-input-border)", borderRadius: "4px", padding: "10px 14px", fontSize: "14px", fontFamily: "Poppins, sans-serif", color: "var(--brand-text-dark)", background: "var(--card)", outline: "none" };
  const lbl: React.CSSProperties = { fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 500, color: "var(--brand-text-dark)", display: "block", marginBottom: "6px" };
  const errStyle: React.CSSProperties = { color: "#d4183d", fontSize: "12px", marginTop: "4px", fontFamily: "Poppins, sans-serif" };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label style={lbl}>Stall Name *</label>
        <input type="text" placeholder="e.g. Spice & Wok Haven" value={form.name} onChange={(e) => { onChange({ ...form, name: e.target.value }); clearFieldError("name"); }} style={inp} />
        {fieldErrors.name && <p style={errStyle}>{fieldErrors.name}</p>}
      </div>
      <div>
        <label style={lbl}>Stall Photo</label>
        <PhotoUpload
          value={form.photoUrl}
          onChange={(url, storageImage) => onChange({ ...form, photoUrl: url, storageImage })}
          label="Click or drag to upload stall photo"
        />
      </div>
      <div>
        <label style={lbl}>Primary Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat: string) => {
            const sel = form.category === cat;
            return <button key={cat} type="button" onClick={() => onChange({ ...form, category: cat as StallCategory })} style={{ padding: "5px 14px", borderRadius: "9999px", border: sel ? "none" : "1px solid var(--brand-card-border)", background: sel ? "var(--brand-green)" : "var(--card)", color: sel ? "white" : "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "13px", cursor: "pointer" }}>{cat}</button>;
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

function LocationStep({ form, onChange, stalls, managementMode = false }: { form: StallFormData; onChange: (f: StallFormData) => void; stalls: Stall[]; managementMode?: boolean }) {
  const navigate = useNavigate();
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const otherMarkersRef = useRef<maplibregl.Marker[]>([]);
  const detachRecoveryRef = useRef<(() => void) | null>(null);
  const initialCoords = { lat: form.location.latitude, lng: form.location.longitude };
  const [coords, setCoords] = useState(initialCoords);
  const [mapRecovering, setMapRecovering] = useState(false);
  const [nearbyStalls, setNearbyStalls] = useState<Array<{ id: string; name: string; distance_meters: number }>>([]);
  const nearbyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coordsRef = useRef(coords);
  coordsRef.current = coords;
  const syncRef = useRef(onChange);
  syncRef.current = onChange;
  const formRef = useRef(form);
  formRef.current = form;

  const syncCoords = (lat: number, lng: number) => {
    const currentForm = formRef.current;
    syncRef.current({
      ...currentForm,
      location: { ...currentForm.location, latitude: lat, longitude: lng },
    });
  };

  const checkNearby = (lat: number, lng: number) => {
    if (managementMode) return;
    if (nearbyTimerRef.current) clearTimeout(nearbyTimerRef.current);
    nearbyTimerRef.current = setTimeout(async () => {
      try {
        const { data } = await api.get(`/vendor/stalls/nearby`, { params: { latitude: lat, longitude: lng } });
        setNearbyStalls(Array.isArray(data.data) ? data.data : []);
      } catch {
        setNearbyStalls([]);
      }
    }, 500);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("stall_create_location");
    if (saved) {
      sessionStorage.removeItem("stall_create_location");
      try {
        const { lat, lng } = JSON.parse(saved);
        setCoords({ lat, lng });
        syncCoords(lat, lng);
      } catch {/* no saved coords */} // eslint-disable-line no-empty
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    detachRecoveryRef.current = attachMapContextRecovery(map, {
      onLost: () => setMapRecovering(true),
      onRestored: () => setMapRecovering(false),
    });

    map.on("load", () => {
      setMapRecovering(false);
      map.resize();
      const el = document.createElement("div");
      el.innerHTML = `<svg width="28" height="40" viewBox="0 0 24 40" fill="none"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 28 12 28s12-19 12-28C24 5.4 18.6 0 12 0z" fill="#006e2f" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="white"/></svg>`;
      el.style.cursor = "grab";
      el.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";

      const marker = new maplibregl.Marker({ element: el.firstElementChild as HTMLElement, draggable: true })
        .setLngLat([coordsRef.current.lng, coordsRef.current.lat])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setCoords({ lat: lngLat.lat, lng: lngLat.lng });
        syncCoords(lngLat.lat, lngLat.lng);
        checkNearby(lngLat.lat, lngLat.lng);
      });
      markerRef.current = marker;

      map.on("click", (e) => {
        if (markerRef.current) {
          markerRef.current.setLngLat(e.lngLat);
          setCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          syncCoords(e.lngLat.lat, e.lngLat.lng);
          checkNearby(e.lngLat.lat, e.lngLat.lng);
        }
      });

      // Show other stalls as grey dots
      stalls.forEach((s) => {
        if (!s.location?.latitude || !s.location?.longitude) return;
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
    });

    return () => {
      detachRecoveryRef.current?.();
      detachRecoveryRef.current = null;
      removeMarkersSafely(otherMarkersRef);
      removeMapSafely(mapRef);
      markerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    marker.setLngLat([coords.lng, coords.lat]);
  }, [coords.lat, coords.lng]);

  return (
    <div className="flex flex-col gap-4" style={{ height: "100%" }}>
      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        {mapRecovering && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <LoadingSpinner message="Recovering map view..." />
          </div>
        )}
        <div ref={mapDivRef} style={{ height: "100%", borderRadius: "8px", border: "1px solid var(--brand-card-border)", overflow: "hidden" }} />
        <button
          type="button"
          onClick={() => {
            if (managementMode) {
              mapDivRef.current?.parentElement?.requestFullscreen?.().then(() => {
                requestAnimationFrame(() => mapRef.current?.resize());
              }).catch(() => undefined);
            } else {
              navigate(`/vendor/stalls/location-pinpoint?lat=${coords.lat}&lng=${coords.lng}`);
            }
          }}
          style={{
            position: "absolute", bottom: "12px", right: "12px", zIndex: 10,
            padding: "7px 12px", borderRadius: "6px", border: "none",
            background: "rgba(0,0,0,0.65)", color: "white",
            fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: "5px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          Full Screen
        </button>
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
      {nearbyStalls.length > 0 && (
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "8px", padding: "10px 14px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <AlertTriangle size={16} style={{ color: "#F59E0B", marginTop: "2px", flexShrink: 0 }} />
          <div>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", fontWeight: 600, color: "#92400e", margin: 0 }}>
              {nearbyStalls.length === 1 ? "1 stall is" : `${nearbyStalls.length} stalls are`} nearby
            </p>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "11px", color: "#92400e", margin: "2px 0 0 0", opacity: 0.8 }}>
              {nearbyStalls.map((s) => `${s.name} (${Math.round(s.distance_meters)}m)`).join(", ")}
            </p>
          </div>
        </div>
      )}
      <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "#64748b", fontStyle: "italic", margin: 0 }}>
        Grey dots show your existing stalls. Drag the green pin or click the map to set location.
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

function scheduleFromAdmin(rows: any): OperatingSchedule {
  if (!Array.isArray(rows)) return EMPTY.operatingHours;
  const byDay = new Map(rows.map((row) => [Number(row.dayOfWeek ?? row.day_of_week), row]));
  const format = (days: number[], fallback: { open: string; close: string }) => {
    const row: any = days.map((day) => byDay.get(day)).find(Boolean);
    if (!row) return fallback;
    return { open: to12h(String(row.opensAt ?? row.opens_at).slice(0, 5)), close: to12h(String(row.closesAt ?? row.closes_at).slice(0, 5)) };
  };
  return {
    weekdays: format([1, 2, 3, 4, 5], EMPTY.operatingHours.weekdays),
    weekends: format([0, 6], EMPTY.operatingHours.weekends),
  };
}

function mapAdminMenuItem(row: any): VendorMenuItem {
  const categories: Record<string, VendorMenuItem["category"]> = {
    snack: "Snack", dessert: "Dessert", drink: "Drink", "main course": "Main Course",
  };
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    price: Number(row.price),
    imageUrl: row.imageUrl || "",
    storageImage: row.storageImage || null,
    category: categories[row.category] || "Snack",
    isAvailable: row.isAvailable ?? true,
  };
}

export function StallCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stallId } = useParams<{ stallId: string }>();
  const portalBase = useManagementPortalBase();
  const managementMode = location.pathname.startsWith("/admin") || location.pathname.startsWith("/business");
  const editing = managementMode && Boolean(stallId);
  const { createStall, stalls: vendorStalls, loading: vendorLoading } = useStalls({ disabled: managementMode });
  const { allItems: vendorItems } = useMenuItems(undefined, { disabled: managementMode });
  const [managementItems, setManagementItems] = useState<VendorMenuItem[]>([]);
  const [managementStalls, setManagementStalls] = useState<Stall[]>([]);
  const [managementOptions, setManagementOptions] = useState<StallManagementOptions | null>(null);
  const [ownerId, setOwnerId] = useState(() => new URLSearchParams(location.search).get("ownerId") || "");
  const [categoryId, setCategoryId] = useState("");
  const [managementLoading, setManagementLoading] = useState(false);
  const sessionKey = managementMode ? `management_stall_form_${stallId || "new"}` : "stall_create_form";
  const [step, setStep] = useState(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (!saved) return 0;
    try { return JSON.parse(saved)._step ?? 0; } catch { return 0; }
  });
  const [form, setForm] = useState<StallFormData>(() => {
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { _step, ...rest } = parsed;
        return { ...EMPTY, ...rest, location: { ...EMPTY.location, ...(rest.location || {}) }, operatingHours: { ...EMPTY.operatingHours, ...(rest.operatingHours || {}) } };
      } catch { /* ignore */ }
    }
    return EMPTY;
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const allItems = managementMode ? managementItems : vendorItems;
  const allStalls = managementMode ? managementStalls : vendorStalls;
  const loading = managementMode ? managementLoading : vendorLoading;
  const backPath = portalPath(portalBase, "/stalls");

  useEffect(() => {
    if (!managementMode) return;
    let active = true;
    setManagementLoading(true);
    Promise.all([
      getStallManagementOptions(),
      getAdminAllStalls(),
      editing && stallId ? getAdminStallById(stallId) : Promise.resolve(null),
      editing && stallId ? api.get(`/admin/menu-items`, { params: { placeId: stallId } }) : Promise.resolve(null),
    ]).then(([options, rows, current, menuResponse]) => {
      if (!active) return;
      setManagementOptions(options);
      setManagementStalls(rows.map((row) => ({
        id: row.id,
        name: row.name,
        photoUrl: row.photoUrl || "",
        category: (row.category?.name || "Others") as StallCategory,
        description: row.description || "",
        operatingHours: scheduleFromAdmin(row.operatingHours),
        status: row.isOpen ? "open" : "closed",
        location: {
          landmark: row.address || "",
          latitude: row.location?.coordinates?.[1] ?? 11.5564,
          longitude: row.location?.coordinates?.[0] ?? 104.9282,
        },
        rating: Number(row.rating || 0),
        reviewCount: row.ratingCount || 0,
        menuItemIds: [],
      })));
      if (current) {
        const menu = (menuResponse as any)?.data?.data || [];
        setOwnerId(current.ownerId);
        setCategoryId(current.category?.id || "");
        setManagementItems(menu.map(mapAdminMenuItem));
        setForm({
          name: current.name,
          photoUrl: current.photoUrl || "",
          storageImage: current.storageImage || undefined,
          category: (current.category?.name || "Others") as StallCategory,
          description: current.description || "",
          operatingHours: scheduleFromAdmin(current.operatingHours),
          status: current.isOpen ? "open" : "closed",
          location: {
            landmark: current.address || "",
            latitude: current.location?.coordinates?.[1] ?? 11.5564,
            longitude: current.location?.coordinates?.[0] ?? 104.9282,
          },
          menuItemIds: menu.map((item: any) => item.id),
        });
      }
    }).catch((err) => {
      console.error("[StallCreatePage] Failed to load management workflow:", err);
      toast.error("Could not load stall management data.");
    }).finally(() => active && setManagementLoading(false));
    return () => { active = false; };
  }, [managementMode, editing, stallId]);

  useEffect(() => {
    if (!managementMode || !ownerId) return;
    api.get("/admin/menu-items", { params: { ownerId } })
      .then(({ data }) => setManagementItems((data.data || []).map(mapAdminMenuItem)))
      .catch(() => setManagementItems([]));
  }, [managementMode, ownerId]);

  useEffect(() => {
    if (!managementMode || !managementOptions) return;
    const category = managementOptions.categories.find((item) => item.name === form.category);
    if (category) setCategoryId(category.id);
  }, [managementMode, managementOptions, form.category]);

  useEffect(() => {
    sessionStorage.setItem(sessionKey, JSON.stringify({ ...form, _step: step }));
  }, [form, step, sessionKey]);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validateStep(stepIndex: number): boolean {
    const errs: Record<string, string> = {};
    if (stepIndex === 0) {
      if (!form.name.trim()) errs.name = "Stall name is required";
      if (managementMode && !ownerId) errs.ownerId = "Vendor owner is required";
      if (managementMode && !categoryId) errs.categoryId = "Category is required";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function toggleItem(id: string) {
    setForm((f) => ({ ...f, menuItemIds: f.menuItemIds.includes(id) ? f.menuItemIds.filter((x) => x !== id) : [...f.menuItemIds, id] }));
  }

  async function handleConfirm() {
    setManagementLoading(true);
    try {
      if (managementMode) {
        const payload = {
          ownerId,
          categoryId,
          name: form.name,
          description: form.description,
          address: form.location.landmark,
          photoUrl: form.photoUrl,
          storageImage: form.storageImage,
          latitude: form.location.latitude,
          longitude: form.location.longitude,
          status: form.status,
          operatingHours: form.operatingHours,
          menuItemIds: form.menuItemIds,
        };
        if (editing && stallId) await api.patch(`/admin/stalls/${stallId}`, payload);
        else await api.post("/admin/stalls", payload);
      } else {
        await createStall(form);
      }
      sessionStorage.removeItem(sessionKey);
      setShowSuccess(true);
    } catch (err) {
      console.error("[StallCreatePage] Failed to register stall:", err);
      toast.error((err as any)?.response?.data?.message || `Failed to ${editing ? "update" : "register"} stall.`);
    } finally {
      setManagementLoading(false);
    }
  }

  function goNext() {
    if (validateStep(step)) setStep(step + 1);
  }

  const selectedItems = allItems.filter((i) => form.menuItemIds.includes(i.id));
  const isLocationStep = step === 2;
  const cardStyle: React.CSSProperties = isLocationStep
    ? { background: "var(--card)", border: "1px solid var(--brand-card-border)", borderRadius: "10px", padding: "24px", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }
    : { background: "var(--card)", border: "1px solid var(--brand-card-border)", borderRadius: "10px", padding: "24px" };
  const btnPrimary: React.CSSProperties = { padding: "11px 24px", borderRadius: "6px", border: "none", background: "var(--brand-green)", color: "white", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" };
  const btnOutline: React.CSSProperties = { padding: "11px 24px", borderRadius: "6px", border: "1px solid var(--brand-card-border)", background: "var(--card)", color: "var(--brand-text-dark)", fontFamily: "Poppins, sans-serif", fontSize: "14px", cursor: "pointer" };

  return (
    <div className={isLocationStep ? "p-6 flex flex-col gap-5 h-full" : "p-6 flex flex-col gap-5 max-w-3xl"}>
      <button onClick={() => navigate(managementMode ? backPath : "/vendor/stalls")} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
        <ChevronLeft size={16} /> Back to Stalls
      </button>

      <div>
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontSize: "26px", fontWeight: 700, color: "var(--brand-text-dark)" }}>{editing ? "Update Stall" : "Register New Stall"}</h1>
        <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginTop: "4px" }}>Set up your stall details, pin your location, and pick menu items.</p>
      </div>

      <StepIndicator steps={STEPS} currentStep={step} />

      <div style={cardStyle}>
        {step === 0 && (
          <>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "20px" }}>Stall Information</h2>
            {managementMode && !editing && (
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block mb-1 text-[13px] font-medium text-[#0b1c30]">Vendor Owner *</label>
                  <select value={ownerId} onChange={(event) => {
                    setOwnerId(event.target.value);
                    setForm((current) => ({ ...current, menuItemIds: [] }));
                    clearFieldError("ownerId");
                  }} className="w-full border border-[#bccbb9] rounded px-3 py-2 text-[13px] bg-white">
                    <option value="">Select vendor...</option>
                    {(managementOptions?.vendors || []).map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name} ({vendor.email})</option>)}
                  </select>
                  {fieldErrors.ownerId && <p className="mt-1 text-[12px] text-red-600">{fieldErrors.ownerId}</p>}
                </div>
                <div>
                  <label className="block mb-1 text-[13px] font-medium text-[#0b1c30]">Category *</label>
                  <select value={categoryId} onChange={(event) => {
                    setCategoryId(event.target.value);
                    clearFieldError("categoryId");
                    const category = managementOptions?.categories.find((item) => item.id === event.target.value);
                    if (category) setForm((current) => ({ ...current, category: category.name as StallCategory }));
                  }} className="w-full border border-[#bccbb9] rounded px-3 py-2 text-[13px] bg-white">
                    <option value="">Select category...</option>
                    {(managementOptions?.categories || []).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                  {fieldErrors.categoryId && <p className="mt-1 text-[12px] text-red-600">{fieldErrors.categoryId}</p>}
                </div>
              </div>
            )}
            <StallInfoForm
              form={form}
              onChange={setForm}
              fieldErrors={fieldErrors}
              clearFieldError={clearFieldError}
              categories={managementMode ? (managementOptions?.categories || []).map((category) => category.name) : undefined}
            />
          </>
        )}

        {step === 1 && (
          <>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "6px" }}>Select Menu Items</h2>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginBottom: "20px" }}>Choose items for your stall. You can change these anytime.</p>
            <MenuItemSelector selectedIds={form.menuItemIds} onToggle={toggleItem} items={allItems} />
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col flex-1 min-h-0">
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "17px", fontWeight: 600, color: "var(--brand-text-dark)", marginBottom: "6px" }}>Set Stall Location</h2>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px", color: "var(--brand-text-muted)", marginBottom: "16px" }}>
              Pin your stall on the map. Existing stalls shown as grey dots.
            </p>
            <div className="flex-1 min-h-0">
              <LocationStep form={form} onChange={setForm} stalls={allStalls} managementMode={managementMode} />
            </div>
          </div>
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
        <button style={btnOutline} onClick={() => { if (step === 0) { sessionStorage.removeItem(sessionKey); navigate(managementMode ? backPath : "/vendor/stalls"); } else { setStep(step - 1); } }}>
          {step === 0 ? "Cancel" : "Back"}
        </button>
        {step < 3 ? (
          <button
            style={btnPrimary}
            onClick={goNext}
          >
            {step === 0 ? "Next: Menu Items" : step === 1 ? "Next: Set Location" : "Review & Confirm"}
          </button>
        ) : (
          <button style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: "8px" }} onClick={handleConfirm} disabled={loading}>
            <Check size={16} /> {loading ? "Saving..." : editing ? "Confirm & Update Stall" : "Confirm & Register Stall"}
          </button>
        )}
      </div>

      {showSuccess && (
        <SuccessModal
          message={`"${form.name}" ${editing ? "updated" : "registered"} successfully!`}
          onContinue={() => { setShowSuccess(false); setForm(EMPTY); setStep(0); }}
          onGoBack={() => navigate(managementMode ? backPath : "/vendor/stalls")}
          backLabel="Go to Stalls"
          continueLabel={editing ? "Continue Editing" : "Register Another"}
        />
      )}
    </div>
  );
}
