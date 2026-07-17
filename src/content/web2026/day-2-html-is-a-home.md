---
title: Day 2 - HTML Is a Home
date: 2026-07-21
description: Semantic HTML through houses and newspapers, CSS selectors, your first (ugly) deploy
published: false
section: Foundations
order: 2
seo_title: HTML Is a Home
seo_description: Semantic HTML through houses and newspapers, CSS selectors, and deploying your first website
seo_keywords: web design, HTML, CSS, semantic HTML, web development course, portfolio website
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-15T12:00
slug: day-2-html-is-a-home
slides: https://teaching.aman.bh/slides/web2026/day-2-html-is-a-home
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/2
readings:
  - title: Scroll, Skim, Stare
    author: Orit Gat
    url: https://web.archive.org/web/20250215172659/https://www.thewhitereview.org/feature/scroll-skim-stare/
    readingTime: 20
  - title: Taking an internet walk
    author: Spencer Chang & Kristoffer Tjalve
    url: https://syllabusproject.org/syllabus-for-taking-an-internet-walk/
    readingTime: 20
assignments: true
---
## Day 2: HTML Is a Home

Today we learn how to actually build websites, and we do it with metaphors you can hold.

**Warm-up (10 min):** _Markup the room._ You'll get sticky notes with HTML tags on them (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<h1>`, `<p>`, `<img>`). In pairs, stick them on things in this room, or on each other. Where's the `<header>` of a person? What's the `<aside>` of this classroom? Silly on purpose; you will never forget these tags again.

**The two metaphors we'll live in today:**

- **HTML is a home.** The `<header>` is the porch and nameplate. The `<nav>` is the hallway signage. `<main>` is the living room where the actual living happens. An `<aside>` is the shelf of curiosities by the wall. The `<footer>` is the basement: important stuff lives there, nobody visits it first. A `<div>`? That's just a cardboard box: fine for storage, but if your whole house is cardboard boxes, guests get confused.
- **HTML is a newspaper.** We'll take real printed newspapers and label them in pen: masthead, headline, byline, lede, pull-quote, caption. Then we'll map every one of those labels to a tag. Newspapers solved information hierarchy a century before the web; we're inheriting, not inventing.

**Then, the mechanics:**

- HTML is a markup language that organizes content for browsers. Every webpage is an HTML document with nested elements. Essential tags: headings (`<h1>`), paragraphs (`<p>`), links (`<a>`), images (`<img>`), containers (`<div>`), lists (`<ul>`, `<li>`), and inline elements (`<span>`).
- CSS targets HTML elements and changes how they look. We'll learn selectors, which is how you grab specific elements to style them. IDs are unique identifiers for single elements, classes are reusable names for groups. This is how you connect design to structure.
- **CSS Diner** to practice selectors. Fair warning: it's addictive.

**Git minute #1 (and every day hereafter):** At the end of class we'll each make our first *commit* (a saved checkpoint of our work) using GitHub Desktop, and push it to GitHub. Think of it as a save-game slot. We will do this at the end of every single class until it feels boring, which is exactly the point.

**And then: the ugly site.** We begin **Hey Jude**, where your mission is to make the ugliest website you possibly can. Clashing colors, cursed fonts, marquee-level chaos. This is a judgment-free zone with exactly one rule: you have to *find out how* to commit each crime yourself (searching and asking is the skill we're actually training). We'll deploy these monstrosities to Netlify so they're live on the real internet by tonight. Your first deployed website will be hideous, and that's exactly right; everything you make after this will be better.

Details on the [assignments page](/web2026/assignments). Due at the **start of Day 4**, so you have two evenings, time-boxed at 90 minutes each.

## Today's Links

- [CSS Diner](https://flukeout.github.io/) - CSS selector practice game
- [CSS Properties List](https://github.com/open-making/web2026-hey-jude/blob/main/css-properties.md) - Reference for styling experiments
- [MDN HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference) - Complete HTML documentation
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) - Complete CSS documentation
- [HTML & CSS Basics videos](https://www.youtube.com/@laurelschwulst) - Laurel Schwulst's gentle introductions
- [GitHub Desktop docs](https://docs.github.com/en/desktop) - The save-game button, explained
