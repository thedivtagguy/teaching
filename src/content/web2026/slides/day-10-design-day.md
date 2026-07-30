---
date: 2026-07-28T23:00
updated: 2026-07-31T00:44
transition: none
---

# Design Day

_Day 10: WEB2026_

---

> Ghass ek baar phir ugegi, ghoda ek baar phir aayega

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730231744303.png" data-background-size="contain" -->

---

## A design system is made of parts, not pages

---

## Keep it small

- **2 to 5 main colors, total.** ([Coolors](https://coolors.co))
- **Two font families at most.**
- **3 to 4 text sizes** with clear hierarchy. ([typescale.com](https://typescale.com/) if you are stuck.)

The system is for the things you reach for constantly. One-off moments can still exist outside it.

---
## Name by purpose not by appearance

```css
/* Good: the name says what it is FOR */
--color-text        /* main text */
--color-background      /* background */
--color-accent     /* links and buttons */

/* Bad: future-you has no idea */
--blue-2
--color-1
--nice-gray
```

If you change your mind from blue to green, `--color-accent` stays correct. `--blue-2` becomes wrong.

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730230652366.png" data-background-size="contain" -->

notes: [Rest of World](https://restofworld.org/style-guide/)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730230717227.png" data-background-size="contain" -->

notes: [Rest of World](https://restofworld.org/style-guide)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730230810115.png" data-background-size="contain" -->

notes: [Rest of World](https://restofworld.org/style-guide)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730230902856.png" data-background-size="contain" -->

notes: [Style Guides](http://styleguides.io/examples)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730231440442.png" data-background-size="contain" -->

notes: [StyleTiles](https://styletil.es/)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730231453487.png" data-background-size="contain" -->

notes: [StyleTiles](https://styletil.es/)

---

## Wireframes

- Main parts of content
- Drawing the outline and layout structure
- Showcasing the bare minimum UI

---

## Rapid Ideation

6-8 ideas in 10 minutes

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730233025653.png" data-background-size="contain" -->

notes: [Credits](https://github.com/messydesign/design-sprint/blob/master/converge-choose-the-right-path/exercises/crazy-eights.md)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730233059431.png" data-background-size="contain" -->

notes: [Credits](https://github.com/messydesign/design-sprint/blob/master/converge-choose-the-right-path/exercises/crazy-eights.md)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730232321839.png" data-background-size="contain" -->

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730233407645.png" data-background-size="contain" -->

notes: [Credits](https://hci.stanford.edu/courses/cs147/2022/au/projects/KeepingCultureAlive/StoreaTime/Presentations/CS%20147%20A05.pdf)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730233508159.png" data-background-size="contain" -->

notes: [Credits](https://hci.stanford.edu/courses/cs147/2022/au/projects/KeepingCultureAlive/StoreaTime/Presentations/CS%20147%20A05.pdf)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730232925673.png" data-background-size="contain" -->

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730232637739.png" data-background-size="contain" -->

notes: [Credits](https://cs.brown.edu/courses/csci1320/assignments/assignment4_design/assignment4_design.html)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730232541917.png" data-background-size="contain" -->

notes: [Credits](https://cs.brown.edu/courses/csci1320/assignments/assignment4_design/assignment4_design.html)

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730232615621.png" data-background-size="contain" -->

notes: [Credits](https://cs.brown.edu/courses/csci1320/assignments/assignment4_design/assignment4_design.html)

---
## Hierarchy

If everything on a page is important, nothing on the page is important.

For each page **what should a visitor see first?** 

---

<!-- slide bg="../assets/slides/day-10-design-day/IMG-20260730234433134.png" data-background-size="contain" -->

notes: [Nielsen Norman Group](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)

---

<!-- slide bg="../assets/slides/day-10-design-day/squint-restofworld.png" data-background-size="contain" -->

notes: Squint test — the hierarchy survives the blur. [Rest of World](https://restofworld.org)

---

<!-- slide bg="../assets/slides/day-10-design-day/squint-maggieappleton.png" data-background-size="contain" -->

notes: Squint test — the hierarchy survives the blur. [Maggie Appleton](https://maggieappleton.com)

---

<!-- slide bg="../assets/slides/day-10-design-day/squint-robinsloan.png" data-background-size="contain" -->

notes: Squint test — the hierarchy survives the blur. [Robin Sloan](https://www.robinsloan.com)


---
## Gearing up for Build Week

---

<!-- slide bg="../assets/slides/day-10-design-day/gantt-timeline.png" data-background-size="contain" -->

---
## Dopamine Hits

Open GitHub Issues on your own repo and write **10 to 12 small issues**.

```
✅ "Make the homepage hero"
✅ "Style the note cards"
✅ "Add footer with social links"

❌ "Build about page"    // this contains ten tasks
❌ "Finish website"      // this is not a task
```
