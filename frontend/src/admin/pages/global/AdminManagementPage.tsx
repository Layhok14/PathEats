import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Users, Plus, Pencil, Trash2, Search, KeyRound, Unlock, Table2, UserPlus, Lock, X, Mail } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import CreateRoleModal from "../../components/Add-role";
import { getAdminRoles, getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, updateAdminUserStatus, type AdminRole, type AdminUser } from "../../services/adminDashboardService";

const PAGE_SIZE = 6;

function formatDate(value: string) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState<"role" | "user">("role");

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" />
      <div className="px-8 pt-6 pb-0">
        <h1 className="text-[28px] font-bold text-[#0b1c30]">Admin Management</h1>
        <p className="text-[14px] text-[#64748b] mt-1">Manage roles and users across the system.</p>
        <div className="flex gap-1 mt-5 border-b border-[#e2e8f0]">
          <button onClick={() => setActiveTab("role")} className={`px-5 py-2.5 text-[13px] font-medium rounded-t-lg transition-all ${activeTab === "role" ? "bg-white text-[#006e2f] border border-b-white border-[#e2e8f0] -mb-px" : "text-[#64748b] hover:text-[#0b1c30] hover:bg-gray-50"}`}>
            <ShieldCheck size={15} className="inline mr-1.5 -mt-0.5" /> Role Management
          </button>
          <button onClick={() => setActiveTab("user")} className={`px-5 py-2.5 text-[13px] font-medium rounded-t-lg transition-all ${activeTab === "user" ? "bg-white text-[#006e2f] border border-b-white border-[#e2e8f0] -mb-px" : "text-[#64748b] hover:text-[#0b1c30] hover:bg-gray-50"}`}>
            <Users size={15} className="inline mr-1.5 -mt-0.5" /> User Management
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 pt-6">
        {activeTab === "role" ? <RoleManagementSection /> : <UserManagementSection />}
      </div>
    </div>
  );
}

function RoleManagementSection() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const rows = await getAdminRoles();
      setRoles(rows);
    } catch (err) { toast.error("Could not load roles."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadRoles(); }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return roles;
    return roles.filter((r) => r.name.toLowerCase().includes(search));
  }, [roles, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allTables = new Set(roles.flatMap((r) => Object.keys(r.tablePrivileges)));
  const grantable = roles.filter((r) => r.grantOption).length;

  return (
    <>
      <CreateRoleModal isOpen={showRoleModal} role={editingRole} onClose={() => { setShowRoleModal(false); setEditingRole(null); }} onCreated={loadRoles} />
      <div className="flex items-start justify-between mb-5">
        <p className="text-[14px] text-[#64748b]">{loading ? "Loading..." : "Create, edit, and delete database roles."}</p>
        <button onClick={() => setShowRoleModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#005a26] shadow-sm"><Plus size={14} /> Create role</button>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Roles" value={String(roles.length)} sub="Live from role table" subVariant="green" topBorderColor="#006e2f" icon={<ShieldCheck size={18} />} accent="#006e2f" />
        <MetricCard label="Tables Covered" value={String(allTables.size)} sub="Database access scope" subVariant="amber" topBorderColor="#f59e0b" icon={<Table2 size={18} />} accent="#f59e0b" />
        <MetricCard label="Grant Option" value={String(grantable)} sub="Can grant permissions" subVariant="neutral" topBorderColor="#64748b" icon={<Unlock size={18} />} accent="#64748b" />
        <MetricCard label="Total Privileges" value={String(roles.reduce((s, r) => s + Object.values(r.tablePrivileges).flat().length, 0))} sub="Assigned permissions" subVariant="blue" topBorderColor="#005ac2" icon={<KeyRound size={18} />} accent="#005ac2" />
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-[#f1f5f9]">
          <h2 className="text-[16px] font-semibold text-[#0b1c30]">Database Roles</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input type="text" placeholder="Search roles..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[220px]" />
          </div>
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#f8fafc]">{["ROLE", "TABLE PRIVILEGES", "GRANT", "CREATED", "ACTIONS"].map(h => <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>)}</tr></thead>
          <tbody>
            {visible.map((role) => (
              <tr key={role.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#dcfce7] flex items-center justify-center text-[#006e2f] text-[13px] font-bold shrink-0">{role.name.slice(0,2).toUpperCase()}</div>
                    <span className="text-[13px] font-medium text-[#0b1c30]">{role.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex flex-wrap gap-1.5 max-w-[400px]">
                    {Object.entries(role.tablePrivileges).length > 0 ? Object.entries(role.tablePrivileges).map(([t, p]) => p.length > 0 ? <span key={t} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f1f5f9] text-[#475569]">{t}: {p.join(",")}</span> : null) : <span className="text-[12px] text-[#94a3b8]">None</span>}
                  </div>
                </td>
                <td className="px-6 py-3"><span className={`text-[12px] font-semibold ${role.grantOption ? "text-[#006e2f]" : "text-[#64748b]"}`}>{role.grantOption ? "Yes" : "No"}</span></td>
                <td className="px-6 py-3 text-[13px] text-[#64748b]">{formatDate(role.createdAt)}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingRole(role); setShowRoleModal(true); }} className="p-1.5 rounded text-[#005ac2] hover:bg-blue-50"><Pencil size={15} /></button>
                    <button onClick={() => { if(confirm(`Delete "${role.name}"?`)) {}} } className="p-1.5 rounded text-[#ef4444] hover:bg-red-50"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">No roles found.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
          <p className="text-[12px] text-[#94a3b8]">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}

function UserManagementSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const rows = await getAdminUsers();
      setUsers(rows.users);
    } catch (err) { toast.error("Could not load users."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return users;
    return users.filter((u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
  }, [users, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="flex items-start justify-between mb-5">
        <p className="text-[14px] text-[#64748b]">{loading ? "Loading..." : "View and manage database users."}</p>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#005a26] shadow-sm"><UserPlus size={14} /> Create user</button>
      </div>
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-[#f1f5f9]">
          <h2 className="text-[16px] font-semibold text-[#0b1c30]">Users</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input type="text" placeholder="Search users..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[220px]" />
          </div>
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#f8fafc]">{["USER", "EMAIL", "ROLE", "STATUS"].map(h => <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>)}</tr></thead>
          <tbody>
            {visible.map((u) => (
              <tr key={u.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                <td className="px-6 py-3"><span className="text-[13px] font-medium text-[#0b1c30]">{u.name}</span></td>
                <td className="px-6 py-3 text-[13px] text-[#64748b]">{u.email}</td>
                <td className="px-6 py-3"><span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#dbeafe] text-[#1e40af]">{u.role}</span></td>
                <td className="px-6 py-3"><span className="text-[13px]" style={{ color: u.status === "Active" ? "#006e2f" : "#ef4444" }}>{u.status}</span></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={4} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">No users found.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
          <p className="text-[12px] text-[#94a3b8]">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}