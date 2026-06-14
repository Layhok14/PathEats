import { TopBar } from "../../components/TopBar";

export default function DatabaseManagementPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search tables or queries…" actionLabel="" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <h1 className="text-[24px] font-bold text-[#0b1c30]">Database Management</h1>
        <p className="text-[13px] text-[#64748b]">Manage core tables, optimize performance, and monitor PostgreSQL instance health.</p>
        <div className="grid grid-cols-[340px_1fr] gap-4 items-start">
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col gap-4">
            <p className="text-[14px] font-semibold text-[#0b1c30]">Instance Details</p>
            {[
              { label: "Engine", value: "PostgreSQL 15.4" },
              { label: "Region", value: "us-east-1" },
              { label: "Connections", value: "42 / 100", color: "#006e2f" },
              { label: "Uptime", value: "142 days" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#f1f5f9] last:border-0">
                <span className="text-[13px] text-[#64748b]">{label}</span>
                <span className="text-[13px] font-semibold" style={{ color: color ?? "#0b1c30" }}>{value}</span>
              </div>
            ))}
            <div className="pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b] mb-2">Storage Usage</p>
              <div className="h-2.5 bg-[#e2e8f0] rounded-full overflow-hidden"><div className="h-full bg-[#006e2f] rounded-full" style={{ width: "68%" }} /></div>
              <div className="flex justify-between mt-1.5 text-[12px]"><span className="text-[#006e2f]">34.2 GB Used</span><span className="text-[#94a3b8]">50 GB Total</span></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f1f5f9]"><h2 className="text-[15px] font-semibold text-[#0b1c30]">Database Tables</h2></div>
            <table className="w-full">
              <thead><tr className="bg-[#f8fafc]">{["TABLE NAME", "ROW COUNT", "SIZE", "STATUS"].map((h) => (<th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>))}</tr></thead>
              <tbody>
                {[
                  { name: "vendors", rows: "1,248", size: "4.2 MB", status: "Optimized" },
                  { name: "menu_items", rows: "24,592", size: "18.6 MB", status: "Fragmented" },
                  { name: "users", rows: "86,402", size: "112.4 MB", status: "Optimized" },
                  { name: "routes", rows: "12,110", size: "8.9 MB", status: "Optimized" },
                  { name: "orders", rows: "342,881", size: "1.2 GB", status: "Vacuum Required" },
                ].map((t) => (
                  <tr key={t.name} className="border-t border-[#f1f5f9]">
                    <td className="px-5 py-3 font-mono text-[13px] font-medium text-[#0b1c30]">{t.name}</td>
                    <td className="px-5 py-3 text-[13px] text-[#374151]">{t.rows}</td>
                    <td className="px-5 py-3 text-[13px] text-[#374151]">{t.size}</td>
                    <td className="px-5 py-3"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${t.status === "Optimized" ? "bg-green-100 text-green-700" : t.status === "Fragmented" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
