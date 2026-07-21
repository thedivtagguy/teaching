---
title: Grids Without Tears (PARKED)
date: 2026-07-24
description: CSS Grid with grid-template-areas first, editorial layouts, and responsive basics
published: false
section: Appendix
seo_title: Grids Without Tears
seo_description: CSS Grid via grid-template-areas, editorial layout, and responsive basics
seo_keywords: web design, CSS grid, grid-template-areas, responsive design, editorial layout
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-21T15:47
slug: grids-without-tears
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/5
assignments: false
---
<!-- PARKED: CSS Grid was pulled out of Week 1 (Day 5 became "The Make Day").
     This lesson needs a home later in the course. Recommended slot:
     Day 11, the kickoff of project week, right before students lay out
     their own personal sites on Day 12 ("your grids"). To reinstate:
     give it a day-N slug + slides URL, flip published:true, and move
     the deck (dump/grids-without-tears-slides.md) back into slides/.
     Its companion assignment lives at assignments/day-5-grid-challenges.md
     (currently unpublished). The old NYT code-along slides are preserved
     in the deck; compress to a demo if the target day is tight. -->
## Grids Without Tears

Flexbox gave us one-dimensional layouts, rows *or* columns. CSS Grid lets us work in both dimensions at once; it's the editorial control over space that web designers dreamed about for decades. Grid has a reputation for frying brains with column math, so we're teaching it in a friendlier order: names first, numbers later.

**Warm-up (10 min):** _Grid hunt._ Newspapers and magazines on every table. Find the grid: how many columns is this page built on? Where does an image break the grid on purpose? Annotate in pen. Print figured out grids long before CSS did, and CSS Grid was literally designed to bring that tradition to the web.

**Today's route:**

1. **`grid-template-areas` first.** You draw your layout *with words*:

```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "story  aside"
    "footer footer";
}
```

That's a layout you can *read*. No math, no counting columns; you name the rooms, then tell each element which room it lives in. This is where everyone starts today, and honestly, you could build every project in this course with just this.

2. **Grid Garden** to practice the underlying properties, game-style. Get as far as feels good; the later levels are optional flexing.

3. **The editorial rebuild.** Together we'll recreate a section of a newspaper front page (the New York Times treatment, inspired by Jen Simmons' art-direction talks): semantic HTML first, then grid areas, then a media query so it reflows on a narrow screen. This is your first taste of **responsive design**: same content, different room arrangement.

4. **`fr` at the end, as the leftover-space unit.** After you're comfortable with named areas, `1fr` is easy to explain: "one share of whatever space is left." That's genuinely all there is to it.

**Solo sprint (20 min):** Apply a grid to your **letter** layout, even just to place the letter text against a generous margin column. Timer on, stuck protocol applies, I'm circulating.

**Git minute:** commit and push before you leave. (Told you it'd become a ritual.)

Homework: two grid layout challenges, time-boxed at 90 minutes. Details on the [assignments page](/web2026/assignments). Tomorrow is a big day: the terminal and Astro arrive. Sleep well, seriously.

## Today's Links

**CSS Grid Learning:**

- [Learn CSS Grid](https://learncssgrid.com/) - Comprehensive visual guide
- [CSS Grid Garden](https://cssgridgarden.com/) - Interactive practice game
- [A Complete Guide to Grid (CSS-Tricks)](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN: grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)

**Design Inspiration:**

- [Jen Simmons: Designing with Grid](https://youtu.be/t0b3uBoDkBs) - The art-direction talk
- [Layout Land YouTube Channel](https://www.youtube.com/channel/UC7TizprGknbDalbHplROtag) - Jen Simmons explaining modern CSS layout
