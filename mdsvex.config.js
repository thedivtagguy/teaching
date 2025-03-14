// Import mdsvex and plugins
import { defineMDSveXConfig } from 'mdsvex';

const config = defineMDSveXConfig({
  extensions: ['.svx', '.md'],
  
  // No plugins for now to avoid compatibility issues
  
  // Layout for our Markdown files
  layout: {
    _: './src/lib/components/MDLayout.svelte'
  }
});

export default config; 