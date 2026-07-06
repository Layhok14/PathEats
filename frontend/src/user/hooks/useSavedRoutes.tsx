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
    const isDuplicate = savedRoutesRef.current.some((r) => {
      const sameOrigin = r.origin === (routeData.origin || routeData.originPlace?.name);
      const sameDest = r.dest === (routeData.dest || routeData.destPlace?.name);
      const samePoints = JSON.stringify(r.points) === JSON.stringify(routeData.points || []);
      return sameOrigin && sameDest && samePoints;
    });
    if (isDuplicate) {
      return { success: false, message: "Route already saved" };
    }

    if (!isLoggedIn) {
      const localId = Date.now();
      const entry = { ...routeData, id: localId, savedAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) };
      setSavedRoutes((prev) => [entry, ...prev].slice(0, 20));
      return { success: true };
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
      return { success: true };
    } catch {
      setSavedRoutes((prev) => prev.filter((r) => r.id !== tempId));
      return { success: false, message: "Failed to save route" };
    }
  }, [isLoggedIn]);

  const updateRouteLabel = useCallback(async (id: string | number, newLabel: string) => {
    const trimmed = newLabel.trim();
    if (!trimmed) return { success: false, message: "Label cannot be empty" };

    const isDuplicate = savedRoutesRef.current.some(
      (r) => r.id !== id && r.label === trimmed
    );
    if (isDuplicate) {
      return { success: false, message: "You already have a route with that name" };
    }

    const originalLabel = savedRoutesRef.current.find((r) => r.id === id)?.label;

    setSavedRoutes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, label: trimmed } : r))
    );

    if (!isLoggedIn) return { success: true };

    try {
      await api.patch(`/user/routes/${id}`, { label: trimmed });
      return { success: true };
    } catch {
      setSavedRoutes((prev) => prev.map((r) =>
        r.id === id ? { ...r, label: originalLabel || r.label } : r
      ));
      return { success: false, message: "Failed to update label" };
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

  return { savedRoutes, addRoute, deleteRoute, clearRoutes, updateRouteLabel, loading };
}
