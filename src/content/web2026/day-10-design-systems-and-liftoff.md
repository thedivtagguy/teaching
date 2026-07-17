---
title: Day 10 - Design Systems & Liftoff
date: 2026-07-30
description: Design tokens and CSS variables, the markdown loop, and deploying your personal site before designing it
published: false
section: Building with Astro
order: 5
seo_title: Design Systems & Liftoff
seo_description: Design tokens, CSS variables, markdown pages in Astro, and project kickoff
seo_keywords: design systems, CSS variables, design tokens, Astro, markdown, project kickoff
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-15T12:00
slug: day-10-design-systems-and-liftoff
slides: https://teaching.aman.bh/slides/web2026/day-10-design-systems-and-liftoff
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/10
assignments: true
---
## Day 10: Design Systems & Liftoff

Last teaching day. This morning you build your design system; this afternoon your personal site goes **live on the internet before it has any design at all**. That's on purpose: blank pages are scary, and a live URL demands to be filled.

**Warm-up (10 min):** _Same site, three skins._ One wireframe, rendered three times with three different token sets: same boxes, wildly different personalities. If the layout is the skeleton, the tokens are the wardrobe, and today you get to design the wardrobe.

### Morning: a personal design system

When you're building, it's tempting to make design decisions on the fly. But before you know it, you can't remember which blue you used where. A design system means making key decisions *once* so you don't keep remaking them, and it makes your site feel intentional because everything connects.

**Keep it small:**

- **2 to 4 colors total.** One or two primary colors for important elements, maybe an accent, your text colors. (Tools like [Coolors](https://coolors.co) help.)
- **At most two font families**, and three or four text sizes that create clear hierarchy.
- **Name them by purpose**, not appearance: `--color-primary`, `--color-accent`, `--text-large`. Never `--blue-2`; future-you doesn't know what `--blue-2` is for.

**Then implement as CSS variables** in your `:root`:

```css
:root {
  /* Colors */
  --color-ink: #1f2937;        /* main text */
  --color-paper: #fffdf8;      /* page background */
  --color-accent: #2563eb;     /* links, buttons, moments of joy */

  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-display: 'Georgia', serif;
  --text-normal: 1rem;
  --text-large: 1.5rem;
  --text-huge: 2.5rem;
}
```

Define once, `var(--color-accent)` everywhere, change your mind in one line. This exact block (same names) is what the [starter's `global.css`](https://github.com/open-making/your-first-astro-site) ships with, so translating your Figma mockup into code is a matter of *replacing the values*.

### Morning, part 2: the markdown loop

One more Astro superpower before liftoff: **pages that write themselves from markdown**. Drop a `.md` file into the garden folder, and it becomes a page, with the index listing it automatically (that's the `import.meta.glob` bit in the starter, step 7 of the README). This is what makes your site *tendable*: adding a garden entry next month means writing a paragraph of markdown, not engineering anything, and that's the loop that keeps personal sites alive after courses end.

### Afternoon: liftoff 🚀

The kickoff checklist. By end of class, every single one of you has:

1. A fresh copy of the starter as your own repo: `web2026-YOURNAME-site`
2. Your design tokens pasted into `global.css`
3. Netlify connected, **first deploy done, site live** (an empty site that's live is exactly what we're after today)
4. A GitHub Issues backlog: **10 to 12 small issues**, one per task. "Make the homepage hero" or "Style the garden cards", not "Build about page." Small units you can close for the dopamine.
5. **40-minute solo sprint** to close your first issue. Structure only, real content, zero styling anxiety; your tokens are already doing quiet work.

Homework: the **content inventory**, where you write the real words for every page you planned. No code tonight; the words are the harder part anyway, and they need to exist before you can build with them. Details on the [assignments page](/web2026/assignments).

Tomorrow the sprint begins. You have a live site, a design system, content in hand, and a backlog, which means project week gets spent *making the thing* instead of wrestling with tools.

## Today's Links

- [Coolors](https://coolors.co) - palette explorer
- [Type Scale](https://typescale.com/) - size systems
- [MDN: CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Starter README, steps 6 to 8](https://github.com/open-making/your-first-astro-site#step-6--write-in-markdown) - markdown pages and tokens
