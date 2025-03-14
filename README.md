# DataViz Course Spreadsheet Integration

A config-based schema system for managing data submissions to a Google Spreadsheet. This system provides a single source of truth for the data structure and ensures consistency across all operations.

## Features

- **Zod Schema Validation**: Type-safe validation for both client and server
- **Single Source of Truth**: Schema configuration in one place
- **Flexible Column Structure**: Required and optional columns defined in the schema
- **API Endpoints**: Submit data and retrieve entries (all or filtered by username)
- **Form Component**: Ready-to-use Svelte component with validation

## Schema Structure

The schema defines the following required columns:

- `date`: Date in DD/MM/YY format
- `username`: User identifier
- `class_confidence`: Numeric confidence level
- `sentence_summary`: String summary
- `keywords`: Comma-separated string of keywords

And optional columns:

- `sleep_hours`: Numeric sleep duration
- `skipped_meals_prev_day`: Comma-separated string of skipped meals

## Technical Implementation

### Schema Definition

The schema is defined in `src/lib/schema.ts` using Zod for type-safe validation.

### API Endpoints

- `POST /api/submit`: Submit a new entry
- `GET /api/entries`: Get all entries
- `POST /api/entries`: Get entries filtered by username

### Netlify Function

The `google-spreadsheet.js` Netlify function handles CRUD operations on the Google Spreadsheet.

## Installation

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build
```

## Environment Variables

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email for Google Sheets API
- `GOOGLE_PRIVATE_KEY`: Private key for the service account
- `VITE_GOOGLE_SHEET_ID`: ID of the Google Spreadsheet

## Usage

1. Import the form component:
   ```svelte
   <script>
     import EntryForm from '$lib/components/EntryForm.svelte';
   </script>
   
   <EntryForm />
   ```

2. Use the API to submit or retrieve data programmatically:
   ```typescript
   // Submit data
   const response = await fetch('/api/submit', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data)
   });
   
   // Get all entries
   const entries = await fetch('/api/entries').then(res => res.json());
   
   // Get entries for a specific user
   const userEntries = await fetch('/api/entries', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ username: 'johndoe' })
   }).then(res => res.json());
   ```
