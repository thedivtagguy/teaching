import defineConfig from '@sveltia/cms';

export default defineConfig({
  collections: [
    {
      name: 'cdv2025',
      label: 'CDV 2025',
      folder: 'src/content/cdv2025',
      create: true,
      format: 'frontmatter',
      extension: 'svx',
      fields: [
        {
          label: 'Title',
          name: 'title',
          widget: 'string',
          required: true,
        },
        {
          label: 'Date',
          name: 'date',
          widget: 'datetime',
          required: true,
        },
        {
          label: 'Description',
          name: 'description',
          widget: 'text',
          required: false,
        },
        {
          label: 'Content',
          name: 'body',
          widget: 'markdown',
          required: true,
        },
      ],
    },
  ],
  backend: {
    name: 'git',
    branch: 'main',
  },
  media_folder: 'static/images',
  public_folder: '/images',
}); 