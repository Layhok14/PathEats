import { useState } from "react";
import { Upload, HardDrive, Cloud, Clock, Shield, CheckCircle } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { Button } from "../../../shared/components/Button";
import { MetricCard } from "../../components/MetricCard";
import { BACKUP_ENTRIES } from "../../../shared/constants/developerData";

const backupIcons: Record<string, typeof HardDrive> = {
  db: HardDrive,
  file: Cloud,
  clock: Clock,
  vendor: Shield,
};

export default function BackupRecoveryPage() {
  const [policyOpen, setPolicyOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Custom top bar with "Admin Portal" centre label */}
      <div className="h-16 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center justify-between px-8 gap-4 shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sticky top-0 z-10">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input className="pl-9 pr-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white w-[240px] text-[#374151] placeholder:text-[#94a3b8]" placeholder="Search backups…" />
        </div>
        <span className="text-[14px] font-semibold text-[#0b1c30]">Admin Portal</span>
        <div className="flex items-center gap-3 ml-auto">
          <button className="p-2 rounded-lg text-[#64748b] hover:bg-gray-100"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
          <button className="p-2 rounded-lg text-[#64748b] hover:bg-gray-100"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
          <div className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0]">
            <div className="text-right">
              <p className="text-[12px] font-semibold text-[#0b1c30]">Admin User</p>
              <p className="text-[11px] text-[#64748b]">System Architect</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1a1a2e] flex items-center justify-center text-white text-[12px] font-bold shrink-0">AU</div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Backup & Recovery</h1>
            <p className="text-[13px] text-[#64748b] mt-0.5 max-w-lg">Ensure data integrity with automated recovery points and secure archival of PathEat's core routing and vendor databases.</p>
          </div>
          <div className="flex gap-3">
            <Button icon={<Upload size={14} />}>Create Full Backup</Button>
            <Button variant="outline">Differential</Button>
            <Button variant="outline">Incremental</Button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Storage Used" value="1.2 TB" sub="+2.4% this week" subVariant="green" topBorderColor="#006e2f" icon={<HardDrive size={18} />} accent="#006e2f" />
          <MetricCard label="Active Backups" value="48" sub="Stable" subVariant="blue" topBorderColor="#005ac2" icon={<Cloud size={18} />} accent="#005ac2" />
          <MetricCard label="Last Success" value="2h ago" sub="On Time" subVariant="amber" topBorderColor="#f59e0b" icon={<Clock size={18} />} accent="#f59e0b" />
          <MetricCard label="Recovery Health" value="99.9%" sub="Optimal" subVariant="green" topBorderColor="#006e2f" icon={<Shield size={18} />} accent="#006e2f" />
        </div>

        {/* Table + policy */}
        <div className="grid grid-cols-[1fr_280px] gap-4 items-start">
          {/* Backup archive */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
              <h2 className="text-[15px] font-semibold text-[#0b1c30]">Recent Backup Archive</h2>
              <button className="text-[12px] font-medium text-[#006e2f] hover:underline">View All ›</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8fafc]">
                  {["BACKUP NAME", "DATE CREATED", "SIZE", "STATUS"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BACKUP_ENTRIES.map((b) => {
                  const Icon = backupIcons[b.icon] ?? HardDrive;
                  return (
                    <tr key={b.name} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Icon size={15} className="text-[#006e2f] shrink-0" />
                          <span className="text-[13px] font-mono font-medium text-[#0b1c30]">{b.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[#64748b] whitespace-pre-line">{b.dateCreated}</td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#0b1c30]">{b.size}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${b.status === "COMPLETED" ? "bg-green-100 text-green-700" : b.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Retention policy */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#006e2f]" />
              <h2 className="text-[15px] font-semibold text-[#0b1c30]">Retention Policy</h2>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { title: "Daily Snapshots", desc: "Retained for 30 consecutive days." },
                { title: "Monthly Archives", desc: "Stored securely for 12 months." },
              ].map((item) => (
                <div key={item.title} className="flex gap-2">
                  <CheckCircle size={15} className="text-[#006e2f] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#0b1c30]">{item.title}</p>
                    <p className="text-[12px] text-[#64748b] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full justify-center mt-2" onClick={() => setPolicyOpen(!policyOpen)}>
              Edit Policy
            </Button>
            {policyOpen && (
              <div className="mt-2 p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] text-[12px] text-[#64748b]">
                Policy editor coming soon. Contact your system administrator to modify retention rules.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
