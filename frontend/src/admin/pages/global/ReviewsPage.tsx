import { TopBar } from "../../components/TopBar";
import { ReviewsManager } from "../../../shared/components/ReviewsManager";

export default function ReviewsPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <TopBar actionLabel="" searchPlaceholder="Search reviews..." />
      <div className="flex-1 p-8">
        <ReviewsManager
          endpoint="/admin/reviews"
          title="All Reviews"
          subtitle="Customer feedback across all stalls on the platform."
        />
      </div>
    </div>
  );
}
