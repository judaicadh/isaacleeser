import csv from 'csvtojson';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function slugify(value) {
	return value
		.toString()
		.toLowerCase()
		.replace(/[\s\W-]+/g, '-') // Replace spaces/anything non-word with -
		.replace(/^-+|-+$/g, '');  // Trim leading/trailing hyphens
}
const csvFilePath = path.join(__dirname, './Leeser-Letters2 (1).csv');
const jsonFilePath = path.join(__dirname, '../src/data/items.json');
const creatorCount = 13; // or whatever max you expect (change as needed)
const creatorFields = Array.from({length: creatorCount}, (_, i) => `dcterms:creator ${i+1}`);
const pipeFields = [
	'dcterms:language',
	'dcterms:contributor',
	'bookseller_editor',
	'agent',
	'correspondent',
	// add more as needed
];

const floatFields = ['author latitude', 'author longitude', 'recipient latitude', 'recipient longitude'];
const intFields = ['unixtime'];
const boolFields = ['Duplicate', 'Refers to the Occident'];

const identityFields = [
	'dcterms:identifier', 'xml', 'ARK ID(2)', 'thumbnail', 'dcterms:title', 'Title', 'Type', 'Hebrew Date', 'dcterms:date',
	'date written', 'hasFormat', 'Link', 'Ark', 'Collection', 'Collection uri', 'dcterms:identifier 2', 'dcterms:identifier 2 1',
	'dcterms:source', 'fromLocation', 'dcterms:spatialcoverage', 'Getty Thesaurus of Geographic Names ID',
	'toLocation', 'URL 2', 'filepath', 'Type', 'Title', 'Description',
];

// ---- HELPERS ---- //
const parsePipeField = value =>
	value ? value.split('|').map(v => v.trim()).filter(Boolean) : [];

const parseBool = v => {
	if (typeof v !== 'string') return false;
	return ['yes', 'true', '1', 'x'].includes(v.toLowerCase());
};

async function main() {
	try {
		const jsonArray = await csv({ separator: ',' }).fromFile(csvFilePath);
		console.log(`Parsed ${jsonArray.length} records from CSV`);

		const formattedData = jsonArray.map((item, index) => {
			const result = {};

			// Identity fields
			identityFields.forEach(field => {
				if (item[field]) result[field.replace(/\s+/g, '_')] = item[field];
			});
			const identifier = item['dcterms:identifier'];
			if (identifier) {
				result.identifier = identifier;
				result.slug = slugify(identifier);
			}
			// Pipe fields (array, deduped)
			pipeFields.forEach(field => {
				if (item[field]) result[field.replace(/\s+/g, '_')] = parsePipeField(item[field]);
			});

			// Creators: from dcterms:creator 1, 2, 3... (skip dcterms:creator)
			const creators = creatorFields
				.map(field => item[field])
				.filter(Boolean)
				.flatMap(val => val.split('|').map(s => s.trim()))
				.filter(Boolean);
			if (creators.length) result.creators = creators;

			// Float fields
			floatFields.forEach(field => {
				if (item[field]) result[field.replace(/\s+/g, '_')] = parseFloat(item[field]);
			});

			// Int fields
			intFields.forEach(field => {
				if (item[field]) result[field.replace(/\s+/g, '_')] = parseInt(item[field], 10);
			});

			// Bool fields
			boolFields.forEach(field => {
				if (item[field]) result[field.replace(/\s+/g, '_')] = parseBool(item[field]);
			});

			result.rowIndex = index + 1;

			return result;
		});

		await fs.mkdir(path.dirname(jsonFilePath), { recursive: true });
		await fs.writeFile(jsonFilePath, JSON.stringify(formattedData, null, 2), 'utf-8');
		console.log('✅ CSV to JSON conversion completed.');
	} catch (err) {
		console.error('❌ Error:', err);
	}
}

main();