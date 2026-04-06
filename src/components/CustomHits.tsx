"use client";
import React from "react";
import { useHits } from "react-instantsearch";
import { Hit as HitComponent } from "./Hit";

type RecordShape = {
    objectID: string;
    slug: string;
    url: string;
    title: string;
    title2: string;
    description?: string;
    type?: string;
    collection?: string;
    collection_uri?: string;
    thumbnail?: string;
    hasRealThumbnail?: boolean;
    creators?: string[];
    contributors?: string[];
    subjects?: string[];
    languages?: string[];
    fromLocation?: string;
    toLocation?: string;
    unix?: string | number;
    duplicate?: boolean;
    _geoloc?: {
        lat: number;
        lng: number;
    };
    date?: string;
    refersToOccident?: boolean;
    xml?: string | null;
    manifestUrl?: string[];
};

export default function CustomHits() {
    const { hits } = useHits<RecordShape>();

    if (hits.length === 0) {
        return (
            <div className="mt-4 rounded-2xl border border-accent-100 bg-paper-light/95 p-6 shadow-sm">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <p className="mb-2 text-lg text-ink">No records found.</p>
                    <p className="text-sm text-ink-muted">
                        Try adjusting your search terms or clearing your filters.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hits.map((hit) => (
                <HitComponent key={hit.objectID} hit={hit} />
            ))}
        </div>
    );
}