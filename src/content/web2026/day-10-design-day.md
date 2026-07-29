---
title: Day 10 - Design Day
date: 2026-07-31
description: Hierarchy, wireframes with your real words, design tokens, and your site goes live
published: false
section: Building with Astro
order: 5
seo_title: Day 10 - Design Day
seo_description: Visual hierarchy, content-first wireframing in Figma, design tokens as CSS variables, and a first deploy to Netlify
seo_keywords: visual hierarchy, wireframes, Figma, design tokens, CSS variables, Netlify, web design
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-28T23:00
slug: day-10-design-day
slides: https://teaching.aman.bh/slides/web2026/day-10-design-day
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/12
assignments: true
readings:
  - title: Achieving Visual Hierarchy
    author: Hack Design
    url: https://www.hackdesign.org/lessons/19-achieving-visual-hierarchy/
    readingTime: 25
  - title: Web Design Balance
    author: Steven Bradley
    url: https://vanseodesign.com/web-design/web-design-balance/
    readingTime: 20
  - title: "Visual Hierarchy: Making User Experiences Easier to Understand"
    author: UXmatters
    url: https://www.uxmatters.com/mt/archives/2024/02/visual-hierarchy-making-user-experiences-easier-to-understand.php
    readingTime: 15
---
# Day 10: Design Day

Last teaching day. You have a site map, a skeleton, and a content inventory full of real words. Today you decide what the site looks like, and by the end of the afternoon it is **live on the internet**, design finished or not. That is on purpose: blank pages are scary, and a live URL asks to be filled.

**Warm-up:** _the squint test._ Blurred screenshots of famous pages go on the projector. All the detail is gone, so what survives? Whatever you can still see while squinting *is* the hierarchy, and if nothing survives the blur, the page never had one.

## Morning: hierarchy, then wireframes

Hierarchy is a budget: if everything is important, nothing is. For each page, decide the one thing a visitor should see first, and give it the space that says so.

Then **content-first wireframing** in Figma. The rule of the morning: real words only, from your inventory. Lorem ipsum is how layouts lie to you; a layout that only works with fake text does not work. Wireframes stay mid-fidelity: real text hierarchy (big, medium, small), gray boxes for images, your actual nav labels. No colors and no fonts yet.

Sketch three arrangements of your homepage on paper first; the first idea is rarely the best one. Then run the squint test on your own sketches before you open Figma.

## Midday: design tokens

Before you build the design, you make the small set of decisions that will hold it together, once, so you stop remaking them all week.

- **2 to 4 colors total.** Text, background, one accent. ([Coolors](https://coolors.co) helps explore.)
- **At most two font families**, and three or four text sizes with clear hierarchy. ([Type Scale](https://typescale.com/) if stuck.)
- **Name them by purpose**, not appearance: `--color-ink`, `--color-paper`, `--color-accent`, `--text-large`. Never `--blue-2`; future-you does not know what `--blue-2` is for.

They live as CSS variables in your `:root`:

```css
:root {
  --color-ink: #1f2937;        /* main text */
  --color-paper: #fffdf8;      /* page background */
  --color-accent: #2563eb;     /* links, moments of joy */

  --font-body: 'Inter', sans-serif;
  --font-display: 'Georgia', serif;
  --text-normal: 1rem;
  --text-large: 1.5rem;
  --text-huge: 2.5rem;
}
```

Define once, `var(--color-accent)` everywhere, change your mind in one line. Translating your Figma file into code becomes a matter of replacing values.

## Afternoon: liftoff 🚀

The checklist. By end of class, every one of you has:

1. Your design tokens in your site's `global.css`
2. Your repo connected to Netlify, **first deploy done, site live**. From now on, every push rebuilds your live site. This is the workflow you keep for years.
3. A GitHub Issues backlog: **10 to 12 small issues**, one per task. "Make the homepage hero", not "Build about page". Small units you can close for the dopamine.
4. A short solo sprint to close your first issue.

## Homework

Finish your **mid-fi wireframes**: your homepage plus your liveliest section, due Monday at the sprint's first standup. Details on the [assignments page](/web2026/assignments). The weekend is otherwise yours; if you build, build small, and rest is also a fine choice. Monday the sprint begins, and you arrive with a live site, tokens, wireframes, and words. Project week gets spent making the thing, not wrestling with tools.

## Today's links

- [Coolors](https://coolors.co) - palette explorer
- [Type Scale](https://typescale.com/) - size systems
- [MDN: CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Figma](https://www.figma.com/) - where the wireframes live
