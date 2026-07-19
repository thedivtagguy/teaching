#!/usr/bin/env node
// Scaffold a new course edition.
//
//   pnpm new-edition web2027            # year inferred from trailing digits
//   pnpm new-edition web2027 --year=2027
//
// Copies src/content/_template/ into src/content/<id>/, substitutes the id and
// year everywhere, and registers the id in src/lib/editions.ts (for cms.config).
// Because the site auto-discovers editions, the new one shows up with no further
// platform edits.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TEMPLATE_DIR = join(ROOT, 'src/content/_template');
const EDITIONS_FILE = join(ROOT, 'src/lib/editions.ts');

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith('--'));
const yearArg = args.find((a) => a.startsWith('--year='))?.split('=')[1];

if (!id || !/^[a-z][a-z0-9-]*$/.test(id)) {
  console.error('Usage: pnpm new-edition <id> [--year=YYYY]');
  console.error('  <id> must be lowercase alphanumeric, e.g. web2027');
  process.exit(1);
}

const year = yearArg ?? id.match(/\d{4}/)?.[0];
if (!year) {
  console.error(`Could not infer a year from "${id}". Pass --year=YYYY.`);
  process.exit(1);
}

const destDir = join(ROOT, 'src/content', id);
if (existsSync(destDir)) {
  console.error(`Edition "${id}" already exists at ${destDir}. Aborting.`);
  process.exit(1);
}
if (!existsSync(TEMPLATE_DIR)) {
  console.error(`Template not found at ${TEMPLATE_DIR}.`);
  process.exit(1);
}

const substitute = (text) =>
  text.replaceAll('__EDITION_ID__', id).replaceAll('__YEAR__', year);

// Recursively copy the template, substituting placeholders in every file.
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      writeFileSync(destPath, substitute(readFileSync(srcPath, 'utf-8')));
    }
  }
}

copyDir(TEMPLATE_DIR, destDir);

// Register the id in editions.ts (idempotent).
const editionsSrc = readFileSync(EDITIONS_FILE, 'utf-8');
if (!editionsSrc.includes(`'${id}'`)) {
  const updated = editionsSrc.replace(
    /export const EDITION_IDS = \[([\s\S]*?)\] as const;/,
    (_, inner) => {
      const ids = inner
        .split(',')
        .map((s) => s.trim().replace(/['"]/g, ''))
        .filter(Boolean);
      ids.push(id);
      return `export const EDITION_IDS = [${ids.map((i) => `'${i}'`).join(', ')}] as const;`;
    }
  );
  writeFileSync(EDITIONS_FILE, updated);
}

console.log(`\n✅ Created edition "${id}" (year ${year}) at src/content/${id}/\n`);
console.log('Next steps (manual, on GitHub under the open-making org):');
console.log(`  1. Create the journal repo from the dev-notes template → ${id}-dev-notes`);
console.log(`     then set its edition.config.json editionId/notesRepo/courseUrl.`);
console.log(`  2. Point students at the starter template → they clone to ${id}-<name>-site.`);
console.log(`  3. Fill in src/content/${id}/ content, then run: pnpm dev\n`);
