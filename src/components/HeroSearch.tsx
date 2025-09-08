import React, { useEffect, useRef, useState } from "react";

type HeroSearchProps = {
  hebrewTitle: string; // e.g., "ההתכתבויות היהודיות באמריקה"
  motto: string; // e.g., "Discover letters that shaped Jewish life in 19th-century America"
  samples?: string[]; // rotating placeholder suggestions
  searchBasePath?: string; // default "/search"
};

const DEFAULT_SAMPLES = [
  "letters about reform",
  "Rebecca Gratz to Isaac Leeser",
  "Zionism in the 1850s",
  "Philadelphia correspondence",
  "education and Jewish identity",
];

export default function HeroSearch({
  hebrewTitle,
  motto,
  samples = DEFAULT_SAMPLES,
  searchBasePath = "/search",
}: HeroSearchProps) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // rotate placeholder every 3s
  useEffect(() => {
    if (samples.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % samples.length),
      3000,
    );
    return () => clearInterval(id);
  }, [samples.length]);

  // "/" to focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement) &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const placeholder = samples[index] ?? "";

  const handleSearch = () => {
    const q = encodeURIComponent((input || placeholder).trim());
    window.location.href = `${searchBasePath}?query=${q}`;
  };

  return (
    <section className="relative flex   justify-center min-h-[60vh] md:min-h-[70vh]">
      <div className="w-full max-w-3xl px-4 text-center">
        {/* Hebrew title (RTL) */}
        <h1
          dir="rtl"
          lang="he"
          className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-right"
        >
          {hebrewTitle}
        </h1>

        {/* English tagline */}
        <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-300">
          {motto}
        </p>

        {/* Search */}
        <form
          className="mt-8 max-w-2xl mx-auto"
          role="search"
          aria-label="Sitewide search"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <label htmlFor="hero-search" className="sr-only">
            Search historical correspondence
          </label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>

            <input
              id="hero-search"
              ref={inputRef}
              type="search"
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
              placeholder={placeholder}
              className="w-full rounded-xl border border-gray-300 bg-white pl-12 pr-28 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-900 dark:border-gray-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </div>
          </div>

          {/* helper row */}
          {/*   <div className="mt-3 text-xs text-gray-500">
                        Tip: press <kbd className="rounded border px-1">/</kbd> to focus
                    </div>*/}
        </form>
      </div>
    </section>
  );
}
