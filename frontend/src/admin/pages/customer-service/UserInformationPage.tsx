import { Mail, Phone, MapPin, CheckCircle, ExternalLink } from "lucide-react";


export default function UserInformationPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search by Name, ID, or Email…" actionLabel="" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] text-[#94a3b8] mb-1">Portal › <span className="text-[#006e2f] font-medium">User Information</span></p>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Customer Insights</h1>
          </div>
          <div className="flex gap-3">
            <button className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#bccbb9] text-[#374151] bg-white hover:bg-gray-50"><ExternalLink size={14} className="inline mr-1" />Audit Log</button>
            <button className="px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">+ Create Ticket</button>
          </div>
        </div>
        <div className="grid grid-cols-[300px_1fr] gap-5 items-start">
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="h-[90px]" style={{ background: "linear-gradient(135deg, #006e2f 0%, #00a846 100%)" }} />
              <div className="px-5 pb-5">
                <div className="relative -mt-[44px] mb-3 w-fit">
                  <div className="w-[80px] h-[80px] rounded-xl border-4 border-white shadow-md bg-[#e5eeff] flex items-center justify-center text-[#005ac2] text-[24px] font-bold">AM</div>
                </div>
                <p className="text-[18px] font-bold text-[#0b1c30]">Alex Morgan</p>
                <p className="text-[12px] text-[#94a3b8] mb-5">User ID: #PH-99210-AX</p>
                <div className="flex flex-col gap-3">
                  <div><p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] mb-0.5">Email</p><div className="flex items-center gap-1.5 text-[13px] text-[#374151]"><Mail size={13} className="text-[#94a3b8]" />alex.morgan@example.com</div></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] mb-0.5">Phone</p><div className="flex items-center gap-1.5 text-[13px] text-[#374151]"><Phone size={13} className="text-[#94a3b8]" />+1 (555) 012-3456</div></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] mb-0.5">Location</p><div className="flex items-center gap-1.5 text-[13px] text-[#374151]"><MapPin size={13} className="text-[#94a3b8]" />San Francisco, CA</div></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <div className="bg-[#f8fafc] rounded-xl p-3 border border-[#e2e8f0]"><p className="text-[11px] text-[#64748b] mb-1">Total Spend</p><p className="text-[18px] font-bold text-[#006e2f]">$1,248.50</p></div>
                  <div className="bg-[#f8fafc] rounded-xl p-3 border border-[#e2e8f0]"><p className="text-[11px] text-[#64748b] mb-1">Orders</p><p className="text-[18px] font-bold text-[#0b1c30]">42</p></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
              <h2 className="text-[15px] font-semibold text-[#0b1c30] mb-4">Recent Order History</h2>
              <table className="w-full">
                <thead><tr className="bg-[#f8fafc]">{["ORDER ID", "DATE", "STORE", "STATUS", "AMOUNT"].map((h) => (<th key={h} className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>))}</tr></thead>
                <tbody>
                  {[
                    { id: "ORD-55219", date: "Oct 24, 2023", store: "Green Garden Salads", status: "DELIVERED", amount: "$34.20" },
                    { id: "ORD-55102", date: "Oct 21, 2023", store: "Pasta & Beyond", status: "DELIVERED", amount: "$28.50" },
                  ].map((o) => (
                    <tr key={o.id} className="border-t border-[#f1f5f9]">
                      <td className="px-4 py-3 font-mono text-[12px] text-[#006e2f]">#{o.id}</td>
                      <td className="px-4 py-3 text-[12px] text-[#64748b]">{o.date}</td>
                      <td className="px-4 py-3 text-[13px] text-[#374151]">{o.store}</td>
                      <td className="px-4 py-3"><span className="text-[11px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">{o.status}</span></td>
                      <td className="px-4 py-3 text-[13px] font-semibold text-[#0b1c30]">{o.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-2xl p-6" style={{ background: "#0b1c30" }}>
              <p className="text-[12px] font-semibold uppercase tracking-widest text-[#006e2f] mb-5">Engagement Velocity</p>
              <div className="grid grid-cols-3 gap-6">
                {[{ label: "App Sessions", value: "1,204" }, { label: "Search Frequency", value: "8.5 / day" }, { label: "LTV Ratio", value: "High" }].map((m) => (
                  <div key={m.label}><p className="text-[11px] text-[#64748b] mb-1">{m.label}</p><p className="text-[24px] font-bold text-white">{m.value}</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
