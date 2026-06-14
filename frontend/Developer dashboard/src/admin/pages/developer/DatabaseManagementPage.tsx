import { useState } from "react";
import { RefreshCw, Terminal, Info } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { Button } from "../../../shared/components/Button";
import { DB_TABLES } from "../../../shared/constants/developerData";

const statusStyle: Record<string, string> = {
  Optimized: "bg-green-100 text-green-700",
  Fragmented: "bg-amber-100 text-amber-700",
  "Vacuum Required": "bg-red-100 text-red-700",
};

const tableIcons: Record<string, string> = {
  vendor: "🏪",
  menu: "🍽️",
  user: "👤",
  route: "🗺️",
  order: "🛒",
};

export default function DatabaseManagementPage() {
  const [storageUsed] = useState(34.2);
  const storageTotal = 50;
  const storagePct = (storageUsed / storageTotal) * 100;

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search tables or queries…" actionLabel="" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#0b1c30]">Database Management</h1>
            <p className="text-[13px] text-[#64748b] mt-0.5">Manage core tables, optimize performance, and monitor PostgreSQL instance health.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon={<RefreshCw size={14} />}>Refresh Data</Button>
            <Button icon={<Terminal size={14} />}>SQL Console</Button>
          </div>
        </div>

        <div className="grid grid-cols-[340px_1fr] gap-4 items-start">
          {/* Instance details */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded bg-green-50 flex items-center justify-center">
                  <svg width="14" height="14" fill="#006e2f" viewBox="0 0 24 24"><path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 12c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23C7.61 15.58 9.72 16 12 16s4.39-.42 6-1.23V17zm0-5c0 .5-2.13 2-6 2s-6-1.5-6-2V9.77C7.61 10.58 9.72 11 12 11s4.39-.42 6-1.23V12z" /></svg>
                </div>
                <p className="text-[14px] font-semibold text-[#0b1c30]">Instance Details</p>
              </div>
              {[
                { label: "Engine", value: "PostgreSQL 15.4" },
                { label: "Region", value: "us-east-1 (N. Virginia)" },
                { label: "Active Connections", value: "42 / 100", valueColor: "#006e2f" },
                { label: "Uptime", value: "142 days, 06:12:44" },
              ].map(({ label, value, valueColor }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#f1f5f9] last:border-0">
                  <span className="text-[13px] text-[#64748b]">{label}</span>
                  <span className="text-[13px] font-semibold" style={{ color: valueColor ?? "#0b1c30" }}>{value}</span>
                </div>
              ))}

              {/* Storage bar */}
              <div className="pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b] mb-2">Storage Usage</p>
                <div className="h-2.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#006e2f] rounded-full transition-all" style={{ width: `${storagePct}%` }} />
                </div>
                <div className="flex justify-between mt-1.5 text-[12px]">
                  <span className="text-[#006e2f] font-medium">{storageUsed} GB Used</span>
                  <span className="text-[#94a3b8]">{storageTotal} GB Total</span>
                </div>
              </div>
            </div>

            {/* Maintenance notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
              <Info size={16} className="text-[#006e2f] shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#006e2f]">Scheduled Maintenance</p>
                <p className="text-[12px] text-[#374151] mt-0.5">Automatic optimization scheduled for Sunday at 02:00 UTC. No downtime expected.</p>
              </div>
            </div>
          </div>

          {/* Tables */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="text-[15px] font-semibold text-[#0b1c30]">Database Tables</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8fafc]">
                  {["TABLE NAME", "ROW COUNT", "SIZE", "LAST OPTIMIZED", "STATUS"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DB_TABLES.map((t) => (
                  <tr key={t.name} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[16px]">{tableIcons[t.icon]}</span>
                        <span className="text-[13px] font-mono font-medium text-[#0b1c30]">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-[#374151]">{t.rowCount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-[13px] text-[#374151]">{t.size}</td>
                    <td className="px-5 py-3 text-[12px] text-[#94a3b8]">{t.lastOptimized}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyle[t.status]}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 border-t border-[#f1f5f9]">
              <button className="text-[12px] font-medium text-[#006e2f] hover:underline">View 18 More System Tables</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
