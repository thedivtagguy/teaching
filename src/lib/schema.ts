import { z } from 'zod';

// Define the required schema fields
const requiredFields = {
  date: z.string(),
  username: z.string(),
  class_confidence: z.coerce.number(),
  sentence_summary: z.string(),
  keywords: z.string() // comma-separated string
};

// Define the optional schema fields
const optionalFields = {
  sleep_hours: z.coerce.number().optional(),
  skipped_meals_prev_day: z.string().optional() // comma-separated string
};

// Combine to create the full schema
export const spreadsheetSchema = z.object({
  ...requiredFields,
  ...optionalFields
});

// Type based on the schema
export type SpreadsheetEntry = z.infer<typeof spreadsheetSchema>;

// Define the sheet configuration
export const spreadsheetConfig = {
  sheetTitle: 'DataViz Entries',
  requiredColumns: Object.keys(requiredFields),
  optionalColumns: Object.keys(optionalFields),
  allColumns: [...Object.keys(requiredFields), ...Object.keys(optionalFields)]
};

// Helper to validate incoming data against schema
export function validateSpreadsheetEntry(data: unknown): SpreadsheetEntry {
  return spreadsheetSchema.parse(data);
}

// Helper to partially validate data (for updates)
export const partialSpreadsheetSchema = spreadsheetSchema.partial();
export function validatePartialEntry(data: unknown) {
  return partialSpreadsheetSchema.parse(data);
}

// Format a date object to DD/MM/YY
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
} 