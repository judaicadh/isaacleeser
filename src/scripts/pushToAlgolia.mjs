import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { algoliasearch } from "algoliasearch";

// ─── 1. Resolve __dirname & load .env ───────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../..", ".env"),
});

// ─── 2. Validate env vars ───────────────────────────────────────────────────────
const { ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY } = process.env;
if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  console.error("⚠️  Missing ALGOLIA_APP_ID or ALGOLIA_ADMIN_KEY in .env");
  process.exit(1);
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

// ─── 3. File Paths and Settings ─────────────────────────────────────────────────
const siteBaseUrl = "https://leeser.judaicadhpenn.org/";
const jsonFilePath = path.join(__dirname, "../data/items.json");
const indexName = "dev_Leeser";

// ─── 4. Format for Batch ────────────────────────────────────────────────────────
const formatRecord = (record) => {
  return {
    objectID: record.id, // required
    slug: record.slug,
    url: `${siteBaseUrl}item/${record.slug}`,
    title: record.title || "Untitled",
    title2: record.title2,
    description: record.description || "",
    type: record.type,
    date: record.date,
    collection_uri: record.collection_uri,
    collection: record.collection || record.Collection,
    thumbnail:
      record.thumbnail ||
      "https://placehold.co/600x600.jpg?text=Image+Coming+Soon",
    hasRealThumbnail:
      record.thumbnail &&
      record.thumbnail !==
        "https://placehold.co/600x600.jpg?text=Image+Coming+Soon",
    creators: record.creators || [],
    contributors: record.contributors || [],
    subjects: record.subject || [],
    languages: record.language || [],
    fromLocation: record.fromLocation,
    fromLocationWikidata: record.fromLocationWikidata,
    toLocation: record.toLocation,
    unix: Number(record.unix),
    hebrewdate: record.hebrewdate || "",
    author_latitude: record.author_latitude,
    author_longitude: record.author_longitude,
    recipient_latitude: record.recipient_latitude,
    transcription: record.transcription || "",
    recipient_longitude: record.recipient_longitude,
    duplicate: record.duplicate || false,
    ...(record._geoloc ? { _geoloc: record._geoloc } : {}),
    refersToOccident: record["Refers to the Occident"] || false,
    xml: record.xml,
    manifestUrl: record.manifestUrl,
  };
};

// ─── 4. Push Data to Algolia ──────────────────────────────────────────────────
async function pushDataToAlgolia(records) {
  try {
    const formattedRecords = records.map(formatRecord);

    console.log(
      "Formatted Records:",
      JSON.stringify(formattedRecords, null, 2),
    );

    // Push records to Algolia
    const response = await client.saveObjects({
      indexName: "dev_Leeser",
      objects: formattedRecords,
    });
    console.log("Objects saved successfully:", response.objectIDs);
  } catch (error) {
    console.error("Error pushing data to Algolia:", error.message, error.stack);
  }
}

// Load data from JSON and push to Algolia
(async () => {
  try {
    const fileContent = await fs.readFile(jsonFilePath, "utf-8");
    const records = JSON.parse(fileContent);

    console.log("Loaded Records:", records.length);

    await pushDataToAlgolia(records);
  } catch (error) {
    console.error(
      "Error loading or processing JSON file:",
      error.message,
      error.stack,
    );
  }
})();
