import { MapPin, Mail, Clock } from "lucide-react";

interface Vendor { id: string; name: string; category: string; location: string; email: string; submittedAt: string }
interface Props { restaurant: Vendor; onApprove: (id: string) => void; onReject: (id: string) => void }

export function ApprovalCard({ restaurant, onApprove, onReject }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5 flex flex-col gap-4 min-w-[280px] shrink-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#005ac2] text-[18px] font-bold shrink-0">{restaurant.name[0]}</div>
          <div><p className="text-[14px] font-semibold text-[#0b1c30]">{restaurant.name}</p><p className="text-[11px] font-semibold uppercase tracking-wider text-[#006e2f]">{restaurant.category}</p></div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#94a3b8]"><Clock size={11} />{restaurant.submittedAt}</div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[12px] text-[#64748b]"><MapPin size={12} className="text-[#94a3b8]" />{restaurant.location}</div>
        <div className="flex items-center gap-2 text-[12px] text-[#64748b]"><Mail size={12} className="text-[#94a3b8]" />{restaurant.email}</div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={() => onReject(restaurant.id)} className="flex-1 justify-center px-3 py-1.5 text-[12px] font-medium rounded-lg border border-[#ef4444] text-[#ef4444] bg-white hover:bg-red-50">Reject</button>
        <button onClick={() => onApprove(restaurant.id)} className="flex-1 justify-center px-3 py-1.5 text-[12px] font-medium rounded-lg bg-[#006e2f] text-white hover:bg-[#005a26]">Approve</button>
      </div>
    </div>
  );
}
