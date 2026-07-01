import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../shared/services/axiosService";
import { useAuth } from "../../shared/hooks/useAuth";

export function useBookmarks() {
  const { user } = useAuth();
  const isLoggedIn = user?.role_scope === "CONSUMER";
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const bookmarksRef = useRef(bookmarks);
  bookmarksRef.current = bookmarks;

  useEffect(() => {
    if (!isLoggedIn) {
      setBookmarks(new Set());
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.get("/user/bookmarks")
      .then(({ data }) => {
        if (cancelled) return;
        const ids = (data?.data ?? [])
          .map((b: any) => b.place_id)
          .filter(Boolean)
          .map(String);
        setBookmarks(new Set(ids));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const toggleBookmark = useCallback(async (placeId: string | number) => {
    if (!isLoggedIn) return;

    const bookmarkId = String(placeId);
    const current = bookmarksRef.current;
    const isCurrentlyBookmarked = current.has(bookmarkId);

    setBookmarks((prev) => {
      const n = new Set(prev);
      isCurrentlyBookmarked ? n.delete(bookmarkId) : n.add(bookmarkId);
      return n;
    });

    if (!isLoggedIn) return;

    try {
      if (isCurrentlyBookmarked) {
        await api.delete(`/user/bookmarks/${bookmarkId}`);
      } else {
        await api.post("/user/bookmarks", { placeId: bookmarkId });
      }
    } catch {
      setBookmarks((prev) => {
        const n = new Set(prev);
        isCurrentlyBookmarked ? n.add(bookmarkId) : n.delete(bookmarkId);
        return n;
      });
    }
  }, [isLoggedIn]);

  return { bookmarks, toggleBookmark, loading };
}
