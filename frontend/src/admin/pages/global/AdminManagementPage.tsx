import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Users, Plus, Pencil, Trash2, Search, KeyRound, Unlock, Table2, UserPlus, Lock, X } from "lucide-react";
import { toast } from "sonner";
import { MetricCard } from "../../components/MetricCard";
import { LoadingSpinner } from "../../../shared/components/LoadingSpinner";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { formatDate } from "../../../shared/utils/formatters";
import CreateRoleModal from "../../components/AddRole";
import {
  getAdminRoles, getAdminUsers, createAdminUser, updateAdminUser, updateAdminUserStatus, deleteAdminRole, deleteAdminUser,
  type AdminRole, type AdminUser,
} from "../../services/adminDashboardService";

const PAGE_SIZE = 6;

export default function AdminManagementPage() {
  const [activeTab, setActiveTab] = useState<"role" | "user">("role");
  const [userRoleFilter, setUserRoleFilter] = useState<string | null>(null);

  const handleRoleUserCountClick = (roleId: string) => {
    setUserRoleFilter(roleId);
    setActiveTab("user");
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
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
        {activeTab === "role"
          ? <RoleManagementSection onUserCountClick={handleRoleUserCountClick} />
          : <UserManagementSection initialRoleFilter={userRoleFilter} onClearRoleFilter={() => setUserRoleFilter(null)} />}
      </div>
    </div>
  );
}

function RoleManagementSection({ onUserCountClick }: { onUserCountClick: (roleId: string) => void }) {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<AdminRole | null>(null);
  const [privilegesRole, setPrivilegesRole] = useState<AdminRole | null>(null);

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

  const handleDeleteRole = async (role: AdminRole) => {
    setConfirmTarget(role);
  };

  return (
    <>
      <CreateRoleModal isOpen={showRoleModal} role={editingRole} onClose={() => { setShowRoleModal(false); setEditingRole(null); }} onCreated={loadRoles} />
      <div className="flex items-start justify-between mb-5">
        <p className="text-[14px] text-[#64748b]">Create application roles and assign table privileges.</p>
        <button onClick={() => setShowRoleModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#005a26] shadow-sm"><Plus size={14} /> Create role</button>
      </div>
      {loading ? (
        <LoadingSpinner message="Loading roles..." />
      ) : (
      <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Roles" value={String(roles.length)} sub="Live from role table" subVariant="green" topBorderColor="#22c55e" icon={<ShieldCheck size={18} />} accent="#22c55e" />
        <MetricCard label="Tables Covered" value={String(allTables.size)} sub="Database access scope" subVariant="green" topBorderColor="#22c55e" icon={<Table2 size={18} />} accent="#22c55e" />
        <MetricCard label="Grant Option" value={String(grantable)} sub="Can grant permissions" subVariant="green" topBorderColor="#22c55e" icon={<Unlock size={18} />} accent="#22c55e" />
        <MetricCard label="Total Users" value={String(roles.reduce((s, r) => s + (r.userCount ?? 0), 0))} sub="Across all roles" subVariant="green" topBorderColor="#22c55e" icon={<Users size={18} />} accent="#22c55e" />
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
          <thead><tr className="bg-[#f8fafc]">{["ROLE", "USERS", "TABLE PRIVILEGES", "GRANT", "CREATED", "ACTIONS"].map(h => <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>)}</tr></thead>
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
                  <button onClick={() => onUserCountClick(role.id)} className={`inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${(role.userCount ?? 0) > 0 ? "bg-blue-50 text-[#005ac2] hover:bg-blue-100" : "bg-gray-50 text-[#94a3b8] hover:bg-gray-100"}`}>
                    {role.userCount ?? 0}
                  </button>
                </td>
                <td className="px-6 py-3">
                  <button onClick={() => setPrivilegesRole(role)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#dcfce7] text-[#006e2f] hover:bg-[#bbf7d0] transition-colors">
                    <Table2 size={12} /> View
                  </button>
                </td>
                <td className="px-6 py-3"><span className={`text-[12px] font-semibold ${role.grantOption ? "text-[#006e2f]" : "text-[#64748b]"}`}>{role.grantOption ? "Yes" : "No"}</span></td>
                <td className="px-6 py-3 text-[13px] text-[#64748b]">{formatDate(role.createdAt, true)}</td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingRole(role); setShowRoleModal(true); }} className="p-1.5 rounded text-[#005ac2] hover:bg-blue-50"><Pencil size={15} /></button>
                    <button onClick={() => handleDeleteRole(role)} disabled={role.isSystem || (role.userCount ?? 0) > 0} title={role.isSystem ? "Built-in roles cannot be deleted" : (role.userCount ?? 0) > 0 ? "Reassign users first" : "Delete role"} className="p-1.5 rounded text-[#ef4444] hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"><Trash2 size={15} /></button>
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
  )}
      <ConfirmDialog
        open={confirmTarget !== null}
        title="Delete Role"
        description={
          (confirmTarget?.userCount ?? 0) > 0
            ? `This role has ${confirmTarget?.userCount} user${(confirmTarget?.userCount ?? 0) === 1 ? "" : "s"} assigned. You must reassign them before deleting.`
            : "Are you sure you want to delete this role? This cannot be undone."
        }
        itemName={confirmTarget?.name}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (!confirmTarget) return;
          try {
            await deleteAdminRole(confirmTarget.id);
            toast.success(`Role "${confirmTarget.name}" deleted.`);
            await loadRoles();
          } catch (err) {
            const msg = err && typeof err === "object" && "response" in err
              ? (err as any).response?.data?.message : undefined;
            toast.error(msg || "Could not delete role.");
          }
          setConfirmTarget(null);
        }}
        onCancel={() => setConfirmTarget(null)}
      />
      {privilegesRole && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setPrivilegesRole(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-6 py-4">
              <div>
                <h2 className="text-[16px] font-bold text-[#0b1c30]">Table Privileges</h2>
                <p className="text-[12px] text-[#64748b] mt-0.5">Role: {privilegesRole.name}</p>
                {privilegesRole.baseScope && <p className="text-[11px] text-[#94a3b8]">System scope: {privilegesRole.baseScope.replaceAll("_", " ")}</p>}
              </div>
              <button onClick={() => setPrivilegesRole(null)} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto">
              {Object.entries(privilegesRole.tablePrivileges).length === 0 ? (
                <p className="text-[13px] text-[#94a3b8]">No table privileges assigned.</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Table</th>
                      <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Privileges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(privilegesRole.tablePrivileges).map(([table, privs]) => (
                      <tr key={table} className="border-t border-[#f1f5f9]">
                        <td className="px-4 py-2.5 text-[13px] font-medium text-[#0b1c30]">{table}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1.5">
                            {(privs as string[]).map((p) => (
                              <span key={p} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#dcfce7] text-[#006e2f]">{p}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="mt-4 flex items-center gap-2 text-[12px] text-[#64748b]">
                <KeyRound size={13} />
                <span>Grant option: <span className={`font-semibold ${privilegesRole.grantOption ? "text-[#006e2f]" : "text-[#64748b]"}`}>{privilegesRole.grantOption ? "Yes" : "No"}</span></span>
              </div>
              {privilegesRole.systemCapabilities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {privilegesRole.systemCapabilities.map((capability) => (
                    <span key={capability} className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#005ac2]">{capability}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UserManagementSection({ initialRoleFilter, onClearRoleFilter }: { initialRoleFilter?: string | null; onClearRoleFilter?: () => void }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState(initialRoleFilter ?? "All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (initialRoleFilter) setRoleFilter(initialRoleFilter);
  }, [initialRoleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const [rows, roleRows] = await Promise.all([
        getAdminUsers(),
        getAdminRoles(),
      ]);
      setUsers(rows);
      setRoles(roleRows);
    } catch (err) { toast.error("Could not load users."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    let result = users;
    if (roleFilter !== "All") result = result.filter((u) => u.roleId === roleFilter);
    if (search) result = result.filter((u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search));
    return result;
  }, [users, query, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteUser = async (user: AdminUser) => {
    setConfirmTarget(user);
  };

  const handleToggleBan = async (user: AdminUser) => {
    const newStatus = user.status === "Suspended" ? "Active" : "Suspended";
    try {
      await updateAdminUserStatus(user.id, newStatus);
      toast.success(`User "${user.name}" is now ${newStatus}.`);
      await loadUsers();
    } catch (err) {
      toast.error("Could not update user status.");
    }
  };

  return (
    <>
      <UserFormModal
        isOpen={showModal}
        user={editingUser}
        roles={roles}
        onClose={() => { setShowModal(false); setEditingUser(null); }}
        onDone={loadUsers}
      />
      <div className="flex items-start justify-between mb-5">
        <p className="text-[14px] text-[#64748b]">View and manage database users.</p>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#006e2f] text-white px-3 py-1.5 text-[12px] font-medium hover:bg-[#005a26] shadow-sm"><UserPlus size={14} /> Create user</button>
      </div>
      {loading ? (
        <LoadingSpinner message="Loading users..." />
      ) : (
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 px-6 pt-4 pb-3 border-b border-[#f1f5f9]">
          <h2 className="text-[16px] font-semibold text-[#0b1c30]">Users</h2>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); if (e.target.value === "All") onClearRoleFilter?.(); }}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-[#e2e8f0] bg-white text-[#374151] outline-none focus:border-[#006e2f]"
          >
            <option value="All">All Roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input type="text" placeholder="Search users..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[200px]" />
          </div>
        </div>
        <table className="w-full">
          <thead><tr className="bg-[#f8fafc]">{["USER", "EMAIL", "ROLE", "STATUS", "ACTIONS"].map(h => <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>)}</tr></thead>
          <tbody>
            {visible.map((u) => (
              <tr key={u.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                <td className="px-6 py-3"><span className="text-[13px] font-medium text-[#0b1c30]">{u.name}</span></td>
                <td className="px-6 py-3 text-[13px] text-[#64748b]">{u.email}</td>
                <td className="px-6 py-3"><span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#dbeafe] text-[#1e40af]">{u.role}</span><p className="mt-1 text-[10px] text-[#94a3b8]">{u.roleScope.replaceAll("_", " ")}</p></td>
                <td className="px-6 py-3"><span className="text-[13px]" style={{ color: u.status === "Active" ? "#006e2f" : "#ef4444" }}>{u.status}</span></td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingUser(u); setShowModal(true); }} className="p-1.5 rounded text-[#005ac2] hover:bg-blue-50"><Pencil size={15} /></button>
                    <button onClick={() => handleToggleBan(u)} className={`p-1.5 rounded ${u.status === "Suspended" ? "text-[#006e2f] hover:bg-green-50" : "text-[#b45309] hover:bg-amber-50"}`}>
                      {u.status === "Suspended" ? <Unlock size={15} /> : <Lock size={15} />}
                    </button>
                    <button onClick={() => handleDeleteUser(u)} className="p-1.5 rounded text-[#ef4444] hover:bg-red-50"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-[13px] text-[#94a3b8]">No users found.</td></tr>}
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
  )}
      <ConfirmDialog
        open={confirmTarget !== null}
        title="Delete User"
        description="Are you sure you want to delete this user? This cannot be undone."
        itemName={confirmTarget ? `${confirmTarget.name} (${confirmTarget.email})` : undefined}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={async () => {
          if (!confirmTarget) return;
          try {
            await deleteAdminUser(confirmTarget.id);
            toast.success(`User "${confirmTarget.name}" deleted.`);
            await loadUsers();
          } catch (err) {
            toast.error("Could not delete user.");
          }
          setConfirmTarget(null);
        }}
        onCancel={() => setConfirmTarget(null)}
      />
    </>
  );
}

function UserFormModal({
  isOpen, user, roles, onClose, onDone,
}: {
  isOpen: boolean;
  user: AdminUser | null;
  roles: AdminRole[];
  onClose: () => void;
  onDone: () => Promise<void>;
}) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(user);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      confirmPassword: "",
      role: user?.roleId ?? "",
    });
    setFieldErrors({});
  }, [isOpen, user]);

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
    if (!form.role) errs.role = "Role is required";
    if (!isEditing) {
      if (!form.password) errs.password = "Password is required";
      else if (form.password.length < 8) errs.password = "At least 8 characters";
      if (!form.confirmPassword) errs.confirmPassword = "Please confirm your password";
      else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const [firstName, ...lastNameParts] = form.name.trim().split(/\s+/);
      const lastName = lastNameParts.join(" ");
      if (isEditing && user) {
        await updateAdminUser(user.id, { firstName, lastName, email: form.email.trim(), roleId: form.role });
        toast.success(`User "${form.name}" updated.`);
      } else {
        await createAdminUser({ name: form.name.trim(), email: form.email.trim(), roleId: form.role, password: form.password });
        toast.success(`User "${form.name}" created.`);
      }
      onClose();
      await onDone();
    } catch (err) {
      const response = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string; fieldErrors?: Record<string, string> } } }).response?.data
        : undefined;
      const msg = response?.message;
      if (response?.fieldErrors) {
        setFieldErrors((previous) => ({ ...previous, ...response.fieldErrors }));
        return;
      }
      if (msg && msg.toLowerCase().includes("email")) {
        setFieldErrors((prev) => ({ ...prev, email: msg }));
      } else {
        toast.error(msg || `${isEditing ? "Update" : "Create"} user failed.`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-bold text-[#0b1c30]">{isEditing ? "Edit User" : "Create User"}</h2>
          <button onClick={onClose} className="p-1 rounded text-[#64748b] hover:bg-[#f1f5f9]"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-[#64748b]">Name *</label>
            <input aria-invalid={Boolean(fieldErrors.name)} value={form.name} onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); clearFieldError("name"); }} placeholder="Full name" className={`w-full mt-1 rounded-lg border px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] ${fieldErrors.name ? "border-[#ba1a1a]" : "border-[#e2e8f0]"}`} />
            {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748b]">Email *</label>
            <input type="email" aria-invalid={Boolean(fieldErrors.email)} value={form.email} onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); clearFieldError("email"); }} placeholder="user@example.com" className={`w-full mt-1 rounded-lg border px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] ${fieldErrors.email ? "border-[#ba1a1a]" : "border-[#e2e8f0]"}`} />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#64748b]">Role *</label>
              <select value={form.role} onChange={(e) => {
                setForm(f => ({ ...f, role: e.target.value }));
                clearFieldError("role");
              }} aria-invalid={Boolean(fieldErrors.role)} className={`w-full mt-1 rounded-lg border px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] ${fieldErrors.role ? "border-[#ba1a1a]" : "border-[#e2e8f0]"}`}>
                <option value="">Select role...</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            {fieldErrors.role && <p className="text-xs text-red-500 mt-1">{fieldErrors.role}</p>}
          </div>
          {!isEditing && (
            <>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Password *</label>
                <input type="password" aria-invalid={Boolean(fieldErrors.password)} value={form.password} onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); clearFieldError("password"); }} placeholder="Enter password" className={`w-full mt-1 rounded-lg border px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] ${fieldErrors.password ? "border-[#ba1a1a]" : "border-[#e2e8f0]"}`} />
                {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#64748b]">Confirm Password *</label>
                <input type="password" aria-invalid={Boolean(fieldErrors.confirmPassword)} value={form.confirmPassword} onChange={(e) => { setForm(f => ({ ...f, confirmPassword: e.target.value })); clearFieldError("confirmPassword"); }} placeholder="Confirm password" className={`w-full mt-1 rounded-lg border px-3 py-2 text-[13px] outline-none focus:border-[#006e2f] ${fieldErrors.confirmPassword ? "border-[#ba1a1a]" : "border-[#e2e8f0]"}`} />
                {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
              </div>
            </>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
            <button type="button" onClick={onClose} className="px-4 py-2 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-60">
              {saving ? "Saving..." : isEditing ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
