import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../shared/services/axiosService";
import { useAuth } from "../../shared/hooks/useAuth";

function toDisplayTime(isoStr: string) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return isoStr;
  }
}

function normalizeRoute(r: any) {
  const originObj = typeof r.origin === "string" ? JSON.parse(r.origin) : r.origin;
  const destObj = typeof r.destination === "string" ? JSON.parse(r.destination) : r.destination;
  return {
    id: r.id,
    label: r.label || `${originObj?.name || ""} → ${destObj?.name || ""}`,
    origin: originObj?.name || "",
    dest: destObj?.name || "",
    originPlace: originObj || null,
    destPlace: destObj || null,
    points: Array.isArray(r.waypoints) ? r.waypoints : (r.points || []),
    savedAt: toDisplayTime(r.saved_at),
    _raw: r,
  };
}

export function useSavedRoutes() {
  const { user } = useAuth();
  const isLoggedIn = user?.role_scope === "CONSUMER";
  const [savedRoutes, setSavedRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const savedRoutesRef = useRef(savedRoutes);
  savedRoutesRef.current = savedRoutes;

  useEffect(() => {
    if (!isLoggedIn) {
      setSavedRoutes([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    api.get("/user/routes")
      .then(({ data }) => {
        if (cancelled) return;
        setSavedRoutes((data?.data ?? []).map(normalizeRoute));
      })
      .catch(() => {/* fetch best-effort */})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isLoggedIn]);

  const addRoute = useCallback(async (routeData: any) => {
    if (!isLoggedIn) {
      const localId = Date.now();
      const entry = { ...routeData, id: localId, savedAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) };
      setSavedRoutes((prev) => [entry, ...prev].slice(0, 20));
      return;
    }

    const tempId = Date.now();
    const tempEntry = { ...routeData, id: tempId, savedAt: "just now" };
    setSavedRoutes((prev) => [tempEntry, ...prev]);

    try {
      const { data } = await api.post("/user/routes", {
        label: routeData.label,
        origin: routeData.originPlace || { name: routeData.origin || "" },
        destination: routeData.destPlace || { name: routeData.dest || "" },
        waypoints: routeData.points || [],
      });
      setSavedRoutes((prev) =>
        prev.map((r) => (r.id === tempId ? normalizeRoute(data.data) : r))
      );
    } catch {
      setSavedRoutes((prev) => prev.filter((r) => r.id !== tempId));
    }
  }, [isLoggedIn]);

  const deleteRoute = useCallback(async (id: string | number) => {
    const entry = savedRoutesRef.current.find((r) => r.id === id);
    setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
    if (!isLoggedIn) return;
    try {
      await api.delete(`/user/routes/${id}`);
    } catch {
      if (entry) setSavedRoutes((prev) => [entry, ...prev]);
    }
  }, [isLoggedIn]);

  const clearRoutes = useCallback(() => {
    const prev = savedRoutesRef.current;
    setSavedRoutes([]);
    if (isLoggedIn) {
      api.delete("/user/routes").catch(() => {
        setSavedRoutes(prev);
      });
    }
  }, [isLoggedIn]);

  return { savedRoutes, addRoute, deleteRoute, clearRoutes, loading };
}
