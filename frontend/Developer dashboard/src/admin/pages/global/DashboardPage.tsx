import { Users, Store, AlertTriangle, ShoppingBag } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { MetricCard } from "../../components/MetricCard";
import { GrowthChart } from "../../components/GrowthChart";
import { SystemActivity } from "../../components/SystemActivity";
import { GROWTH_DATA, SYSTEM_ACTIVITY } from "../../../shared/constants/adminData";

export default function DashboardPage() {
  const metrics = [
    { label: "Total Users", value: "1,240", sub: "+12%  · New signups this week", subVariant: "green" as const, accent: "#006e2f", topBorderColor: "#006e2f", icon: <Users size={18} /> },
    { label: "Active Restaurants", value: "256", sub: "+8.4%  · Onboarded vendors", subVariant: "blue" as const, accent: "#005ac2", topBorderColor: "#005ac2", icon: <Store size={18} /> },
    { label: "Open Complaints", value: "76", sub: "CRITICAL · Requires urgent review", subVariant: "red" as const, accent: "#ba1a1a", topBorderColor: "#ba1a1a", icon: <AlertTriangle size={18} /> },
    { label: "Total Orders", value: "1,890", sub: "+15%  · Processed in 24h", subVariant: "amber" as const, accent: "#f59e0b", topBorderColor: "#f59e0b", icon: <ShoppingBag size={18} /> },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="+ Add Vendor" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Page header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#0b1c30]">System Overview</h1>
          <p className="text-[14px] text-[#64748b] mt-1">Real-time status of the PathEat ecosystem</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-[1fr_320px] gap-4">
          <GrowthChart data={GROWTH_DATA} />
          <SystemActivity items={SYSTEM_ACTIVITY} />
        </div>
      </div>
    </div>
  );
}
