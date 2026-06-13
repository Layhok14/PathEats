import { Mail, Phone, MapPin, ExternalLink, CheckCircle, Plus } from "lucide-react";
import imgUserProfile from "../../../imports/Html→Body-7/2a20559eec195c4c38a5bb86be7d75922aa58366.png";
import { TopBar } from "../../components/TopBar";
import { Button } from "../../../shared/components/Button";
import { CUSTOMER_ORDERS, OPEN_TICKETS, TICKET_HISTORY } from "../../../shared/constants/customerServiceData";

const ORDER_STATUS_STYLE: Record<string, string> = {
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100  text-red-700",
  PENDING:   "bg-amber-100 text-amber-700",
};

export default function UserInformationPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar searchPlaceholder="Search by Name, ID, or Email…" actionLabel="" />

      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Breadcrumb + header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] text-[#94a3b8] mb-1">
              Portal &rsaquo; <span className="text-[#006e2f] font-medium">User Information</span>
            </p>
            <h1 className="text-[28px] font-bold text-[#0b1c30]">Customer Insights</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" icon={<ExternalLink size={14} />}>Audit Log</Button>
            <Button icon={<Plus size={14} />}>+ Create Ticket</Button>
          </div>
        </div>

        <div className="grid grid-cols-[300px_1fr] gap-5 items-start">

          {/* ── LEFT: Profile card + Loyalty ── */}
          <div className="flex flex-col gap-4">

            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              {/* Green header band */}
              <div className="relative h-[90px]" style={{ background: "linear-gradient(135deg, #006e2f 0%, #00a846 100%)" }}>
                <span className="absolute top-3 right-3 flex items-center gap-1.5 text-[11px] font-semibold text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                  Active Account
                </span>
              </div>

              {/* Avatar — overlaps green band */}
              <div className="px-5 pb-5">
                <div className="relative -mt-[44px] mb-3 w-fit">
                  <img
                    src={imgUserProfile}
                    alt="Alex Morgan"
                    className="w-[80px] h-[80px] rounded-xl object-cover border-4 border-white shadow-md"
                  />
                </div>

                <p className="text-[18px] font-bold text-[#0b1c30]">Alex Morgan</p>
                <p className="text-[12px] text-[#94a3b8] mb-5">User ID: #PH-99210-AX</p>

                {/* Contact rows */}
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] mb-0.5">Email Address</p>
                    <div className="flex items-center gap-1.5 text-[13px] text-[#374151]">
                      <Mail size={13} className="text-[#94a3b8] shrink-0" />
                      alex.morgan@example.com
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] mb-0.5">Phone Number</p>
                    <div className="flex items-center gap-1.5 text-[13px] text-[#374151]">
                      <Phone size={13} className="text-[#94a3b8] shrink-0" />
                      +1 (555) 012-3456
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] mb-0.5">Primary Location</p>
                    <div className="flex items-center gap-1.5 text-[13px] text-[#374151]">
                      <MapPin size={13} className="text-[#94a3b8] shrink-0" />
                      San Francisco, CA
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <div className="bg-[#f8fafc] rounded-xl p-3 border border-[#e2e8f0]">
                    <p className="text-[11px] text-[#64748b] mb-1">Total Spend</p>
                    <p className="text-[18px] font-bold text-[#006e2f]">$1,248.50</p>
                  </div>
                  <div className="bg-[#f8fafc] rounded-xl p-3 border border-[#e2e8f0]">
                    <p className="text-[11px] text-[#64748b] mb-1">Order Count</p>
                    <p className="text-[18px] font-bold text-[#0b1c30]">42</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loyalty tier card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#64748b]">Loyalty Tier</p>
                <span className="text-[12px] font-bold text-[#f59e0b]">GOLD MEMBER</span>
              </div>
              <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full bg-[#f59e0b]" style={{ width: "65%" }} />
              </div>
              <p className="text-[11px] text-[#94a3b8]">Next tier: Platinum (250 points needed)</p>
            </div>
          </div>

          {/* ── RIGHT: Orders, Tickets, Engagement ── */}
          <div className="flex flex-col gap-4">

            {/* Order history */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f5f9]">
                <h2 className="text-[15px] font-semibold text-[#0b1c30]">Recent Order History</h2>
                <button className="text-[12px] font-medium text-[#006e2f] hover:underline">View All Orders</button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    {["ORDER ID", "DATE", "STORE", "STATUS", "AMOUNT"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CUSTOMER_ORDERS.map((o) => (
                    <tr key={o.id} className="border-t border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                      <td className="px-5 py-3 font-mono text-[12px] text-[#006e2f]">#{o.id}</td>
                      <td className="px-5 py-3 text-[12px] text-[#64748b]">{o.date}</td>
                      <td className="px-5 py-3 text-[13px] text-[#374151]">{o.store}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${ORDER_STATUS_STYLE[o.status] ?? ""}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[13px] font-semibold text-[#0b1c30]">{o.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Open tickets + Ticket history */}
            <div className="grid grid-cols-2 gap-4">
              {/* Open tickets */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-[#0b1c30]">Open Tickets</h2>
                  <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">1 ACTIVE</span>
                </div>
                {OPEN_TICKETS.map((t) => (
                  <div key={t.id} className="border border-[#e2e8f0] rounded-xl p-3 flex flex-col gap-1.5 bg-[#f8fafc]">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-semibold text-[#0b1c30]">{t.title}</p>
                      <span className="text-[11px] text-[#94a3b8]">{t.time}</span>
                    </div>
                    <p className="text-[11px] text-[#64748b] leading-relaxed">{t.description}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-4 h-4 rounded-full bg-[#006e2f]/20 flex items-center justify-center text-[8px] font-bold text-[#006e2f]">SK</div>
                      <p className="text-[11px] text-[#94a3b8]">Assigned to {t.assignedTo}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ticket history */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold text-[#0b1c30]">Ticket History</h2>
                  <button className="text-[#94a3b8] hover:text-[#006e2f] transition-colors">
                    <ExternalLink size={13} />
                  </button>
                </div>
                {TICKET_HISTORY.map((h) => (
                  <div key={h.id} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-[#006e2f] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-semibold text-[#0b1c30]">{h.title}</p>
                      <p className="text-[11px] text-[#94a3b8] mt-0.5">{h.date} • Case #{h.caseId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement velocity */}
            <div className="rounded-2xl p-6" style={{ background: "#0b1c30" }}>
              <div className="flex items-center justify-between mb-5">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-[#006e2f]">Engagement Velocity</p>
                <span className="text-[12px] font-medium text-[#006e2f]">+12.4% vs last month</span>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: "App Sessions",      value: "1,204"    },
                  { label: "Search Frequency",  value: "8.5 / day" },
                  { label: "LTV Ratio",         value: "High"      },
                ].map((m) => (
                  <div key={m.label}>
                    <p className="text-[11px] text-[#64748b] mb-1">{m.label}</p>
                    <p className="text-[24px] font-bold text-white leading-tight">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
