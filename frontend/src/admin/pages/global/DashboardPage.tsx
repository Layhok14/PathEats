import { useEffect, useMemo, useState } from "react";
import { KeyRound, Pencil, ShieldCheck, Table2, Trash2, Unlock } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import CreateRoleModal from "../../components/Add-role";
import { deleteAdminRole, getAdminRoles, type AdminRole } from "../../services/adminDashboardService";

const PAGE_SIZE = 6;

function formatDate(value: string) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);

  const loadRoles = async () => {
    try {
      setLoading(true);
      setMessage("");
      const rows = await getAdminRoles();
      setRoles(rows);
    } catch (err) {
      console.error("[DashboardPage] Failed to load roles:", err);
      const text = "Could not load roles from database.";
      setMessage(text);
      toast.error(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return roles;
    return roles.filter((role) =>
      role.name.toLowerCase().includes(search) ||
      role.privileges.join(" ").toLowerCase().includes(search) ||
      role.tables.join(" ").toLowerCase().includes(search)
    );
  }, [roles, query]);

  const totalPages = Math.max(Math.ceil(filteredRoles.length / PAGE_SIZE), 1);
  const visibleRoles = filteredRoles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const uniqueTables = new Set(roles.flatMap((role) => role.tables)).size;
  const grantableRoles = roles.filter((role) => role.grantOption).length;
  const totalPrivileges = roles.reduce((sum, role) => sum + role.privileges.length, 0);

  const openCreateRole = () => {
    setEditingRole(null);
    setShowRoleModal(true);
  };

  const openEditRole = (role: AdminRole) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const handleDeleteRole = async (role: AdminRole) => {
    if (!confirm(`Delete role "${role.name}"?`)) return;

    try {
      await deleteAdminRole(role.id);
      toast.success(`Role "${role.name}" deleted.`);
      await loadRoles();
    } catch (err) {
      console.error("[DashboardPage] Failed to delete role:", err);
      toast.error("Could not delete role.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" />
      <CreateRoleModal
        isOpen={showRoleModal}
        role={editingRole}
        onClose={() => {
          setShowRoleModal(false);
          setEditingRole(null);
        }}
        onCreated={loadRoles}
      />

      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Role Management</h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              {loading ? "Loading roles..." : "Manage database roles, privileges, and table access."}
            </p>
          </div>
          <button
            onClick={openCreateRole}
            className="inline-flex items-center gap-2 font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] shadow-sm px-3 py-1.5 text-[12px]"
          >
            Create role
          </button>
        </div>

        {message && (
          <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[13px] text-[#92400e]">
            {message}
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Total Roles" value={String(roles.length)} sub="Live from role table" subVariant="green" topBorderColor="#006e2f" icon={<ShieldCheck size={18} />} accent="#006e2f" />
          <MetricCard label="Privileges" value={String(totalPrivileges)} sub="Assigned permissions" subVariant="blue" topBorderColor="#005ac2" icon={<KeyRound size={18} />} accent="#005ac2" />
          <MetricCard label="Tables Covered" value={String(uniqueTables)} sub="Database access scope" subVariant="amber" topBorderColor="#f59e0b" icon={<Table2 size={18} />} accent="#f59e0b" />
          <MetricCard label="Grant Option" value={String(grantableRoles)} sub="Can grant permissions" subVariant="neutral" topBorderColor="#64748b" icon={<Unlock size={18} />} accent="#64748b" />
        </div>

        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-[#f1f5f9] flex-wrap gap-3">
            <div>
              <h2 className="text-[16px] font-semibold text-[#0b1c30]">Database Roles</h2>
              <p className="text-[12px] text-[#64748b]">Roles are loaded from your database role table.</p>
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              <input
                type="text"
                placeholder="Search roles..."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-1.5 text-[12px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[220px] text-[#374151] placeholder:text-[#94a3b8]"
              />
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc]">
                {["ROLE", "PRIVILEGES", "TABLE ACCESS", "GRANT OPTION", "CREATED", "ACTIONS"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleRoles.map((role) => (
                <tr key={role.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#dcfce7] flex items-center justify-center text-[#006e2f] text-[13px] font-bold shrink-0">
                        {role.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[#0b1c30]">{role.name}</p>
                        <p className="text-[11px] text-[#94a3b8]">ID: {role.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                      {role.privileges.length ? role.privileges.map((privilege) => (
                        <span key={privilege} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#dbeafe] text-[#1e40af]">{privilege}</span>
                      )) : <span className="text-[12px] text-[#94a3b8]">None</span>}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                      {role.tables.length ? role.tables.map((table) => (
                        <span key={table} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f1f5f9] text-[#475569]">{table}</span>
                      )) : <span className="text-[12px] text-[#94a3b8]">None</span>}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-[12px] font-semibold ${role.grantOption ? "text-[#006e2f]" : "text-[#64748b]"}`}>
                      {role.grantOption ? "ENABLED" : "DISABLED"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[13px] text-[#64748b]">{formatDate(role.createdAt)}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditRole(role)}
                        className="p-1.5 rounded text-[#005ac2] hover:bg-blue-50"
                        title="Grant or revoke privileges"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role)}
                        className="p-1.5 rounded text-[#ef4444] hover:bg-red-50"
                        title="Delete role"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
            <p className="text-[12px] text-[#94a3b8]">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26] disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
