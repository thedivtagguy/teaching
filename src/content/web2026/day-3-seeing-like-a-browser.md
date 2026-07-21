---
title: Day 3 - Seeing Like a Browser
date: 2026-07-22
description: Seeing pages as tags, the box model, devtools detective work, and a flexbox exercise repo
published: false
section: Foundations
order: 3
seo_title: Seeing Like a Browser
seo_description: Reading pages as HTML and CSS, the box model, browser devtools, and flexbox
seo_keywords: web design, HTML, CSS, flexbox, box model, devtools, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-21T15:42
slug: day-3-seeing-like-a-browser
slides: https://teaching.aman.bh/slides/web2026/day-3-seeing-like-a-browser
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/3
---
## Day 3: Seeing Like a Browser

Today is about training our eyes to see web pages the way the browser does: as tags, and as boxes inside boxes inside boxes. Then we learn the one layout tool that quietly runs half the web: flexbox.

**Warm-up (10 min):** _Box-spotting._ You'll get a printed screenshot of a website you like (bring one, or pick from my stack). Draw the boxes in pen around every heading, every image, every column. Then the reveal: this drawing *is* the layout code you'll write, and if you can box it, you can build it.

**Today's agenda:**

- **Seeing pages as tags.** We'll look at real screenshots and spot the paragraphs, headings, images, colors, and spacing hiding in plain sight. Then we practice the skill that actually carries you through this course: turning "I want that effect" into a *good search*. A good search is specific keywords plus knowing exactly what you want ("CSS space below heading", not "make it look nicer").
- **The box model.** Every element is a box with content, padding, border, and margin. Once you see it, you can't unsee it, and the devtools inspector will show you the actual boxes on any live site.
- **Devtools as x-ray specs.** We'll open real websites (including your own Bohemian Rhapsody monstrosities), inspect them, tweak their values live, and break them for fun. Deconstructing other people's pages is detective work, and it's how working developers learn from each other. You'll spend 15 minutes *sniffing*: pick a site, inspect something you like, and write down what tags and properties make it work.
- **Flexbox** for one-dimensional layouts (rows or columns). This is the answer to "how do things sit side by side?" We'll cover the whole family — `flex-direction`, `justify-content`, `align-items`, `gap` — warm up with **Flexbox Froggy** (get to about level 13; revisiting it later is normal and encouraged), and then do the real work in an exercise repo.

**The flexbox gym.** The centerpiece of today is [**open-making/web2026-space-oddity**](https://github.com/open-making/web2026-space-oddity), a repo you'll fork and clone with GitHub Desktop — the same dance as Bohemian Rhapsody. It's one repo, seven small design jobs, escalating from *fix the bug* to *build the whole thing from a picture*:

- Fix broken CSS until a layout snaps together
- Write the CSS for a layout whose HTML is already built (including the legendary "center a div")
- Write the HTML for a layout whose CSS is already written
- Build a whole thing from just a screenshot

Each exercise has its own README and a goal image. We do the first four in class; the rest are homework. File paths get their own lab tomorrow morning, right before images need them.

**The stuck protocol.** Today we also put up the poster that governs the rest of the course. When something breaks:

1. **Read the error out loud.** Actually out loud.
2. **Rubber duck it**: explain what should happen to a duck, a neighbor, or a water bottle.
3. **Check the docs** (MDN first).
4. **Ask a neighbor.**
5. **Ask me or an LLM**, with the actual error, the actual code, and what you expected vs. got. (See the [AI policy](/web2026/ai-policy) for how to ask well.)

**Solo, gradually.** The exercise repo is built to take the training wheels off one at a time: the early exercises hand you almost everything, the later ones hand you almost nothing. That "now you" ramp is the shape of every code-along in this course, and the solo stretches get longer each week.

Homework: finish the back half of the flexbox repo — exercises 05 (mixtape shelf), 06 (boarding pass), and 07 (the three katas). Details on the [assignments page](/web2026/assignments). Time-boxed at 75 minutes total.

### Misc.

- [CSS Zen Garden](https://csszengarden.com) - Useful for seeing how people use images, positioning, colors and text styles to style plain ol' markup.

### Flexbox Learning

- [Flexbox Froggy](https://flexboxfroggy.com)
- [Interactive Flexbox Screencasts](https://scrimba.com/learn-flexbox-c0k)
- [A Complete Guide to Flexbox (CSS-Tricks)](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
