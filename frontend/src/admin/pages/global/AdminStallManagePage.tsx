import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Clock, ListOrdered, Star } from "lucide-react";
import api from "../../../shared/services/axiosService";

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
}

interface Review {
  id: string;
  userName: string;
  rating: string;
  body: string;
}

interface PlaceHour {
  id: string;
  day_of_week: number;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
}

export default function AdminStallManagePage() {
  const { stallId } = useParams<{ stallId: string }>();
  const navigate = useNavigate();

  const [stallName, setStallName] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [placeHours, setPlaceHours] = useState<PlaceHour[]>([]);
  const [loading, setLoading] = useState(true);

  const [menuForm, setMenuForm] = useState({ name: "", price: "", category: "snacks", description: "" });
  const [hourForm, setHourForm] = useState({ dayOfWeek: "0", opensAt: "07:00", closesAt: "21:00", isClosed: false });
  const [reviewForm, setReviewForm] = useState({ rating: "5", body: "" });

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const fetchData = async () => {
    if (!stallId) return;
    setLoading(true);
    try {
      const [menuRes, reviewRes, hourRes, stallRes] = await Promise.all([
        api.get(`/admin/stalls/${stallId}/menu-items`).catch(() => ({ data: { data: [] } })),
        api.get(`/admin/stalls/${stallId}/reviews`).catch(() => ({ data: { data: [] } })),
        api.get(`/admin/stalls/${stallId}/place-hours`).catch(() => ({ data: { data: [] } })),
        api.get(`/admin/stalls/${stallId}`).catch(() => ({ data: { data: { name: "Stall" } } })),
      ]);
      setMenuItems(menuRes.data.data || []);
      setReviews(reviewRes.data.data || []);
      setPlaceHours(hourRes.data.data || []);
      setStallName(stallRes.data.data?.name || "Stall");
    } catch {
      toast.error("Could not load stall data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [stallId]);

  const handleAddMenuItem = async () => {
    if (!menuForm.name.trim() || !menuForm.price) {
      toast.error("Name and price required.");
      return;
    }
    try {
      await api.post(`/admin/stalls/${stallId}/menu-items`, menuForm);
      toast.success("Menu item added.");
      setMenuForm({ name: "", price: "", category: "snacks", description: "" });
      fetchData();
    } catch {
      toast.error("Could not add menu item.");
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm("Delete this menu item?")) return;
    try {
      await api.delete(`/admin/stalls/menu-items/${id}`);
      toast.success("Menu item deleted.");
      fetchData();
    } catch {
      toast.error("Could not delete menu item.");
    }
  };

  const handleAddPlaceHour = async () => {
    try {
      await api.post(`/admin/stalls/${stallId}/place-hours`, hourForm);
      toast.success("Place hour added.");
      setHourForm({ dayOfWeek: "0", opensAt: "07:00", closesAt: "21:00", isClosed: false });
      fetchData();
    } catch {
      toast.error("Could not add place hour.");
    }
  };

  const handleDeletePlaceHour = async (id: string) => {
    if (!confirm("Delete this place hour?")) return;
    try {
      await api.delete(`/admin/stalls/place-hours/${id}`);
      toast.success("Place hour deleted.");
      fetchData();
    } catch {
      toast.error("Could not delete place hour.");
    }
  };

  const handleAddReview = async () => {
    if (!reviewForm.body.trim()) {
      toast.error("Review body required.");
      return;
    }
    try {
      await api.post(`/admin/stalls/${stallId}/reviews`, reviewForm);
      toast.success("Review added.");
      setReviewForm({ rating: "5", body: "" });
      fetchData();
    } catch {
      toast.error("Could not add review.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/admin/stalls/reviews/${id}`);
      toast.success("Review deleted.");
      fetchData();
    } catch {
      toast.error("Could not delete review.");
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="h-16 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center px-8 gap-4 shrink-0 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] font-medium text-[#006e2f] hover:underline"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex-1" />
        <div className="text-[13px] font-semibold text-[#0b1c30]">{stallName}</div>
      </div>

      <div className="flex-1 p-8">
        {loading ? (
          <p className="text-[14px] text-[#64748b]">Loading stall data...</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Menu Items */}
            <div className="rounded-xl bg-white border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="border-b border-[#f1f5f9] px-5 py-3.5 flex items-center gap-2">
                <ListOrdered size={16} className="text-[#005ac2]" />
                <h2 className="text-[14px] font-semibold text-[#0b1c30]">Menu Items</h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} placeholder="Item name" className="col-span-2 rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] outline-none focus:border-[#006e2f]" />
                  <input value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} placeholder="Price" type="number" min="0" step="0.01" className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] outline-none focus:border-[#006e2f]" />
                  <input value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} placeholder="Category" className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] outline-none focus:border-[#006e2f]" />
                  <textarea value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} placeholder="Description" className="col-span-2 rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] outline-none focus:border-[#006e2f]" rows={2} />
                </div>
                <button onClick={handleAddMenuItem} className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#005a26]">
                  <Plus size={13} /> Add Item
                </button>
                <div className="max-h-[240px] overflow-y-auto space-y-1.5">
                  {menuItems.length === 0 && <p className="text-[11px] text-[#94a3b8]">No menu items.</p>}
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-[#f8fafc] px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-[#0b1c30] truncate">{item.name}</p>
                        <p className="text-[10px] text-[#64748b]">${item.price} · {item.category}</p>
                      </div>
                      <button onClick={() => handleDeleteMenuItem(item.id)} className="shrink-0 rounded-md bg-red-50 p-1 text-[#ba1a1a] hover:bg-red-100">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Place Hours */}
            <div className="rounded-xl bg-white border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="border-b border-[#f1f5f9] px-5 py-3.5 flex items-center gap-2">
                <Clock size={16} className="text-[#f59e0b]" />
                <h2 className="text-[14px] font-semibold text-[#0b1c30]">Place Hours</h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <select value={hourForm.dayOfWeek} onChange={(e) => setHourForm({ ...hourForm, dayOfWeek: e.target.value })} className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] outline-none focus:border-[#006e2f]">
                    {DAYS.map((day, i) => <option key={i} value={i}>{day}</option>)}
                  </select>
                  <input value={hourForm.opensAt} onChange={(e) => setHourForm({ ...hourForm, opensAt: e.target.value })} type="time" className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] outline-none focus:border-[#006e2f]" />
                  <input value={hourForm.closesAt} onChange={(e) => setHourForm({ ...hourForm, closesAt: e.target.value })} type="time" className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] outline-none focus:border-[#006e2f]" />
                  <label className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[11px] text-[#64748b]">
                    <input type="checkbox" checked={hourForm.isClosed} onChange={(e) => setHourForm({ ...hourForm, isClosed: e.target.checked })} />Closed
                  </label>
                </div>
                <button onClick={handleAddPlaceHour} className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#005a26]">
                  <Plus size={13} /> Add Hours
                </button>
                <div className="max-h-[240px] overflow-y-auto space-y-1.5">
                  {placeHours.length === 0 && <p className="text-[11px] text-[#94a3b8]">No place hours.</p>}
                  {placeHours.map((hour) => (
                    <div key={hour.id} className="flex items-center justify-between rounded-lg bg-[#f8fafc] px-3 py-2">
                      <div>
                        <p className="text-[12px] font-medium text-[#0b1c30]">{DAYS[hour.day_of_week]}</p>
                        <p className="text-[10px] text-[#64748b]">{hour.is_closed ? "Closed" : `${hour.opens_at} - ${hour.closes_at}`}</p>
                      </div>
                      <button onClick={() => handleDeletePlaceHour(hour.id)} className="shrink-0 rounded-md bg-red-50 p-1 text-[#ba1a1a] hover:bg-red-100">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="rounded-xl bg-white border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="border-b border-[#f1f5f9] px-5 py-3.5 flex items-center gap-2">
                <Star size={16} className="text-[#64748b]" />
                <h2 className="text-[14px] font-semibold text-[#0b1c30]">Reviews</h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="space-y-2">
                  <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} className="w-full rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] outline-none focus:border-[#006e2f]">
                    {[1,2,3,4,5].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>)}
                  </select>
                  <textarea value={reviewForm.body} onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })} placeholder="Review text" className="w-full rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] outline-none focus:border-[#006e2f]" rows={2} />
                </div>
                <button onClick={handleAddReview} className="inline-flex items-center gap-1.5 rounded-lg bg-[#006e2f] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#005a26]">
                  <Plus size={13} /> Add Review
                </button>
                <div className="max-h-[240px] overflow-y-auto space-y-1.5">
                  {reviews.length === 0 && <p className="text-[11px] text-[#94a3b8]">No reviews.</p>}
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-lg bg-[#f8fafc] px-3 py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] font-medium text-[#0b1c30]">{'★'.repeat(Number(review.rating))}{'☆'.repeat(5 - Number(review.rating))}</p>
                        <button onClick={() => handleDeleteReview(review.id)} className="shrink-0 rounded-md bg-red-50 p-1 text-[#ba1a1a] hover:bg-red-100">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#64748b] mt-0.5">{review.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
