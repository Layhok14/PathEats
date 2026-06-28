import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Plus, Search, List, Map, Info, X } from "lucide-react";
import { SuccessModal } from "../../../shared/components/SuccessModal";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  getAdminAllStalls,
  getAdminStallsByOwner,
  createAdminStall,
  getStallManagementOptions,
  type AdminStallRow,
  type StallManagementOptions,
} from "../../services/adminDashboardService";
import { LIGHT_VECTOR_STYLE } from "../../../shared/constants/appConfig";

type ViewMode = "list" | "map";

const PAGE_SIZE = 10;

function StallMap({ stalls, loading = false }: { stalls: AdminStallRow[]; loading?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current || !containerRef.current || stalls.length === 0) return;

    const withLoc = stalls.filter((s) => s.location?.coordinates?.length >= 2);
    if (withLoc.length === 0) return;

    const lngs = withLoc.map((s) => s.location!.coordinates[0]);
    const lats = withLoc.map((s) => s.location!.coordinates[1]);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: LIGHT_VECTOR_STYLE,
      center: [(Math.min(...lngs) + Math.max(...lngs)) / 2, (Math.min(...lats) + Math.max(...lats)) / 2],
      zoom: 12,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;

    map.on("load", () => {
      withLoc.forEach((stall) => {
        const el = document.createElement("div");
        const color = stall.isOpen ? "#006e2f" : "#d4183d";
        el.innerHTML = `<svg width="24" height="32" viewBox="0 0 24 32" fill="none"><path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 28 12 28s12-19 12-28C24 5.4 18.6 0 12 0z" fill="${color}" stroke="white" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`;
        el.style.cursor = "pointer";
        el.title = stall.name;
        const marker = new maplibregl.Marker({ element: el.firstElementChild as HTMLElement })
          .setLngLat(stall.location!.coordinates as [number, number])
          .addTo(map);
        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [stalls]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 rounded-xl border border-[#e2e8f0] bg-white">
        <div className="w-6 h-6 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-[13px] text-[#94a3b8]">Loading stalls from database...</p>
      </div>
    );
  }

  if (stalls.length === 0) return <div className="flex items-center justify-center h-80 text-[13px] text-[#94a3b8]">No stalls to display on map.</div>;
  return <div ref={containerRef} className="w-full rounded-lg overflow-hidden" style={{ height: "480px" }} />;
}

export default function AdminStallManagePage() {
  const navigate = useNavigate();
  const { vendorId } = useParams<{ vendorId: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [stalls, setStalls] = useState<AdminStallRow[]>([]);
  const [stallSearch, setStallSearch] = useState("");
  const [stallPage, setStallPage] = useState(1);
  const [loadingStalls, setLoadingStalls] = useState(true);

  const [options, setOptions] = useState<StallManagementOptions | null>(null);
  const [showCreateStall, setShowCreateStall] = useState(false);
  const [successState, setSuccessState] = useState<{ message: string } | null>(null);

  const loadStalls = async () => {
    try {
      setLoadingStalls(true);
      const data = vendorId ? await getAdminStallsByOwner(vendorId) : await getAdminAllStalls();
      setStalls(data);
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to load stalls:", err);
      toast.error("Could not load stalls.");
    } finally {
      setLoadingStalls(false);
    }
  };

  const loadOptions = async () => {
    try {
      const opts = await getStallManagementOptions();
      setOptions(opts);
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to load options:", err);
    }
  };

  useEffect(() => {
    loadStalls();
    loadOptions();
  }, [vendorId]);

  const filteredStalls = stalls.filter((s) =>
    s.name.toLowerCase().includes(stallSearch.toLowerCase()) ||
    s.ownerName?.toLowerCase().includes(stallSearch.toLowerCase()) ||
    s.ownerEmail?.toLowerCase().includes(stallSearch.toLowerCase())
  );
  const stallTotalPages = Math.max(1, Math.ceil(filteredStalls.length / PAGE_SIZE));
  const visibleStalls = filteredStalls.slice((stallPage - 1) * PAGE_SIZE, stallPage * PAGE_SIZE);

  const [createForm, setCreateForm] = useState({ ownerId: "", categoryId: "", name: "" });
  const handleCreateStall = async () => {
    if (!createForm.name.trim() || !createForm.ownerId || !createForm.categoryId) {
      toast.error("Name, owner, and category required.");
      return;
    }
    try {
      await createAdminStall(createForm);
      setShowCreateStall(false);
      setCreateForm({ ownerId: "", categoryId: "", name: "" });
      await loadStalls();
      setSuccessState({ message: "Stall created." });
    } catch (err) {
      console.error("[AdminStallManagePage] Failed to create stall:", err);
      toast.error((err as any)?.response?.data?.message || "Could not create stall.");
    }
  };

  const vendorName = stalls.length > 0 ? (stalls[0].ownerName || stalls[0].ownerEmail || "Vendor") : "Vendor";

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-6 flex flex-col gap-5">
        {vendorId && (
          <button onClick={() => navigate("/admin/vendors")} className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748b] hover:text-[#0b1c30] w-fit">
            <ArrowLeft size={14} /> Back to Vendors
          </button>
        )}
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold text-[#0b1c30]">{vendorId ? `Stalls — ${vendorName}` : "All Stalls"}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => {
              if (vendorId) setCreateForm((f) => ({ ...f, ownerId: vendorId }));
              setShowCreateStall(true);
            }} className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]">
              <Plus size={14} /> Create Stall
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
            <input value={stallSearch} onChange={(e) => { setStallSearch(e.target.value); setStallPage(1); }} placeholder="Search stalls..." className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]" />
          </div>
          <div className="flex rounded-lg border border-[#e2e8f0] bg-white p-0.5">
            {([["list", <List size={14} />], ["map", <Map size={14} />]] as const).map(([mode, icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)} className={`flex items-center gap-1 px-3 py-1.5 rounded text-[12px] font-medium ${viewMode === mode ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"}`}>
                {icon} {mode === "list" ? "List" : "Map"}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "map" && <StallMap stalls={filteredStalls} loading={loadingStalls} />}

        {viewMode === "list" && (
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            {loadingStalls ? (
              <div className="p-8 text-center text-[13px] text-[#94a3b8]">
                <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading stalls...
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-[#f8fafc]">
                        {["Name", "Owner", "Category", "Rating", "Status", "Stall Info"].map((h) => (
                          <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleStalls.map((stall) => (
                        <tr key={stall.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                          <td className="px-5 py-3">
                            <p className="text-[13px] font-medium text-[#0b1c30]">{stall.name}</p>
                            <p className="text-[11px] text-[#94a3b8]">{stall.address || "No address"}</p>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-[12px] text-[#0b1c30]">{stall.ownerName || stall.ownerEmail || "—"}</p>
                          </td>
                          <td className="px-5 py-3 text-[12px] text-[#64748b]">{stall.category?.name || "—"}</td>
                          <td className="px-5 py-3 text-[13px] text-[#64748b]">{stall.rating != null ? Number(stall.rating).toFixed(1) : "—"}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${stall.isOpen ? "bg-green-50 text-[#006e2f]" : "bg-red-50 text-[#ba1a1a]"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${stall.isOpen ? "bg-[#006e2f]" : "bg-[#ba1a1a]"}`} />
                              {stall.isOpen ? "Open" : "Closed"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => navigate(vendorId ? `/admin/vendors/${vendorId}/stall/${stall.id}` : `/admin/stalls/stall/${stall.id}`)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]"
                            >
                              <Info size={14} /> Stall Info
                            </button>
                          </td>
                        </tr>
                      ))}
                      {visibleStalls.length === 0 && (
                        <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No stalls found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
                  <p className="text-[12px] text-[#94a3b8]">Page {stallPage} of {stallTotalPages}</p>
                  <div className="flex gap-2">
                    <button disabled={stallPage <= 1} onClick={() => setStallPage((p) => p - 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button disabled={stallPage >= stallTotalPages} onClick={() => setStallPage((p) => p + 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Create Stall Modal */}
      {showCreateStall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-[16px] font-bold text-[#0b1c30]">Create Stall</h2>
              <button onClick={() => setShowCreateStall(false)} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Stall Name *</label>
                <input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="Enter stall name" className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Owner *</label>
                <select value={createForm.ownerId} onChange={(e) => setCreateForm((f) => ({ ...f, ownerId: e.target.value }))}>
                  <option value="">Select vendor...</option>
                  {(options?.vendors || []).map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Category *</label>
                <select value={createForm.categoryId} onChange={(e) => setCreateForm({ ...createForm, categoryId: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">
                  <option value="">Select category...</option>
                  {(options?.categories || []).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button onClick={() => setShowCreateStall(false)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateStall} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Create</button>
            </div>
          </div>
        </div>
      )}

      {successState && (
        <SuccessModal message={successState.message} onContinue={() => setSuccessState(null)} onGoBack={() => setSuccessState(null)} />
      )}
    </div>
  );
}
