# Course Metadata System

This document explains how course metadata is centrally managed and used throughout the application.

## Overview

Instead of repeating common course information in every content file, we use a centralized `meta.yaml` file in each course directory to store shared metadata. This reduces duplication and makes it easier to maintain consistent information.

## How It Works

1. Each course directory contains a `meta.yaml` file with common course metadata
2. Individual content files (`.svx`) only contain page-specific metadata
3. The menu generator and other components read from the central metadata file
4. Components can access course metadata through utility functions

## File Structure

```
src/content/
├── cdv2025/
│   ├── meta.yaml      # <-- Centralized course metadata
│   ├── syllabus.svx   # <-- Only contains page-specific metadata
│   └── day1.svx       # <-- Only contains page-specific metadata
└── otherCourse/
    ├── meta.yaml
    └── ...
```

## Metadata File Format

The `meta.yaml` file contains common course information that would otherwise be duplicated:

```yaml
# Course Metadata for cdv2025
title: "Introduction to Computer Science"
code: "cdv2025"
term: "Fall 2023"
description: "This course provides a broad introduction to computer science and programming."
instructor:
  name: "Dr. Jane Smith"
  email: "jsmith@university.edu"
  office: "Science Building, Room 301"
  hours: "Monday 2-4pm, Wednesday 1-3pm, or by appointment"
navigation:
  sections:
    - title: "Course Info"
      order: 1
    - title: "Module 1: Fundamentals" 
      order: 2
    # ... more sections
```

## Content File Format

Content files (`.svx`) now only need page-specific information:

```yaml
---
title: "Day 1: Introduction to Computer Science"
date: "2023-09-05"
description: "First day overview"
published: true
section: "Module 1: Fundamentals"
order: 1
---

# Content starts here...
```

## Accessing Metadata in Components

Use the utility functions in `src/lib/utils/courseMetadata.ts`:

```javascript
import { getCourseMetadata, getAllCourses } from '$lib/utils/courseMetadata';

// Get metadata for a specific course
const metadata = getCourseMetadata('cdv2025');
console.log(metadata.title); // "Introduction to Computer Science"

// Get all courses with metadata
const allCourses = getAllCourses();
```

## Menu Generation

The menu generator automatically uses metadata from `meta.yaml` for:

1. Course title
2. Section organization and ordering
3. Other navigation-related properties

## Benefits

- **Reduced Duplication**: Common information is stored in one place
- **Easier Maintenance**: Update course info in a single file
- **Consistency**: Ensures consistent metadata across course pages
- **Flexibility**: Add course-wide settings without changing individual files 