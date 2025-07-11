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
seo_keywords: web design, HTML, CSS, responsive design, web development course, portfolio website
seo_type: article
seo_author: Aman Bhargava
updated: <% tp.date.now("YYYY-MM-DDTHH:mm") %>
slug: <% slug %>
---

# <% title %>

<% tp.file.cursor() %>
