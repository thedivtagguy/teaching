// Canonical list of course-edition ids that live under src/content/<id>/.
//
// The SvelteKit site auto-discovers editions at build time via import.meta.glob
// (see contentService.ts), so routes, menus, and the homepage do NOT need this
// list. It exists only for plain-Node/plain-TS consumers that cannot use Vite's
// glob — chiefly cms.config.ts. Keep it in sync when adding an edition; the
// `pnpm new-edition <id>` script appends to it automatically.
export const EDITION_IDS = ['web2025', 'web2026', 'cdv2025'] as const;

export type EditionId = (typeof EDITION_IDS)[number];
