---
title: Day 5 - The Make Day
date: 2026-07-24
description: A full studio day building your letter page in vanilla HTML and CSS
published: false
section: Foundations
order: 5
seo_title: The Make Day
seo_description: Building the Letters to a Young Designer page in vanilla HTML and CSS, methodically
seo_keywords: web design, HTML, CSS, typography, flexbox, portfolio project, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-21T22:47
slug: day-5-the-make-day
slides: https://teaching.aman.bh/slides/web2026/day-5-the-make-day
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/5
assignments: true
---
## Day 5: The Make Day

No new concepts today. That's the point. Everything this page needs, you already have: HTML structure, the box model, flexbox, the four typography rules, and the image survival kit. Today we put it all together and build something you're actually proud of.

You walked in with a letter, a sketch, and a folder of assets (that was the deal yesterday). Today you turn them into a webpage.

**The one rule of today: build in the right order.** Beginners try to do everything at once and drown. We go one layer at a time, and we check in at each layer.

### The build order (and the checkpoints)

| Time | Layer | Checkpoint |
|---|---|---|
| Morning | Blocks on paper → HTML | Show a neighbor your *naked, unstyled* HTML. Does it read top to bottom? |
| Late morning | Typography | The squint test: can you feel the hierarchy from across the room? |
| Early afternoon | Layout (flexbox) | Does it hold together on a narrow window? |
| Mid afternoon | The flourish | *One* Jen Simmons technique. One. |
| Late afternoon | Ship + show-and-tell | It's live on Netlify, and you can talk about it. |

1. **Identify your building blocks.** A letter is almost pre-structured: a heading, paragraphs, the odd emphasized line, a signature, a `<blockquote>` maybe. Name them before you type them.
2. **HTML first. Always.** Write the whole letter as plain, unstyled HTML and get it reading correctly top to bottom *before you write a line of CSS*. If the naked HTML doesn't make sense, no styling will save it.
3. **Typography pass.** Now, yesterday's four rules in order: load your fonts, set your measure (`max-width: 65ch`), set line-height, apply your 3-4 size scale. Squint at it.
4. **Layout pass.** Flexbox only, and honestly mostly margins: a generous margin column, a centered text column, maybe a header row. Your letter needs *less* layout than you think. (No grid; grid arrives later, and your letter doesn't need it.)
5. **The flourish.** One showpiece: a dropcap, a pull quote, text wrapping a shape. Set a timer. One is elegant; three is a mess.

### When you get stuck (you will)

The **15-minute rule**: if one problem has eaten fifteen minutes, stop grinding. Screenshot it, try a different approach, ask a neighbor, or park it and move to another section. Don't let one bug freeze the whole page. And run the [stuck protocol](/web2026/day-3-seeing-like-a-browser): read the error out loud, rubber-duck it, check MDN, ask.

**Search prompts** to keep moving: `CSS font family`, `CSS line height`, `CSS max width center`, `CSS drop cap first letter`, `CSS blockquote styling`, `CSS letter spacing uppercase`.

**Images checklist** (yesterday's kit, deployed): lowercase filenames, compressed under 500KB, real alt text, `max-width: 100%` so nothing blows out.

### Show-and-tell (last 30 minutes)

We go around. Each of you shows your page and says: one thing you searched for, one property you discovered, one thing you'd still improve. Kind, specific, useful.

**Ship it before you leave.** Commit, push, deploy to Netlify. An unfinished page that's live beats a perfect one stuck on localhost. Homework: finish your first full pass; it's due at the start of Day 6, when your letter moves into Astro.

Tomorrow is a Saturday and a big one: the terminal, and Astro. Sleep well.
