---
title: Day 8 - Thinking in Components
date: 2026-07-28
description: Astro anatomy (props, slots, layouts) plus your second page and continuous deployment
published: false
section: Building with Astro
order: 3
seo_title: Thinking in Components
seo_description: Astro components, props, slots and layouts, multi-page routing, continuous deployment
seo_keywords: Astro, components, props, slots, layouts, continuous deployment, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-21T15:44
slug: day-8-thinking-in-components
slides: https://teaching.aman.bh/slides/web2026/day-8-thinking-in-components
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/8
assignments: true
readings:
  - title: Revolutionize Your Page
    author: Jen Simmons
    url: https://www.youtube.com/watch?v=aYgMExb-mlo
    readingTime: 60
---
## Day 8: Thinking in Components

Your letter lives in Astro now, but you're still writing it like one big HTML file. Today we learn why frameworks exist at all: **so you never have to copy-paste the same header twice.**

**Warm-up (10 min):** _Spot the repeat._ A well-known site goes on the projector. Find everything that's secretly the same thing wearing different content: every card, every list row, every button. Count them. That repeated thing is a *component*, and the site's designers built it once; today, so will you.

### The anatomy of a `.astro` file

```astro
---
// This top part (between the fences) is JavaScript.
// It runs ONCE, when the site is built, never in your visitor's browser.
const { title } = Astro.props;
---
<!-- This bottom part is HTML you already know. -->
<h2>{title}</h2>
```

Two rooms, one file: code fence up top for logic, template below for markup. We'll go through this **slowly**, including that `const { title } = Astro.props;` line, which is doing something called *destructuring* (unpacking a value from a box; nothing magical, just compact syntax).

- **Props**: how a page passes information into a component. `<Card title="Hello" />` sends "Hello" in; the component catches it.
- **Slots**: the hole your content pours into. A layout is a picture frame; `<slot />` marks where the picture goes.
- **Layouts**: components that wrap whole pages. Write your `<head>`, nav, and footer once; every page pours itself into the frame.

### Code-along, then solo

Together we'll build a `LetterLayout` for your Letters site, and one small component (a `PullQuote` for that line in your letter that deserves architecture). Then the **solo sprint (20 min)**: build a sibling component (a `Byline` showing the letter-writer's name and year) on your own, timer running, stuck protocol in force.

### Your second page

Your reply letter (written yesterday) becomes `src/pages/reply.astro`. File = URL, remember? Add a simple `<nav>` in the layout linking the two pages, and you have officially built a **multi-page website**, the thing that separates a page from a *place*.

### Continuous deployment 🚀

To close: we connect your GitHub repo to Netlify. From tonight on, **pushing your commits automatically rebuilds your live site**. You've done the commit ritual daily for a week; now every ritual ends with your actual website updating on the actual internet. This is the workflow you'll keep for years.

Homework: finish and ship both pages of your Letters site; the anthology assembles tomorrow morning. Brief on the [assignments page](/web2026/assignments). Time-box: 90 minutes; the design bar is "would the letter-writer forgive the medium," not "perfect."

## Today's Links

- [Starter README, steps 4 and 5](https://github.com/open-making/your-first-astro-site#step-4--your-first-component) - today's material in tutorial form
- [Astro docs: Components](https://docs.astro.build/en/basics/astro-components/)
- [Astro docs: Layouts](https://docs.astro.build/en/basics/layouts/)
- [Netlify: continuous deployment from Git](https://docs.netlify.com/site-deploys/create-deploys/)
