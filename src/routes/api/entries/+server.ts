import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
	const { url } = event;
	
	try {
		// Use the correct URL for local development vs. production
		const functionUrl = import.meta.env.DEV 
			? new URL('/.netlify/functions/google-spreadsheet-function', url.origin).href
			: `${url.origin}/.netlify/functions/google-spreadsheet-function`;
			
		console.log('Fetching entries from:', functionUrl);
		
		const response = await fetch(functionUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error('Response not OK:', response.status, errorText);
			throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
		}
		
		const entries = await response.json();
		return json(entries);
	} catch (error) {
		console.error('Error fetching entries:', error);
		// Safely handle error of unknown type
		const errorMessage = error instanceof Error ? error.message : String(error);
		return json({ error: 'Failed to fetch entries', details: errorMessage }, { status: 500 });
	}
}

// Get entries for a specific username
export async function POST(event: RequestEvent) {
	const { request, url } = event;
	const { username } = await request.json();
	
	if (!username) {
		return json({ error: 'Username is required' }, { status: 400 });
	}
	
	try {
		// Use the correct URL for local development vs. production
		const functionUrl = import.meta.env.DEV 
			? new URL('/.netlify/functions/google-spreadsheet-function', url.origin).href
			: `${url.origin}/.netlify/functions/google-spreadsheet-function`;
			
		console.log('Fetching entries for user:', username);
		
		// Get all entries first
		const response = await fetch(functionUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error('Response not OK:', response.status, errorText);
			throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
		}
		
		const allEntries = await response.json();
		// Filter the entries for the requested username
		const userEntries = allEntries.filter((entry: any) => entry.username === username);
		
		return json(userEntries);
	} catch (error) {
		console.error('Error fetching user entries:', error);
		// Safely handle error of unknown type
		const errorMessage = error instanceof Error ? error.message : String(error);
		return json({ error: 'Failed to fetch user entries', details: errorMessage }, { status: 500 });
	}
} 