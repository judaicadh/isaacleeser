import type { GeoHit } from "instantsearch.js";

// Wrap your fields in GeoHit
export type LetterHit = GeoHit<{
  objectID: string;
  title2: string;
  description?: string;
  date: string;
  _geoloc: { lat: number; lng: number };
}>;