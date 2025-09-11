import csv from "csvtojson";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, "./Leeser-Letters2 (1).csv");
const jsonFilePath = path.join(__dirname, "../src/data/items.json");

const slugify = (value) =>
  value
    .toString()
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const creatorFields = Array.from(
  { length: 13 },
  (_, i) => `dcterms:creator ${i + 1}`,
);
const contributorFields = Array.from(
  { length: 3 },
  (_, i) => `dcterms:contributor ${i + 1}`,
);

// --- Helpers ---
const normalizeName = (name) => {
  if (!name) return "";
  let n = name.replace(/\./g, "").trim();
  if (n.includes(",")) {
    const [last, first] = n.split(",").map((s) => s.trim());
    n = `${first} ${last}`;
  }
  return n.toLowerCase();
};

const dedupeNames = (names) => {
  const seen = new Map();
  names.forEach((name) => {
    const norm = normalizeName(name);
    if (!seen.has(norm)) {
      seen.set(norm, name); // keep the first nicely formatted version
    }
  });
  return Array.from(seen.values());
};

(async () => {
  try {
    const jsonArray = await csv().fromFile(csvFilePath);

    const formattedData = jsonArray.map((item, index) => {
      // --- Contributors ---
      const baseContributors = item["dcterms:contributor"]
        ? item["dcterms:contributor"].split("|").map((s) => s.trim())
        : [];
      const numberedContributors = contributorFields
        .map((field) => item[field])
        .filter(Boolean)
        .flatMap((val) => val.split("|").map((s) => s.trim()));
      const contributors = dedupeNames([
        ...baseContributors,
        ...numberedContributors,
      ]);

      // --- Creators ---
      const numberedCreators = creatorFields
        .map((field) => item[field])
        .filter(Boolean)
        .flatMap((val) => val.split("|").map((s) => s.trim()));

      const creators = dedupeNames(numberedCreators);

      const dates = [];
      if (item["date written"]) dates.push(item["date written"]);
      if (item["date received"]) dates.push(item["date received"]);

// If "date written" contains multiple values separated by "|"
      if (item["date written"] && item["date written"].includes("|")) {
        dates.push(...item["date written"].split("|").map(d => d.trim()));
      }
      let _geoloc = null;
      const lat = parseFloat(item["author latitude"]);
      const lng = parseFloat(item["author longitude"]);
      if (!isNaN(lat) && !isNaN(lng)) {
        _geoloc = { lat, lng };
      }
      return {
        id: item["dcterms:identifier"] || `row-${index + 1}`,
        slug: slugify(item["dcterms:identifier"] || ""),
        title: item["dcterms:title"] || item["Title"] || "Untitled",
        title2: item["AI Title"],
        description: item["Description"] || "",
        unix: item["unixtime"],
        creators,
        contributors,
        thumbnail:
          item["thumbnail"] || "https://placehold.co/600x600.jpg?text=No+Image",
        manifestUrl: item["hasFormat"]
          ? item["hasFormat"].split("|").map((s) => s.trim())
          : [],
        xml: item["xml"] || null,
        type: item["Type"] || null,
        collection_uri: item["Collection uri"] || null,
        collection: item["Collection"] || "",
        fromLocation: item["fromLocation"] || "",
        toLocation: item["toLocation"] || "",
        fromLocationWikidata: item["fromLocationwikidata"],
        subject: item["Subjects"]
          ? item["Subjects"].split("|").map((s) => s.trim())
          : [],
        language: item["dcterms:language"]
          ? item["dcterms:language"].split("|").map((s) => s.trim())
          : [],
        date: dates,
        transcription: item["transcription"] || "",
        hebrewdate: item["HebrewDate"] || "",
        rowIndex: index + 1,
        ...(_geoloc ? { _geoloc } : {}),

      };
    });

    await fs.writeFile(
      jsonFilePath,
      JSON.stringify(formattedData, null, 2),
      "utf-8",
    );
    console.log("✅ Leeser CSV → JSON completed.");
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
