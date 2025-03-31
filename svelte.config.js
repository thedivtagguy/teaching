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
			entries: [
				'*',
				'/[courseId]/submit',
				'/[courseId]/assignments/[assignmentId]',
				'/[courseId]/assignments',
				'/[courseId]/slides/[...path]',
				'/buzzer'
			],
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore prerendering errors for API routes
				if (path.startsWith('/api/')) {
					return;
				}
				
				// Ignore errors for dynamic routes that are causing issues
				if (path.includes('/[courseId]/submit') || 
					path.includes('/[courseId]/assignments/[assignmentId]') ||
					path.includes('/[courseId]/assignments') ||
					path.includes('/slides/') || 
					path.includes('/buzzer') ||
					path.includes('/[courseId]/slides/')) {
					console.warn(`Warning: Ignoring prerender error for dynamic route: ${path}`);
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
