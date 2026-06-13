import { Download, UserPlus, Users, Zap, Clock } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import { UserTable } from "../../components/UserTable";
import { Button } from "../../../shared/components/Button";
import { MOCK_USERS } from "../../../shared/constants/adminData";

export default function UserManagementPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar
        actionLabel="+ Add Vendor"
        searchPlaceholder="Search system logs, users, or restaurants…"
      />
      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">User Management</h1>
            <p className="text-[14px] text-[#64748b] mt-1">Monitor platform activity and manage member access permissions.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={<Download size={14} />}>Export CSV</Button>
            <Button icon={<UserPlus size={14} />}>Add New User</Button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            label="Total Users"
            value="12,482"
            sub="+8.4% from last month"
            subVariant="green"
            topBorderColor="#006e2f"
            icon={<Users size={18} />}
            accent="#006e2f"
          />
          <MetricCard
            label="Active Now"
            value="1,204"
            sub="Live platform traffic"
            subVariant="blue"
            topBorderColor="#005ac2"
            icon={<Zap size={18} />}
            accent="#005ac2"
          />
          <MetricCard
            label="Pending Approval"
            value="84"
            sub="! Requires immediate review"
            subVariant="amber"
            topBorderColor="#f59e0b"
            icon={<Clock size={18} />}
            accent="#f59e0b"
          />
        </div>

        {/* User table */}
        <UserTable users={MOCK_USERS} />
      </div>
    </div>
  );
}
