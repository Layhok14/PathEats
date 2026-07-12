import type { Map as MaplibreMap, MapContextEvent } from "maplibre-gl";

type MapRef = {
  current: MaplibreMap | null;
};

type MarkerRef<T> = {
  current: T[];
};

interface ContextRecoveryOptions {
  onLost?: () => void;
  onRestored?: () => void;
}

interface SafeSetStyleOptions {
  nextStyle: string;
  currentStyleRef: { current: string | null };
  onStyleReady?: () => void;
  onStyleError?: (error: unknown) => void;
}

function isStyleReady(map: MaplibreMap): boolean {
  try {
    return Boolean(map.isStyleLoaded?.()) || map.loaded();
  } catch {
    return false;
  }
}

export function waitForMapStyle(map: MaplibreMap, onReady: () => void): () => void {
  if (isStyleReady(map)) {
    onReady();
    return () => {};
  }

  let done = false;

  const cleanup = () => {
    map.off("load", checkReady);
    map.off("styledata", checkReady);
    map.off("idle", checkReady);
  };

  const finish = () => {
    if (done) return;
    done = true;
    cleanup();
    onReady();
  };

  const checkReady = () => {
    if (isStyleReady(map)) finish();
  };

  map.on("load", checkReady);
  map.on("styledata", checkReady);
  map.on("idle", checkReady);

  return () => {
    done = true;
    cleanup();
  };
}

export function safeSetMapStyle(
  map: MaplibreMap,
  { nextStyle, currentStyleRef, onStyleReady, onStyleError }: SafeSetStyleOptions,
): () => void {
  if (currentStyleRef.current === nextStyle) {
    return () => {};
  }

  let cancelled = false;
  let cleanupAfterStyleChange: (() => void) | undefined;

  const applyStyle = () => {
    if (cancelled) return;

    try {
      currentStyleRef.current = nextStyle;
      map.setStyle(nextStyle, { diff: false });
    } catch (error) {
      currentStyleRef.current = null;
      onStyleError?.(error);
      return;
    }

    cleanupAfterStyleChange = waitForMapStyle(map, () => {
      if (cancelled) return;
      map.resize();
      onStyleReady?.();
    });
  };

  const cleanupBeforeStyleChange = waitForMapStyle(map, applyStyle);

  return () => {
    cancelled = true;
    cleanupBeforeStyleChange();
    cleanupAfterStyleChange?.();
  };
}

export function attachMapContextRecovery(
  map: MaplibreMap,
  { onLost, onRestored }: ContextRecoveryOptions,
): () => void {
  const handleContextLost = (event: MapContextEvent) => {
    event.originalEvent?.preventDefault();
    onLost?.();
  };

  const handleContextRestored = () => {
    map.resize();
    onRestored?.();
  };

  map.on("webglcontextlost", handleContextLost);
  map.on("webglcontextrestored", handleContextRestored);

  return () => {
    map.off("webglcontextlost", handleContextLost);
    map.off("webglcontextrestored", handleContextRestored);
  };
}

export function removeMapSafely(mapRef: MapRef): void {
  const map = mapRef.current;
  if (!map) return;

  try {
    map.remove();
  } catch {
    // MapLibre can throw if a WebGL context was already torn down.
  } finally {
    mapRef.current = null;
  }
}

export function removeMarkersSafely<T extends { remove: () => void }>(markersRef: MarkerRef<T>): void {
  markersRef.current.forEach((marker) => marker.remove());
  markersRef.current = [];
}
