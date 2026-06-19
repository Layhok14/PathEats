import { useEffect, useState } from "react";
import { Download, Users, Zap, Clock } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import { UserTable } from "../../components/UserTable";
import {
  checkAdminDatabase,
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUser,
} from "../../services/adminDashboardService";

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setMessage("");
      const [userRows, dbStatus] = await Promise.all([
        getAdminUsers(),
        checkAdminDatabase().catch(() => ({ connected: false, checkedAt: null })),
      ]);
      setUsers(userRows);
      setDbConnected(dbStatus.connected);
    } catch {
      const text = "Could not load users. Check admin login token and database connection.";
      setMessage(text);
      toast.error(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateAdminUserStatus(id, status);
      await loadUsers();
      toast.success(`User ${status === "Active" ? "activated" : "suspended"}.`);
    } catch {
      const text = "Could not update user status.";
      setMessage(text);
      toast.error(text);
    }
  };

  const handleRole = async (id: string, role: string) => {
    try {
      await updateAdminUserRole(id, role);
      await loadUsers();
      toast.success(`User role updated to ${role}.`);
    } catch {
      const text = "Could not update user role.";
      setMessage(text);
      toast.error(text);
    }
  };

  const handleExport = () => {
    if (users.length === 0) {
      toast.error("No users to export.");
      return;
    }

    const rows = [
      ["Name", "Email", "Role", "Status"],
      ...users.map((user) => [user.name, user.email, user.role, user.status]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "patheat-users.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Users exported.");
  };

  const activeUsers = users.filter((user) => user.status === "Active").length;
  const pendingUsers = users.filter((user) => user.status !== "Active").length;

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search system logs, users, or vendors..." />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">User Management</h1>
            <p className="text-[14px] text-[#64748b] mt-1">
              {loading ? "Loading users..." : "Monitor platform activity and manage member access permissions."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold ${dbConnected ? "bg-green-50 text-[#006e2f]" : "bg-red-50 text-[#ba1a1a]"}`}>
              DB {dbConnected ? "Connected" : "Not Connected"}
            </span>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50 shadow-sm px-3 py-1.5 text-[12px]"
            >
              <Download size={14} />Export CSV
            </button>
          </div>
        </div>

        {message && (
          <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[13px] text-[#92400e]">
            {message}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <MetricCard label="Total Users" value={String(users.length)} sub="Live from database" subVariant="green" topBorderColor="#006e2f" icon={<Users size={18} />} accent="#006e2f" />
          <MetricCard label="Active Users" value={String(activeUsers)} sub="Allowed to access platform" subVariant="blue" topBorderColor="#005ac2" icon={<Zap size={18} />} accent="#005ac2" />
          <MetricCard label="Suspended" value={String(pendingUsers)} sub="Requires admin review" subVariant="amber" topBorderColor="#f59e0b" icon={<Clock size={18} />} accent="#f59e0b" />
        </div>

        <UserTable
          users={users}
          onActivate={(id) => handleStatus(id, "Active")}
          onSuspend={(id) => handleStatus(id, "Suspended")}
          onRoleChange={handleRole}
        />
      </div>
    </div>
  );
}
