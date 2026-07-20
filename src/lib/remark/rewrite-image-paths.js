// Remark plugin: rewrite bare image references to absolute /assets/... paths.
//
// Content pages (everything NOT under /slides/) are rendered by mdsvex, which
// does no path rewriting. A bare ref like ![](IMG-123.png) therefore resolves
// relative to the page URL (e.g. /web2026/guides) and 404s. The images actually
// live under static/assets/<...>/, served at /assets/<...>/.
//
// This mirrors scripts/normalize-slide-assets.mjs, but runs at build time so
// authors can paste bare Obsidian filenames and have them Just Work. Slides are
// untouched: they never reach mdsvex (excluded in mdsvex.config.js) and are
// patched live by hooks.server.js instead.

import { readdirSync, statSync } from 'fs';
import { resolve, dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../../..');
const ASSETS_ROOT = join(ROOT, 'static/assets');

// Build a basename -> [absolute web path] index over static/assets once.
// Timestamped Obsidian filenames are effectively unique, so collisions are rare;
// when they happen we prefer a folder matching the content file's basename.
let index = null;
function buildIndex() {
  const map = new Map();
  const walk = (dir, webPrefix) => {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return; // static/assets missing — nothing to rewrite
    }
    for (const entry of entries) {
      const abs = join(dir, entry);
      if (statSync(abs).isDirectory()) {
        walk(abs, `${webPrefix}/${entry}`);
      } else {
        const web = `${webPrefix}/${entry}`;
        if (!map.has(entry)) map.set(entry, []);
        map.get(entry).push(web);
      }
    }
  };
  walk(ASSETS_ROOT, '/assets');
  return map;
}

function isBare(url) {
  return !/^(https?:|data:|\/|#|\.)/.test(url);
}

export default function rewriteImagePaths() {
  return (tree, file) => {
    if (!index) index = buildIndex();
    // The content file's basename, e.g. "guides" — used to disambiguate.
    const pageName = file?.filename ? basename(file.filename).replace(/\.[^.]+$/, '') : '';

    const visit = (node) => {
      if (node.type === 'image' && typeof node.url === 'string' && isBare(node.url)) {
        // Strip an Obsidian size hint like IMG-123.png|400.
        const [rawPath] = node.url.split('|');
        const hits = index.get(basename(rawPath.trim()));
        if (hits && hits.length) {
          node.url =
            hits.length > 1
              ? hits.find((h) => h.includes(`/${pageName}/`)) || hits[0]
              : hits[0];
        }
      }
      if (node.children) for (const child of node.children) visit(child);
    };

    visit(tree);
  };
}
