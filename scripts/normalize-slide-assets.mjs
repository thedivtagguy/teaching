#!/usr/bin/env node
// Normalize image/video references in a slide deck to absolute /assets/... paths.
//
//   node scripts/normalize-slide-assets.mjs src/content/web2026/slides/day-1-the-small-web.md
//   node scripts/normalize-slide-assets.mjs --all   # every deck under src/content/web2026/slides
//
// Slide decks reused from a prior edition often reference attachments by bare
// filename (e.g. ![](IMG-123.png)), which Obsidian resolves by searching the
// vault but which 404 both in the Slides Extended preview and on the deployed
// site (both serve images from /assets/...). This rewrites every non-absolute
// image ref to the file's real location under static/assets/, found by basename.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve, dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ASSETS_ROOT = join(ROOT, 'static/assets');

// Build basename -> [absolute web paths] index over static/assets once.
const index = new Map();
function indexDir(dir, webPrefix) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) {
      indexDir(abs, `${webPrefix}/${entry}`);
    } else {
      const web = `${webPrefix}/${entry}`;
      if (!index.has(entry)) index.set(entry, []);
      index.get(entry).push(web);
    }
  }
}
indexDir(ASSETS_ROOT, '/assets');

const IMG_REF = /(!\[[^\]]*\]\()([^)]+)(\))/g;

function normalizeDeck(file) {
  let src = readFileSync(file, 'utf-8');
  let changed = 0;
  const unresolved = new Set();
  src = src.replace(IMG_REF, (whole, open, path, close) => {
    // Strip an Obsidian size hint like |800 from the target.
    const [rawPath] = path.split('|');
    const target = rawPath.trim();
    if (target.startsWith('/') || /^https?:/.test(target)) return whole; // already absolute/remote
    const name = basename(target);
    const hits = index.get(name);
    if (!hits || hits.length === 0) {
      unresolved.add(name);
      return whole;
    }
    if (hits.length > 1) {
      // Ambiguous basename across folders; prefer a folder matching the deck name.
      const deck = basename(file).replace(/\.md$/, '');
      const preferred = hits.find((h) => h.includes(`/slides/${deck}/`));
      if (!preferred) {
        unresolved.add(`${name} (ambiguous: ${hits.join(', ')})`);
        return whole;
      }
      changed++;
      return `${open}${preferred}${close}`;
    }
    changed++;
    return `${open}${hits[0]}${close}`;
  });
  if (changed) writeFileSync(file, src);
  console.log(`${file}: rewrote ${changed} ref(s)` + (unresolved.size ? `, ${unresolved.size} unresolved` : ''));
  if (unresolved.size) unresolved.forEach((u) => console.log(`  ! ${u}`));
}

const args = process.argv.slice(2);
let decks = [];
if (args[0] === '--all') {
  const slidesDir = join(ROOT, 'src/content/web2026/slides');
  decks = readdirSync(slidesDir).filter((f) => f.endsWith('.md')).map((f) => join(slidesDir, f));
} else if (args[0]) {
  decks = [resolve(args[0])];
} else {
  console.error('Usage: node scripts/normalize-slide-assets.mjs <deck.md> | --all');
  process.exit(1);
}
decks.filter(existsSync).forEach(normalizeDeck);
