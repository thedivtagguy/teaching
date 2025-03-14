import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
// Import the schema validation from our local ES module file
import { spreadsheetConfig, formatDate } from './schema.js';

// We don't need the formatDate function since we import it from schema.js
// function formatDate(date) {
// 	const d = new Date(date);
// 	const day = String(d.getDate()).padStart(2, '0');
// 	const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
// 	const year = String(d.getFullYear()).slice(-2);
// 	return `${day}/${month}/${year}`;
// }

// This is the correct format for Netlify Functions with ES modules
export const handler = async function(event, context) {
	const UserIP = event.headers['x-nf-client-connection-ip'] || '6.9.6.9';

	const serviceAccountAuth = new JWT({
		email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
		scopes: ['https://www.googleapis.com/auth/spreadsheets']
	});
	const doc = new GoogleSpreadsheet(process.env.VITE_GOOGLE_SHEET_ID, serviceAccountAuth);

	await doc.loadInfo();
	const sheetTitle = spreadsheetConfig.sheetTitle; // Use the sheet title from our config
	const sheet = doc.sheetsByTitle[sheetTitle];

	if (!sheet) {
		throw new Error(`Sheet "${sheetTitle}" not found in the spreadsheet`);
	}

	// Check if header row exists and initialize if not
	await ensureHeaderRow(sheet);

	const path = event.path.replace(/\.netlify\/functions\/[^/]+/, '');
	const segments = path.split('/').filter((e) => e);

	try {
		switch (event.httpMethod) {
			case 'GET':
				if (segments.length === 0) {
					const rows = await sheet.getRows();
					console.log(`Fetched ${rows.length} rows from sheet`);
					
					// Debug: Log the first row if it exists
					if (rows.length > 0) {
						console.log('First row structure:', Object.keys(rows[0]));
						console.log('Row data sample:', JSON.stringify(rows[0].toObject()));
					}
					
					// Use the toObject() method instead of our custom serializer
					const serializedRows = rows.map(row => row.toObject());
					return {
						statusCode: 200,
						body: JSON.stringify(serializedRows)
					};
				}
				if (segments.length === 1) {
					const rowId = parseInt(segments[0]);
					const rows = await sheet.getRows();
					if (rowId >= 0 && rowId < rows.length) {
						const srow = rows[rowId].toObject();
						return {
							statusCode: 200,
							body: JSON.stringify(srow)
						};
					} else {
						return {
							statusCode: 404,
							body: JSON.stringify({ error: 'Row not found' })
						};
					}
				}
				throw new Error('Invalid GET request');

			case 'POST':
				const data = JSON.parse(event.body);
				
				// Include all required fields from our schema
				const newRow = {
					id: Date.now().toString(), // Generate a unique ID
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

			case 'PUT':
				if (segments.length !== 1) {
					return {
						statusCode: 422,
						body: JSON.stringify({ error: 'PUT request must have an id' })
					};
				}
				const rowId = parseInt(segments[0]);
				const rows = await sheet.getRows();
				if (rowId >= 0 && rowId < rows.length) {
					const data = JSON.parse(event.body);
					data.UserIP = UserIP;
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

			case 'DELETE':
				if (segments.length !== 1) {
					return {
						statusCode: 400,
						body: JSON.stringify({
							error:
								'Invalid DELETE request, must be /.netlify/functions/google-spreadsheet/{rowId}'
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

			default:
				return {
					statusCode: 405,
					body: JSON.stringify({ error: 'Method not allowed' })
				};
		}
	} catch (err) {
		console.error('Error occurred in processing ', event);
		console.error('Error details:', err);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: err.message,
				details: err.stack
			})
		};
	}
};

// Helper function to serialize row data
function serializeRow(row) {
	let temp = {};
	// Make this more defensive against undefined properties
	if (row && row._sheet && row._sheet.headerValues) {
		row._sheet.headerValues.forEach((header) => {
			temp[header] = row.get(header);
		});
	} else {
		// Fallback for when the sheet structure is unexpected
		// Extract data directly from the row's properties
		Object.keys(row).forEach(key => {
			// Skip internal properties that start with underscore
			if (!key.startsWith('_') && typeof row[key] !== 'function') {
				temp[key] = row[key];
			}
		});
	}
	return temp;
}

// Helper function to ensure the header row exists
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