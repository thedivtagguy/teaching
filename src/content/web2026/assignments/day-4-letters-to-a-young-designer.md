---
title: "Assignment 4: Letters to a Young Designer 💌"
due: 2026-07-25
description: Typeset a public-domain letter from a great artist or thinker, your first real portfolio piece
published: false
date: 2026-07-23T18:00
updated: 2026-07-15T12:00
submissionUrl: https://github.com/open-making/web2026-letters/issues/1
---

# Letters to a Young Designer

You're going to take one letter written by a great artist, designer, or thinker (real correspondence, from one human to another) and typeset it into a webpage so beautiful the writer would forgive the medium. I encourage you to think of this as your first real web design portfolio piece, something you'd actually want to show someone.

This project grows over the week:

| Milestone | When |
|---|---|
| Pick your letter + design review with me | Day 4 or 5 (in class or after) |
| Typeset page, first full pass (vanilla HTML/CSS) | **Start of Day 6 (Sat, Jul 25)** |
| Migrate into Astro | Day 6, in class together |
| Write your reply | Day 7, in class |
| Two-page Astro site, live, with layout + components | Start of Day 9 (see Assignment 7) |

## The letter menu

Pick one that actually speaks to you (or propose your own; any public-domain letter works, just clear it with me):

- **Rainer Maria Rilke → Franz Kappus**, from *Letters to a Young Poet* (1903) - [full text](https://www.gutenberg.org/ebooks/56674). The letter that gives this project its name. "Go into yourself."
- **Vincent van Gogh → Theo van Gogh** - [vangoghletters.org](https://vangoghletters.org/vg/). Pick any; the ones about starting to paint are extraordinary.
- **John Keats → George and Georgiana Keats** (1819), the "negative capability" letters. [Project Gutenberg](https://www.gutenberg.org/ebooks/35698)
- **Ada Lovelace → Charles Babbage** (1843), the correspondence of the first programmer.
- **Seneca → Lucilius**, from *Moral Letters* - [full text](https://en.wikisource.org/wiki/Moral_letters_to_Lucilius). On the shortness of life, on friendship; timeless advice column energy.
- **Louis Sullivan**, "The Tall Office Building Artistically Considered" (1896) - [full text](https://archive.org/details/tallofficebuildi00sull). Not strictly a letter, but the essay where "form follows function" was coined; advice from architecture's godfather.
- **Sol LeWitt → Eva Hesse** (1965)*, the famous "DO" letter. (*Not public domain; you may typeset an excerpt under fair-use for class, but it can't go in the public anthology, so talk to me.)

Read your letter properly, twice; you can't typeset a mood you haven't felt.

## Expectations

- **Typography carries this project.** Your font choices should match the era and mood of the letter. Use web fonts deliberately; play with sizes, spacing, and measure (45 to 75 characters per line; this is a *letter*, it should read like one).
- **Maximum two images**, both properly processed: cropped, compressed (under 500KB, use [Squoosh](https://squoosh.app/)), lowercase filenames, alt text. Two is a deliberately low cap; part of the design challenge here is restraint. **No AI imagery.** Use the [image pools](/web2026/day-4-setting-type-placing-images#image-pools) or your own drawings/scans.
- **One technique from [Jen Simmons' labs](https://labs.jensimmons.com/)** you haven't tried: a dropcap with `initial-letter`, multicolumn text, text wrapping a CSS shape, or a considered overlap.
- **Use flexbox or grid** for the page structure (no floats needed, it's 2026).
- Steal like a designer: find one [CSS Zen Garden](https://csszengarden.com) entry that inspires you and adapt its *approach*, not its code.

## Process

Sketch before you code: paper or Figma, I don't care, but **get your direction reviewed by me at least once before coding**. Structure your HTML first (it's a letter: `<article>`, headings, paragraphs; the semantics are almost pre-written for you). Then style methodically: typography first, then layout, then the fancy thing.

You will get stuck. When it happens, be specific in your searching: not "how to make text look good" but "CSS drop cap first letter." Stuck for 15 minutes? Use the protocol. Simple and well-executed beats complex and broken, every time. [Even whitespace can look good](https://labs.jensimmons.com/2017/01-021.html).

**Time-box: two evenings × 90 minutes** gets a solid first pass done. This is a marathon project with checkpoints, not an all-nighter.
