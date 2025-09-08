export default function BackToSearch() {
  if (typeof window !== "undefined" && document.referrer.includes("/search")) {
    return (
      <a
        href={document.referrer}
        aria-label="Back to search results"
        className="inline-block mb-6 text-sm text-ink font-light dark:text-accent-100 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink transition"
      >
        ← Back to search results
      </a>
    );
  }
  return null;
}
