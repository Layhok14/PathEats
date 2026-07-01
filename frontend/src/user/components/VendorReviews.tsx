// Review list + write-a-review form — extracted from VendorDetail.
// Auth-gates the submission form; unauthenticated users see a sign-in prompt.

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useTheme } from "../../shared/hooks/useTheme";
import { useAuth } from "../../shared/hooks/useAuth";
import { timeAgo } from "../../shared/utils/formatters";
import { useReviews } from "../hooks/useReviews";

const AVATAR_COLORS = ["#22C55E", "#005AC2", "#9333EA", "#F59E0B"];

/**
 * @param {{ vendor: object, colors: object, onSignInRequest: ()=>void }} props
 */
export function VendorReviews({ vendor, colors: c, onSignInRequest }) {
  const { tm } = useTheme();
  const { user, isLoggedIn } = useAuth();
  const {
    reviews,
    submit,
    submitting,
    loading,
    error: reviewLoadError,
  } = useReviews(vendor.id);

  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const storedRating = Number(vendor.rating) || 0;
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
      : storedRating.toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map((starsValue) => ({
    stars: starsValue,
    count: reviews.filter((review) => review.stars === starsValue).length,
  }));
  const maxRatingCount = Math.max(...ratingCounts.map((item) => item.count), 1);

  async function handleSubmit(e) {
    e.preventDefault();
    if (stars === 0) {
      setError("Please select a rating.");
      return;
    }
    if (!body.trim()) {
      setError("Please write something.");
      return;
    }
    setError("");
    try {
      await submit({
        vendor_id: vendor.id,
        user_id: user.id,
        user_name: `${user.firstName} ${user.lastName}`,
        stars,
        body,
      });
      setBody("");
      setStars(0);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit review.");
    }
  }

  return (
    <div>
      <h3
        className="text-sm font-semibold mb-3 flex items-center gap-2"
        style={{ color: c.textMid }}
      >
        <Star size={13} className="text-amber-400 fill-amber-400" /> Reviews
        <span className="text-[11px] font-normal" style={{ color: c.textDim }}>
          ({reviews.length})
        </span>
      </h3>

      {/* Rating summary */}
      <div
        className="rounded-xl p-3.5 mb-4 flex gap-4 items-center"
        style={{
          background: c.scoreCard,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: c.scoreCardBorder,
        }}
      >
        <div className="text-center shrink-0">
          <div className="text-3xl font-bold" style={{ color: c.text }}>
            {avg}
          </div>
          <div className="flex gap-0.5 justify-center mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={
                  s <= Math.round(storedRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-400"
                }
              />
            ))}
          </div>
          <div className="text-[10px] mt-1" style={{ color: c.textDim }}>
            out of 5
          </div>
        </div>
        <div className="flex-1 space-y-1">
          {ratingCounts.map(({ stars: s, count }) => (
            <div key={s} className="flex items-center gap-2">
              <span
                className="text-[10px] w-3 shrink-0 text-right"
                style={{ color: c.textFaint }}
              >
                {s}
              </span>
              <Star
                size={8}
                className="fill-amber-400 text-amber-400 shrink-0"
              />
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: c.scoreBarBg }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: reviews.length > 0
                      ? `${Math.max(6, (count / maxRatingCount) * 100)}%`
                      : "0%",
                    background: "#F59E0B",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-3">
        {loading && (
          <p className="text-[12px]" style={{ color: c.textFaint }}>
            Loading reviews...
          </p>
        )}

        {!loading && reviewLoadError && (
          <p className="text-[12px] text-red-400">{reviewLoadError}</p>
        )}

        {!loading && !reviewLoadError && reviews.length === 0 && (
          <div
            className="rounded-xl p-3.5 text-[12px]"
            style={{
              background: c.surface,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: c.scoreCardBorder,
              color: c.textFaint,
            }}
          >
            No reviews yet.
          </div>
        )}

        {!loading && !reviewLoadError && reviews.map((r, i) => (
          <div
            key={r.id ?? i}
            className="rounded-xl p-3.5"
            style={{
              background: c.surface,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: c.scoreCardBorder,
            }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white"
                style={{ background: AVATAR_COLORS[i % 4] }}
              >
                {r.user_name?.[0] ?? "?"}
              </div>
              <div className="flex-1">
                <div
                  className="text-[12px] font-semibold"
                  style={{ color: c.text }}
                >
                  {r.user_name}
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={9}
                      className={
                        s <= r.stars
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-400"
                      }
                    />
                  ))}
                </div>
              </div>
              <span className="text-[10px]" style={{ color: c.textDim }}>
                {timeAgo(r.created_at)}
              </span>
            </div>
            <p
              className="text-[12px] leading-relaxed"
              style={{ color: c.textMid }}
            >
              {r.body}
            </p>
          </div>
        ))}
      </div>

      {/* Write a review */}
      <div className="mt-4">
        {!isLoggedIn ? (
          <button
            onClick={onSignInRequest}
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:brightness-110"
            style={{
              background: c.scoreCard,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: c.scoreCardBorder,
              color: tm.primary,
            }}
          >
            <Star size={14} /> Sign in to write a review
          </button>
        ) : submitted ? (
          <div
            className="py-3 rounded-xl text-center text-sm font-semibold text-emerald-400"
            style={{
              background: "rgba(16,185,129,0.1)",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "rgba(16,185,129,0.2)",
            }}
          >
            ✓ Review submitted — thank you!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl p-4 space-y-3"
            style={{
              background: c.scoreCard,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: c.scoreCardBorder,
            }}
          >
            <p className="text-[12px] font-semibold" style={{ color: c.text }}>
              Write a review
            </p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setStars(s)}
                >
                  <Star
                    size={22}
                    className={
                      (hover || stars) >= s
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-400"
                    }
                  />
                </button>
              ))}
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="Share your experience…"
              className="w-full px-3 py-2.5 rounded-xl text-[13px] resize-none focus:outline-none"
              style={{
                background: tm.inputBg,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: tm.inputBorder,
                color: tm.text1,
              }}
            />
            {error && <p className="text-[11px] text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              style={{ background: tm.primary, color: tm.primaryText }}
            >
              <Send size={13} /> {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
