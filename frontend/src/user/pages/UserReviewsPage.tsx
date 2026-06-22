import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { ReviewsManager } from "../../shared/components/ReviewsManager";

export default function UserReviewsPage() {
  const navigate = useNavigate();
  return (
    <div className="flex-1 p-6 overflow-auto" style={{ background: "#f8fafc" }}>
      <button
        onClick={() => navigate("/user")}
        style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "var(--brand-text-muted)", fontFamily: "Poppins, sans-serif", fontSize: "14px", marginBottom: "16px" }}
      >
        <ChevronLeft size={16} /> Back to Search
      </button>
      <ReviewsManager
        endpoint="/places/reviews/all"
        title="Community Reviews"
        subtitle="Recent feedback from customers across all stalls."
      />
    </div>
  );
}
