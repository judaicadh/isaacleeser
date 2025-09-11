import React, { useState, Fragment } from "react";
import ReactDOM from "react-dom";
import { algoliasearch } from "algoliasearch";
import {
  InstantSearch,
  PoweredBy,
  Stats,
  SearchBox,
  CurrentRefinements,
  ClearRefinements,
  Pagination,
  useCurrentRefinements,
  SortBy,
  usePoweredBy,
  RefinementList,
  useRefinementList,
  useClearRefinements,
} from "react-instantsearch";
import CustomHits from "./CustomHits";

import { Dialog, Transition, DialogTitle, DialogPanel } from "@headlessui/react";
import DateRangeSlider from "@components/DateRangeSlider";
import dayjs from "dayjs";

const searchClient = algoliasearch(
  "ZLPYTBTZ4R",
  "be46d26dfdb299f9bee9146b63c99c77",
);
const indexName = "dev_Leeser";
function CustomClearRefinements({
  resetDate,
  dateRange,
  defaultRange,
}: {
  resetDate: () => void;
  dateRange: { min: number; max: number };
  defaultRange: { min: number; max: number };
}) {
  const { canRefine, refine } = useClearRefinements();

  const dateIsActive =
    dateRange.min !== defaultRange.min || dateRange.max !== defaultRange.max;

  const handleClick = () => {
    refine(); // clear Algolia refinements
    resetDate(); // reset date
  };

  return (
    <button
      onClick={handleClick}
      disabled={!canRefine && !dateIsActive}
      className={`text-sm font-body ${
        canRefine || dateIsActive
          ? "text-ink-muted hover:text-ink underline underline-offset-2"
          : "text-ink-muted/30 cursor-not-allowed"
      }`}
    >
      Clear all
    </button>
  );
}
function CustomCreatorRefinement() {
  const { items, refine, searchForItems } = useRefinementList({
    attribute: "creators",
  });

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative w-full">
        <input
          type="search"
          placeholder="Search authors..."
          onChange={(e) => searchForItems(e.currentTarget.value)}
          className="w-full rounded-lg border border-accent-100 bg-paper-light px-3 py-2 pr-8 text-sm font-body text-ink placeholder-ink-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-200 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      {/* Checkbox list */}
      <ul className="space-y-2 max-h-60   pr-1 sm:max-h-72 md:max-h-80">
        {items.map((item) => (
          <li key={item.label}>
            <label className="flex items-center gap-2 text-sm font-body text-ink dark:text-gray-200">
              <input
                type="checkbox"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
                className="h-4 w-4 rounded border-gray-300 text-accent-200 focus:ring-accent-200 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="truncate">{item.label}</span>
              <span className="ml-auto text-xs text-ink-muted dark:text-gray-400">
                {item.count}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
function RefinementChips({
                           start,
                           end,
                           resetDate,
                           defaultMin,
                           defaultMax,
                           dateRange,
                           defaultRange,
                         }: {
  start?: number;
  end?: number;
  resetDate: () => void;
  defaultMin: number;
  defaultMax: number;
  dateRange: { min: number; max: number };
  defaultRange: { min: number; max: number };
}) {
  const { items } = useCurrentRefinements();
  const hasOther = items.length > 0;
  const hasDate =
      start !== undefined &&
      end !== undefined &&
      (start !== defaultMin || end !== defaultMax);

  return (
      <div
          className={`flex flex-wrap justify-center items-center gap-3 mt-3 transition-all duration-300 ${
              hasOther || hasDate ? "opacity-100 mt-3" : "opacity-0 max-h-0 overflow-hidden"
          }`}
      >
        <CurrentRefinements
            classNames={{
              category:
                  "inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-sm font-body text-ink",
              delete: "ml-2 text-ink-muted hover:text-ink",
              list: "flex flex-wrap gap-2",
            }}
        />

        {hasDate && (
            <div className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-sm font-body text-ink">
              {dayjs(start! * 1000).format("YYYY")} –{" "}
              {dayjs(end! * 1000).format("YYYY")}
              <button
                  onClick={resetDate}
                  className="ml-2 text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>
        )}

        {/* Clear all refinements + date */}
        <CustomClearRefinements
            resetDate={resetDate}
            dateRange={dateRange}
            defaultRange={defaultRange}
        />
      </div>
  );
}
function FilterModal({
  open,
  onClose,
  dateRange,
  setDateRange,
}: {
  open: boolean;
  onClose: () => void;
  dateRange: { min: number; max: number };
  setDateRange: React.Dispatch<
    React.SetStateAction<{ min: number; max: number }>
  >;
}) {
  const defaultRange = { min: -5049107529, max: -2200000000 };

  return (
    <Transition show={open} as={Fragment} unmount={false}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Slide-in panel */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-md transform transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <DialogPanel className="h-full flex flex-col bg-paper-light shadow-xl border-l border-accent-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-accent-100 px-6 py-4 bg-paper">
              <DialogTitle className="text-lg font-sans text-ink">
                Filters
              </DialogTitle>
              <button
                onClick={onClose}
                className="rounded-md px-3 py-1 text-ink-muted hover:bg-accent-50"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Type filter */}
              <div className="rounded-lg border border-accent-100 p-4 bg-paper">
                <h3 className="mb-3 text-sm font-semibold font-sans text-ink">
                  Document Type
                </h3>
                <RefinementList
                  attribute="type"
                  classNames={{
                    root: "space-y-2",
                    list: "space-y-2 p-1",
                    item: "flex items-center",
                    label:
                      "flex w-full items-center gap-2 text-sm font-body text-ink dark:text-gray-200 cursor-pointer",
                    checkbox:
                      "h-4 w-4 rounded border-gray-300 text-accent-200 focus:ring-accent-200 dark:border-gray-600 dark:bg-gray-700",
                    labelText: "truncate flex-1",
                    count:
                      "ml-auto inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-gray-700 dark:text-gray-300",
                  }}
                />
              </div>

              {/* Collection */}
              <div className="rounded-lg border border-accent-100 p-4 bg-paper">
                <h3 className="mb-3 text-sm font-semibold font-sans text-ink">
                  Collection
                </h3>
                <RefinementList
                  attribute="collection"
                  classNames={{
                    root: "space-y-2",
                    list: "space-y-2 p-1",
                    item: "flex items-start", // items-start so text aligns top if it wraps
                    label:
                      "flex w-full items-start gap-2 text-sm font-body text-ink dark:text-gray-200 cursor-pointer",
                    checkbox:
                      "h-4 w-4 mt-0.5 rounded border-gray-300 text-accent-200 focus:ring-accent-200 dark:border-gray-600 dark:bg-gray-700",
                    labelText: "flex-1 whitespace-normal break-words", // ✅ wrap text
                    count:
                      "ml-auto inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-gray-700 dark:text-gray-300",
                  }}
                />
              </div>

              {/* Date filter */}
              <div className="font-serif rounded-lg border border-accent-100 p-4 bg-paper">
                <h3 className="mb-3 text-sm font-semibold font-sans text-ink">
                  Date Range
                </h3>
                <DateRangeSlider
                  title="Filter by Year"
                  minTimestamp={-5049107529}
                  maxTimestamp={-2200000000}
                  dateFields={["unix"]}
                  value={dateRange}
                  onChange={(newRange) => setDateRange(newRange)}
                  // 👇 Add this to only apply refinement if user changes it
                />
              </div>

              {/* Authors */}
              <div className="rounded-lg border bg-paper border-accent-100 p-4">
                <h3 className="mb-3 text-sm font-sans font-semibold text-ink">
                  Authors
                </h3>
                <CustomCreatorRefinement />
              </div>

              {/* Language */}
              <div className="rounded-lg border border-accent-100 p-4 bg-paper">
                <h3 className="mb-3 text-sm font-semibold font-sans text-ink">
                  Language
                </h3>
                <RefinementList
                  attribute="languages"
                  classNames={{
                    root: "space-y-2",
                    list: "space-y-2 p-1",
                    item: "flex items-center",
                    label:
                      "flex w-full items-center gap-2 text-sm font-body text-ink dark:text-gray-200 cursor-pointer",
                    checkbox:
                      "h-4 w-4 rounded border-gray-300 text-accent-200 focus:ring-accent-200 dark:border-gray-600 dark:bg-gray-700",
                    labelText: "truncate flex-1",
                    count:
                      "ml-auto inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-gray-700 dark:text-gray-300",
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-accent-100 px-6 py-4 bg-paper-light/95 backdrop-blur">
              <CustomClearRefinements
                resetDate={() => setDateRange(defaultRange)}
                dateRange={dateRange}
                defaultRange={defaultRange}
              />
              <button
                onClick={onClose}
                className="inline-flex items-center rounded-lg border border-accent-200 bg-paper px-4 py-2 text-sm font-body text-ink hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-accent-200"
              >
                Apply
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}

const App = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  // central dateRange state
  const [dateRange, setDateRange] = useState<{ min: number; max: number }>({
    min: -5049107529,
    max: -2200000000,
  });

  const defaultRange = { min: -5049107529, max: -2200000000 };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indexName}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      insights={true}
    >
      {/* Page background in parchment */}
      <div className="bg-paper min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Hero Section */}
          <div className="absolute inset-0 bg-[url('/images/LeeserLetter1.jpg')] bg-contain bg-center  opacity-10 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h1 className="text-4xl md:text-5xl  font-serif text-ink">
              Discover the Legacy of Rev. Isaac Leeser
            </h1>
            <p className="max-w-2xl text-lg font-sans  text-ink-muted">
              Search letters, sermons, and pamphlets that shaped American Jewish
              life.
            </p>

            {/* Search */}
            {/* Search row */}
            <div className="w-full max-w-4xl">
              {/* Search Bar */}
              <SearchBox
                  placeholder="Search documents..."
                  classNames={{
                    root: "w-full",
                    form: "relative flex items-center w-full",
                    input:
                        "w-full rounded-xl border border-accent-100 bg-paper-light px-6 py-5 text-base md:text-lg font-body text-ink placeholder-ink-muted shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-200",
                    resetIcon: "hidden",
                    submitIcon: "hidden",
                  }}
              />

              {/* Secondary actions row */}
              <div className="mt-2 flex justify-between items-center text-sm font-body">
                {/* Filter button on the left */}
                <button
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-accent-200 bg-paper-light px-3 py-1.5 text-sm text-ink hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-accent-200 shadow-sm"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5h18M6 12h12M10 19h4"
                    />
                  </svg>
                  Filters
                </button>
                <div className="flex items-center gap-4 ml-auto">

                </div>
                {/* Map search link on the right */}

                  <a
                      href="/geosearch"
                      className="text-sm text-ink-muted hover:text-accent-200 transition"
                  >
                      or search by map →
                  </a>

              </div>
            </div>

            {/* Hero + chips */}
            <RefinementChips
              start={dateRange.min}
              end={dateRange.max}
              defaultMin={defaultRange.min}
              defaultMax={defaultRange.max}
              resetDate={() => setDateRange(defaultRange)}
              dateRange={dateRange}
              defaultRange={defaultRange}
            />
          </div>


          <CustomHits />

          {/* Pagination */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center w-full">
              <Pagination
                classNames={{
                  root: "flex font-sans",
                  list: "flex gap-2 font-sans",
                }}
              />
            </div>
            <PoweredBy
              classNames={{
                root: "flex justify-center md:justify-end py-4",
                link: "flex items-center no-underline",
                logo: "h-4 w-auto opacity-70 hover:opacity-100 transition dark:opacity-80",
              }}
            />
          </div>
        </main>
      </div>

      <FilterModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
    </InstantSearch>
  );
};

export default App;
