import { useState, useEffect, useRef } from "react";
import api from "../../shared/services/axiosService";
import { distToRouteM, calcScore } from "../../shared/utils/geoUtils";
import type { Vendor } from "../../shared/types";

export function useVendors({
  routePoints,
  vendorRange,
  filterCuisine,
  filterMaxPrice,
  filterOpenNow,
  vendorSearch,
}: {
  routePoints: [number, number][];
  vendorRange: number;
  filterCuisine: string;
  filterMaxPrice: number;
  filterOpenNow: boolean;
  vendorSearch: string;
}): { scoredVendors: Vendor[]; allVendors: Vendor[] } {
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    api.get("/places").then(({ data }) => setAllVendors(data.data)).catch((err) => {console.log("error:",err.message)});
  }, []);

  if (routePoints.length < 2) return { scoredVendors: [], allVendors };
  const q = vendorSearch.toLowerCase().trim();

  const scoredVendors = allVendors
    .map((v) => {
      const dist = distToRouteM(v.lat, v.lng, routePoints);
      if (dist > vendorRange) return null;
      return {
        ...v,
        dist_m: Math.round(dist),
        final_score: calcScore(v.price_range, dist, v.rating, v.wait_time_est),
      };
    })
    .filter((v) => v !== null)
    .filter((v) => filterCuisine === "All" || v.cuisine === filterCuisine)
    .filter((v) => v.price_range <= filterMaxPrice)
    .filter((v) => !filterOpenNow || v.open_now)
    .filter(
      (v) =>
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.menu.some((m) => m.name.toLowerCase().includes(q)),
    )
    .sort((a, b) => b.final_score - a.final_score) as Vendor[];

  return { scoredVendors, allVendors };
}
