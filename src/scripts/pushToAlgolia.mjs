import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { algoliasearch } from 'algoliasearch';

// ─── 1. Resolve __dirname & load .env ───────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, '../..', '.env')
});

// ─── 2. Validate env vars ───────────────────────────────────────────────────────
const { ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY } = process.env;
if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
    console.error('⚠️  Missing ALGOLIA_APP_ID or ALGOLIA_ADMIN_KEY in .env');
    process.exit(1);
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

// ─── 3. File Paths and Settings ─────────────────────────────────────────────────
const siteBaseUrl = 'https://leeser.judaicadhpenn.org/';
const jsonFilePath = path.join(__dirname, '../data/items.json');
const indexName = 'dev_Leeser';

// ─── 4. Format for Batch ────────────────────────────────────────────────────────
const formatRecordsForBatch = (records) =>
    records.map((record) => ({
        action: 'partialUpdateObject',
        body: {
            objectID: record.identifier, // main id for Algolia
            identifier: record.identifier, // raw id
            slug: record.slug, // clean slug
            url: `${siteBaseUrl}${record.slug}`, // use slug, not id
            title: record.Title,
            type: record.Type,
            description: record.description,
            notes: record.notes,
            collection: record.collection || record.Collection,
            thumbnail: record.thumbnail,
            place: record.place,
            startDate: record.startDate,
            endDate: record.endDate,
            year: record.year,
            languages: record.dcterms_language || record.languages,
            creators: record.creators,           // array of creators
            contributors: record.dcterms_contributor || record.contributors,
            holdings: record.holdings,
            isDigitized: record.isDigitized,
            tags: record.tags || [],
            // Any additional fields, e.g.:
            author_latitude: record.author_latitude,
            author_longitude: record.author_longitude,
            recipient_latitude: record.recipient_latitude,
            recipient_longitude: record.recipient_longitude,
            fromLocation: record.fromLocation,
            toLocation: record.toLocation,
            duplicate: record.Duplicate,
            refersToOccident: record['Refers to the Occident'],
            // Add more fields as needed!
        }
    }));

// ─── 5. Push Data to Algolia ────────────────────────────────────────────────────
async function pushDataToAlgolia(records) {
    try {
        const requests = formatRecordsForBatch(records);

        const response = await client.batch({
            indexName,
            batchWriteParams: { requests }
        });
        // Algolia expects: [{ action, body }, ...]

        console.log('✅ Batch update successful:', response);
    } catch (error) {
        console.error('❌ Error during batch update:', error.message, error.stack);
    }
}

// ─── 6. Load and Run ────────────────────────────────────────────────────────────
(async () => {
    try {
        const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
        const records = JSON.parse(fileContent);

        console.log(`📄 Loaded ${records.length} records from JSON`);

        await pushDataToAlgolia(records);
    } catch (error) {
        console.error('❌ Error loading or processing JSON file:', error.message, error.stack);
    }
})();