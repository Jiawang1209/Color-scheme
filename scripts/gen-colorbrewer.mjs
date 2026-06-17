/**
 * Generator script: produces src/data/colorbrewer.json from the colorbrewer npm package.
 * Run with: node scripts/gen-colorbrewer.mjs
 *
 * Package shape: default export is an object keyed by scheme name (plus "schemeGroups").
 * Each scheme value is an object keyed by class count (string) → array of lowercase hex strings.
 * Colors are already lowercase hex — no rgb() conversion needed.
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Dynamic ESM import via direct path (bare specifier resolves wrong in some Node versions)
const { default: cb } = await import('../node_modules/colorbrewer/index.es.js');

// Type classification per spec
// sequential includes both multi-hue sequential AND singlehue (Blues, Greens, etc.)
const sequential = new Set([
  'BuGn', 'BuPu', 'GnBu', 'Greens', 'Greys', 'OrRd', 'Oranges',
  'PuBu', 'PuBuGn', 'PuRd', 'Purples', 'RdPu', 'Reds', 'YlGn',
  'YlGnBu', 'YlOrBr', 'YlOrRd', 'Blues',
]);

const diverging = new Set([
  'BrBG', 'PiYG', 'PRGn', 'PuOr', 'RdBu', 'RdGy', 'RdYlBu', 'RdYlGn', 'Spectral',
]);

const qualitative = new Set([
  'Accent', 'Dark2', 'Paired', 'Pastel1', 'Pastel2', 'Set1', 'Set2', 'Set3',
]);

// Not reliably colorblind-safe qualitative palettes
const partialCBSafe = new Set(['Pastel1', 'Pastel2', 'Set3', 'Accent', 'Paired']);

function getType(name) {
  if (sequential.has(name)) return 'sequential';
  if (diverging.has(name)) return 'diverging';
  if (qualitative.has(name)) return 'qualitative';
  throw new Error(`Unknown scheme type for: ${name}`);
}

function getMeta(name, type) {
  if (type === 'sequential') {
    return { colorblindSafe: true, printFriendly: true, photocopySafe: false };
  }
  if (type === 'diverging') {
    return { colorblindSafe: true, printFriendly: true, photocopySafe: false };
  }
  // qualitative — all are at most 'partial' for colorblind safety
  const colorblindSafe = partialCBSafe.has(name) ? 'partial' : 'partial';
  return { colorblindSafe, printFriendly: true, photocopySafe: false };
}

const allSchemes = [...sequential, ...diverging, ...qualitative];

const palettes = allSchemes.map((name) => {
  const schemeData = cb[name];
  if (!schemeData) throw new Error(`Scheme not found in package: ${name}`);

  const type = getType(name);
  const meta = getMeta(name, type);

  // Build discrete map: numeric keys → array of lowercase hex strings
  const discrete = {};
  for (const [k, colors] of Object.entries(schemeData)) {
    discrete[Number(k)] = colors.map((c) => c.toLowerCase());
  }

  return {
    id: name,
    name,
    collection: 'colorbrewer',
    type,
    discrete,
    meta,
  };
});

const outPath = join(__dirname, '../src/data/colorbrewer.json');
writeFileSync(outPath, JSON.stringify(palettes, null, 2) + '\n', 'utf8');

console.log(`Wrote ${palettes.length} palettes to src/data/colorbrewer.json`);
palettes.forEach((p) =>
  console.log(`  ${p.type.padEnd(12)} ${p.id} (counts: ${Object.keys(p.discrete).join(',')})`)
);
