import defineConfig from '@sveltia/cms';
import { EDITION_IDS } from './src/lib/editions';

// One CMS collection per edition, generated from the shared registry so a new
// edition needs no manual edit here (the new-edition script updates editions.ts).
const editionCollection = (id: string) => ({
  name: id,
  label: id.toUpperCase(),
  folder: `src/content/${id}`,
  create: true,
  format: 'frontmatter' as const,
  extension: 'svx',
  fields: [
    { label: 'Title', name: 'title', widget: 'string', required: true },
    { label: 'Date', name: 'date', widget: 'datetime', required: true },
    { label: 'Description', name: 'description', widget: 'text', required: false },
    { label: 'Content', name: 'body', widget: 'markdown', required: true },
  ],
});

export default defineConfig({
  collections: EDITION_IDS.map(editionCollection),
  backend: {
    name: 'git',
    branch: 'main',
  },
  media_folder: 'static/images',
  public_folder: '/images',
}); 