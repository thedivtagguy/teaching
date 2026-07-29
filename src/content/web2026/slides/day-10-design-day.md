---
date: 2026-07-28T23:00
updated: 2026-07-29T00:15
transition: none
---

# Design Day

_Day 10: WEB2026_

This is the last teaching day. Everything after this is making.

---

# The squint test 😑

*(blurred screenshots on the projector)*

All the detail is gone. What survives?

Whatever you can still see while squinting is the hierarchy of the page. <!--element class="fragment"-->

If nothing survives the blur, the page does not have a hierarchy. <!--element class="fragment"-->

note: Prepare four or five blurred screenshots: one newspaper front page, one good personal site, one cluttered site where nothing survives. Let them call out what they see before you name the principle.

---

## Hierarchy is a budget

If everything on a page is important, nothing on the page is important.

For each page, answer one question: **what should a visitor see first?** <!--element class="fragment"-->

Then give that thing the space that says so. <!--element class="fragment"-->

---

## The 10-second test

Someone lands on your homepage for the first time. In 10 seconds, they need to know:

- Who you are
- What you care about
- Why they should stay

Your site map decided where a visitor can go. Today you decide what they see first.

---

## Content-first wireframing

**You have real words now. Use them.**

Your inventory was due this morning. Every box in your wireframe contains, or clearly stands for, content that exists. <!--element class="fragment"-->

A layout that only works with fake text does not work. <!--element class="fragment"-->

note: This is why the inventory was due today and not Monday. Anyone without an inventory writes it first, this morning, before they open Figma.

---

## Mid-fi means

- Real text hierarchy: big, medium, small
- Gray boxes for images
- Your actual nav labels from Day 8
- No colors and no fonts. Those decisions come at midday.

If the page does not work as gray boxes, no font will save it.

---

## Sketch round (30 minutes)

Work on paper first. Draw **three** different arrangements of your homepage.

Three, because the first idea is rarely the best one. <!--element class="fragment"-->

Run the squint test on your own sketches. The best one goes to Figma. <!--element class="fragment"-->

note: Enforce the three sketches. The second is usually a rearrangement of the first, and the third is where something interesting happens. Teach Figma basics as needed: frames, text styles for the size hierarchy, rectangles for images. Components in Figma follow the same idea as components in Astro; point that out.

---

# Midday: design tokens 🎨

---

## The 20-minute blue problem

You spend 20 minutes choosing the perfect blue for your links.

The next day you need that blue for a button, and you cannot remember the code. <!--element class="fragment"-->

Now you are hunting through your CSS, or settling for "close enough". <!--element class="fragment"-->

Multiply this by every color, font, and size, across a whole project week. <!--element class="fragment"-->

---

## A design system is a set of decisions made once

- Your site feels intentional, because everything connects.
- The boring decisions are automated, so the interesting ones get your full attention.
- Changing your mind costs one line, not a search through every file.

---

## Keep it small

- **2 to 4 colors, total.** ([Coolors](https://coolors.co) helps you explore.)
- **Two font families at most.**
- **3 to 4 text sizes** with clear hierarchy. ([typescale.com](https://typescale.com/) if you are stuck.)

The system is for the things you reach for constantly. One-off moments can still exist outside it.

---

## Name by purpose, never by appearance

```css
/* Good: the name says what it is FOR */
--color-ink        /* main text */
--color-paper      /* background */
--color-accent     /* links and buttons */

/* Bad: future-you has no idea */
--blue-2
--color-1
--nice-gray
```

If you change your mind from blue to green, `--color-accent` stays correct. `--blue-2` becomes wrong.

---

## CSS variables: define once, use everywhere

```css
:root {
  --color-ink: #1f2937;
  --color-paper: #fffdf8;
  --color-accent: #2563eb;

  --font-body: 'Inter', sans-serif;
  --font-display: 'Georgia', serif;

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

Translating your Figma file into code means replacing these values.

---

## Do it now (30 minutes)

From your sketches and references:

1. Colors → hex codes, named by purpose
2. Two fonts → with fallback stacks
3. Sizes → a scale

Write the `:root` block and put it in your site's `global.css`.

---

# Afternoon: liftoff 🚀

---

## Your site goes live today

It goes live **before the design is finished**, and that is on purpose.

A blank page gives you nothing to react to. A live URL gives you something to improve. <!--element class="fragment"-->

Monday starts with a site that already exists. <!--element class="fragment"-->

---

## Connect the pipeline

1. Go to [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Pick your site's repo from GitHub
3. Netlify detects Astro. Accept the build settings.
4. Deploy, and rename the site to something humane.

Then: change one word, commit, push, wait about 40 seconds, refresh.

The site updated itself. This is the workflow you keep for years. <!--element class="fragment"-->

---

## The backlog

Open GitHub Issues on your own repo and write **10 to 12 small issues**.

```
✅ "Make the homepage hero"
✅ "Style the note cards"
✅ "Add footer with one honest sentence"

❌ "Build about page"    ← this contains ten tasks
❌ "Finish website"      ← this is not a task
```

One issue equals one sitting. Close them for the dopamine.

note: The backlog is Monday's standup agenda, written in advance. Tell them you will watch the issue graphs during the sprint; it helps you see who is stuck before they say so.

---

## The kickoff checklist

By the end of class, every single one of you has:

1. ☐ Tokens in `global.css`
2. ☐ Netlify connected, and the site **live**
3. ☐ 10 to 12 small issues filed
4. ☐ The first issue closed (short solo sprint, right now)

---

## In your dev notes today

- Your live URL 🎉
- A screenshot of your tokens block
- Your issue backlog
- One sentence: *"The first thing I want a visitor to see is ___."*

---

## The weekend

**Homework: finish your mid-fi wireframes.** Your homepage plus your liveliest section. Due Monday at standup.

Run the self-checks before you call them done:

- **Squint test**: does the important thing still dominate?
- **Stranger test**: would your named reader know where to click first?
- **Honesty test**: is there a box you cannot name the real content for? Delete it or fill it.

Beyond that, the weekend is yours. If you build, build small. Rest is also a good use of it. <!--element class="fragment"-->

---

## Look at where you are

A live site. Design tokens. A skeleton you can explain. Words in hand. A backlog.

All of the tool-learning is behind you. <!--element class="fragment"-->

Monday at 9:30 is standup number one. Project week is only for making the thing. 🌅 <!--element class="fragment"-->
