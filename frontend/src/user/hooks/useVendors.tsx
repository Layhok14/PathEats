import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../../shared/services/axiosService";
import type { Vendor } from "../../shared/types";

type RoutePoint = [number, number];

type UseVendorsParams = {
  routePoints: RoutePoint[];
  vendorRange: number;
  filterCuisine: string;
  filterMaxPrice: number;
  filterOpenNow: boolean;
  vendorSearch: string;
};

type UseVendorsResult = {
  scoredVendors: Vendor[];
  allVendors: Vendor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  searchMeta: {
    total: number;
    byName: number;
    byMenu: number;
  };
};

export function useVendors({
  routePoints,
  vendorRange,
  filterCuisine,
  filterMaxPrice,
  filterOpenNow,
  vendorSearch,
}: UseVendorsParams): UseVendorsResult {
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchMeta, setSearchMeta] = useState({ total: 0, byName: 0, byMenu: 0 });
  const previousParams = useRef<string>("");

  const fetchVendors = useCallback(async () => {
    // Don't search without a route
    if (routePoints.length < 2) {
      setAllVendors([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post<{ success: boolean; data: { vendors: Vendor[]; total: number; searchMeta: { total: number; byName: number; byMenu: number } } }>("/places/search", {
        routePoints,
        range: vendorRange,
        cuisine: filterCuisine,
        maxPrice: filterMaxPrice,
        openNow: filterOpenNow,
        search: vendorSearch || undefined,
        limit: 1000,
        offset: 0,
      });
      const result = data?.data;
      setAllVendors(Array.isArray(result?.vendors) ? result.vendors : []);
      setSearchMeta(result?.searchMeta || { total: 0, byName: 0, byMenu: 0 });
    } catch {
      setAllVendors([]);
      setError("Unable to load vendors right now.");
    } finally {
      setLoading(false);
    }
  }, [routePoints, vendorRange, filterCuisine, filterMaxPrice, filterOpenNow, vendorSearch]);

  // Refetch when filter params change and we have a route
  useEffect(() => {
    const paramsKey = JSON.stringify({
      routePoints,
      vendorRange,
      filterCuisine,
      filterMaxPrice,
      filterOpenNow,
      vendorSearch,
    });
    if (previousParams.current === paramsKey) return;
    previousParams.current = paramsKey;

    if (routePoints.length < 2) {
      setAllVendors([]);
      setLoading(false);
      return;
    }

    void fetchVendors();
  }, [fetchVendors, routePoints]);

  const scoredVendors = useMemo(() => {
    return allVendors;
  }, [allVendors]);

  return { scoredVendors, allVendors, loading, error, refetch: fetchVendors, searchMeta };
}
