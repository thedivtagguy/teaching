# Aman's Resource Platform

A content-driven course platform built with SvelteKit. Manage content using Markdown files with frontmatter metadata.


## Project Structure

- **`src/content/[courseId]/`**: Course content files (.svx)
  - `meta.yaml`: Course metadata
  - `*.svx`: Individual content pages
  - `assignments/*.svx`: Assignment pages

- **`src/lib/utils/contentService.ts`**: Content management
- **`src/lib/utils/contentSchema.ts`**: Type definitions
- **`src/routes/`**: SvelteKit routes

## Content Organization

### Course Structure

Each course has its own directory under `src/content/[courseId]/`. The structure is as follows:

```
src/content/
  └── courseId/
      ├── meta.yaml           # Course metadata
      ├── outline.svx        # Course syllabus
      ├── day-1.svx           # Content pages
      ├── day-2.svx
      ├── ...
      └── assignments/        # Course assignments
          ├── assignment1.svx
          └── assignment2.svx
```

### Content Files

Content files use Markdown with frontmatter metadata:

```md
---
title: "Lecture Title"
date: "2023-09-05"
description: "Brief description"
published: true
section: "Section Name"
order: 1
readings:
  - title: "Reading Title"
    author: "Author Name"
    pages: "1-20"
    url: "https://example.com"
assignments:
  - title: "Assignment Title"
    due: "2023-09-12"
    description: "Assignment description"
---

# Content goes here

Regular Markdown content...
```

### File Naming Conventions

You can use numeric prefixes in filenames to control ordering:

- `01-introduction.svx`
- `02-basics.svx`

The numeric prefix will be used for ordering in the navigation menu.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Adding Content

1. Create a directory for your course under `src/content/`
2. Add a `meta.yaml` file with course metadata
3. Add content files (.svx) with appropriate frontmatter
4. The site structure will automatically update

## Customization

- Edit `src/lib/components/` for UI components
- Modify `src/lib/utils/contentService.ts` for content processing logic
- Update schemas in `src/lib/utils/contentSchema.ts` for new metadata fields