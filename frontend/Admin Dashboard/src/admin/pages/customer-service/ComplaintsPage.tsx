import { AlertCircle, CheckCircle, Clock, Users } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import { TicketTable } from "../../components/TicketTable";
import { MOCK_TICKETS } from "../../../shared/constants/adminData";

export default function ComplaintsPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar
        actionLabel="+ Add Vendor"
        searchPlaceholder="Search system logs, users, or restaurants…"
      />
      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">Ticket Resolution Center</h1>
          <p className="text-[14px] text-[#64748b] mt-1">Manage and resolve incoming complaints from users and vendors in real-time.</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Urgent Pending"
            value="24"
            sub="↑ 12%  · vs last hour"
            subVariant="red"
            topBorderColor="#ef4444"
            icon={<AlertCircle size={18} />}
            accent="#ef4444"
          />
          <MetricCard
            label="Resolved Today"
            value="148"
            sub="↑ 8%  · vs yesterday"
            subVariant="green"
            topBorderColor="#006e2f"
            icon={<CheckCircle size={18} />}
            accent="#006e2f"
          />
          <MetricCard
            label="Avg. Response"
            value="14m"
            sub="Target: &lt;15m  · On track"
            subVariant="blue"
            topBorderColor="#005ac2"
            icon={<Clock size={18} />}
            accent="#005ac2"
          />
          <MetricCard
            label="CS Capacity"
            value="92%"
            sub="Team utilisation"
            subVariant="amber"
            topBorderColor="#f59e0b"
            icon={<Users size={18} />}
            accent="#f59e0b"
          />
        </div>

        {/* Ticket table */}
        <TicketTable tickets={MOCK_TICKETS} />
      </div>
    </div>
  );
}
