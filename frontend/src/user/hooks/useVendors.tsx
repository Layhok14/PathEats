import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../../shared/services/axiosService";
import { distToRouteM, calcScore } from "../../shared/utils/geoUtils";
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
};

function hasCoordinates(vendor: Vendor) {
  return Number.isFinite(Number(vendor.lat)) && Number.isFinite(Number(vendor.lng));
}

function matchesSearch(vendor: Vendor, query: string) {
  if (!query) return true;
  const name = vendor.name?.toLowerCase() ?? "";
  const menu = Array.isArray(vendor.menu) ? vendor.menu : [];

  return (
    name.includes(query) ||
    menu.some((item) => item.name?.toLowerCase().includes(query))
  );
}

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
  const fetched = useRef(false);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get<{ data?: Vendor[] }>("/places");
      setAllVendors(Array.isArray(data?.data) ? data.data : []);
    } catch {
      setAllVendors([]);
      setError("Unable to load vendors right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    void fetchVendors();
  }, [fetchVendors]);

  const scoredVendors = useMemo(() => {
    if (routePoints.length < 2) return [];

    const query = vendorSearch.toLowerCase().trim();

    return allVendors
      .map((vendor) => {
        if (!hasCoordinates(vendor)) return null;

        const distance = distToRouteM(vendor.lat, vendor.lng, routePoints);
        if (distance > vendorRange) return null;

        return {
          ...vendor,
          dist_m: Math.round(distance),
          final_score: calcScore(
            Number(vendor.price_range) || 1,
            distance,
            Number(vendor.rating) || 0,
            Number(vendor.wait_time_est) || 0,
          ),
        };
      })
      .filter((vendor): vendor is Vendor => vendor !== null)
      .filter((vendor) => filterCuisine === "All" || vendor.cuisine === filterCuisine)
      .filter((vendor) => Number(vendor.price_range) <= filterMaxPrice)
      .filter((vendor) => !filterOpenNow || vendor.open_now)
      .filter((vendor) => matchesSearch(vendor, query))
      .sort((a, b) => Number(b.final_score) - Number(a.final_score));
  }, [
    allVendors,
    filterCuisine,
    filterMaxPrice,
    filterOpenNow,
    routePoints,
    vendorRange,
    vendorSearch,
  ]);

  return { scoredVendors, allVendors, loading, error, refetch: fetchVendors };
}
