import { resolve as resolvePath } from 'path';
import { readFileSync, existsSync, statSync, readdirSync } from 'fs';

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
		case 'mp4': return 'video/mp4';
		case 'webm': return 'video/webm';
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
			// For asset requests like /slides/<edition>/dist/reveal.css that don't resolve
			// directly, search each day-folder under the edition for the asset. This is
			// edition-agnostic: no year or day folder is hardcoded.
			const pathParts = urlPath.split('/');
			if (pathParts.length >= 3 && pathParts[0] === 'slides') {
				const edition = pathParts[1]; // e.g. "web2026"
				const assetPath = pathParts.slice(2).join('/'); // e.g. "dist/reveal.css"
				const editionDir = resolvePath(process.cwd(), 'static', 'slides', edition);

				// The Obsidian exporter sometimes links the theme as assets/<file> while
				// copying it to css/<file> (or vice versa), so try both folders.
				const withSwaps = (p) => {
					const variants = [p];
					if (p.startsWith('assets/')) variants.push(`css/${p.slice('assets/'.length)}`);
					else if (p.startsWith('css/')) variants.push(`assets/${p.slice('css/'.length)}`);
					return variants;
				};

				if (existsSync(editionDir) && statSync(editionDir).isDirectory()) {
					const dayFolders = readdirSync(editionDir).filter((name) =>
						statSync(resolvePath(editionDir, name)).isDirectory()
					);
					outer: for (const dayFolder of dayFolders) {
						// URLs with a trailing slash repeat the day folder in the asset
						// path (day-x/assets/foo.css requested inside day-x); strip it.
						const rel = assetPath.startsWith(`${dayFolder}/`)
							? assetPath.slice(dayFolder.length + 1)
							: assetPath;
						for (const tryPath of withSwaps(rel)) {
							const candidate = resolvePath(editionDir, dayFolder, tryPath);
							if (existsSync(candidate) && statSync(candidate).isFile()) {
								console.log('Found asset in slides folder:', candidate);
								staticFilePath = candidate;
								break outer;
							}
						}
					}
				}
			}
		}

		// Decks reference shared media as ../assets/slides/<day>/<file>, which lands
		// on /slides/assets/... or /slides/<edition>/assets/... depending on whether
		// the deck URL had a trailing slash. Those files live in static/assets/, so
		// remap anything still unresolved that contains assets/slides/.
		if (!(existsSync(staticFilePath) && statSync(staticFilePath).isFile())) {
			const assetsIdx = urlPath.indexOf('assets/slides/');
			if (assetsIdx !== -1) {
				const rootCandidate = resolvePath(process.cwd(), 'static', urlPath.slice(assetsIdx));
				if (existsSync(rootCandidate) && statSync(rootCandidate).isFile()) {
					console.log('Found asset in root assets folder:', rootCandidate);
					staticFilePath = rootCandidate;
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