export default function CustomerServiceDashboard() {
  const stats = [
    { label: "Open Tickets", value: "24", color: "#006e2f" },
    { label: "Resolved Today", value: "18", color: "#006e2f" },
    { label: "Total Complaints", value: "142", color: "#0b1c30" },
    { label: "Avg. Response Time", value: "2.1h", color: "#0b1c30" },
  ];

  const complaints = [
    { id: "CS-1041", user: "Sok Dara", issue: "Order not delivered", status: "Open", priority: "High", time: "10 min ago" },
    { id: "CS-1040", user: "Lim Bopha", issue: "Wrong item received", status: "In Progress", priority: "Medium", time: "34 min ago" },
    { id: "CS-1039", user: "Chan Ratha", issue: "Payment failed twice", status: "Open", priority: "High", time: "1h ago" },
    { id: "CS-1038", user: "Noun Sreyleak", issue: "Restaurant closed early", status: "Resolved", priority: "Low", time: "2h ago" },
    { id: "CS-1037", user: "Pich Vireak", issue: "Driver rude behaviour", status: "In Progress", priority: "Medium", time: "3h ago" },
    { id: "CS-1036", user: "Heng Kimchea", issue: "Refund not processed", status: "Open", priority: "High", time: "5h ago" },
  ];

  const statusColor: Record<string, string> = {
    Open: "bg-red-100 text-red-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Resolved: "bg-green-100 text-green-700",
  };

  const priorityColor: Record<string, string> = {
    High: "text-red-600 font-semibold",
    Medium: "text-yellow-600 font-semibold",
    Low: "text-gray-500",
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-[#0b1c30]">Customer Service Overview</h1>
          <p className="text-[13px] text-[#64748b] mt-0.5">Manage complaints, disputes and support tickets</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-white border border-[#e2e8f0] text-[13px] text-[#374151] font-medium shadow-sm hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#006e2f] text-white text-[13px] font-medium hover:bg-[#005a26] transition-colors">
            + New Ticket
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b] mb-2">{s.label}</p>
            <p className="text-[30px] font-bold text-[#0b1c30] leading-none">{s.value}</p>
            <div className="mt-2 h-[3px] w-10 rounded-full bg-[#006e2f] opacity-60" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
          <h2 className="text-[15px] font-semibold text-[#0b1c30]">My Assigned Complaints</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search tickets..."
              className="text-[12px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] w-48"
            />
            <select className="text-[12px] px-3 py-1.5 border border-[#e2e8f0] rounded-lg outline-none focus:border-[#006e2f] bg-white">
              <option>All Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f8fafc] text-left">
              {["Ticket ID", "User", "Issue", "Status", "Priority", "Time"].map((h) => (
                <th key={h} className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
              ))}
              <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, i) => (
              <tr key={c.id} className={`border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors ${i % 2 === 0 ? "" : "bg-[#fafafa]"}`}>
                <td className="px-6 py-3 text-[13px] font-mono text-[#006e2f] font-medium">{c.id}</td>
                <td className="px-6 py-3 text-[13px] text-[#0b1c30]">{c.user}</td>
                <td className="px-6 py-3 text-[13px] text-[#475569] max-w-[200px] truncate">{c.issue}</td>
                <td className="px-6 py-3">
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColor[c.status]}`}>{c.status}</span>
                </td>
                <td className={`px-6 py-3 text-[12px] ${priorityColor[c.priority]}`}>{c.priority}</td>
                <td className="px-6 py-3 text-[12px] text-[#94a3b8]">{c.time}</td>
                <td className="px-6 py-3">
                  <button className="text-[12px] text-[#006e2f] font-medium hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#f1f5f9]">
          <p className="text-[12px] text-[#94a3b8]">Showing 6 of 142 tickets</p>
          <div className="flex gap-1">
            {[1, 2, 3, "..."].map((p) => (
              <button key={p} className={`w-7 h-7 rounded text-[12px] font-medium transition-colors ${p === 1 ? "bg-[#006e2f] text-white" : "text-[#64748b] hover:bg-[#f1f5f9]"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
