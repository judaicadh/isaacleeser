import React from "react";
import {SortBy, Stats, useHits} from "react-instantsearch";
import { Hit as HitComponent } from "./Hit";

type RecordShape = {
  objectID: string; // required by Algolia
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
  unix?: string | number; // depends on how you index it
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
  const { results } = useHits<RecordShape>();
  const hits = results?.hits ?? [];

  return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header row above results */}
        <div className="flex items-center justify-between mb-4">
          <Stats
              translations={{
                rootElementText: ({ nbHits, processingTimeMS }) =>
                    `${nbHits.toLocaleString()} results found in ${processingTimeMS} ms`,
              }}
              classNames={{
                root: "text-sm font-body text-ink-muted",
              }}
          />

          <SortBy
              items={[
                { value: "dev_Leeser", label: "Relevance" },
                { value: "dev_Leeser_date_desc", label: "Newest first" },
                { value: "dev_Leeser_date_asc", label: "Oldest first" },
              ]}
              classNames={{
                root: "text-sm font-body",
                select:
                    "rounded-full border border-accent-100 bg-paper-light px-4 py-1.5 text-sm font-body text-ink hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-accent-200 shadow-sm",
              }}
          />
        </div>

        {/* Results grid */}
        <div
            className="
      grid gap-6
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      items-start
    "
        >
          {hits.length === 0 ? (
              <p className="text-center text-gray-500">No results found.</p>
          ) : (
              hits.map((hit) => <HitComponent key={hit.objectID} hit={hit} />)
          )}
        </div>
      </section>
  );
}
