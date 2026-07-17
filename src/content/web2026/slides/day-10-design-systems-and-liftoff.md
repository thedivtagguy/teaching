---
date: 2026-07-15T12:00
updated: 2026-07-15T12:00
transition: none
---

# Design Systems & Liftoff

_Day 10: WEB2026_

*(Last teaching day. Everything after this is making.)*

---

# Same site, three skins 👕

*(one wireframe, rendered three times with three different token sets)*

<!-- TODO: prepare 3 skinned versions of one wireframe for this slide -->

Same boxes. Wildly different personalities.

The layout is the skeleton. The **tokens** are the wardrobe.<!--element class="fragment"-->

Today you design the wardrobe.<!--element class="fragment"-->

---

## The 20-minute blue problem

You spend 20 minutes choosing the perfect blue for your links.

Next day you need that blue for a button. Can't remember the code.<!--element class="fragment"-->

Now you're hunting through CSS, or settling for "close enough."<!--element class="fragment"-->

Multiply by every color, font, and size, times three weeks.<!--element class="fragment"-->

---

## A design system = decisions made once

- Your site feels **intentional**: everything connects
- Boring decisions get automated; interesting ones get your full attention
- Changing your mind costs one line, not an archaeology dig

---

## Keep it SMALL

- **2–4 colors.** Total. ([Coolors](https://coolors.co) helps explore.)
- **Two font families, max.**
- **3–4 text sizes** with clear hierarchy.

You can always add non-system, one-off things later. The system is for what you reach for *constantly*.

---

## Name by purpose, never appearance

```css
/* Good: says what it's FOR */
--color-ink        /* main text */
--color-paper      /* background */
--color-accent     /* links, buttons, moments of joy */

/* Bad: future-you has no idea */
--blue-2
--color-1
--nice-gray
```

If you rebrand from blue to green, `--color-accent` stays honest. `--blue-2` becomes a lie.

---

## CSS variables: define once, use everywhere

```css
:root {
  --color-ink: #1f2937;
  --color-paper: #fffdf8;
  --color-accent: #2563eb;

  --font-body: 'Inter', sans-serif;
  --font-display: 'Fraunces', serif;

  --text-normal: 1.125rem;
  --text-large: 1.5rem;
  --text-huge: 2.5rem;
}
```

```css
h1 {
  font-family: var(--font-display);
  font-size: var(--text-huge);
  color: var(--color-ink);
}
```

---

## Here's the good news

This **exact block**, same names, is what the starter's `global.css` ships with.

Translating your Figma mockup into code = **replacing the values.**

That's the whole handoff.

---

## Do it now (30 min)

From your mockups: extract your tokens.

1. Colors → hex codes, named by purpose
2. Two fonts → with fallback stacks
3. Sizes → a scale ([typescale.com](https://typescale.com/) if stuck)

Write them as a `:root` block. This is your site's wardrobe, chosen.

---

# Part 2: The markdown loop 🌱

One more Astro superpower before liftoff.

---

## Pages that write themselves

Drop a markdown file into your garden folder:

```markdown
---
layout: ../../layouts/NoteLayout.astro
title: "Things I learnt this week"
date: "2026-08-10"
---

Real words go here. No HTML required.
```

It becomes a page. **And the garden index lists it automatically.**

---

## The six magic lines

(from the starter's `garden/index.astro`, README step 7)

```js
const notes = Object.values(
  import.meta.glob("./*.md", { eager: true })
).sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));
```

"Grab every markdown file next to me. Sort newest first."

The template loops over them. Done.

---

## Why this matters more than it looks

Adding to your site next month = **writing a paragraph of markdown.**

Not engineering. Not remembering how anything works. Writing.

This is the loop that keeps personal sites alive after courses end.<!--element class="fragment"-->

---

# Part 3: LIFTOFF 🚀

---

## The plan for this afternoon

Your site goes live **before it has any design.** On purpose.

Blank pages are scary. Live URLs ask to be filled.<!--element class="fragment"-->

Project week starts with a site that already exists, not a blank page.<!--element class="fragment"-->

---

## The kickoff checklist

By end of class, every single one of you has:

1. ☐ Fresh copy of the starter → your repo: `web2026-YOURNAME-site`
2. ☐ Your tokens pasted into `global.css`
3. ☐ Netlify connected: **first deploy done, site LIVE**
4. ☐ GitHub Issues backlog: 10–12 small issues
5. ☐ First issue closed (that's the sprint, next slide)

---

## Issues: small units only

```
✅ "Make the homepage hero"
✅ "Style the garden cards"
✅ "Add nav links to all pages"

❌ "Build about page"        ← contains ten tasks
❌ "Finish website"           ← contains despair
```

Each issue = one sitting. Close them for the dopamine. I'll be watching the graphs; it helps me help you.

---

# Now you. 🏃

**Solo sprint: 40 minutes.** The longest yet. You're ready.

Close your first issue: structure only, real content from your inventory-in-progress, zero styling anxiety.

Your tokens are already doing quiet work underneath.

---

## Tonight: the content inventory 📝

Write the **real words** for every page. **NO CODE. Do not open VS Code.**

- Homepage: name, one-sentence intro (it's in your reply letter, I promise), nav labels
- Each plot: title, 2–3 sentence intro, first real entries
- About: your reply letter, edited. It's 80% written.

90 minutes. Words are the hard part. Make them exist tonight.

---

## Look at where you are

Live site. Design system. Content nearly in hand. A backlog. Continuous deployment humming.

All the tool-learning is behind you now.<!--element class="fragment"-->

Project week is purely for making the thing.<!--element class="fragment"-->

---

## Git minute

Commit. Push. Watch Netlify rebuild your live, empty, wonderful site.

Tomorrow at 9:30: standup #1. Bring your inventory. 🌅
