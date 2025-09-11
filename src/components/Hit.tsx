import React from "react";
import type { Hit as AlgoliaHit } from "instantsearch.js";

type RecordShape = {
  objectID: string; // required by Algolia
  slug: string;
  url: string;
  title: string;
  title2: string;
  description?: string;
  type?: string;
  collection?: string;
  hebrewdate?: string;
  _geoloc?: {
    lat: number;
    lng: number;
  };
  collection_uri?: string;
  thumbnail?: string;
  transcription?: string;
  hasRealThumbnail?: boolean;
  creators?: string[];
  contributors?: string[];
  subjects?: string[];
  languages?: string[];
  fromLocation?: string;
  toLocation?: string;
  unix?: string | number; // depends on how you index it
  duplicate?: boolean;
  date?: string;
  refersToOccident?: boolean;
  xml?: string | null;
  manifestUrl?: string[];
};
const formatItalics = (str: string | undefined | null) =>
  str ? str.replace(/\*(.*?)\*/g, "<i>$1</i>") : "";
type HitProps = { hit: AlgoliaHit<RecordShape> };

const getItemHref = (hit: AlgoliaHit<RecordShape>) => {
  if (hit.slug) {
    return `/item/${encodeURIComponent(hit.slug)}`;
  }
  if (hit.url) {
    return hit.url;
  }
  return `#${hit.objectID}`;
};
export function Hit({ hit }: HitProps) {
  const href = getItemHref(hit);

  const institutionIcons: Record<string, string> = {
    "American Jewish Historical Society": "/icons/AJHS.png",
    "The Jesselson Family Collection of Isaac Leeser Material":
      "../../src/images/icons/Penn.png",
    "Arnold and Deanne Kaplan Isaac Leeser Collection":
      "../../src/images/icons/Penn.png",
    "The Abraham J. Karp Collection of Judaica Americana":
      "../../src/images/icons/Penn.png",
    "The Dropsie College Isaac Leeser Collection at the Penn Libraries":
      "../../src/images/icons/Penn.png",
    "American Jewish Archives": "/icons/AJA.png",
    "Penn Libraries": "/icons/Penn.png",
    JTS: "/icons/JTS.png",
  };

  const collectionIcon =
    hit.collection && institutionIcons[hit.collection]
      ? institutionIcons[hit.collection]
      : null;

  return (
    <div className="h-full flex flex-col justify-between rounded-xl bg-paper-light px-4 py-4 shadow-sm border border-accent-100">
      {/* Top section: thumbnail + type + date */}
      <div className="flex flex-col gap-4">
        {hit.thumbnail ? (
          <a href={href} className="block w-full relative">
            <img
              src={hit.thumbnail}
              alt={hit.title2}
              className="h-64 w-full flex-none rounded-md object-cover"
              loading="lazy"
            />
            {hit.type && (
              <span className="absolute top-2 right-2 bg-white/90 text-ink text-xs px-2 py-0.5 rounded-md shadow">
                {hit.type}
              </span>
            )}
          </a>
        ) : (
          <div className="h-64 w-full flex items-center justify-center rounded-md bg-accent-50 text-ink-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 12l8-8 8 8M12 4v12"
              />
            </svg>
          </div>
        )}
        {/* Top row: Date on the left, Collection logo always justified right */}
        {(hit.date || collectionIcon) && (
          <div className="flex w-full items-center justify-between">
            {/* Date pill (left) */}
            {hit.date ? (
              <span
                className="
          group relative inline-block
          bg-accent-100 text-ink text-xs px-2 py-0.5
          rounded-md shadow cursor-default overflow-hidden
          hover:bg-accent-200
        "
              >
                {/* Gregorian date */}
                <span
                  className={`block transition-all duration-300 ease-in-out ${
                    hit.hebrewdate
                      ? "group-hover:opacity-0 group-hover:invisible"
                      : ""
                  }`}
                >
                  {hit.date}
                </span>

                {/* Hebrew date (on hover) */}
                {hit.hebrewdate && (
                  <span
                    className="
              absolute inset-0 flex items-center justify-center
              opacity-0 invisible transition-all duration-300 ease-in-out
              group-hover:opacity-100 group-hover:visible
            "
                  >
                    {hit.hebrewdate}
                  </span>
                )}
              </span>
            ) : (
              // keeps spacing consistent even if no date
              <span />
            )}

            {/* Collection logo (always right) */}
            {collectionIcon && (
              <img
                src={collectionIcon}
                alt={hit.collection}
                title={hit.collection}
                className="h-6 w-6 object-contain"
              />
            )}
          </div>
        )}
        {/* Text */}
        <div className="flex flex-col items-start gap-2">
          <a href={href} className="w-full hover:underline">
            <span
              className="text-md text-ink line-clamp-2"
              dangerouslySetInnerHTML={{ __html: formatItalics(hit.title2) }}
            />
          </a>

          {hit.description && (
            <p className="text-xs font-body text-ink-muted whitespace-pre-wrap line-clamp-2 group-hover:line-clamp-none transition-all">
              {hit.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom bar: subjects + logo */}
      <div className="relative flex items-end justify-between mt-4">
        {Array.isArray(hit.subjects) && hit.subjects.length > 0 && (
          <div className="flex flex-wrap gap-2 pr-10 text-xs">
            {hit.subjects.slice(0, 3).map((s, i) => (
              <span
                key={`${hit.objectID}-subj-${i}`}
                className="inline-block text-xs rounded-full bg-accent-50 px-3 py-1 font-body text-ink shadow"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
