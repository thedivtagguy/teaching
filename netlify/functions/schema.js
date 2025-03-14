// ES module version of schema configuration for Netlify functions

// Define the required columns
const requiredColumns = [
  'date',
  'username',
  'class_confidence',
  'sentence_summary',
  'keywords'
];

// Define the optional columns
const optionalColumns = [
  'sleep_hours',
  'skipped_meals_prev_day'
];

// Export the configuration using ES module syntax
export const spreadsheetConfig = {
  sheetTitle: 'DataViz Entries',
  requiredColumns,
  optionalColumns,
  allColumns: [...requiredColumns, ...optionalColumns]
};
  
// Utility function to format dates
export function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
} 