---
title: Day 3 - Seeing Like a Browser
date: 2026-07-22
description: The box model, flexbox, devtools, and the file-paths lab
published: false
section: Foundations
order: 3
seo_title: Seeing Like a Browser
seo_description: The box model, flexbox, browser devtools, and why file paths break
seo_keywords: web design, HTML, CSS, flexbox, box model, devtools, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-15T12:00
slug: day-3-seeing-like-a-browser
slides: https://teaching.aman.bh/slides/web2026/day-3-seeing-like-a-browser
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/3
---
## Day 3: Seeing Like a Browser

Today is about training our eyes to see web pages the way the browser does: boxes, inside boxes, inside boxes.

**Warm-up (10 min):** _Box-spotting._ You'll get a printed screenshot of a website you like (bring one, or pick from my stack). Draw the boxes in pen around every heading, every image, every column. Then the reveal: this drawing *is* the layout code you'll write, and if you can box it, you can build it.

**Today's agenda:**

- **The box model.** Every element is a box with content, padding, border, and margin. Once you see it, you can't unsee it, and the devtools inspector will show you the actual boxes on any live site.
- **Flexbox** for one-dimensional layouts (rows or columns). We'll practice with **Flexbox Froggy**; get as far as you can, revisiting it later is normal and encouraged.
- **Devtools as x-ray specs.** We'll open real websites, inspect them, tweak their values live, and break them for fun. Deconstructing other people's pages is detective work and it's how working developers learn from each other.

**The file-paths lab (don't skip this).** File paths will happily eat more of your hours than any CSS concept if you let them, so we're going to break things *on purpose*:

- Rename `photo.jpg` to `Photo.JPG` and watch your image vanish on Netlify, but maybe not on your laptop. (Why? Case sensitivity. Your Mac forgives; the server does not.)
- Move an image into a folder and learn what `images/photo.jpg`, `./photo.jpg`, and `/photo.jpg` each actually mean.
- Read a 404 in the Network tab and trace exactly *what* the browser asked for vs. what exists.

Twenty minutes of deliberate breakage now buys you back whole evenings later, I promise.

**The stuck protocol.** Today we also put up the poster that governs the rest of the course. When something breaks:

1. **Read the error out loud.** Actually out loud.
2. **Rubber duck it**: explain what should happen to a duck, a neighbor, or a water bottle.
3. **Check the docs** (MDN first).
4. **Ask a neighbor.**
5. **Ask me or an LLM**, with the actual error, the actual code, and what you expected vs. got. (See the [AI policy](/web2026/ai-policy) for how to ask well.)

**First solo sprint (10 min).** After we build a small flexbox layout together, you'll build its sibling alone: same skills, different content, timer on. This is the first of many: every code-along in this course ends with a "now you" round, and the solo rounds get longer each week, so the life jacket comes off gradually.

Homework: three small flexbox katas, details on the [assignments page](/web2026/assignments). Time-boxed at 60 minutes total.

### Misc.

- [CSS Zen Garden](https://csszengarden.com) - Useful for seeing how people use images, positioning, colors and text styles to style plain ol' markup.

### Flexbox Learning

- [Flexbox Froggy](https://flexboxfroggy.com)
- [Interactive Flexbox Screencasts](https://scrimba.com/learn-flexbox-c0k)
- [A Complete Guide to Flexbox (CSS-Tricks)](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
