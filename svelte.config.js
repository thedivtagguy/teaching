import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig)
	],

	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore prerendering errors for API routes
				if (path.startsWith('/api/')) {
					return;
				}
				
				// Throw errors for other routes
				throw new Error(`${message}\n\tPath: ${path}\n\tReferrer: ${referrer}`);
			}
		}
	},

	extensions: ['.svelte', '.svx', '.md']
};

export default config;
