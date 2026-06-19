import { FormEvent, useEffect, useMemo, useState } from "react";
import { Ban, CheckCircle, Download, Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import type { AdminUser } from "../../services/adminDashboardService";
import {
  banDeveloperUser,
  createDeveloperUser,
  deleteDeveloperUser,
  getDeveloperUsers,
  unbanDeveloperUser,
  updateDeveloperUser,
} from "../../services/developerService";

const ROLE_OPTIONS = ["CONSUMER", "VENDOR", "GLOBAL_ADMIN", "CUSTOMER_SERVICE_ADMIN", "DEVELOPER_ADMIN"];
const PAGE_SIZE = 10;

const emptyForm = { name: "", email: "", phone: "", role: "CONSUMER", password: "" };

export default function DeveloperUserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setUsers(await getDeveloperUsers());
    } catch {
      toast.error("Could not load developer user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => users.filter((user) => {
    const target = `${user.name} ${user.email} ${user.role}`.toLowerCase();
    return target.includes(query.toLowerCase());
  }), [query, users]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, phone: "", role: user.role, password: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (editing) {
        await updateDeveloperUser(editing.id, form);
        toast.success("User updated.");
      } else {
        await createDeveloperUser(form);
        toast.success("User created.");
      }
      setModalOpen(false);
      await loadUsers();
    } catch {
      toast.error(editing ? "Could not update user." : "Could not create user.");
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Delete ${user.name}?`)) return;
    try {
      await deleteDeveloperUser(user.id);
      toast.success("User deleted.");
      await loadUsers();
    } catch {
      toast.error("Could not delete user.");
    }
  };

  const handleBanToggle = async (user: AdminUser) => {
    try {
      if (user.status === "Suspended") {
        await unbanDeveloperUser(user.id);
        toast.success("User unbanned.");
      } else {
        await banDeveloperUser(user.id);
        toast.success("User banned.");
      }
      await loadUsers();
    } catch {
      toast.error("Could not update user access.");
    }
  };

  const handleExport = () => {
    const rows = [["Name", "Email", "Role", "Status"], ...users.map((user) => [user.name, user.email, user.role, user.status])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "developer-users.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Users exported.");
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search developer users..." />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">User Management</h1>
            <p className="text-[14px] text-[#64748b] mt-1">{loading ? "Loading users..." : "Create, edit, delete, ban, and unban platform users."}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-lg border border-[#bccbb9] bg-white px-3 py-1.5 text-[12px] font-medium text-[#374151] shadow-sm hover:bg-gray-50"><Download size={14} />Export CSV</button>
            <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm hover:bg-[#005a26]"><Plus size={14} />Add User</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Total Users" value={String(users.length)} sub="Live from database" subVariant="green" topBorderColor="#006e2f" icon={<Users size={18} />} accent="#006e2f" />
          <MetricCard label="Active Users" value={String(users.filter((u) => u.status === "Active").length)} sub="Can access the platform" subVariant="blue" topBorderColor="#005ac2" icon={<CheckCircle size={18} />} accent="#005ac2" />
          <MetricCard label="Banned Users" value={String(users.filter((u) => u.status === "Suspended").length)} sub="Blocked from login" subVariant="amber" topBorderColor="#f59e0b" icon={<Ban size={18} />} accent="#f59e0b" />
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
            <div><h2 className="text-[16px] font-semibold text-[#0b1c30]">User Directory</h2><p className="text-[12px] text-[#64748b]">Developer CRUD operations</p></div>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search users..." className="w-[220px] rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-[12px] text-[#374151] outline-none focus:border-[#006e2f]" />
          </div>
          <table className="w-full">
            <thead><tr className="bg-[#f8fafc]">{["USER", "EMAIL", "ROLE", "STATUS", "ACTIONS"].map((header) => <th key={header} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{header}</th>)}</tr></thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc]">
                  <td className="px-6 py-3 text-[13px] font-medium text-[#0b1c30]">{user.name}</td>
                  <td className="px-6 py-3 text-[13px] text-[#64748b]">{user.email}</td>
                  <td className="px-6 py-3"><span className="rounded-full bg-[#dbeafe] px-2.5 py-0.5 text-[11px] font-medium text-[#1e40af]">{user.role}</span></td>
                  <td className="px-6 py-3 text-[13px]" style={{ color: user.status === "Active" ? "#006e2f" : "#ef4444" }}>{user.status}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(user)} className="rounded p-1.5 text-[#005ac2] hover:bg-blue-50" title="Edit user"><Pencil size={15} /></button>
                      <button onClick={() => handleBanToggle(user)} className={`rounded p-1.5 ${user.status === "Suspended" ? "text-[#006e2f] hover:bg-green-50" : "text-[#ef4444] hover:bg-red-50"}`} title={user.status === "Suspended" ? "Unban user" : "Ban user"}>{user.status === "Suspended" ? <CheckCircle size={15} /> : <Ban size={15} />}</button>
                      <button onClick={() => handleDelete(user)} className="rounded p-1.5 text-[#ef4444] hover:bg-red-50" title="Delete user"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-[#f1f5f9] px-6 py-3">
            <p className="text-[12px] text-[#94a3b8]">Showing {visibleUsers.length} of {filtered.length}</p>
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
            <h2 className="text-[20px] font-bold text-[#0b1c30]">{editing ? "Edit User" : "Add User"}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <label className="col-span-2 text-[12px] font-semibold text-[#374151]">Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" /></label>
              <label className="col-span-2 text-[12px] font-semibold text-[#374151]">Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" /></label>
              <label className="text-[12px] font-semibold text-[#374151]">Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" /></label>
              <label className="text-[12px] font-semibold text-[#374151]">Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]">{ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role}</option>)}</select></label>
              {!editing && <label className="col-span-2 text-[12px] font-semibold text-[#374151]">Password<input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Default: Password@123" className="mt-1 w-full rounded-lg border border-[#e2e8f0] px-3 py-2 text-[13px] outline-none focus:border-[#006e2f]" /></label>}
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
