import { resolve as resolvePath } from 'path';
import { readFileSync, existsSync, statSync } from 'fs';

function getContentType(filePath) {
	const ext = filePath.split('.').pop();
	switch (ext) {
		case 'html': return 'text/html';
		case 'css': return 'text/css';
		case 'js': return 'application/javascript';
		case 'json': return 'application/json';
		case 'png': return 'image/png';
		case 'jpg': case 'jpeg': return 'image/jpeg';
		case 'gif': return 'image/gif';
		case 'svg': return 'image/svg+xml';
		case 'woff': return 'font/woff';
		case 'woff2': return 'font/woff2';
		case 'ttf': return 'font/ttf';
		default: return 'application/octet-stream';
	}
}

export async function handle({ event, resolve }) {
	// Check if the request is for slides
	if (event.url.pathname.startsWith('/slides/')) {
		const urlPath = event.url.pathname.slice(1); // Remove leading slash
		console.log('Slides request:', urlPath);

		// First try to serve the file directly
		let staticFilePath = resolvePath(process.cwd(), 'static', urlPath);
		console.log('Trying direct path:', staticFilePath);

		// Check if the path exists and if it's a directory
		if (existsSync(staticFilePath)) {
			const stats = statSync(staticFilePath);
			if (stats.isDirectory()) {
				// If it's a directory, try index.html
				staticFilePath = resolvePath(staticFilePath, 'index.html');
				console.log('Is directory, trying index.html:', staticFilePath);
			}
		} else if (!urlPath.includes('.')) {
			// If it doesn't exist and doesn't have an extension, try adding index.html
			staticFilePath = resolvePath(process.cwd(), 'static', urlPath, 'index.html');
			console.log('Trying index.html path:', staticFilePath);
		} else {
			// For asset requests like /slides/web2025/dist/reveal.css, 
			// try to find them in the day-1-the-old-web folder
			const pathParts = urlPath.split('/');
			if (pathParts.length >= 3 && pathParts[0] === 'slides' && pathParts[1] === 'web2025') {
				// Try to find the asset in the day-1-the-old-web folder
				const assetPath = pathParts.slice(2).join('/'); // e.g., "dist/reveal.css"
				const slidesFolderPath = resolvePath(process.cwd(), 'static', 'slides', 'web2025', 'day-1-the-small-web', assetPath);
				console.log('Trying asset in slides folder:', slidesFolderPath);

				if (existsSync(slidesFolderPath) && statSync(slidesFolderPath).isFile()) {
					staticFilePath = slidesFolderPath;
				}
			}
		}

		// Check if the final static file exists and is a file
		if (existsSync(staticFilePath) && statSync(staticFilePath).isFile()) {
			try {
				const contentType = getContentType(staticFilePath);

				// Read binary files as buffer for fonts, images, etc.
				const isBinary = contentType.startsWith('font/') ||
					contentType.startsWith('image/') ||
					contentType === 'application/octet-stream';

				const fileContent = isBinary ?
					readFileSync(staticFilePath) :
					readFileSync(staticFilePath, 'utf-8');

				console.log('Serving file:', staticFilePath);
				return new Response(fileContent, {
					headers: {
						'Content-Type': contentType,
						'Cache-Control': 'public, max-age=3600'
					}
				});
			} catch (error) {
				console.error('Error reading static file:', error);
			}
		} else {
			console.log('File not found or not a file:', staticFilePath);
		}
	}

	// For all other requests, use the default SvelteKit behavior
	return await resolve(event);
}