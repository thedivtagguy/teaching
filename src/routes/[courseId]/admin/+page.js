import { error } from '@sveltejs/kit';

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
	const { courseId } = params;

	try {
		// Use the existing meta loading pattern from other routes
		const metaModule = await import(`../../../content/${courseId}/meta.yaml?raw`);

		// Parse YAML manually (simple parsing for our use case)
		const metaContent = metaModule.default;
		const lines = metaContent.split('\n');
		const meta = {};

		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed && !trimmed.startsWith('#') && trimmed.includes(':')) {
				const [key, ...valueParts] = trimmed.split(':');
				const value = valueParts.join(':').trim();

				// Remove quotes if present
				const cleanValue = value.replace(/^["']|["']$/g, '');

				// Convert numbers
				if (/^\d+$/.test(cleanValue)) {
					meta[key.trim()] = parseInt(cleanValue, 10);
				} else {
					meta[key.trim()] = cleanValue;
				}
			}
		}

		return {
			courseId,
			meta
		};
	} catch (err) {
		console.error('Error loading course metadata:', err);
		throw error(404, 'Course not found');
	}
}