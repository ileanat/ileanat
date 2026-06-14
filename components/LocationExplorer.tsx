"use client";

import Script from "next/script";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  BROOKLYN_COLLEGE,
  BROOKLYN_COLLEGE_PLACE,
  LocationResult,
  searchPlacesNearBrooklynCollege,
} from "@/lib/location";

const ACCENT = "#e8aeb7";
const ACCENT_HOVER = "#f0bec6";

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#18181b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#09090b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a1a1aa" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#e8aeb7" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a1a1aa" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1f1f23" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#27272a" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#09090b" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3f3f46" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#fafafa" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#27272a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f0f12" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#52525b" }],
  },
];

function createPinkMarkerIcon(highlighted = false) {
  return {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
    fillColor: highlighted ? ACCENT_HOVER : ACCENT,
    fillOpacity: 1,
    strokeColor: highlighted ? "#fafafa" : ACCENT_HOVER,
    strokeWeight: highlighted ? 2.5 : 1.5,
    scale: highlighted ? 2 : 1.6,
    anchor: new google.maps.Point(12, 22),
  };
}

type LocationExplorerProps = {
  initialPlace?: string;
};

export function LocationExplorer({ initialPlace }: LocationExplorerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersByIdRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const [scriptReady, setScriptReady] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const clearMarkers = useCallback(() => {
    markersByIdRef.current.forEach((marker) => marker.setMap(null));
    markersByIdRef.current.clear();
  }, []);

  const updateMarkerHighlight = useCallback((selectedId: string | null) => {
    markersByIdRef.current.forEach((marker, id) => {
      marker.setIcon(createPinkMarkerIcon(id === selectedId));
    });
  }, []);

  const focusOnResult = useCallback(
    (result: LocationResult) => {
      if (!mapInstanceRef.current) return;

      setSelectedResultId(result.id);
      mapInstanceRef.current.panTo({ lat: result.lat, lng: result.lng });
      mapInstanceRef.current.setZoom(16);
      updateMarkerHighlight(result.id);
    },
    [updateMarkerHighlight],
  );

  const setResultMarkers = useCallback(
    (locations: LocationResult[], selectedId: string | null = null) => {
      if (!mapInstanceRef.current || !window.google) return;

      clearMarkers();

      if (locations.length === 0) {
        mapInstanceRef.current.setCenter(BROOKLYN_COLLEGE);
        mapInstanceRef.current.setZoom(15);
        return;
      }

      const bounds = new google.maps.LatLngBounds();

      locations.forEach((location) => {
        const position = { lat: location.lat, lng: location.lng };
        const marker = new google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          title: location.name,
          icon: createPinkMarkerIcon(location.id === selectedId),
        });

        marker.addListener("click", () => {
          focusOnResult(location);
        });

        markersByIdRef.current.set(location.id, marker);
        bounds.extend(position);
      });

      if (selectedId) {
        const selected = locations.find((location) => location.id === selectedId);
        if (selected) {
          mapInstanceRef.current.setCenter({
            lat: selected.lat,
            lng: selected.lng,
          });
          mapInstanceRef.current.setZoom(16);
          return;
        }
      }

      mapInstanceRef.current.fitBounds(bounds, 64);
    },
    [clearMarkers, focusOnResult],
  );

  const highlightBrooklynCollege = useCallback(() => {
    setResults([BROOKLYN_COLLEGE_PLACE]);
    setSelectedResultId(BROOKLYN_COLLEGE_PLACE.id);
    setHasSearched(false);
    setError(null);
    setResultMarkers([BROOKLYN_COLLEGE_PLACE], BROOKLYN_COLLEGE_PLACE.id);
  }, [setResultMarkers]);

  useEffect(() => {
    if (!scriptReady || !mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: BROOKLYN_COLLEGE,
      zoom: 15,
      styles: darkMapStyles,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      backgroundColor: "#09090b",
    });

    mapInstanceRef.current = map;

    if (initialPlace === "brooklyn-college") {
      highlightBrooklynCollege();
    } else {
      const defaultMarker = new google.maps.Marker({
        position: BROOKLYN_COLLEGE,
        map,
        title: "Brooklyn College",
        icon: createPinkMarkerIcon(),
      });

      markersByIdRef.current.set(BROOKLYN_COLLEGE_PLACE.id, defaultMarker);
    }

    return () => {
      clearMarkers();
      mapInstanceRef.current = null;
    };
  }, [scriptReady, initialPlace, highlightBrooklynCollege, clearMarkers]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery || !mapInstanceRef.current) return;

    setSearching(true);
    setHasSearched(true);
    setError(null);
    setResults([]);
    setSelectedResultId(null);
    clearMarkers();

    try {
      const places = await searchPlacesNearBrooklynCollege(
        trimmedQuery,
        mapInstanceRef.current,
      );
      setResults(places);
      setResultMarkers(places);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to search locations. Please try again.",
      );

      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(BROOKLYN_COLLEGE);
        mapInstanceRef.current.setZoom(15);

        const defaultMarker = new google.maps.Marker({
          position: BROOKLYN_COLLEGE,
          map: mapInstanceRef.current,
          title: "Brooklyn College",
          icon: createPinkMarkerIcon(),
        });

        markersByIdRef.current.set(BROOKLYN_COLLEGE_PLACE.id, defaultMarker);
      }
    } finally {
      setSearching(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-border bg-card/50 p-8 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          Configuration
        </p>
        <p className="mt-3 text-muted">
          Add{" "}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-sm text-foreground">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          to your <code className="font-mono text-sm">.env.local</code> file to
          load the map.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <div className="space-y-8">
        <form
          onSubmit={handleSearch}
          className="rounded-2xl border border-border bg-card p-4 sm:p-6"
        >
          <label htmlFor="location-search" className="mb-2 block text-sm font-medium">
            Search locations
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="location-search"
              name="query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={searching}
              placeholder="Coffee shops, libraries, restaurants near campus..."
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={searching || !query.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[140px]"
            >
              {searching ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                  Searching...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                    />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">
            Searches for places within about 5 miles of Brooklyn College using
            Google Places.
          </p>
        </form>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/20">
          <div
            ref={mapRef}
            className="h-[min(70vh,520px)] w-full"
            role="img"
            aria-label="Interactive map centered on Brooklyn College"
          />
        </div>

        <section aria-labelledby="search-results-heading">
          <div className="mb-6">
            <p className="mb-2 font-mono text-sm uppercase tracking-widest text-accent">
              Results
            </p>
            <h2
              id="search-results-heading"
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Search Results
            </h2>
          </div>

          {searching ? (
            <div className="rounded-2xl border border-border bg-card/50 px-6 py-12 text-center">
              <span className="mx-auto mb-4 inline-flex h-10 w-10 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
              <p className="text-sm text-muted">Searching for locations...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-border bg-card px-6 py-8">
              <p className="text-sm text-muted">{error}</p>
            </div>
          ) : results.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {results.map((result) => {
                const isSelected = selectedResultId === result.id;

                return (
                  <li key={result.id}>
                    <button
                      type="button"
                      onClick={() => focusOnResult(result)}
                      className={`h-full w-full rounded-xl border bg-card p-5 text-left transition-all duration-200 hover:border-accent/30 ${
                        isSelected
                          ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                          : "border-border"
                      }`}
                    >
                      <h3 className="font-semibold text-foreground">{result.name}</h3>
                      {result.address && (
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {result.address}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {result.category && (
                          <span className="rounded-md bg-background px-2 py-0.5 font-mono text-xs text-muted">
                            {result.category}
                          </span>
                        )}
                        <span className="font-mono text-xs text-accent">
                          {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <svg
                  className="h-6 w-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted">
                {hasSearched
                  ? "No locations matched your search."
                  : "Enter a location, business, or point of interest above to explore results."}
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
