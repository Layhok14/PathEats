import { ReviewsManager } from "../../../shared/components/ReviewsManager";

export default function DeveloperReviewsPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      <div className="flex-1 p-8">
        <ReviewsManager
          endpoint="/developer/reviews"
          title="All Reviews"
          subtitle="System-wide customer feedback for developer analysis."
        />
      </div>
    </div>
  );
}
