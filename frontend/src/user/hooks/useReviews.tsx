import { useState, useEffect } from "react";
import api from "../../shared/services/axiosService";

interface Review {
  id: string;
  vendor_id: string;
  user_id: string;
  user_name: string;
  stars: number;
  body: string;
  created_at: string;
}

export function useReviews(vendorId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!vendorId) return;
    api.get(`/places/${vendorId}/reviews`).then(({ data }) => {
      setReviews(data.data);
    }).catch(() => {});
  }, [vendorId]);

  async function submit(payload: { vendor_id: string; user_id: string; rating: number; body: string }) {
    setSubmitting(true);
    try {
      const { data } = await api.post(`/places/${vendorId}/reviews`, {
        rating: payload.rating,
        body: payload.body,
      });
      const newReview = { ...data.data, vendor_id: vendorId, user_name: "You" };
      setReviews((prev) => [newReview, ...prev]);
    } finally {
      setSubmitting(false);
    }
  }

  return { reviews, submit, submitting };
}
