import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../shared/services/axiosService";
import { useAuth } from "../../shared/hooks/useAuth";

const ROUTE_SEPARATOR = " -> ";

function toDisplayTime(isoStr: string) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoStr;
  }
}

function splitRouteQuery(query: string) {
  const separators = [ROUTE_SEPARATOR, " → "];
  for (const separator of separators) {
    const index = query.indexOf(separator);
    if (index > 0) {
      return {
        origin: query.slice(0, index),
        dest: query.slice(index + separator.length),
      };
    }
  }
  return { origin: query, dest: "" };
}

function parseHistoryRow(row: any) {
  const queryStr = row.query || "";
  const { origin, dest } = splitRouteQuery(queryStr);
  const filters = row.filters || {};
  return {
    id: row.id,
    origin,
    dest,
    originPlace: filters.originPlace || null,
    destPlace: filters.destPlace || null,
    searchedAt: toDisplayTime(row.created_at),
  };
}

export function useSearchHistory() {
  const { user } = useAuth();
  const isLoggedIn = user?.role_scope === "CONSUMER";
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const historyRef = useRef(history);
  historyRef.current = history;

  useEffect(() => {
    if (!isLoggedIn) {
      setHistory([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.get("/user/history")
      .then(({ data }) => {
        if (cancelled) return;
        setHistory((data?.data ?? []).map(parseHistoryRow));
      })
      .catch(() => {/* fetch best-effort */})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const addSearch = useCallback(async (entry: any) => {
    const query = `${entry.origin}${ROUTE_SEPARATOR}${entry.dest}`;
    const tempId = Date.now();
    const newEntry = {
      id: tempId,
      origin: entry.origin,
      dest: entry.dest,
      originPlace: entry.originPlace || null,
      destPlace: entry.destPlace || null,
      searchedAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    };

    setHistory((prev) =>
      [newEntry, ...prev.filter((s) => !(s.origin === entry.origin && s.dest === entry.dest))].slice(0, 50)
    );

    if (isLoggedIn) {
      try {
        const { data } = await api.post("/user/history", {
          query,
          filters: {
            originPlace: entry.originPlace || null,
            destPlace: entry.destPlace || null,
          },
          resultsCount: entry.resultsCount || 0,
        });
        setHistory((prev) =>
          prev.map((h) => h.id === tempId ? parseHistoryRow(data.data) : h)
        );
      } catch {/* add best-effort */}
    }
  }, [isLoggedIn]);

  const deleteSearch = useCallback(async (id: string | number) => {
    const entry = historyRef.current.find((h) => h.id === id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (!isLoggedIn || !entry) return;
    try {
      await api.delete(`/user/history/${id}`);
    } catch {
      console.warn("[useSearchHistory] delete failed, restoring optimistically");
      setHistory((prev) => [entry, ...prev]);
    }
  }, [isLoggedIn]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    if (isLoggedIn) {
      api.delete("/user/history").catch(() => {/* clear best-effort */});
    }
  }, [isLoggedIn]);

  return { history, addSearch, deleteSearch, clearHistory, loading };
}
