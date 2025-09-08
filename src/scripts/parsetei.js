import fs from "fs";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: false,
});

/**
 * Fetch and parse TEI
 */
async function parseTEI(url) {
  console.log(`📥 Fetching TEI from: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch TEI: ${url} (${res.status})`);

  // get the raw xml
  const rawXml = await res.text();

  // strip any DOCTYPE or entity declarations
  const cleanedXml = rawXml.replace(/<!DOCTYPE[^>]*>\s*/g, "");

  // return both the cleaned xml string and parsed JSON
  return {
    xml: cleanedXml,
    json: parser.parse(cleanedXml),
  };
}

/**
 * Strip XML/HTML tags → plain text
 */
function stripTags(str) {
  return str
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Build annotations per <pb n="..."/>
 *
 * @param {string} teiXml - raw TEI XML string
 * @param {object} manifest - IIIF manifest
 * @param {boolean} plainText - if true, strip tags
 */
function teiToAnnotations(teiXml, manifest) {
  const canvases = manifest.sequences?.[0]?.canvases || [];
  const annotations = [];

  // Case 1: No <pb>, fallback to attaching entire body to first canvas
  if (!teiXml.includes("<pb")) {
    const canvas = canvases[0];
    if (canvas) {
      annotations.push({
        id: `${manifest["@id"]}/annotation/fulltext`,
        type: "Annotation",
        motivation: "commenting",
        body: { type: "TextualBody", value: teiXml.trim() },
        target: canvas["@id"],
      });
      console.log(`📄 Fallback: attached full TEI body to ${canvas["@id"]}`);
    } else {
      console.warn("⚠️ No canvases found to attach fallback text");
    }
    return annotations;
  }

  // Case 2: TEI has <pb>, split page by page
  const chunks = teiXml.split(/<pb[^>]*n="(\d+)"[^>]*>/);
  for (let i = 1; i < chunks.length; i += 2) {
    const pageNum = chunks[i];
    const pageText = chunks[i + 1] || "";
    const canvas = canvases.find((c) => c.label?.toString().includes(pageNum));
    if (canvas) {
      annotations.push({
        id: `${manifest["@id"]}/annotation/p${pageNum}`,
        type: "Annotation",
        motivation: "commenting",
        body: { type: "TextualBody", value: pageText.trim() },
        target: canvas["@id"],
      });
    }
  }
  return annotations;
}

function attachAnnotations(manifest, annotations) {
  manifest.sequences?.[0]?.canvases?.forEach((canvas) => {
    const pageNum = parseInt(canvas.label?.toString().replace(/\D/g, ""), 10);
    const matching = annotations.filter((ann) =>
      ann.id.endsWith(`p${pageNum}`),
    );

    if (matching.length) {
      canvas.annotations = [
        {
          id: `${canvas["@id"]}/annopage`,
          type: "AnnotationPage",
          items: matching,
        },
      ];
      console.log(
        `✅ Attached page ${pageNum} → ${canvas["@id"]}\n   Preview: ${matching[0].body.value.slice(
          0,
          150,
        )}…`,
      );
    } else {
      console.log(`⚠️ No text for canvas ${canvas["@id"]}`);
    }
  });
}

/**
 * Main
 */
const items = JSON.parse(fs.readFileSync("../data/items.json", "utf8"));
console.log(`📚 Loaded ${items.length} items`);

for (const item of items) {
  if (!item.manifestUrl || !item.xml) continue;

  const manifests = Array.isArray(item.manifestUrl)
    ? item.manifestUrl
    : [item.manifestUrl];

  for (const manifestUrl of manifests) {
    try {
      console.log(`\n🔗 Processing manifest: ${manifestUrl}`);
      const res = await fetch(manifestUrl);
      const manifest = await res.json();

      const { xml } = await parseTEI(item.xml);

      // toggle true/false for plain text vs. TEI HTML
      const annotations = teiToAnnotations(xml, manifest, false);

      attachAnnotations(manifest, annotations);

      // Write merged manifest
      const slug = item.slug || item.id || Date.now().toString();
      const outPath = `../public/manifests/${slug}.json`;
      fs.mkdirSync("../public/manifests", { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));
      console.log(`💾 Saved → ${outPath}`);
    } catch (err) {
      console.error(`💥 Error with ${manifestUrl}:`, err.message);
    }
  }
}

console.log("\n🎉 Done! All manifests updated.");
