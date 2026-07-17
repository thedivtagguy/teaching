<%*
// Prompt for all values once
const title = await tp.system.prompt("Title");
const description = await tp.system.prompt("Description");
const section = await tp.system.prompt("Section");

// Generate slug from title
const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

// Rename file to slug
await tp.file.rename(slug);
%>---
title: "<% title %>"
date: <% tp.date.now("YYYY-MM-DD") %>
description: "<% description %>"
published: true
section: <% section %>
order: 2
seo_title: <% title %>
seo_description: <% description %>
seo_keywords: web design, HTML, CSS, Astro, responsive design, web development course, portfolio website
seo_type: article
seo_author: Aman Bhargava
updated: <% tp.date.now("YYYY-MM-DDTHH:mm") %>
show_metadata_card: false
slides:
slug: <% slug %>
---

# <% title %>

**Warm-up (10 min):** _Name of icebreaker._ <% tp.file.cursor() %>

## Today's agenda

-

## Now you (solo sprint)

After the code-along:  minutes, timer on, stuck protocol applies.

## Git minute

Commit and push before you leave.

## Today's Links

-
