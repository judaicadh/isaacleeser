import React, {useEffect, useState} from "react";
import { algoliasearch } from "algoliasearch";
import { Configure, InstantSearch, SearchBox } from "react-instantsearch";
import {MapContainer, TileLayer, useMap} from "react-leaflet";

import { GeoHits } from "./GeoHits";
import DateRangeSlider  from "./DateRangeSlider.tsx"; // 👈 your custom slider
import "leaflet/dist/leaflet.css";
import dayjs from "dayjs";
import { HomeIcon } from "@heroicons/react/24/solid";
import * as L from "leaflet"; // ✅ import L properly

// ⚡ Your Algolia credentials
const searchClient = algoliasearch(
    "ZLPYTBTZ4R",
    "be46d26dfdb299f9bee9146b63c99c77"
);
type ResetViewButtonProps = {
    center: [number, number];
    zoom: number;
};

function ResetViewButton({ center, zoom }: ResetViewButtonProps) {
    const map = useMap();

    useEffect(() => {
        // ✅ Use L.Control.extend instead of calling L.control directly
        const HomeControl = L.Control.extend({
            onAdd: () => {
                const div = L.DomUtil.create(
                    "div",
                    "leaflet-bar leaflet-control leaflet-control-custom"
                );

                div.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg"
               fill="currentColor" viewBox="0 0 24 24"
               class="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors">
            <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.25 8.25a.75.75 0 0 1-1.06 1.06L19.5 12.06V20.25A1.75 1.75 0 0 1 17.75 22h-3a.75.75 0 0 1-.75-.75V16.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v4.75a.75.75 0 0 1-.75.75h-3A1.75 1.75 0 0 1 4.5 20.25V12.06l-1.22 1.22a.75.75 0 1 1-1.06-1.06l8.25-8.25z"/>
          </svg>
        `;

                div.title = "Reset to home";
                div.style.cursor = "pointer";
                div.style.backgroundColor = "white";
                div.style.width = "34px";
                div.style.height = "34px";
                div.style.display = "flex";
                div.style.alignItems = "center";
                div.style.justifyContent = "center";

                div.onclick = () => {
                    map.setView(center, zoom, { animate: true });
                };

                return div;
            },
        });

        const homeControl = new HomeControl({ position: "topleft" });
        map.addControl(homeControl);

        return () => {
            map.removeControl(homeControl);
        };
    }, [map, center, zoom]);

    return null;
}
// Helper to compute radius (meters) from map bounds
function getRadiusFromBounds(bounds: any) {
    const center = bounds.getCenter();
    const ne = bounds.getNorthEast();
    // distance in meters between center and northeast corner
    return center.distanceTo(ne);
}

function GeoSearch() {
    const [lat, setLat] = useState(30);
    const [lng, setLng] = useState(-30);
    const [radius, setRadius] = useState(5000000); // default ~5000km

    return (
        <>
            <header className="header">
                <h1 className="header-title">
                    <a href="/">Leeser Letters GeoSearch</a>
                </h1>
                <p className="header-subtitle">
                    Powered by{" "}
                    <a href="https://github.com/algolia/react-instantsearch">
                        React InstantSearch
                    </a>{" "}
                    + Leaflet
                </p>
            </header>

            <InstantSearch
                searchClient={searchClient}
                indexName="dev_Leeser"
                insights={true}
            >
                {/* Top controls: Search + Date Slider */}
                {/* Top controls: Search + Date slider */}
                <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

                        {/* Search bar (2/3 width on desktop) */}
                        <div className="md:col-span-2 col-span-1">
                            <SearchBox
                                placeholder="Search for documents..."
                                classNames={{
                                    root: "w-full",
                                    form: "flex",
                                    input:
                                        "w-full px-3 py-2 border rounded focus:outline-none focus:ring",
                                    submit: "hidden",
                                    reset: "hidden",
                                }}
                            />
                        </div>

                        {/* Date slider (1/3 width on desktop) */}
                        <div className="md:col-span-1 col-span-1">
                            <DateRangeSlider
                                minTimestamp={dayjs("1810-01-01").unix()}
                                maxTimestamp={dayjs("1900-12-31").unix()}
                                dateFields={["unix"]}
                                title="Filter by Date"
                            />
                        </div>
                    </div>
                </div>

                {/* Two-pane layout: map + sidebar */}
                <div className="grid grid-cols-1 md:grid-cols-3 h-[80vh]">
                    {/* Map */}
                    <div className="col-span-2 relative">
                        <MapContainer
                            className="map h-full w-full rounded-lg shadow"
                            center={[lat, lng]}
                            scrollWheelZoom={true}
                            doubleClickZoom={true}
                            zoom={3}
                            minZoom={2}

                            whenCreated={(map) => {
                                map.on("moveend", () => {
                                    const center = map.getCenter();
                                    setLat(center.lat);
                                    setLng(center.lng);
                                    setRadius(getRadiusFromBounds(map.getBounds()));
                                });
                            }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=xtsVilWwgs7xgbwS6FUT"
                            />
                            <GeoHits mode="map" />
                            <ResetViewButton center={[30, -30]} zoom={3} /> {/* 👈 button */}

                        </MapContainer>
                    </div>

                    {/* 🔑 Configure updates whenever lat/lng/radius changes */}
                    <Configure
                        aroundLatLng={`${lat},${lng}`}
                        aroundRadius={radius}
                        hitsPerPage={2000} // pull larger result sets
                    />

                    {/* Sidebar */}
                    <div className="col-span-1 flex flex-col h-[80vh] border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <h2 className="text-lg font-serif p-4 border-b dark:border-gray-700">
                            Places in View
                        </h2>
                        <GeoHits mode="list" />
                    </div>
                </div>
            </InstantSearch>
        </>
    );
}

export default GeoSearch;