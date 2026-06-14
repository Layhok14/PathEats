export default function DeveloperDashboard() {
  const metrics = [
    { label: "API Uptime", value: "98.7%", sub: "Last 30 days", good: true },
    { label: "DB Queries/s", value: "32", sub: "+4 from yesterday", good: true },
    { label: "Avg Latency", value: "124ms", sub: "P95: 310ms", good: false },
    { label: "Error Rate", value: "2", sub: "Errors today", good: true },
  ];

  const backups = [
    { name: "db-backup-2026-06-12-00:00", size: "1.2 GB", status: "Success", time: "Today 00:00" },
    { name: "db-backup-2026-06-11-00:00", size: "1.1 GB", status: "Success", time: "Yesterday 00:00" },
    { name: "db-backup-2026-06-10-00:00", size: "1.1 GB", status: "Success", time: "Jun 10 00:00" },
    { name: "db-backup-2026-06-09-00:00", size: "1.0 GB", status: "Failed", time: "Jun 9 00:00" },
  ];

  const logs = [
    { level: "ERROR", message: "Timeout on /api/v1/orders endpoint", time: "08:42:11", service: "order-service" },
    { level: "WARN", message: "High memory usage on worker-03 (87%)", time: "08:30:05", service: "worker" },
    { level: "INFO", message: "Deployment completed: v2.4.1 → v2.4.2", time: "07:15:00", service: "deploy" },
    { level: "INFO", message: "Scheduled backup started", time: "00:00:01", service: "db-backup" },
    { level: "ERROR", message: "Payment gateway connection refused", time: "Yesterday 23:58", service: "payment-service" },
  ];

  const levelStyle: Record<string, string> = {
    ERROR: "bg-red-100 text-red-700",
    WARN: "bg-yellow-100 text-yellow-700",
    INFO: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#0b1c30]">Developer Overview</h1>
          <p className="text-[13px] text-[#64748b] mt-0.5">Database backups, diagnostics and telemetry</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#006e2f] bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#006e2f] inline-block animate-pulse" />
            All Systems Operational
          </span>
          <button className="px-4 py-2 rounded-lg bg-[#006e2f] text-white text-[13px] font-medium hover:bg-[#005a26] transition-colors">
            Run Diagnostic
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b] mb-2">{m.label}</p>
            <p className="text-[30px] font-bold text-[#0b1c30] leading-none">{m.value}</p>
            <p className={`text-[11px] mt-1.5 ${m.good ? "text-[#006e2f]" : "text-red-500"}`}>{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Backups */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
            <h2 className="text-[15px] font-semibold text-[#0b1c30]">Database Backups</h2>
            <button className="text-[12px] text-[#006e2f] font-medium hover:underline">Create Backup</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc]">
                {["Backup Name", "Size", "Status", "Time"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr key={b.name} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3 text-[12px] text-[#0b1c30] font-mono truncate max-w-[140px]">{b.name}</td>
                  <td className="px-4 py-3 text-[12px] text-[#475569]">{b.size}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${b.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#94a3b8]">{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
            <h2 className="text-[15px] font-semibold text-[#0b1c30]">System Logs</h2>
            <select className="text-[11px] px-2.5 py-1 border border-[#e2e8f0] rounded-lg outline-none bg-white focus:border-[#006e2f]">
              <option>All Levels</option>
              <option>ERROR</option>
              <option>WARN</option>
              <option>INFO</option>
            </select>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {logs.map((log, i) => (
              <div key={i} className="px-5 py-3 hover:bg-[#f8fafc] transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${levelStyle[log.level]}`}>{log.level}</span>
                  <span className="text-[10px] text-[#94a3b8] font-mono">{log.time}</span>
                  <span className="text-[10px] text-[#cbd5e1] font-mono">[{log.service}]</span>
                </div>
                <p className="text-[12px] text-[#374151]">{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
