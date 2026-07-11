import { useState } from "react";
import {
  AlertCircle,
  Filter,
  RefreshCw,
  Search,
  ArrowLeft,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../shared/hooks/useTheme";
import { LoadingSpinner } from "../../shared/components/LoadingSpinner";
import { CUISINES, PRICE_LABELS } from "../../shared/constants/appConfig";
import { VendorCard } from "./VendorCard";

const SECTION_VARIANTS = {
  enter: { height: "auto", opacity: 1, overflow: "visible" },
  exit: { height: 0, opacity: 0, overflow: "hidden" },
};

const CHIP_VARIANTS = {
  tap: { scale: 0.94 },
};

const LIST_VARIANTS = {
  enter: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.96 },
};

const ease = [0.16, 1, 0.3, 1];

export function FilterPanel({
  originText,
  destText,
  vendorCount,
  scoredVendors,
  onSelectVendor,
  filterCuisine,
  setFilterCuisine,
  filterMaxPrice,
  setFilterMaxPrice,
  filterOpenNow,
  setFilterOpenNow,
  vendorSearch,
  setVendorSearch,
  onBack,
  onResetFilters,
  activeFilterCount,
  vendorLoading = false,
  vendorError = null,
  onRetryVendors,
  favorites = new Set(),
  onToggleFavorite = () => {},
  onViewDetails,
  searchMeta = { total: 0, byName: 0, byMenu: 0 },
}) {
  const { darkMode, tm } = useTheme();
  const [openSections, setOpenSections] = useState({
    cuisine: true,
    price: true,
    other: true,
    vendors: true,
  });

  function toggleSection(key) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Route summary header */}
      <motion.div
        layout
        className="shrink-0 px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: `1px solid ${tm.border}` }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={onBack}
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-white/10"
          style={{ background: tm.surface2 }}
        >
          <ArrowLeft size={13} style={{ color: tm.text3 }} />
        </motion.button>
        <div className="flex-1 min-w-0">
          <motion.div
            className="text-[11px] font-semibold truncate"
            style={{ color: tm.text1 }}
            layout
          >
            {originText} → {destText}
          </motion.div>
          <motion.div
            className="text-[10px]"
            style={{ color: tm.text4 }}
            layout
          >
            {vendorLoading ? <LoadingSpinner inline message="Loading vendors..." /> : vendorError ? "Vendor data unavailable" : `${vendorCount} vendors found`}
          </motion.div>
        </div>
      </motion.div>

      {/* Filter controls */}
      <div className="shrink-0 px-4 py-3 space-y-3 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
        {/* Filter header */}
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 text-[13px] font-semibold"
            style={{ color: tm.text3 }}
            layout
          >
            <SlidersHorizontal size={13} />
            <span>Filters</span>
            <AnimatePresence mode="popLayout">
              {activeFilterCount > 0 && (
                <motion.span
                  key="filter-badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="text-[11px] font-bold px-1.5 py-px rounded-full"
                  style={{ background: tm.primary, color: tm.primaryText }}
                >
                  {activeFilterCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.button
            whileHover={{ opacity: 0.7 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetFilters}
            className="text-[11px] font-medium"
            style={{ color: tm.text4 }}
          >
            Reset
          </motion.button>
        </div>

        {/* Search */}
        <motion.div className="relative" layout>
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: tm.text4 }}
          />
          <motion.input
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            placeholder="Search vendors or menu…"
            className="w-full pl-8 pr-3 py-2 rounded-xl text-[13px] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30"
            style={{
              background: tm.inputBg,
              border: `1px solid ${vendorSearch ? tm.inputFocus : tm.inputBorder}`,
              color: tm.text1,
              transition: "border-color 0.2s ease",
            }}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.15 }}
          />
          <AnimatePresence>
            {vendorSearch && (
              <motion.button
                key="search-clear"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.12 }}
                onClick={() => setVendorSearch("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                style={{ color: tm.text4 }}
              >
                <X size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Search result summary */}
        <AnimatePresence>
          {vendorSearch && !vendorLoading && !vendorError && (
            <motion.div
              key="search-summary"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 text-[11px]"
              style={{ color: tm.text4 }}
            >
              <span>{searchMeta.total} result{searchMeta.total !== 1 ? "s" : ""}</span>
              {searchMeta.byName > 0 && (
                <span
                  className="px-1.5 py-px rounded-full text-[10px] font-medium"
                  style={{
                    background: tm.primary + "18",
                    color: tm.primary,
                  }}
                >
                  {searchMeta.byName} by name
                </span>
              )}
              {searchMeta.byMenu > 0 && (
                <span
                  className="px-1.5 py-px rounded-full text-[10px] font-medium"
                  style={{
                    background: tm.filterChip,
                    color: tm.text3,
                  }}
                >
                  {searchMeta.byMenu} by menu
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading / Error states */}
        <AnimatePresence>
          {vendorLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[12px]"
              style={{ background: tm.surface1, color: tm.text4 }}
            >
              <LoadingSpinner inline message="Loading vendor data..." />
            </motion.div>
          )}

          {vendorError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-2 rounded-xl px-3 py-2 text-[12px]"
              style={{
                background: darkMode ? "rgba(248,113,113,0.12)" : "#FEF2F2",
                color: darkMode ? "#FCA5A5" : "#B91C1C",
              }}
            >
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p>{vendorError}</p>
                {onRetryVendors && (
                  <motion.button
                    whileHover={{ opacity: 0.75 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRetryVendors}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <RefreshCw size={11} /> Retry
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cuisine section */}
        <motion.div layout>
          <button
            onClick={() => toggleSection("cuisine")}
            className="w-full flex items-center justify-between py-1"
          >
            <span
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: tm.text4 }}
            >
              Cuisine
            </span>
            {openSections.cuisine ? (
              <ChevronUp size={12} style={{ color: tm.text4 }} />
            ) : (
              <ChevronDown size={12} style={{ color: tm.text4 }} />
            )}
          </button>
          <AnimatePresence initial={false}>
            {openSections.cuisine && (
              <motion.div
                key="cuisine"
                variants={SECTION_VARIANTS}
                initial="exit"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.2, ease }}
              >
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {["All", ...CUISINES].map((c) => (
                    <motion.button
                      key={c}
                      whileTap="tap"
                      variants={CHIP_VARIANTS}
                      onClick={() => setFilterCuisine(c)}
                      className="px-3 py-1 rounded-full text-[12px] font-medium transition-colors"
                      style={
                        filterCuisine === c
                          ? { background: tm.primary, color: tm.primaryText }
                          : { background: tm.filterChip, color: tm.filterChipText }
                      }
                    >
                      {c}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Price section */}
        <motion.div layout>
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between py-1"
          >
            <span
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: tm.text4 }}
            >
              Max Price
            </span>
            {openSections.price ? (
              <ChevronUp size={12} style={{ color: tm.text4 }} />
            ) : (
              <ChevronDown size={12} style={{ color: tm.text4 }} />
            )}
          </button>
          <AnimatePresence initial={false}>
            {openSections.price && (
              <motion.div
                key="price"
                variants={SECTION_VARIANTS}
                initial="exit"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.2, ease }}
              >
                <div className="flex gap-1.5 pt-1.5">
                  {[1, 2, 3, 4].map((p) => {
                    const isSelected = filterMaxPrice === p;
                    const isBelowMax = p < filterMaxPrice;
                    return (
                      <motion.button
                        key={p}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setFilterMaxPrice(p)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg text-[13px] font-bold transition-colors relative overflow-hidden"
                        style={
                          isSelected
                            ? { background: tm.primary, color: tm.primaryText }
                            : isBelowMax
                              ? {
                                  background: darkMode
                                    ? "rgba(34,197,94,0.15)"
                                    : "rgba(34,197,94,0.1)",
                                  color: tm.primary,
                                }
                              : { background: tm.filterChip, color: tm.filterChipText }
                        }
                      >
                        <span className="relative z-10">{PRICE_LABELS[p]}</span>
                        {isSelected && (
                          <motion.div
                            layoutId="price-indicator"
                            className="absolute inset-0 rounded-lg"
                            style={{ background: tm.primary }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Other toggles section */}
        <motion.div layout>
          <button
            onClick={() => toggleSection("other")}
            className="w-full flex items-center justify-between py-1"
          >
            <span
              className="text-[10px] uppercase tracking-wider font-semibold"
              style={{ color: tm.text4 }}
            >
              Availability
            </span>
            {openSections.other ? (
              <ChevronUp size={12} style={{ color: tm.text4 }} />
            ) : (
              <ChevronDown size={12} style={{ color: tm.text4 }} />
            )}
          </button>
          <AnimatePresence initial={false}>
            {openSections.other && (
              <motion.div
                key="other"
                variants={SECTION_VARIANTS}
                initial="exit"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.2, ease }}
              >
                <div className="flex items-center justify-between pt-2 pb-1">
                  <span className="text-[12px] font-medium" style={{ color: tm.text2 }}>
                    Open now
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFilterOpenNow(!filterOpenNow)}
                    className="w-10 h-5 rounded-full relative transition-colors shrink-0"
                    style={{
                      background: filterOpenNow ? "#10b981" : tm.surface3,
                    }}
                  >
                    <motion.div
                      layout
                      className="absolute top-[2px] w-4 h-4 bg-white rounded-full shadow"
                      transition={{ type: "spring", stiffness: 500, damping: 28 }}
                      style={{ left: filterOpenNow ? "22px" : "2px" }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {!vendorLoading && !vendorError && vendorCount === 0 && (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-center py-4"
              style={{ color: tm.text4 }}
            >
              No vendors match these filters.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Vendor list section */}
        <AnimatePresence>
          {scoredVendors && scoredVendors.length > 0 && (
            <motion.div
              key="vendor-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <button
                onClick={() => toggleSection("vendors")}
                className="w-full flex items-center justify-between pt-4 pb-2"
                style={{ borderTop: `1px solid ${tm.border}` }}
              >
                <span
                  className="text-[10px] uppercase tracking-wider font-semibold"
                  style={{ color: tm.text4 }}
                >
                  Vendors ({scoredVendors.length})
                </span>
                {openSections.vendors ? (
                  <ChevronUp size={12} style={{ color: tm.text4 }} />
                ) : (
                  <ChevronDown size={12} style={{ color: tm.text4 }} />
                )}

              </button>        
              <AnimatePresence initial={false}>
                {openSections.vendors && (
                  <motion.div
                    key="vendor-list"
                    variants={SECTION_VARIANTS}
                    initial="exit"
                    animate="enter"
                    exit="exit"
                    transition={{ duration: 0.2, ease }}
                    className="space-y-0.5 max-h-64 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10"
                  >
                    <AnimatePresence mode="popLayout">
                      {scoredVendors.map((v, i) => (
                        <motion.div
                          key={v.id}
                          layout
                          variants={LIST_VARIANTS}
                          initial="exit"
                          animate="enter"
                          exit="exit"
                          transition={{
                            duration: 0.25,
                            delay: i * 0.03,
                            ease,
                          }}
                        >
                          <VendorCard
                            vendor={v}
                            rank={i + 1}
                            isFavorite={favorites.has(String(v.id))}
                            onSelect={() => onSelectVendor(v)}
                            onToggleFavorite={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(v.id);
                            }}
                            searchQuery={vendorSearch}
                          />
                          {onViewDetails && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onViewDetails(v); }}
                              className="w-full text-[10px] font-medium text-right pr-4 pb-1 -mt-1"
                              style={{ color: tm.primary }}
                            >
                              View Details →
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
