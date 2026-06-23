import { MessageSquare, CheckCircle, Clock, TrendingUp } from "lucide-react";

import { MetricCard } from "../../components/MetricCard";

export default function CustomerServiceDashboard() {
  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search users, tickets, or complaints…" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">Customer Service Dashboard</h1>
          <p className="text-[14px] text-[#64748b] mt-1">Monitor support tickets, complaints, and resolution metrics.</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Open Complaints" value="76" sub="Requires attention" subVariant="red" topBorderColor="#ef4444" icon={<MessageSquare size={18} />} accent="#ef4444" />
          <MetricCard label="In Progress" value="34" sub="Being resolved" subVariant="amber" topBorderColor="#f59e0b" icon={<Clock size={18} />} accent="#f59e0b" />
          <MetricCard label="Resolved This Week" value="128" sub="+12% vs last week" subVariant="green" topBorderColor="#006e2f" icon={<CheckCircle size={18} />} accent="#006e2f" />
          <MetricCard label="Avg Response Time" value="4.2m" sub="Fast" subVariant="blue" topBorderColor="#005ac2" icon={<TrendingUp size={18} />} accent="#005ac2" />
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6">
          <h2 className="text-[15px] font-semibold text-[#0b1c30] mb-4">Quick Actions</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-[13px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">View All Tickets</button>
            <button className="px-4 py-2 text-[13px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50">Search User</button>
          </div>
        </div>
      </div>
    </div>
  );
}
