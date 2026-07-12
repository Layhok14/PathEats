import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../shared/services/axiosService";
import { useAuth } from "../../shared/hooks/useAuth";

export function useBookmarks() {
  const { user } = useAuth();
  const isLoggedIn = user?.role_scope === "CONSUMER";
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [pendingToggles, setPendingToggles] = useState<Set<string>>(new Set());
  const bookmarksRef = useRef(bookmarks);
  const pendingRef = useRef(pendingToggles);
  bookmarksRef.current = bookmarks;
  pendingRef.current = pendingToggles;

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
      .catch(() => {/* fetch best-effort */})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const toggleBookmark = useCallback(async (placeId: string | number) => {
    if (!isLoggedIn) return;

    const bookmarkId = String(placeId);

    if (pendingRef.current.has(bookmarkId)) return;

    setPendingToggles((prev) => new Set(prev).add(bookmarkId));

    const current = bookmarksRef.current;
    const isCurrentlyBookmarked = current.has(bookmarkId);

    setBookmarks((prev) => {
      const n = new Set(prev);
      if (isCurrentlyBookmarked) n.delete(bookmarkId);
      else n.add(bookmarkId);
      return n;
    });

    try {
      if (isCurrentlyBookmarked) {
        await api.delete(`/user/bookmarks/${bookmarkId}`);
      } else {
        await api.post("/user/bookmarks", { placeId: bookmarkId });
      }
    } catch {
      setBookmarks((prev) => {
        const n = new Set(prev);
        if (isCurrentlyBookmarked) n.add(bookmarkId);
        else n.delete(bookmarkId);
        return n;
      });
    } finally {
      setPendingToggles((prev) => {
        const n = new Set(prev);
        n.delete(bookmarkId);
        return n;
      });
    }
  }, [isLoggedIn]);

  return { bookmarks, toggleBookmark, loading };
}
