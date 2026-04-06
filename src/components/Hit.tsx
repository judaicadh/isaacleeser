import React from "react";
import type { Hit as AlgoliaHit } from "instantsearch.js";

type RecordShape = {
  objectID: string;
  slug?: string;
  url?: string;
  collection?: string;
  thumbnail?: string;
  type?: string;
  date?: string;
  hebrewdate?: string;
  title2?: string;
  description?: string;
  subjects?: string[];
};

type HitProps = { hit: AlgoliaHit<RecordShape> };

const formatItalics = (str: string | undefined | null) =>
    str ? str.replace(/\*(.*?)\*/g, "<i>$1</i>") : "";

const getItemHref = (hit: AlgoliaHit<RecordShape>) => {
  if (hit.slug) return `/item/${encodeURIComponent(hit.slug)}`;
  if (hit.url) return hit.url;
  return `#${hit.objectID}`;
};

const institutionIcons: Record<string, string> = {
  "American Jewish Historical Society": "/icons/AJHS.png",
  "The Jesselson Family Collection of Isaac Leeser Material": "/icons/Penn.png",
  "Arnold and Deanne Kaplan Isaac Leeser Collection": "/icons/Penn.png",
  "The Abraham J. Karp Collection of Judaica Americana": "/icons/Penn.png",
  "The Dropsie College Isaac Leeser Collection at the Penn Libraries": "/icons/Penn.png",
  "Penn Libraries": "/icons/Penn.png",
  "American Jewish Archives": "/icons/AJA.png",
  "JTS": "/icons/JTS.png",
};

function containsHebrew(text: string) {
  return /[\u0590-\u05FF]/.test(text);
}

function subjectTagClasses(subject: string) {
  const isHebrew = containsHebrew(subject);

  return [
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] transition-colors",
    "bg-paper-light border-accent-200/80 hover:bg-accent-50",
    "font-body text-ink-muted",
    isHebrew
        ? "font-normal normal-case tracking-normal"
        : "uppercase tracking-wide",
  ].join(" ");
}

export function Hit({ hit }: HitProps) {
  const href = getItemHref(hit);

  const collectionIcon =
      hit.collection && institutionIcons[hit.collection]
          ? institutionIcons[hit.collection]
          : null;

  return (
      <article className="group flex h-full flex-col rounded-xl border border-accent-100 bg-paper-light p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <a href={href} className="relative block overflow-hidden rounded-md">
          {hit.thumbnail ? (
              <>
                <img
                    src={hit.thumbnail}
                    alt={hit.title2 || "Thumbnail"}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                />
                {hit.type && (
                    <span className="absolute right-2 top-2 rounded bg-white/95 px-2 py-0.5 text-[11px] font-medium text-ink shadow-sm">
                {hit.type}
              </span>
                )}
              </>
          ) : (
              <div className="flex h-56 w-full items-center justify-center rounded-md bg-accent-50 text-ink-muted">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 12l8-8 8 8M12 4v12"
                  />
                </svg>
              </div>
          )}
        </a>

        <div className="mt-3 flex flex-1 flex-col">
          {(hit.date || collectionIcon) && (
              <div className="mb-3 flex items-center justify-between gap-3">
                {hit.date ? (
                    <span className="group/date relative inline-block cursor-default overflow-hidden rounded bg-accent-100 px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm transition-colors hover:bg-accent-200">
                <span
                    className={`block transition-all duration-300 ease-in-out ${
                        hit.hebrewdate
                            ? "group-hover/date:invisible group-hover/date:opacity-0"
                            : ""
                    }`}
                >
                  {hit.date}
                </span>

                      {hit.hebrewdate && (
                          <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap px-2 opacity-0 invisible transition-all duration-300 ease-in-out group-hover/date:visible group-hover/date:opacity-100">
                    {hit.hebrewdate}
                  </span>
                      )}
              </span>
                ) : (
                    <span />
                )}

                {collectionIcon && (
                    <img
                        src={collectionIcon}
                        alt={hit.collection || "Institution"}
                        title={hit.collection}
                        className="h-5 w-auto max-w-[72px] object-contain opacity-75 transition-opacity group-hover:opacity-100"
                        loading="lazy"
                    />
                )}
              </div>
          )}

          <div className="flex-1">
            <a href={href} className="block transition-colors group-hover:text-accent-700">
              <h3
                  className="line-clamp-2 text-[1.28rem] font-serif font-semibold leading-snug text-ink"
                  dangerouslySetInnerHTML={{ __html: formatItalics(hit.title2) }}
              />
            </a>

            {hit.description && (
                <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                  {hit.description}
                </p>
            )}
          </div>

          {Array.isArray(hit.subjects) && hit.subjects.length > 0 && (
              <div className="mt-4 pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {hit.subjects.slice(0, 3).map((s, i) => {
                    const isHebrew = containsHebrew(s);

                    return (
                        <span
                            key={`${hit.objectID}-subj-${i}`}
                            className={subjectTagClasses(s)}
                            dir={isHebrew ? "rtl" : "ltr"}
                            lang={isHebrew ? "he" : undefined}
                            title={s}
                        >
                    {s}
                  </span>
                    );
                  })}

                  {hit.subjects.length > 3 && (
                      <span className="inline-flex items-center px-1 text-[11px] text-ink-muted">
                  +{hit.subjects.length - 3}
                </span>
                  )}
                </div>
              </div>
          )}
        </div>
      </article>
  );
}