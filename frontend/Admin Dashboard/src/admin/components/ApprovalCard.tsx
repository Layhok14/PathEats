import { MapPin, Mail, Clock } from "lucide-react";
import { Button } from "../../shared/components/Button";
import type { Restaurant } from "../../shared/types";

interface Props {
  restaurant: Restaurant;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalCard({ restaurant, onApprove, onReject }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-5 flex flex-col gap-4 min-w-[280px] shrink-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#005ac2] text-[18px] font-bold shrink-0">
            {restaurant.name[0]}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#0b1c30]">{restaurant.name}</p>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#006e2f]">{restaurant.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#94a3b8]">
          <Clock size={11} />
          {restaurant.submittedAt}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[12px] text-[#64748b]">
          <MapPin size={12} className="text-[#94a3b8] shrink-0" />
          {restaurant.location}
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#64748b]">
          <Mail size={12} className="text-[#94a3b8] shrink-0" />
          {restaurant.email}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button variant="danger" size="sm" className="flex-1 justify-center" onClick={() => onReject(restaurant.id)}>
          Reject
        </Button>
        <Button variant="primary" size="sm" className="flex-1 justify-center" onClick={() => onApprove(restaurant.id)}>
          Approve
        </Button>
      </div>
    </div>
  );
}
