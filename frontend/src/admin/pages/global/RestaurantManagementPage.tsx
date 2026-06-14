import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TopBar } from "../../components/TopBar";
import { ApprovalCard } from "../../components/ApprovalCard";
import { RestaurantTable } from "../../components/RestaurantTable";
import { PENDING_RESTAURANTS, ACTIVE_RESTAURANTS } from "../../data/adminData";

export default function RestaurantManagementPage() {
  const [pending, setPending] = useState(PENDING_RESTAURANTS);
  const [scrollIdx, setScrollIdx] = useState(0);
  const handleApprove = (id: string) => setPending((prev) => prev.filter((r) => r.id !== id));
  const handleReject = (id: string) => setPending((prev) => prev.filter((r) => r.id !== id));
  const canScrollLeft = scrollIdx > 0;
  const canScrollRight = scrollIdx < pending.length - 3;

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="+ Add Vendor" searchPlaceholder="Search vendors, locations, or IDs…" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#0b1c30]">Pending Approvals</h2>
              <p className="text-[13px] text-[#64748b] mt-0.5">Review new restaurant submissions for platform eligibility</p>
            </div>
            {pending.length > 0 && (
              <div className="flex gap-1">
                <button onClick={() => setScrollIdx((i) => Math.max(0, i - 1))} disabled={!canScrollLeft} className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={16} /></button>
                <button onClick={() => setScrollIdx((i) => Math.min(pending.length - 3, i + 1))} disabled={!canScrollRight} className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={16} /></button>
              </div>
            )}
          </div>
          {pending.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-10 text-center text-[#94a3b8] text-[14px]">No pending approvals at this time.</div>
          ) : (
            <div className="overflow-hidden">
              <div className="flex gap-4 transition-transform duration-300" style={{ transform: `translateX(calc(-${scrollIdx} * (280px + 16px)))` }}>
                {pending.map((r) => (<ApprovalCard key={r.id} restaurant={r} onApprove={handleApprove} onReject={handleReject} />))}
              </div>
            </div>
          )}
        </div>
        <RestaurantTable restaurants={ACTIVE_RESTAURANTS} />
      </div>
    </div>
  );
}
