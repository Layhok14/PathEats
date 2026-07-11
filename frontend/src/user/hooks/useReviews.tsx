import { useState, useEffect } from "react";
import api from "../../shared/services/axiosService";

interface Review {
  id: string;
  vendor_id: string | number;
  user_id: string;
  user_name: string;
  stars: number;
  body: string;
  created_at: string;
}

export function useReviews(vendorId: string | number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!vendorId) return;
    let active = true;

    setLoading(true);
    setError("");

    api.get(`/places/${vendorId}/reviews`).then(({ data }) => {
      if (!active) return;
      setReviews(Array.isArray(data.data) ? data.data : []);
    }).catch(() => {
      if (!active) return;
      setReviews([]);
      setError("Unable to load reviews right now.");
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [vendorId]);

  async function submit(payload: { vendor_id: string | number; user_id: string; stars: number; body: string }) {
    setSubmitting(true);
    try {
      const { data } = await api.post(`/places/${vendorId}/reviews`, {
        rating: payload.stars,
        body: payload.body,
      });
      const newReview = { ...data.data, vendor_id: vendorId, user_name: "You" };
      setReviews((prev) => [newReview, ...prev]);
    } finally {
      setSubmitting(false);
    }
  }

  async function updateReview(reviewId: string, payload: { rating?: number; body?: string }) {
    const { data } = await api.patch(`/places/${vendorId}/reviews/${reviewId}`, payload);
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, ...data.data } : r))
    );
    return data.data;
  }

  async function deleteReview(reviewId: string) {
    await api.delete(`/places/${vendorId}/reviews/${reviewId}`);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }

  return { reviews, submit, updateReview, deleteReview, submitting, loading, error };
}
