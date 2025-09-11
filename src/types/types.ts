import type { GeoHit } from "instantsearch.js";

// Wrap your fields in GeoHit
export type LetterHit = GeoHit<{
  objectID: string; // required by Algolia
  slug: string;
  url: string;
  fromLocationWikidata: string;
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
}>;