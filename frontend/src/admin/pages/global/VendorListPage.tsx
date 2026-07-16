import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search, Store, Plus, Pencil, Trash2, X, Ban, CheckCircle, Download } from "lucide-react";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { PasswordRequirementChecklist } from "../../../shared/components/PasswordRequirementChecklist";
import { isStrongPassword } from "../../../shared/utils/passwordPolicy";
import { toast } from "sonner";
import { SuccessModal } from "../../../shared/components/SuccessModal";
import {
  getAdminUserManagementOverview,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  updateAdminUserStatus,
  getAdminRoles,
  type AdminUserOverviewRow,
} from "../../services/adminDashboardService";
import { DetailModal } from "../developer/devShared";
import { exportXlsx } from "../../../shared/utils/exportXlsx";
import { portalPath, useManagementPortalBase } from "../../utils/portalPath";

const PAGE_SIZE = 10;

function vendorName(r: AdminUserOverviewRow): string {
  const d = r.user.details as Record<string, unknown> | null;
  if (d) {
    const first = d.firstName ? String(d.firstName).trim() : d.first_name ? String(d.first_name).trim() : "";
    const last = d.lastName ? String(d.lastName).trim() : d.last_name ? String(d.last_name).trim() : "";
    const parts = [first, last].filter(Boolean);
    if (parts.length > 0) return parts.join(" ");
  }
  return r.user.label || "—";
}

function vendorStatus(r: AdminUserOverviewRow): string {
  const d = r.user.details as Record<string, unknown> | null;
  if (d) {
    const s = d.status as string | undefined;
    if (s) return s;
    const banned = d.is_banned as boolean | undefined;
    if (banned) return "Suspended";
  }
  return r.status || "Active";
}

function exportVendors(rows: AdminUserOverviewRow[]) {
  exportXlsx([
    {
      name: "Vendors",
      headers: ["Name", "Email", "Status"],
      rows: rows.map((r) => [vendorName(r), r.user.subLabel || "", vendorStatus(r)]),
    },
  ], "vendors.xlsx");
}

export default function VendorListPage() {
  const navigate = useNavigate();
  const portalBase = useManagementPortalBase();
  const [rows, setRows] = useState<AdminUserOverviewRow[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [successState, setSuccessState] = useState<{ message: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const [detailRow, setDetailRow] = useState<AdminUserOverviewRow | null>(null);
  const [detailTable, setDetailTable] = useState<"user" | "search">("user");
  const [confirmTarget, setConfirmTarget] = useState<AdminUserOverviewRow | null>(null);

  const loadRows = async () => {
    try {
      setLoading(true);
      const all = await getAdminUserManagementOverview("", "VENDOR");
      setRows(all.filter((r) => r.user.details?.role_scope === "VENDOR"));
    } catch (err) {
      toast.error("Could not load vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRows(); }, []);

  const filtered = rows.filter((r) =>
    vendorName(r).toLowerCase().includes(query.toLowerCase()) ||
    (r.user.subLabel ?? "").toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim() || !isStrongPassword(form.password) || form.password !== form.confirmPassword) {
      toast.error("Complete the form with a strong, matching password.");
      return;
    }
    try {
      const role = (await getAdminRoles()).find((item) => item.baseScope === "VENDOR");
      if (!role) throw new Error("Vendor role is not configured");
      await createAdminUser({ name: form.name, email: form.email, password: form.password, roleId: role.id });
      setShowCreate(false);
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      await loadRows();
      setSuccessState({ message: "Vendor created." });
    } catch (err) {
      toast.error("Could not create vendor.");
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      await updateAdminUser(editId, { firstName: editName });
      setEditId(null);
      await loadRows();
      setSuccessState({ message: "Vendor updated." });
    } catch (err) {
      toast.error("Could not update vendor.");
    }
  };

  const handleDelete = async (row: AdminUserOverviewRow) => {
    setConfirmTarget(row);
  };

  const handleStatus = async (row: AdminUserOverviewRow) => {
    const current = vendorStatus(row);
    const next = current === "Suspended" ? "Active" : "Suspended";
    try {
      await updateAdminUserStatus(row.id, next);
      toast.success(next === "Active" ? "Vendor unbanned." : "Vendor banned.");
      await loadRows();
    } catch (err) {
      toast.error("Could not update status.");
    }
  };

  function openDetail(row: AdminUserOverviewRow, table: "user" | "search") {
    setDetailRow(row);
    setDetailTable(table);
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#0b1c30]">Vendor Management</h1>
            <p className="text-[13px] text-[#64748b] mt-1">Manage vendor accounts with personal info, stalls, and reviews.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => exportVendors(rows)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#bccbb9] px-3 py-1.5 text-[12px] font-semibold text-[#374151] bg-white hover:bg-gray-50">
              <Download size={14} /> Export
            </button>
            <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]">
              <Plus size={14} /> Add Vendor
            </button>
          </div>
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search vendors..." className="w-full pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white text-[#374151] placeholder:text-[#94a3b8]" />
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <LoadingSpinner message="Loading vendors..." />
            </div>
          ) : (
            <>
               <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      <th className="w-1/6 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Name</th>
                      <th className="w-1/6 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Personal Info</th>
                      <th className="w-1/6 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Stall</th>
                      <th className="w-1/6 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Edit</th>
                      <th className="w-1/6 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Ban</th>
                      <th className="w-1/6 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((r) => {
                      const status = vendorStatus(r);
                      return (
                      <tr key={r.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                        <td className="px-5 py-3 text-[13px] font-medium text-[#0b1c30]">{vendorName(r)}</td>
                        <td className="px-5 py-3">
                          <button onClick={() => openDetail(r, "user")} className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#005a26]">
                            View
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => navigate(portalPath(portalBase, `/vendors/${r.id}`))} className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[#005a26]">
                            <Store size={14} /> Manage Stall
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => { setEditId(r.id); setEditName(vendorName(r)); setEditEmail(r.user.subLabel ?? ""); }} className="inline-flex items-center gap-1 rounded text-[#005ac2] hover:text-[#1d4ed8] text-[12px] font-semibold">
                            <Pencil size={14} /> Edit
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => handleStatus(r)} className={`inline-flex items-center gap-1 rounded text-[12px] font-semibold ${status === "Suspended" ? "text-[#006e2f] hover:text-[#005a26]" : "text-[#ba1a1a] hover:text-[#991111]"}`}>
                            {status === "Suspended" ? <CheckCircle size={14} /> : <Ban size={14} />}
                            {status === "Suspended" ? "Unban" : "Ban"}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <button onClick={() => handleDelete(r)} className="inline-flex items-center gap-1 rounded text-[#ef4444] hover-[#dc2626] text-[12px] font-semibold">
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    );
                    })}
                    {visible.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[#94a3b8]">No vendors found.</td></tr>
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
                <PasswordRequirementChecklist password={form.password} />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Confirm Password *</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
                {form.confirmPassword && form.password !== form.confirmPassword && <p className="mt-1 text-xs text-red-500">Passwords do not match</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreate} disabled={!isStrongPassword(form.password) || form.password !== form.confirmPassword} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <h2 className="text-[16px] font-bold text-[#0b1c30]">Edit Vendor</h2>
              <button onClick={() => setEditId(null)} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Email</label>
                <input value={editEmail} disabled className="w-full mt-1 rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none bg-gray-50 text-[#94a3b8]" />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#e2e8f0] px-6 py-4">
              <button onClick={() => setEditId(null)} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Save</button>
            </div>
          </div>
        </div>
      )}

      {successState && (
        <SuccessModal message={successState.message} onContinue={() => setSuccessState(null)} onGoBack={() => setSuccessState(null)} />
      )}

      {/* Detail Modal */}
      {detailRow && (
        <DetailModal
          title={`${detailTable === "user" ? "User" : "Search History"} — ${vendorName(detailRow)}`}
          details={Object.assign({ Status: detailRow.status }, detailRow[detailTable]?.details ?? {})}
          onClose={() => setDetailRow(null)}
        />
      )}

      <ConfirmDialog
        open={confirmTarget !== null}
        title="Delete Vendor"
        description="Are you sure you want to delete this vendor?"
        itemName={confirmTarget ? vendorName(confirmTarget) : undefined}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (!confirmTarget) return;
          try {
            await deleteAdminUser(confirmTarget.id);
            toast.success(`"${vendorName(confirmTarget)}" deleted.`);
            await loadRows();
          } catch (err) {
            toast.error("Could not delete vendor.");
          }
          setConfirmTarget(null);
        }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
