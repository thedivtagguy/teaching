/**
 * Enrich library.json with share-card metadata (og:image, description, site
 * name, favicon) fetched from each item's URL. Results are written to
 * library-meta.json next to each course's library.json (in src/content and
 * mirrored to static), keyed by item URL.
 *
 * Re-runnable: previously fetched URLs are skipped unless --force is passed.
 *
 *   node scripts/enrich-library.mjs [course] [--force]
 *   node scripts/enrich-library.mjs web2026
 */
import fs from 'node:fs';
import path from 'node:path';

const course = process.argv.find((a) => !a.startsWith('-') && !a.includes('/') && a.startsWith('web')) || 'web2026';
const force = process.argv.includes('--force');

const contentDir = path.resolve('src/content', course, 'data');
const staticDir = path.resolve('static', course, 'data');
const libraryPath = path.join(contentDir, 'library.json');
const metaPath = path.join(contentDir, 'library-meta.json');

const UA =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const CONCURRENCY = 6;
const TIMEOUT_MS = 15000;

const raw = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
const items = raw.items || raw;
const existing = !force && fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : {};

const urls = [...new Set(items.map((i) => i.url).filter(Boolean))];

function decodeEntities(s) {
	if (!s) return s;
	return s
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#039;|&apos;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/&mdash;/g, '—')
		.replace(/&ndash;/g, '–')
		.replace(/&hellip;/g, '…')
		.replace(/\s+/g, ' ')
		.trim();
}

function extractMeta(html, baseUrl) {
	const meta = {};
	// <meta property/name="..." content="..."> in either attribute order
	const tagRe = /<meta\s+[^>]*>/gi;
	const tags = html.match(tagRe) || [];
	const get = (attr, tag) => {
		const m = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, 'i'));
		return m ? m[1] : null;
	};
	const wanted = {
		'og:title': 'title',
		'twitter:title': 'title',
		'og:description': 'description',
		'twitter:description': 'description',
		description: 'description',
		'og:image': 'image',
		'twitter:image': 'image',
		'og:site_name': 'siteName',
		'theme-color': 'themeColor'
	};
	// first hit wins per field, og:* checked in tag order so priority ≈ source order;
	// enforce og > twitter > plain by scoring
	const priority = { title: 0, description: 0, image: 0, siteName: 0, themeColor: 0 };
	const score = (key) => (key.startsWith('og:') ? 3 : key.startsWith('twitter:') ? 2 : 1);
	for (const tag of tags) {
		const key = (get('property', tag) || get('name', tag) || '').toLowerCase();
		const field = wanted[key];
		if (!field) continue;
		const content = get('content', tag);
		if (!content) continue;
		if (score(key) > priority[field]) {
			meta[field] = decodeEntities(content);
			priority[field] = score(key);
		}
	}
	if (!meta.title) {
		const t = html.match(/<title[^>]*>([^<]*)<\/title>/i);
		if (t) meta.title = decodeEntities(t[1]);
	}
	// favicon
	const linkTags = html.match(/<link\s+[^>]*>/gi) || [];
	let favicon = null,
		faviconScore = 0;
	for (const tag of linkTags) {
		const rel = (get('rel', tag) || '').toLowerCase();
		if (!/\bicon\b|apple-touch-icon/.test(rel)) continue;
		const href = get('href', tag);
		if (!href) continue;
		const s = rel.includes('apple-touch-icon') ? 2 : 1;
		if (s > faviconScore) {
			favicon = href;
			faviconScore = s;
		}
	}
	if (favicon) {
		try {
			meta.favicon = new URL(favicon, baseUrl).href;
		} catch {
			/* skip malformed */
		}
	}
	if (meta.image) {
		try {
			meta.image = new URL(meta.image, baseUrl).href;
		} catch {
			delete meta.image;
		}
	}
	return meta;
}

function youtubeId(url) {
	const m = url.match(/(?:youtube\.com\/watch\?.*v=|youtu\.be\/)([\w-]{11})/);
	return m ? m[1] : null;
}

const JUNK_TITLES = /just a moment|access denied|attention required|are you a robot|page not found|403|404/i;

async function fetchMeta(url) {
	const result = { url, fetchedAt: new Date().toISOString().slice(0, 10) };
	try {
		const u = new URL(url);
		result.domain = u.hostname.replace(/^www\./, '');
	} catch {
		return { ...result, status: 'invalid-url' };
	}

	// YouTube: thumbnails are predictable, pages are JS-heavy
	const yt = youtubeId(url);
	if (yt) {
		result.image = `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
		try {
			const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, {
				signal: AbortSignal.timeout(TIMEOUT_MS)
			});
			if (r.ok) {
				const o = await r.json();
				result.title = o.title;
				result.siteName = 'YouTube';
				result.authorName = o.author_name;
			}
		} catch {
			/* thumbnail alone is fine */
		}
		result.kind = 'video';
		result.status = 'ok';
		return result;
	}

	// Vimeo oembed
	if (result.domain === 'vimeo.com') {
		try {
			const r = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`, {
				signal: AbortSignal.timeout(TIMEOUT_MS)
			});
			if (r.ok) {
				const o = await r.json();
				result.title = o.title;
				result.image = o.thumbnail_url;
				result.siteName = 'Vimeo';
				result.authorName = o.author_name;
				result.kind = 'video';
				result.status = 'ok';
				return result;
			}
		} catch {
			/* fall through to generic fetch */
		}
	}

	try {
		const r = await fetch(url, {
			headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8' },
			redirect: 'follow',
			signal: AbortSignal.timeout(TIMEOUT_MS)
		});
		const type = r.headers.get('content-type') || '';
		if (type.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
			result.kind = 'pdf';
			result.status = r.ok ? 'ok' : `http-${r.status}`;
			return result;
		}
		if (!r.ok) {
			result.status = `http-${r.status}`;
			return result;
		}
		const html = (await r.text()).slice(0, 500_000);
		const meta = extractMeta(html, r.url || url);
		if (meta.title && JUNK_TITLES.test(meta.title)) {
			result.status = 'blocked';
			return result;
		}
		Object.assign(result, meta);
		result.kind = 'page';
		result.status = 'ok';
		return result;
	} catch (e) {
		result.status = e.name === 'TimeoutError' ? 'timeout' : `error:${e.message?.slice(0, 80)}`;
		return result;
	}
}

const queue = urls.filter((u) => force || !existing[u] || existing[u].status !== 'ok');
console.log(`${urls.length} unique URLs, fetching ${queue.length} (${urls.length - queue.length} cached)`);

const results = { ...existing };
let done = 0;
async function worker() {
	while (queue.length) {
		const url = queue.shift();
		const meta = await fetchMeta(url);
		results[url] = meta;
		done++;
		const flag = meta.status === 'ok' ? (meta.image ? '🖼 ' : '· ') : '✗ ';
		console.log(`${String(done).padStart(3)} ${flag}${meta.status.padEnd(12)} ${url.slice(0, 90)}`);
	}
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// stable key order for clean diffs
const sorted = Object.fromEntries(Object.keys(results).sort().map((k) => [k, results[k]]));
const json = JSON.stringify(sorted, null, '\t');
fs.writeFileSync(metaPath, json);
fs.mkdirSync(staticDir, { recursive: true });
fs.writeFileSync(path.join(staticDir, 'library-meta.json'), json);

const ok = Object.values(sorted).filter((m) => m.status === 'ok');
const withImage = ok.filter((m) => m.image);
console.log(`\nWrote ${metaPath}`);
console.log(`   and ${path.join(staticDir, 'library-meta.json')}`);
console.log(`${ok.length}/${urls.length} ok, ${withImage.length} with images, ${urls.length - ok.length} failed`);
