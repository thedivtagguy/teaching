import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
// Import the schema validation from our local ES module file
import { spreadsheetConfig, formatDate } from './schema.js';

/**
 * Netlify Function Handler
 * 
 * @param {Object} event - The request event 
 * @param {Object} context - The function context
 * @returns {Object} Response object
 */
export const handler = async function(event, context) {
	// Parse client IP for tracking
	const userIP = event.headers['x-nf-client-connection-ip'] || '127.0.0.1';
	
	// Setup Google Sheets authentication
	try {
		const serviceAccountAuth = new JWT({
			email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
			scopes: ['https://www.googleapis.com/auth/spreadsheets']
		});
		
		// Initialize the Google Spreadsheet
		const doc = new GoogleSpreadsheet(process.env.VITE_GOOGLE_SHEET_ID, serviceAccountAuth);
		await doc.loadInfo();
		
		// Get the specific sheet
		const sheetTitle = spreadsheetConfig.sheetTitle;
		const sheet = doc.sheetsByTitle[sheetTitle];

		if (!sheet) {
			return {
				statusCode: 404,
				body: JSON.stringify({ 
					error: `Sheet "${sheetTitle}" not found in the spreadsheet` 
				})
			};
		}

		// Ensure the sheet has the required columns
		await ensureHeaderRow(sheet);

		// Handle the request based on HTTP method
		const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '');
		const segments = path.split('/').filter((e) => e);

		switch (event.httpMethod) {
			case 'GET':
				return handleGet(sheet, segments);
				
			case 'POST':
				return handlePost(sheet, event.body);
				
			case 'PUT':
				return handlePut(sheet, segments, event.body, userIP);
				
			case 'DELETE':
				return handleDelete(sheet, segments);
				
			default:
				return {
					statusCode: 405,
					body: JSON.stringify({ error: 'Method not allowed' })
				};
		}
	} catch (err) {
		console.error('Error occurred in processing: ', err);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: err.message,
				details: err.stack
			})
		};
	}
};

/**
 * Handle GET requests
 */
async function handleGet(sheet, segments) {
	if (segments.length === 0) {
		// Get all rows
		const rows = await sheet.getRows();
		const serializedRows = rows.map(serializeRow);
		return {
			statusCode: 200,
			body: JSON.stringify(serializedRows)
		};
	} else if (segments.length === 1) {
		// Get a specific row by ID
		const rowId = parseInt(segments[0]);
		const rows = await sheet.getRows();
		if (rowId >= 0 && rowId < rows.length) {
			const serializedRow = serializeRow(rows[rowId]);
			return {
				statusCode: 200,
				body: JSON.stringify(serializedRow)
			};
		} else {
			return {
				statusCode: 404,
				body: JSON.stringify({ error: 'Row not found' })
			};
		}
	} else {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Invalid GET request' })
		};
	}
}

/**
 * Handle POST requests to add new data
 */
async function handlePost(sheet, body) {
	const data = JSON.parse(body);
	
	// Build the new row with required fields
	const newRow = {
		id: Date.now().toString(),
		date: data.date || formatDate(new Date()),
		username: data.username,
		class_confidence: data.class_confidence,
		sentence_summary: data.sentence_summary,
		keywords: data.keywords
	};
	
	// Add optional fields if present
	if (data.sleep_hours !== undefined) {
		newRow.sleep_hours = data.sleep_hours;
	}
	
	if (data.skipped_meals_prev_day !== undefined) {
		newRow.skipped_meals_prev_day = data.skipped_meals_prev_day;
	}
	
	const addedRow = await sheet.addRow(newRow);
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: `POST Success - added row ${addedRow.rowIndex - 1}`,
			rowNumber: addedRow.rowIndex - 1
		})
	};
}

/**
 * Handle PUT requests to update existing data
 */
async function handlePut(sheet, segments, body, userIP) {
	if (segments.length !== 1) {
		return {
			statusCode: 422,
			body: JSON.stringify({ error: 'PUT request must have an id' })
		};
	}
	
	const rowId = parseInt(segments[0]);
	const rows = await sheet.getRows();
	
	if (rowId >= 0 && rowId < rows.length) {
		const data = JSON.parse(body);
		data.UserIP = userIP; // Track who modified
		
		const selectedRow = rows[rowId];
		Object.entries(data).forEach(([k, v]) => {
			selectedRow[k] = v;
		});
		
		await selectedRow.save();
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'PUT is a success!' })
		};
	} else {
		return {
			statusCode: 404,
			body: JSON.stringify({ error: 'Row not found' })
		};
	}
}

/**
 * Handle DELETE requests
 */
async function handleDelete(sheet, segments) {
	if (segments.length !== 1) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: 'Invalid DELETE request, must be /.netlify/functions/google-spreadsheet-function/{rowId}'
			})
		};
	}
	
	const deleteRowId = parseInt(segments[0]);
	const allRows = await sheet.getRows();
	
	if (deleteRowId >= 1 && deleteRowId < allRows.length) {
		// Protect the first row (headers)
		await allRows[deleteRowId].delete();
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'DELETE is a success!' })
		};
	} else if (deleteRowId === 0) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Cannot delete the header row' })
		};
	} else {
		return {
			statusCode: 404,
			body: JSON.stringify({ error: 'Row not found' })
		};
	}
}

/**
 * Helper function to serialize row data
 */
function serializeRow(row) {
	let temp = {};
	row._sheet.headerValues.forEach((header) => {
		temp[header] = row.get(header);
	});
	return temp;
}

/**
 * Helper function to ensure the header row exists
 */
async function ensureHeaderRow(sheet) {
	await sheet.loadHeaderRow();
	if (sheet.headerValues.length === 0 || 
        !spreadsheetConfig.requiredColumns.every(col => sheet.headerValues.includes(col))) {
		console.log('Header row is missing required columns. Initializing with schema columns.');
		// Make sure we include ID column as well
		const allColumns = ['id', ...spreadsheetConfig.allColumns];
		await sheet.setHeaderRow(allColumns);
	}
}