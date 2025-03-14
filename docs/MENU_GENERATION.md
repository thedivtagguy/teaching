# Automatic Menu Generation

This document explains how the course navigation menu is automatically generated from content files.

## Overview

Instead of manually maintaining the menu structure in `src/config/menu.yaml`, the system now automatically generates this file by scanning the content files and extracting metadata from their frontmatter.

## How It Works

1. When the application starts, it scans the `src/content` directory for course folders
2. For each course folder, it reads all `.svx` files and extracts their frontmatter metadata
3. It organizes content files into sections based on the `section` field in the frontmatter
4. It generates the menu structure and makes it available to the application

## Required Frontmatter Fields

Add these fields to your `.svx` content files:

```yaml
---
title: "Page Title"               # Required: Title displayed in the menu
published: true                   # Optional: If false, item won't appear in menu (default: true)
section: "Module 1: Fundamentals" # Optional: Section to group this content under (default: "General") 
order: 1                          # Optional: Order within the section (default: 0)
courseTitle: "Course Name"        # Optional: Title for the course (best in syllabus)
---
```

## Example

Here's an example of a content file with proper frontmatter:

```yaml
---
title: "Day 1: Introduction to Computer Science"
date: "2023-09-05"
description: "First day of class covering course overview and introduction to programming concepts."
courseTitle: "Introduction to Computer Science" 
published: true
section: "Module 1: Fundamentals"
order: 1
---

# Content starts here...
```

## Manual Generation

You can manually generate the menu file by running:

```bash
node scripts/generate-menu.js
```

This will create/update the `src/config/menu.yaml` file.

## Implementation Details

- The menu generation code is in `src/lib/utils/menuGenerator.ts`
- The application tries to dynamically generate the menu on startup
- If generation fails, it falls back to reading the static `menu.yaml` file
- For debugging, it writes the generated menu to `menu.generated.yaml` 