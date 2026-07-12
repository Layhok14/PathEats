// Main consumer page — composes sidebar panels with the MapLibre map.
// Map lifecycle delegated to useMaplibreMap; vendor scoring to useVendors.

// MapLibre GL styles
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useEffect, useCallback, useDeferredValue } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { PenLine, Eye, BookmarkPlus, X } from "lucide-react";
import { toast } from "sonner";

import { useTheme } from "../../shared/hooks/useTheme";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";
import { useAuth } from "../../shared/hooks/useAuth";
import { useGeolocation } from "../../shared/hooks/useGeolocation";
import { PLACES, VENDOR_RANGE_DEFAULT } from "../../shared/constants/appConfig";
import { haversineM } from "../../shared/utils/geoUtils";
import { getRoute } from "../../shared/services/routeService";
import { useVendors } from "../hooks/useVendors";
import { useBookmarks } from "../hooks/useBookmarks";
import { useSavedRoutes } from "../hooks/useSavedRoutes";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { useMaplibreMap } from "../hooks/useMaplibreMap";

import { NavRail } from "../components/NavRail";
import { RouteInputPanel } from "../components/RouteInputPanel";
import { FilterPanel } from "../components/FilterPanel";
import { FavoritesPanel } from "../components/FavoritesPanel";
import { HistoryPanel } from "../components/HistoryPanel";
import { SearchHistoryPanel } from "../components/SearchHistoryPanel";
import { VendorDetail } from "../components/VendorDetail";
import { MenuGallery } from "../components/MenuGallery";
import { UserProfileModal } from "../components/UserProfileModal";
import type { Vendor } from "../../shared/types";

type RoutePlace = {
  name?: string;
  lat?: number;
  lng?: number;
};

function hasRouteCoordinates(
  place: RoutePlace | null | undefined,
): place is RoutePlace & { lat: number; lng: number } {
  return Number.isFinite(Number(place?.lat)) && Number.isFinite(Number(place?.lng));
}

function isSameRoutePoint(first: RoutePlace, second: RoutePlace) {
  return (
    Number(first.lat).toFixed(6) === Number(second.lat).toFixed(6) &&
    Number(first.lng).toFixed(6) === Number(second.lng).toFixed(6)
  );
}

function isCurrentLocationText(value = "") {
  const normalized = value.trim().toLowerCase();
  return ["you", "me", "my place", "my location", "current location", "your location"].includes(normalized);
}

export default function UserSearchPage() {
  const { darkMode, tm } = useTheme();
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role_scope === "CONSUMER") return;
    const target =
      user.role_scope === "VENDOR"
        ? "/vendor/stalls"
        : user.role_scope === "DEVELOPER_ADMIN"
          ? "/admin/developer/dashboard"
          : "/admin";
    navigate(target, { replace: true });
  }, [navigate, user]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const [page, setPage] = useState("home");
  const [leftNavTab, setLeftNavTab] = useState("route");
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // ── Route ─────────────────────────────────────────────────────────────────
  const [originText, setOriginText] = useState("");
  const [destText, setDestText] = useState("");
  const [originPlace, setOriginPlace] = useState(PLACES[0]);
  const [destPlace, setDestPlace] = useState(PLACES[1]);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [routeReady, setRouteReady] = useState(false);
  const [editRouteMode, setEditRouteMode] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [routeFallbackWarning, setRouteFallbackWarning] = useState("");
  const [originFocus, setOriginFocus] = useState(false);
  const [destFocus, setDestFocus] = useState(false);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [filterCuisine, setFilterCuisine] = useState("All");
  const [filterMaxPrice, setFilterMaxPrice] = useState(4);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");
  const deferredVendorSearch = useDeferredValue(vendorSearch);
  const [vendorRange, setVendorRange] = useState(VENDOR_RANGE_DEFAULT);

  // ── User data ─────────────────────────────────────────────────────────────
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const selectVendor = useCallback((v: Vendor | null) => {
    setSelectedVendor(v);
    setShowVendorDetails(false);
  }, []);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { savedRoutes, addRoute, deleteRoute, clearRoutes, updateRouteLabel } = useSavedRoutes();
  const { history: searchHistory, addSearch, deleteSearch, clearHistory } = useSearchHistory();

  const { latitude, longitude, loading: geoLoading, error: geoError } = useGeolocation();
  const [geoFilled, setGeoFilled] = useState(false);
  const currentLocationPlace =
    latitude !== null && longitude !== null
      ? { name: "Your location", lat: latitude, lng: longitude }
      : null;

  useEffect(() => {
    if (!geoLoading && latitude !== null && longitude !== null && !geoFilled) {
      let minDist = Infinity;
      for (const place of PLACES) {
        const d = haversineM(latitude, longitude, place.lat, place.lng);
        if (d < minDist) {
          minDist = d;
        }
      }
      if (minDist <= 1000 || !originText.trim()) {
        setOriginText("Your location");
        setOriginPlace({ name: "Your location", lat: latitude, lng: longitude });
      }
      setGeoFilled(true);
    }
  }, [geoLoading, latitude, longitude, geoFilled, originText]);

  const {
    scoredVendors,
    loading: vendorLoading,
    error: vendorError,
    refetch: refetchVendors,
    searchMeta,
  } = useVendors({
    routePoints,
    vendorRange,
    filterCuisine,
    filterMaxPrice,
    filterOpenNow,
    vendorSearch: deferredVendorSearch,
  });
  const activeFilterCount =
    (filterCuisine !== "All" ? 1 : 0) +
    (filterMaxPrice < 4 ? 1 : 0) +
    (filterOpenNow ? 1 : 0);

  const handleToggleBookmark = useCallback((placeId: string | number) => {
    if (user?.role_scope !== "CONSUMER") {
      navigate("/user/login");
      return;
    }
    toggleBookmark(placeId);
  }, [user, navigate, toggleBookmark]);

  async function handleFindRoute(overrideOrigin?: RoutePlace, overrideDest?: RoutePlace) {
    const wantsCurrentLocation = !overrideOrigin && isCurrentLocationText(originText);

    setRouteError("");
    setRouteFallbackWarning("");

    if (wantsCurrentLocation && !currentLocationPlace) {
      setRouteError("Allow browser location access or choose a start point from the suggestions.");
      return;
    }

    const effectiveOrigin = overrideOrigin ??
      (wantsCurrentLocation
        ? currentLocationPlace
        : originPlace);
    const effectiveDest = overrideDest ?? destPlace;

    if (!hasRouteCoordinates(effectiveOrigin) || !hasRouteCoordinates(effectiveDest)) {
      setRouteError("Choose a valid start and destination from the suggestions.");
      return;
    }

    if (isSameRoutePoint(effectiveOrigin, effectiveDest)) {
      setRouteError("Start and destination cannot be the same place.");
      return;
    }

    setOriginPlace(effectiveOrigin);
    setDestPlace(effectiveDest);
    setLoadingRoute(true);
    try {
      const displayOrigin = effectiveOrigin.name === "Your location" || isCurrentLocationText(originText)
        ? "Your location"
        : originText.trim();
      const { points, wasFallback } = await getRoute(effectiveOrigin, effectiveDest);
      if (!Array.isArray(points) || points.length < 2) {
        throw new Error("Route service returned too few points.");
      }
      setRoutePoints(points);
      if (wasFallback) {
        setRouteFallbackWarning("Live routing unavailable — showing approximate route.");
      }
      setRouteReady(true);
      selectVendor(null);
      setPage("filter");
      if (originText.trim() && destText.trim()) {
        addSearch({
          origin: displayOrigin,
          dest: destText.trim(),
          originPlace: effectiveOrigin,
          destPlace: effectiveDest,
          resultsCount: 0,
        });
      }
    } catch (err) {
      console.error("OSRM routing failed:", err);
      setRouteError("Could not calculate this route. Try different locations.");
    } finally {
      setLoadingRoute(false);
    }
  }

  const handleBack = useCallback(() => {
    setPage("home");
    setRouteReady(false);
    setEditRouteMode(false);
    selectVendor(null);
    setRouteError("");
    setRouteFallbackWarning("");
  }, []);

  async function handleSaveRoute() {
    const result = await addRoute({
      label: originText && destText ? `${originText} → ${destText}` : "Custom Route",
      origin: originText,
      dest: destText,
      originPlace,
      destPlace,
      points: routePoints,
    });
    if (result?.success) {
      toast.success("Route saved!");
    } else {
      toast.error(result?.message || "Route already saved");
    }
  }

  function handleLoadRoute(r) {
    setOriginText(r.origin);
    setDestText(r.dest);
    setOriginPlace(r.originPlace ?? { name: r.origin, lat: r.points?.[0]?.[0], lng: r.points?.[0]?.[1] });
    setDestPlace(r.destPlace ?? { name: r.dest, lat: r.points?.[r.points.length - 1]?.[0], lng: r.points?.[r.points.length - 1]?.[1] });
    setRoutePoints(r.points);
    setRouteReady(true);
    setPage("filter");
    setLeftNavTab("route");
  }

  async function handleWaypointAdded(lat, lng) {
    setLoadingRoute(true);
    setRouteError("");
    try {
      const waypoint = { name: "Waypoint", lat, lng };
      const { points, wasFallback } = await getRoute(originPlace, destPlace, [waypoint]);
      if (!Array.isArray(points) || points.length < 2) {
        throw new Error("Route service returned too few points.");
      }
      setRoutePoints(points);
      if (wasFallback) {
        setRouteFallbackWarning("Live routing unavailable — showing approximate route.");
      }
    } catch (err) {
      console.error("Failed to recalculate route with waypoint:", err);
      setRouteError("Could not customize this route. Try dragging a different part of the route.");
    } finally {
      setLoadingRoute(false);
    }
  }

    const handleVendorSelect = useCallback((v) => {
      selectVendor(v);
    }, [selectVendor]);

    const { mapDivRef, mapRecovering } = useMaplibreMap({
    darkMode,
    routePoints,
    routeReady,
    editRouteMode,
    scoredVendors,
    selectedVendorId: selectedVendor?.id ?? null,
    onSelectVendor: handleVendorSelect,
    onWaypointAdded: handleWaypointAdded,
    onEndpointDrag: useCallback((type, lat, lng) => {
      const newOrigin = type === "origin" ? { ...originPlace, lat, lng } : originPlace;
      const newDest = type === "dest" ? { ...destPlace, lat, lng } : destPlace;
      if (type === "origin") setOriginPlace(newOrigin);
      else setDestPlace(newDest);
      handleFindRoute(newOrigin, newDest);
    }, [originPlace, destPlace, handleFindRoute]),
    debugPlaces: [],
    userLocation: latitude !== null && longitude !== null ? { latitude, longitude } : null,
    favorites: bookmarks,
  });

  const hasRoute = routeReady && routePoints.length >= 2;

  return (
    <div
      className="w-screen h-screen flex overflow-hidden"
      style={{ background: tm.appBg }}
    >
      <NavRail
        activeTab={leftNavTab}
        onTabChange={setLeftNavTab}
        showSettings={showSettings}
        onSettingsToggle={() => setShowSettings((v) => !v)}
        onProfileOpen={() => setShowProfile(true)}
        onHomeReset={() => {
          setPage("home");
          setRouteReady(false);
          setEditRouteMode(false);
          selectVendor(null);
          setRouteError("");
        }}
        onAuthRequired={() => navigate("/user/login")}
      />

      <aside
        className="flex flex-col h-full overflow-hidden shrink-0"
        style={{
          width: "25vw",
          minWidth: 260,
          borderRight: `1px solid ${tm.border}`,
          background: tm.sidebar,
        }}
      >
        <AnimatePresence mode="wait">
          {leftNavTab === "favorite" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <FavoritesPanel
                favorites={bookmarks}
                vendors={scoredVendors}
                onSelectVendor={(v) => { selectVendor(v); }}
                onToggleFavorite={handleToggleBookmark}
              />
            </motion.div>
          )}
          {leftNavTab === "trips" && (
            <motion.div
              key="trips"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <SearchHistoryPanel
                history={searchHistory}
                onReplay={(e) => {
                  setOriginText(e.origin);
                  setDestText(e.dest);
                  setOriginPlace(e.originPlace);
                  setDestPlace(e.destPlace);
                  setLeftNavTab("route");
                  setPage("home");
                }}
                onDelete={(id) => deleteSearch(id)}
                onClearAll={() => clearHistory()}
              />
            </motion.div>
          )}
          {leftNavTab === "savedRoutes" && (
            <motion.div
              key="savedRoutes"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <HistoryPanel
                savedRoutes={savedRoutes}
                onLoadRoute={handleLoadRoute}
                onDeleteRoute={(id) => deleteRoute(id)}
                onClearAll={() => clearRoutes()}
                onUpdateLabel={async (id, label) => {
                  const res = await updateRouteLabel(id, label);
                  if (res && !res.success) toast.error(res.message);
                  return res;
                }}
              />
            </motion.div>
          )}
          {leftNavTab === "route" && page === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-y-auto"
            >
              <RouteInputPanel
                originText={originText}
                setOriginText={setOriginText}
                destText={destText}
                setDestText={setDestText}
                originPlace={originPlace}
                setOriginPlace={setOriginPlace}
                destPlace={destPlace}
                setDestPlace={setDestPlace}
                originFocus={originFocus}
                setOriginFocus={setOriginFocus}
                destFocus={destFocus}
                setDestFocus={setDestFocus}
                vendorRange={vendorRange}
                setVendorRange={setVendorRange}
                savedRoutes={searchHistory}
                loadingRoute={loadingRoute}
                routeError={routeError}
                routeFallbackWarning={routeFallbackWarning}
                currentLocation={currentLocationPlace}
                currentLocationLoading={geoLoading}
                currentLocationError={geoError}
                onUseCurrentLocation={() => setRouteError("")}
                onLoadRoute={(e) => {
                  setOriginText(e.origin);
                  setDestText(e.dest);
                  setOriginPlace(e.originPlace);
                  setDestPlace(e.destPlace);
                  handleFindRoute(e.originPlace, e.destPlace);
                }}
                onViewMoreHistory={() => setLeftNavTab("trips")}
                onFindRoute={handleFindRoute}
              />
            </motion.div>
          )}
          {leftNavTab === "route" && page === "filter" && (
            <motion.div
              key="filter"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <FilterPanel
                originText={originText}
                destText={destText}
                vendorCount={scoredVendors.length}
                scoredVendors={scoredVendors}
                onSelectVendor={(v) => { selectVendor(v); }}
                onViewDetails={(v) => { setSelectedVendor(v); setShowVendorDetails(true); }}
                searchMeta={searchMeta}
                filterCuisine={filterCuisine}
                setFilterCuisine={setFilterCuisine}
                filterMaxPrice={filterMaxPrice}
                setFilterMaxPrice={setFilterMaxPrice}
                filterOpenNow={filterOpenNow}
                setFilterOpenNow={setFilterOpenNow}
                vendorSearch={vendorSearch}
                setVendorSearch={setVendorSearch}
                onBack={handleBack}
                favorites={bookmarks}
                onToggleFavorite={handleToggleBookmark}
                onResetFilters={() => {
                  setFilterCuisine("All");
                  setFilterMaxPrice(4);
                  setFilterOpenNow(false);
                  setVendorSearch("");
                }}
                activeFilterCount={activeFilterCount}
                vendorLoading={vendorLoading}
                vendorError={vendorError}
                onRetryVendors={refetchVendors}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Map area — click outside dismisses vendor detail or returns to gallery */}
      <div className="flex-1 relative overflow-hidden flex flex-col" onClick={() => {
        if (showVendorDetails) {
          setShowVendorDetails(false);
        } else {
          selectVendor(null);
        }
      }}>
        {mapRecovering && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <LoadingSpinner message="Recovering map view..." />
          </div>
        )}
        <div
          ref={mapDivRef}
          className="w-full transition-[height] duration-200"
          style={{ height: selectedVendor && !showVendorDetails ? "calc(100% - 130px)" : "100%" }}
        />

        {/* Edit mode banner */}
        {editRouteMode && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-2.5 px-3 py-2 rounded-2xl"
            style={{
              background: "rgba(34,197,94,0.92)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(34,197,94,0.4)",
            }}
          >
            <PenLine size={13} className="text-white/70 shrink-0" />
            <span className="text-white text-[11px] font-medium">
              Drag route to add waypoints
            </span>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button
              onClick={handleSaveRoute}
              title="Save Route"
              className="flex items-center justify-center w-7 h-7 rounded-xl transition-all hover:bg-white/25 active:scale-95"
              style={{ color: "#ffffff" }}
            >
              <BookmarkPlus size={15} />
            </button>
            <button
              onClick={() => {
                setEditRouteMode(false);
              }}
              aria-label="Dismiss edit mode"
              className="flex items-center justify-center w-7 h-7 rounded-xl transition-all hover:bg-white/20 active:scale-95"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Edit route toggle */}
        {routeReady && (
          <div className="absolute top-4 right-16 z-[400]">
            <button
              onClick={() => {
                const n = !editRouteMode;
                setEditRouteMode(n);
              }}
              className="flex items-center gap-2 px-3 h-9 rounded-xl transition-all hover:brightness-110 active:scale-95"
              style={
                editRouteMode
                    ? {
                        background: "rgba(34,197,94,0.9)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 0 0 3px rgba(34,197,94,0.3)",
                    }
                  : {
                      background: tm.glassCard,
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${tm.border}`,
                    }
              }
            >
              {editRouteMode ? (
                <>
                  <Eye size={14} className="text-white shrink-0" />
                  <span className="text-[11px] font-semibold text-white">
                    Show Vendors
                  </span>
                </>
              ) : (
                <>
                  <PenLine
                    size={14}
                    style={{ color: tm.text2 }}
                    className="shrink-0"
                  />
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: tm.text2 }}
                  >
                    Edit Route
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Debug toggle — shows all vendors */}
        <div
          title="Map marker legend"
          className="absolute top-4 left-4 z-[500] w-fit px-2.5 h-9 rounded-xl flex items-center justify-center gap-1.5"
          style={{
            background: tm.glassCard,
            backdropFilter: "blur(12px)",
            border: `1px solid ${tm.border}`,
          }}
        >
          <div
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#f97316",
            }}
          />
          <span
            className="text-[10px] font-semibold"
            style={{ color: tm.text3 }}
          >
            You
          </span>
          <div
            className="rotate-[-45deg]"
            style={{
              width: 8, height: 8, borderRadius: "50% 50% 50% 0",
              background: "#22c55e",
              border: "1px solid white",
            }}
          />
          <span className="text-[10px] font-semibold" style={{ color: tm.text3 }}>
            Vendor
          </span>
          <div
            className="rotate-[-45deg]"
            style={{
              width: 8, height: 8, borderRadius: "50% 50% 50% 0",
              background: "#3B82F6",
              border: "1px solid white",
            }}
          />
          <span className="text-[10px] font-semibold" style={{ color: tm.text3 }}>
            Selected
          </span>
        </div>

        <div
          className="absolute bottom-2 right-3 z-[400] text-[9px]"
          style={{ color: tm.text4 }}
        >
          © OpenStreetMap contributors
        </div>

        {/* Menu gallery — shows selected vendor's menu items with pictures */}
        {selectedVendor && !showVendorDetails && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 z-[300]"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuGallery vendor={selectedVendor} />
          </motion.div>
        )}

        {/* Vendor detail slide-in — only opens when user clicks "Details" */}
        <div
          className="absolute top-0 right-0 bottom-0 z-[1000] transition-transform duration-300"
          style={{
            width: 360,
            transform: showVendorDetails && selectedVendor ? "translateX(0)" : "translateX(100%)",
            boxShadow: "-8px 0 32px rgba(0,0,0,0.35)",
          }}
        >
          {showVendorDetails && selectedVendor && (
            <VendorDetail
              vendor={selectedVendor}
              onClose={() => setShowVendorDetails(false)}
              isFavorite={bookmarks.has(String(selectedVendor.id))}
              onToggleFavorite={() => handleToggleBookmark(selectedVendor.id)}
            />
          )}
        </div>
      </div>

      {showProfile && (
        <UserProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}
