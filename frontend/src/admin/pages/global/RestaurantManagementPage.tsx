import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "../../components/TopBar";
import { ApprovalCard } from "../../components/ApprovalCard";
import { RestaurantTable } from "../../components/RestaurantTable";
import { ACTIVE_RESTAURANTS, PENDING_RESTAURANTS } from "../../data/adminData";
import {
  getAdminPlaceCategories,
  getAdminRestaurants,
  updateRestaurantApproval,
  type AdminRestaurant,
  type AdminPlaceCategory,
} from "../../services/adminDashboardService";

export default function RestaurantManagementPage() {
  const [restaurants, setRestaurants] = useState<AdminRestaurant[]>([]);
  const [scrollIdx, setScrollIdx] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<AdminPlaceCategory[]>([]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setMessage("");
      const [rows, categoryRows] = await Promise.all([
        getAdminRestaurants(),
        getAdminPlaceCategories(),
      ]);
      setRestaurants(rows);
      setCategories(categoryRows);
    } catch {
      const text = "Could not load live vendors. Showing saved sample data.";
      setMessage(text);
      setRestaurants([...PENDING_RESTAURANTS, ...ACTIVE_RESTAURANTS]);
      setCategories([]);
      toast.warning(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const pending = restaurants.filter((restaurant) => restaurant.status === "Pending");
  const active = restaurants.filter((restaurant) => restaurant.status !== "Pending");
  const categoryNames = categories.length
    ? categories.map((category) => category.name)
    : Array.from(new Set(restaurants.map((restaurant) => restaurant.category).filter(Boolean)));

  const handleApprove = async (id: string) => {
    try {
      await updateRestaurantApproval(id, true);
      await loadRestaurants();
      toast.success("Vendor approved.");
    } catch {
      const text = "Could not approve vendor.";
      setMessage(text);
      toast.error(text);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateRestaurantApproval(id, false);
      await loadRestaurants();
      toast.success("Vendor rejected.");
    } catch {
      const text = "Could not reject vendor.";
      setMessage(text);
      toast.error(text);
    }
  };

  const canScrollLeft = scrollIdx > 0;
  const canScrollRight = scrollIdx < pending.length - 3;

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search vendors, locations, or IDs..." />
      <div className="flex-1 p-8 flex flex-col gap-6">
        {message && (
          <div className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[13px] text-[#92400e]">
            {message}
          </div>
        )}

        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-[20px] font-semibold text-[#0b1c30]">Vendor Management</h2>
              <p className="text-[13px] text-[#64748b] mt-0.5">
                {loading ? "Loading vendors..." : "Review vendor submissions and manage listed places"}
              </p>
            </div>
            {pending.length > 0 && (
              <div className="flex gap-1">
                <button onClick={() => setScrollIdx((i) => Math.max(0, i - 1))} disabled={!canScrollLeft} className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={16} /></button>
                <button onClick={() => setScrollIdx((i) => Math.min(pending.length - 3, i + 1))} disabled={!canScrollRight} className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={16} /></button>
              </div>
            )}
          </div>
          {pending.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e2e8f0] p-10 text-center text-[#94a3b8] text-[14px]">No pending vendor approvals at this time.</div>
          ) : (
            <div className="overflow-hidden">
              <div className="flex gap-4 transition-transform duration-300" style={{ transform: `translateX(calc(-${scrollIdx} * (280px + 16px)))` }}>
                {pending.map((restaurant) => (
                  <ApprovalCard key={restaurant.id} restaurant={restaurant} onApprove={handleApprove} onReject={handleReject} />
                ))}
              </div>
            </div>
          )}
        </div>

        <RestaurantTable restaurants={active} categories={categoryNames} />
      </div>
    </div>
  );
}
