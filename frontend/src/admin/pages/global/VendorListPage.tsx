import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search, Store, Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { SuccessModal } from "../../../shared/components/SuccessModal";
import {
  getAdminUsersByRole,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  type AdminUser,
} from "../../services/adminDashboardService";

const PAGE_SIZE = 10;

export default function VendorListPage() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editVendor, setEditVendor] = useState<AdminUser | null>(null);
  const [successState, setSuccessState] = useState<{ message: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const loadVendors = async () => {
    try {
      setLoading(true);
      const all = await getAdminUsersByRole("VENDOR");
      setVendors(all);
    } catch (err) {
      toast.error("Could not load vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVendors(); }, []);

  const filtered = vendors.filter((v) =>
    v.name.toLowerCase().includes(query.toLowerCase()) ||
    v.email.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Name, email, and password required.");
      return;
    }
    try {
      await createAdminUser({ name: form.name, email: form.email, password: form.password, role: "VENDOR" });
      setShowCreate(false);
      setForm({ name: "", email: "", password: "" });
      await loadVendors();
      setSuccessState({ message: "Vendor created." });
    } catch (err) {
      toast.error("Could not create vendor.");
    }
  };

  const handleUpdate = async () => {
    if (!editVendor) return;
    try {
      await updateAdminUser(editVendor.id, { firstName: editVendor.name, lastName: "" });
      setEditVendor(null);
      await loadVendors();
      setSuccessState({ message: "Vendor updated." });
    } catch (err) {
      toast.error("Could not update vendor.");
    }
  };

  const handleDelete = async (v: AdminUser) => {
    if (!confirm(`Delete vendor "${v.name}"?`)) return;
    try {
      await deleteAdminUser(v.id);
      toast.success(`"${v.name}" deleted.`);
      await loadVendors();
    } catch (err) {
      toast.error("Could not delete vendor.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#0b1c30]">Vendor Management</h1>
            <p className="text-[13px] text-[#64748b] mt-1">View all vendors. Click "Manage Stall" to manage a vendor's stalls.</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]">
            <Plus size={14} /> Add Vendor
          </button>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search vendors..." className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]" />
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[13px] text-[#94a3b8]">
              <div className="w-5 h-5 border-2 border-[#006e2f] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading vendors...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      {["Name", "Email", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((v) => (
                      <tr key={v.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 text-[13px] font-medium text-[#0b1c30]">{v.name}</td>
                        <td className="px-5 py-3 text-[12px] text-[#64748b]">{v.email}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${v.status === "Active" ? "bg-green-50 text-[#006e2f]" : "bg-red-50 text-[#ba1a1a]"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${v.status === "Active" ? "bg-[#006e2f]" : "bg-[#ba1a1a]"}`} />
                            {v.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/admin/vendors/${v.id}`)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]"
                            >
                              <Store size={14} /> Manage Stall
                            </button>
                            <button onClick={() => setEditVendor(v)} className="p-1.5 rounded text-[#005ac2] hover:bg-blue-50"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(v)} className="p-1.5 rounded text-[#ef4444] hover:bg-red-50"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {visible.length === 0 && (
                      <tr><td colSpan={4} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No vendors found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#f1f5f9]">
                <p className="text-[12px] text-[#94a3b8]">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
                  <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-[16px] font-bold text-[#0b1c30]">Add Vendor</h2>
              <button onClick={() => setShowCreate(false)} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Password *</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-[16px] font-bold text-[#0b1c30]">Edit Vendor</h2>
              <button onClick={() => setEditVendor(null)} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Name</label>
                <input value={editVendor.name} onChange={(e) => setEditVendor({ ...editVendor, name: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Email</label>
                <input value={editVendor.email} disabled className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none bg-gray-50 text-[#94a3b8]" />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button onClick={() => setEditVendor(null)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Save</button>
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
