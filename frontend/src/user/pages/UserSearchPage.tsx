// Main consumer page — composes sidebar panels with the MapLibre map.
// Map lifecycle delegated to useMaplibreMap; vendor scoring to useVendors.

// MapLibre GL styles
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PenLine, Eye, BookmarkPlus, HelpCircle, LogOut, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

import { useTheme } from "../../shared/hooks/useTheme";
import { useAuth } from "../../shared/hooks/useAuth";
import { useGeolocation } from "../../shared/hooks/useGeolocation";
import { PLACES, VENDOR_RANGE_DEFAULT } from "../../shared/constants/appConfig";
import { getRoute } from "../../shared/services/routeService";
import { useVendors } from "../hooks/useVendors";
import { useMaplibreMap } from "../hooks/useMaplibreMap";
import { haversineM } from "../../shared/utils/geoUtils";

import { NavRail } from "../components/NavRail";
import { RouteInputPanel } from "../components/RouteInputPanel";
import { FilterPanel } from "../components/FilterPanel";
import { FavoritesPanel } from "../components/FavoritesPanel";
import { HistoryPanel } from "../components/HistoryPanel";
import { SearchHistoryPanel } from "../components/SearchHistoryPanel";
import { VendorDetail } from "../components/VendorDetail";
import { UserProfileModal } from "../components/UserProfileModal";

export default function UserSearchPage() {
  const { darkMode, tm } = useTheme();
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();

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
  const [routePoints, setRoutePoints] = useState([]);
  const [routeReady, setRouteReady] = useState(false);
  const [editRouteMode, setEditRouteMode] = useState(false);
  const [waypointMode, setWaypointMode] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [originFocus, setOriginFocus] = useState(false);
  const [destFocus, setDestFocus] = useState(false);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [filterCuisine, setFilterCuisine] = useState("All");
  const [filterMaxPrice, setFilterMaxPrice] = useState(4);
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorRange, setVendorRange] = useState(VENDOR_RANGE_DEFAULT);

  // ── User data ─────────────────────────────────────────────────────────────
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [menuVendor, setMenuVendor] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [geoFilled, setGeoFilled] = useState(false);

  const [debugShowAll, setDebugShowAll] = useState(false);

  const { latitude, longitude, loading: geoLoading } = useGeolocation();
  useEffect(() => {
    if (!geoLoading && latitude !== null && longitude !== null && !geoFilled) {
      let closest = PLACES[0];
      let minDist = Infinity;
      for (const place of PLACES) {
        const d = haversineM(latitude, longitude, place.lat, place.lng);
        if (d < minDist) {
          minDist = d;
          closest = place;
        }
      }
      if (minDist <= 1000) {
        setOriginText("My Place");
        setOriginPlace({ name: "My Place", lat: latitude, lng: longitude });
        setGeoFilled(true);
      }
      setGeoFilled(true);
    }
  }, [geoLoading, latitude, longitude, geoFilled]);
  const { scoredVendors, allVendors } = useVendors({
    routePoints,
    vendorRange,
    filterCuisine,
    filterMaxPrice,
    filterOpenNow,
    vendorSearch,
  });
  const activeFilterCount =
    (filterCuisine !== "All" ? 1 : 0) +
    (filterMaxPrice < 4 ? 1 : 0) +
    (filterOpenNow ? 1 : 0);

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function handleFindRoute(overrideOrigin, overrideDest) {
    setLoadingRoute(true);
    try {
      const displayOrigin = originText.trim() === "My Place" && originPlace
        ? `${originPlace.lat.toFixed(4)}, ${originPlace.lng.toFixed(4)}`
        : originText.trim();
      const pts = await getRoute(overrideOrigin ?? originPlace, overrideDest ?? destPlace);
      setRoutePoints(pts);
      setRouteReady(true);
      setSelectedVendor(null);
      setPage("filter");
      // Record every search so the History tab and recent strip stay current
      if (originText.trim() && destText.trim()) {
        const searchedAt = new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        const entry = {
          id: Date.now(),
          origin: displayOrigin,
          dest: destText.trim(),
          originPlace,
          destPlace,
          searchedAt,
        };
        setSearchHistory((prev) =>
          [
            entry,
            ...prev.filter(
              (s) => !(s.origin === entry.origin && s.dest === entry.dest),
            ),
          ].slice(0, 50),
        );
      }
    } catch (err) {
      console.error("OSRM routing failed:", err);
    } finally {
      setLoadingRoute(false);
    }
  }

  function handleBack() {
    setPage("home");
    setRouteReady(false);
    setEditRouteMode(false);
    setWaypointMode(false);
    setSelectedVendor(null);
  }

  function handleSaveRoute() {
    const label =
      originText && destText ? `${originText} → ${destText}` : "Custom Route";
    const savedAt = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setSavedRoutes((prev) =>
      [
        {
          id: Date.now(),
          label: `${originText === "My Place" ? `${destPlace.lat.toFixed(4)}, ${destPlace.lng.toFixed(4)}` : destText}`,
          origin: originText,
          dest: destText,
          originPlace,
          destPlace,
          points: routePoints,
          savedAt,
        },
        ...prev,
      ].slice(0, 20),
    );
  }

  function handleLoadRoute(r) {
    setOriginText(r.origin);
    setDestText(r.dest);
    setOriginPlace(r.originPlace ?? { name: r.origin, lat:r.points?.[0]?.[0], lng:r.points?.[0]?.[1]});
    setDestPlace(r.destPlace ?? { name: r.dest, lat:r.points?.[r.points.length - 1]?.[0], lng:r.points?.[r.points.length - 1]?.[1] });
    setRoutePoints(r.points);
    setRouteReady(true);
    setPage("filter");
    setLeftNavTab("route");
  }

  async function handleWaypointAdded(lat, lng) {
    setLoadingRoute(true);
    try {
      const waypoint = { name: "Waypoint", lat, lng };
      const pts = await getRoute(originPlace, destPlace, [waypoint]);
      setRoutePoints(pts);
    } catch (err) {
      console.error("Failed to recalculate route with waypoint:", err);
    } finally {
      setLoadingRoute(false);
    }
  }

  function handleVendorSelect(v) {
    setMenuVendor(v);
    setSelectedVendor(v);
  }

  const { mapDivRef } = useMaplibreMap({
    darkMode,
    routePoints,
    routeReady,
    editRouteMode,
    scoredVendors,
    selectedVendorId: selectedVendor?.id ?? null,
    onSelectVendor: handleVendorSelect,
    onWaypointAdded: handleWaypointAdded,
    onEndpointDrag: (type, lat, lng) => {
      const newOrigin = type === "origin" ? { ...originPlace, lat, lng } : originPlace;
      const newDest = type === "dest" ? { ...destPlace, lat, lng } : destPlace;
      if (type === "origin") setOriginPlace(newOrigin);
      else setDestPlace(newDest);
      handleFindRoute(newOrigin, newDest);
    },
    debugPlaces: debugShowAll ? allVendors : [],
    userLocation: latitude && longitude ? { latitude, longitude } : null,
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
          setWaypointMode(false);
          setSelectedVendor(null);
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
                favorites={favorites}
                vendors={scoredVendors}
                onSelectVendor={(v) => { setMenuVendor(v); setSelectedVendor(v); }}
                onToggleFavorite={toggleFavorite}
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
                onDelete={(id) =>
                  setSearchHistory((prev) => prev.filter((h) => h.id !== id))
                }
                onClearAll={() => setSearchHistory([])}
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
                onDeleteRoute={(id) =>
                  setSavedRoutes((prev) => prev.filter((r) => r.id !== id))
                }
                onClearAll={() => setSavedRoutes([])}
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
                  onSelectVendor={(v) => { setMenuVendor(v); setSelectedVendor(v); }}
                  filterCuisine={filterCuisine}
                  setFilterCuisine={setFilterCuisine}
                  filterMaxPrice={filterMaxPrice}
                  setFilterMaxPrice={setFilterMaxPrice}
                  filterOpenNow={filterOpenNow}
                  setFilterOpenNow={setFilterOpenNow}
                  vendorSearch={vendorSearch}
                  setVendorSearch={setVendorSearch}
                  onBack={handleBack}
                  onResetFilters={() => {
                  setFilterCuisine("All");
                  setFilterMaxPrice(4);
                  setFilterOpenNow(false);
                  setVendorSearch("");
                }}
                activeFilterCount={activeFilterCount}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </aside>

      {/* Map area — click outside dismisses vendor detail */}
      <div className="flex-1 relative overflow-hidden flex flex-col" onClick={() => selectedVendor && setSelectedVendor(null)}>
        <div
          ref={mapDivRef}
          className="w-full transition-[height] duration-200"
          style={{ height: hasRoute ? "calc(100% - 116px)" : "100%" }}
        />

        {/* Edit mode banner */}
        {editRouteMode && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-2.5 px-3 py-2 rounded-2xl"
            style={{
              background: "rgba(99,102,241,0.92)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            }}
          >
            <PenLine size={13} className="text-white/70 shrink-0" />
            <span className="text-white text-[11px] font-medium">
              Click route to add waypoints
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
                setWaypointMode(false);
              }}
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
                setWaypointMode(n);
              }}
              className="flex items-center gap-2 px-3 h-9 rounded-xl transition-all hover:brightness-110 active:scale-95"
              style={
                editRouteMode
                  ? {
                      background: "rgba(99,102,241,0.9)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 0 0 3px rgba(99,102,241,0.3)",
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
        <button
          onClick={() => setDebugShowAll((v) => !v)}
          title="Toggle all vendors"
          className="absolute top-4 right-4 z-[500] w-fit px-2.5 h-9 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
          style={{
            background: debugShowAll ? "rgba(34,197,94,0.15)" : tm.glassCard,
            backdropFilter: "blur(12px)",
            border: `1px solid ${debugShowAll ? "#22c55e" : tm.border}`,
          }}
        >
          <div
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: debugShowAll ? "#22c55e" : tm.text3,
            }}
          />
          <span
            className="text-[10px] font-semibold"
            style={{ color: debugShowAll ? "#22c55e" : tm.text3 }}
          >
            {debugShowAll ? "All On" : "All Vendors"}
          </span>
        </button>

        {/* Logout button for signed-in users */}
        {!isGuest && (
          <button
            onClick={logout}
            title="Sign out"
            className="absolute top-4 right-[88px] z-[500] w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{
              background: tm.glassCard,
              backdropFilter: "blur(12px)",
              border: `1px solid ${tm.border}`,
            }}
          >
            <LogOut size={14} style={{ color: tm.text3 }} />
          </button>
        )}

        <div
          className="absolute bottom-2 right-3 z-[400] text-[9px]"
          style={{ color: tm.text4 }}
        >
          © OpenStreetMap contributors
        </div>

        {/* Menu strip — vendor tabs + menu items */}
        {hasRoute && (
          <div
            className="absolute bottom-0 left-0 right-0 z-[300]"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: darkMode
                ? "rgba(15,23,42,0.97)"
                : "rgba(255,255,255,0.98)",
              borderTop: `1px solid ${tm.border}`,
            }}
          >
            {/* Vendor tabs */}
            <div className="flex items-center gap-1 px-4 pt-2 pb-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {scoredVendors.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setMenuVendor(v)}
                  className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
                  style={
                    menuVendor?.id === v.id
                      ? { background: "#22c55e", color: "white" }
                      : { background: tm.surface2, color: tm.text3 }
                  }
                >
                  {v.name}
                </button>
              ))}
            </div>
            {/* Menu items row */}
            {menuVendor && menuVendor.menu?.length > 0 && (
              <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                <div
                  className="flex gap-3 px-4 py-2"
                  style={{ width: "max-content", minWidth: "100%" }}
                >
                  {menuVendor.menu.map((item, i) => (
                    <div
                      key={i}
                      className="shrink-0 rounded-xl border transition-colors flex flex-col overflow-hidden"
                      style={{
                        width: 160,
                        borderColor: tm.border,
                        background: darkMode ? "rgba(255,255,255,0.04)" : "#fafafa",
                      }}
                    >
                      <div className="h-20 overflow-hidden bg-[#e2e8f0] shrink-0">
                        <img
                          src={menuVendor.photo_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2.5 flex flex-col flex-1">
                        <p className="text-[11px] font-semibold leading-tight" style={{ color: tm.text1 }}>
                          {item.name}
                        </p>
                        {item.desc && (
                          <p className="text-[9px] mt-0.5 leading-tight line-clamp-2" style={{ color: tm.text4 }}>
                            {item.desc}
                          </p>
                        )}
                        <p className="text-[11px] font-bold mt-auto pt-1" style={{ color: "#22c55e" }}>
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vendor detail slide-in */}
        <div
          className="absolute top-0 right-0 bottom-0 z-[1000] transition-transform duration-300"
          style={{
            width: 360,
            transform: selectedVendor ? "translateX(0)" : "translateX(100%)",
            boxShadow: "-8px 0 32px rgba(0,0,0,0.35)",
          }}
        >
          {selectedVendor && (
            <VendorDetail
              vendor={selectedVendor}
              onClose={() => setSelectedVendor(null)}
              isFavorite={favorites.has(selectedVendor.id)}
              onToggleFavorite={() => toggleFavorite(selectedVendor.id)}
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
