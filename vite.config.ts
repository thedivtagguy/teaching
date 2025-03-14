import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { watch } from 'fs';

export default defineConfig({
	plugins: [
		// Custom plugin to watch content files
		{
			name: 'content-hmr',
			configureServer(server) {
				const contentDir = resolve(process.cwd(), 'src/content');
				console.log(`Watching directory: ${contentDir} for changes`);
				
				// Watch the content directory for changes
				const watcher = watch(contentDir, { recursive: true }, (eventType, filename) => {
					if (filename && (filename.endsWith('.svx') || filename.endsWith('.yaml'))) {
						console.log(`Content file changed: ${filename}`);
						
						// Force invalidation of all modules in the browser
						server.ws.send({
							type: 'full-reload',
							path: '*'
						});
					}
				});
				
				// Cleanup watcher on server close
				if (server.httpServer) {
					server.httpServer.on('close', () => {
						watcher.close();
					});
				}
				
				// Ensure the watcher is closed when Vite is shutting down
				process.on('SIGTERM', () => {
					watcher.close();
				});
			}
		},
		tailwindcss(),
		sveltekit()
	]
});
