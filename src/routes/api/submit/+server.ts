import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { validateSpreadsheetEntry, formatDate } from '$lib/schema';

export async function POST(event: RequestEvent) {
	const { request, url } = event;
	const formData = await request.json();

	try {
		// Validate the incoming data against our schema
		// This will throw if validation fails
		const validatedData = validateSpreadsheetEntry({
			...formData,
			// Ensure date is in the correct format if not provided
			date: formData.date || formatDate(new Date())
		});

		// Use the correct URL for local development vs. production
		const functionUrl = import.meta.env.DEV 
			? new URL('/.netlify/functions/google-spreadsheet-function', url.origin).href
			: `${url.origin}/.netlify/functions/google-spreadsheet-function`;

		console.log('Attempting to call function at:', functionUrl);

		const response = await fetch(functionUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(validatedData)
		});

		console.log('Response status:', response.status);
		console.log('Response headers:', Object.fromEntries(response.headers.entries()));

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Response not OK:', response.status, errorText);
			throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
		}

		const result = await response.json();
		return json(result);
	} catch (error) {
		console.error('Error:', error);
		// Safely handle error of unknown type
		const errorMessage = error instanceof Error ? error.message : String(error);
		return json({ error: 'Failed to submit data', details: errorMessage }, { status: 500 });
	}
}