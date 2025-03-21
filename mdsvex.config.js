// Import mdsvex and plugins
import { defineMDSveXConfig } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';

const config = defineMDSveXConfig({
  extensions: ['.svx', '.md'],
  
  smartypants: {
    dashes: 'oldschool'
  },
  
  // Add remark plugins for GitHub Flavored Markdown and footnotes
  remarkPlugins: [
    remarkGfm,
    [remarkFootnotes, { inlineNotes: true }]
  ],
  
  // Add rehype plugins for automatic heading IDs and anchor links
  rehypePlugins: [
    // Add IDs to headings
    rehypeSlug,
    // Add anchor links to headings
    [rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['anchor-link'],
        ariaLabel: 'Link to this section',
        tabIndex: -1,
        'data-heading-link': true
      },
      content: {
        type: 'element',
        tagName: 'svg',
        properties: {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          width: 16,
          height: 16,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          className: ['link-icon']
        },
        children: [
          {
            type: 'element',
            tagName: 'path',
            properties: {
              d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'
            }
          },
          {
            type: 'element',
            tagName: 'path',
            properties: {
              d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'
            }
          }
        ]
      }
    }]
  ],
  
  // Layout for our Markdown files
  layout: {
    _: './src/lib/components/MDLayout.svelte'
  }
});

export default config; 