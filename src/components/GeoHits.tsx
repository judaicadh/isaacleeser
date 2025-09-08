import { useGeoSearch, type UseGeoSearchProps } from "react-instantsearch";
import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import type { LeafletEvent } from "leaflet";
import type { GeoHit } from "instantsearch.js";

type LetterHit = GeoHit<{
    objectID: string;
    title2: string;
    description?: string;
    fromLocation?: string;
    _geoloc: { lat: number; lng: number };
}>;

type GeoHitsProps = UseGeoSearchProps<LetterHit> & {
    mode?: "map" | "list";
};

export function GeoHits({ mode, ...props }: GeoHitsProps) {
    const {items, refine} = useGeoSearch<LetterHit>(props);
    const map = useMapSafe();

    // Group hits by fromLocation
    const grouped = items.reduce((acc: Record<string, LetterHit[]>, hit) => {
        const place = hit.fromLocation || "Unknown location";
        if (!acc[place]) acc[place] = [];
        acc[place].push(hit);
        return acc;
    }, {});

    // --- Map mode ---
    if (mode === "map") {
        function onViewChange({target}: LeafletEvent) {
            refine({
                northEast: target.getBounds().getNorthEast(),
                southWest: target.getBounds().getSouthWest(),
            });
        }

        useMapEvents({zoomend: onViewChange, dragend: onViewChange});

        return (
            <>
                {Object.entries(grouped).map(([place, hits]) => {
                    const coords = hits[0]._geoloc; // use first hit's coords
                    return (
                        <Marker key={place} position={[coords.lat, coords.lng]}>

                        </Marker>
                    );
                })}
            </>
        );
    }

    // --- Sidebar mode ---
    return (
        <div className="overflow-y-auto h-full divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(grouped).map(([place, hits]) => {
                const slug = encodeURIComponent(place.toLowerCase().replace(/\s+/g, "-"));
                return (
                    <details key={place} className="p-2 group">
                        <summary className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center font-semibold">
              <span className="mr-2 group-open:rotate-90 transition-transform">
                ▶
              </span>
                {place} ({hits.length})
            </span>
                            <a
                                href={`/place/${slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="ml-2 text-sm text-blue-600 hover:underline"
                            >
                                View page →
                            </a>
                        </summary>

                        {/* hits list with dividers */}
                        <ul className="ml-6 mt-2 divide-y divide-gray-200 dark:divide-gray-700">
                            {hits.map((hit) => (
                                <li
                                    key={hit.objectID}
                                    className="py-2 cursor-pointer hover:underline text-sm"
                                    onClick={() => {
                                        if (map && hit._geoloc) {
                                            map.flyTo([hit._geoloc.lat, hit._geoloc.lng], 7, {
                                                animate: true,
                                            });
                                        }
                                        window.location.href = `/item/${hit.objectID}`;
                                    }}
                                >
                                    {hit.title2}
                                </li>
                            ))}
                        </ul>
                    </details>
                );
            })}
        </div>
    );
}

// Safe hook so sidebar doesn't crash if no map exists
function useMapSafe() {
    try {
        return useMap();
    } catch {
        return null;
    }
}