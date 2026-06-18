import { FormEvent, useEffect, useMemo, useState } from "react";
import { Ban, CheckCircle, MapPin, Pencil, Plus, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import type { AdminPlaceCategory, AdminRestaurant } from "../../services/adminDashboardService";
import {
  banDeveloperVendor,
  createDeveloperVendor,
  deleteDeveloperVendor,
  getDeveloperPlaceCategories,
  getDeveloperVendors,
  unbanDeveloperVendor,
  updateDeveloperVendor,
} from "../../services/developerService";

const emptyForm = { name: "", location: "", category_id: "" };
const PAGE_SIZE = 10;

export default function DeveloperVendorManagementPage() {
  const [vendors, setVendors] = useState<AdminRestaurant[]>([]);
  const [categories, setCategories] = useState<AdminPlaceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<(AdminRestaurant & { categoryId?: string }) | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const [vendorRows, categoryRows] = await Promise.all([
        getDeveloperVendors(),
        getDeveloperPlaceCategories(),
      ]);
      setVendors(vendorRows);
      setCategories(categoryRows);
    } catch {
      toast.error("Could not load developer vendor data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const filtered = useMemo(() => vendors.filter((vendor) => {
    const target = `${vendor.name} ${vendor.location} ${vendor.category} ${vendor.status}`.toLowerCase();
    return target.includes(query.toLowerCase());
  }), [query, vendors]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleVendors = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (vendor: AdminRestaurant & { categoryId?: string }) => {
    setEditing(vendor);
    setForm({ name: vendor.name, location: vendor.location, category_id: vendor.categoryId ?? "" });
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (editing) {
        await updateDeveloperVendor(editing.id, form);
        toast.success("Vendor updated.");
      } else {
        await createDeveloperVendor(form);
        toast.success("Vendor created.");
      }
      setModalOpen(false);
      await loadVendors();
    } catch {
      toast.error(editing ? "Could not update vendor." : "Could not create vendor.");
    }
  };

  const handleBanToggle = async (vendor: AdminRestaurant) => {
    try {
      if (vendor.status === "Suspended") {
        await unbanDeveloperVendor(vendor.id);
        toast.success("Vendor unbanned.");
      } else {
        await banDeveloperVendor(vendor.id);
        toast.success("Vendor banned.");
      }
      await loadVendors();
    } catch {
      toast.error("Could not update vendor access.");
    }
  };

  const handleDelete = async (vendor: AdminRestaurant) => {
    if (!confirm(`Delete ${vendor.name}?`)) return;
    try {
      await deleteDeveloperVendor(vendor.id);
      toast.success("Vendor deleted.");
      await loadVendors();
    } catch {
      toast.error("Could not delete vendor.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search developer vendors..." />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Vendor Management</h1>
            <p className="text-[14px] text-[#64748b] mt-1">{loading ? "Loading vendors..." : "Create, edit, delete, ban, and unban vendors."}</p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#005a26]"><Plus size={14} />Add Vendor</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Total Vendors" value={String(vendors.length)} sub="Live from database" subVariant="green" topBorderColor="#006e2f" icon={<Store size={18} />} accent="#006e2f" />
          <MetricCard label="Active Vendors" value={String(vendors.filter((vendor) => vendor.status === "Active").length)} sub="Visible to users" subVariant="blue" topBorderColor="#005ac2" icon={<CheckCircle size={18} />} accent="#005ac2" />
          <MetricCard label="Banned Vendors" value={String(vendors.filter((vendor) => vendor.status === "Suspended").length)} sub="Hidden or blocked" subVariant="amber" topBorderColor="#f59e0b" icon={<Ban size={18} />} accent="#f59e0b" />
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
            <div><h2 className="text-[16px] font-semibold text-[#0b1c30]">Vendor Directory</h2><p className="text-[12px] text-[#64748b]">Developer CRUD operations</p></div>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search vendors..." className="w-[220px] rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] text-[#374151] outline-none focus:border-[#006e2f]" />
          </div>
          <table className="w-full">
            <thead><tr className="bg-[#f8fafc]">{["VENDOR", "LOCATION", "CATEGORY", "STATUS", "ACTIONS"].map((header) => <th key={header} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{header}</th>)}</tr></thead>
            <tbody>
              {visibleVendors.map((vendor) => (
                <tr key={vendor.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                  <td className="px-6 py-3"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e5eeff] text-[13px] font-bold text-[#005ac2]">{vendor.name[0]}</div><div><p className="text-[13px] font-medium text-[#0b1c30]">{vendor.name}</p><p className="text-[11px] text-[#94a3b8]">ID: {vendor.id}</p></div></div></td>
                  <td className="px-6 py-3 text-[13px] text-[#64748b]"><MapPin size={13} className="mr-1 inline" />{vendor.location}</td>
                  <td className="px-6 py-3"><span className="rounded-full bg-[#dbeafe] px-2.5 py-0.5 text-[11px] font-medium text-[#1e40af]">{vendor.category}</span></td>
                  <td className="px-6 py-3 text-[13px]" style={{ color: vendor.status === "Active" ? "#006e2f" : vendor.status === "Suspended" ? "#ef4444" : "#f59e0b" }}>{vendor.status}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(vendor)} className="rounded p-1.5 text-[#005ac2] hover:bg-blue-50" title="Edit vendor"><Pencil size={15} /></button>
                      <button onClick={() => handleBanToggle(vendor)} className={`rounded p-1.5 ${vendor.status === "Suspended" ? "text-[#006e2f] hover:bg-green-50" : "text-[#ef4444] hover:bg-red-50"}`} title={vendor.status === "Suspended" ? "Unban vendor" : "Ban vendor"}>{vendor.status === "Suspended" ? <CheckCircle size={15} /> : <Ban size={15} />}</button>
                      <button onClick={() => handleDelete(vendor)} className="rounded p-1.5 text-[#ef4444] hover:bg-red-50" title="Delete vendor"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-[#f1f5f9] px-6 py-3">
            <p className="text-[12px] text-[#94a3b8]">Showing {visibleVendors.length} of {filtered.length}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-medium text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-[520px] rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-[20px] font-bold text-[#0b1c30]">{editing ? "Edit Vendor" : "Add Vendor"}</h2>
            <div className="mt-5 grid gap-4">
              <label className="text-[12px] font-semibold text-[#374151]">Vendor Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" /></label>
              <label className="text-[12px] font-semibold text-[#374151]">Location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" /></label>
              <label className="text-[12px] font-semibold text-[#374151]">Category<select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]"><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-[#bccbb9] bg-white px-4 py-2 text-[13px] font-medium text-[#374151] hover:bg-gray-50">Cancel</button>
              <button className="rounded-lg bg-[#006e2f] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#005a26]">{editing ? "Save" : "Create"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
