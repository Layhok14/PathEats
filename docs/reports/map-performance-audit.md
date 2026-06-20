# Map Rendering Performance Audit

Audit date: 2026-06-20
Audited file: `frontend/src/user/hooks/useMaplibreMap.tsx` (233 lines)

## Summary

Three issues fixed (1 critical, 2 high), two medium improvements applied.

---

## Fixed Issues

### 1. [Critical] Accumulating event listeners — **fixed**

**What:** `mousemove`, `mouseleave`, and `click` listeners on `"route-line"` were registered on every `routePoints` change but never cleaned up. Each route change added 3 new listeners without removing the previous ones.

**Fix:** Store listener references and call `map.off()` in the effect cleanup. Listeners are now properly removed before re-registration.

### 2. [High] All vendor markers destroyed and recreated on every state change — **fixed**

**What:** `scoredVendors` (changes on every filter keystroke, price change, toggle), `selectedVendorId`, `routeReady`, `editRouteMode`, and `styleVersion` triggered full teardown + rebuild of all 30 vendor markers. A single keystroke in the search box destroyed and recreated 30 DOM elements + 30 `maplibregl.Marker` instances.

**Fix:** Marker pool with ID-based diffing. Existing markers are updated in-place (`setLngLat`, element style mutation, rank text update). Only truly new vendors create new markers; only removed vendors get their markers destroyed.

### 3. [High] Route source + layer destroyed/recreated instead of `setData()` — **fixed**

**What:** Every `routePoints` change ran `map.removeLayer()` + `map.removeSource()` + `map.addSource()` + `map.addLayer()`, triggering full style recalculation and a brief route line flicker.

**Fix:** On first render, create source+layer normally. On subsequent updates, call `map.getSource("route").setData(newGeoJSON)` — in-place update, no flicker, no style recalculation. Recreates source+layer only after `setStyle()` (dark mode toggle) destroys them.

### 4. [Medium] Markers removed before early-return guard — **fixed**

**What:** The vendor markers effect destroyed all markers _before_ checking `if (!routeReady || editRouteMode) return`. Toggling edit mode destroyed markers that were immediately unnecessary.

**Fix:** Guard check moved before the marker removal loop.

### 5. [Medium] `styleVersion` triggered unnecessary vendor marker rebuilds — **fixed**

**What:** `styleVersion` (incremented on dark mode toggle) was a dependency of the vendor markers effect. After `setStyle()`, markers don't need to be recreated — they survive style swaps independently.

**Fix:** Removed `styleVersion` from the vendor markers effect's dependency array.

---

## Remaining (not addressed — low real-world impact)

- Unthrottled `mousemove` on route-line (60+ events/sec)
- `onEndpointDrag` inline function in JSX
- No endpoint drag deduplication (multiple concurrent OSRM fetches)

---

## Chunk size warning (pre-existing)

```
(!) Some chunks are larger than 500 kB after minification.
```

`maplibre-gl` (~400 KB) and `recharts` contribute most of the bundle. Not addressed here.
