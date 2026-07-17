---
date: 2026-07-15T12:00
updated: 2026-07-15T12:00
transition: none
---

<!-- NOTE: recap-stats and grid-challenge images referenced below live in the
     web2025 vault (day-6-making-grids assets). Regenerate stats from 2026
     submissions and copy challenge images before exporting. -->

# Grids Without Tears

_Day 5: WEB2026_

---

# Grid hunt 🔍

Newspapers and magazines are on your tables.

**Find the grid:**
- How many columns is this page built on?
- Where does an image break the grid *on purpose*?

Annotate in pen. 10 minutes.

Print figured out grids a century before CSS. CSS Grid was literally designed to bring that tradition to the web.<!--element class="fragment"-->

---

## Let us have Taylor Swift do a small recap

<!-- TODO: regenerate class-stats slides (lines of code, top tags, properties, colors, fonts) from 2026 submissions -->

---

## Verdict: Great Job

But a few things to clear up before we move forward...

---

## The greatest hits of invalid HTML

```html
<!-- These do not exist. The browser is just being polite. -->
<p1>This is wrong</p1>
<bottom id="footer">Footer content</bottom>
```

```html
<!-- Real tags, real classes -->
<p class="intro-text">This is correct</p>
<footer id="footer">Footer content</footer>
```

The browser renders *something* anyway. That doesn't mean it's right.

---

## Boilerplate, please

Every HTML file starts with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <link rel="stylesheet" href="style.css">
</head>
```

Missing doctype, missing charset, missing viewport = subtle weirdness later.

---

## Name things like future-you is reading

```css
/* Bad: what is this */
.para1, .para2, .P4, .box3 { }

/* Good: says what it IS */
.story-introduction { }
.character-dialogue { }
.chapter-heading { }
```

And style in CSS files, not in HTML `style=""` attributes. **Do not style in HTML.**

---

## And no `<br>` stacking

```html
<!-- Bad: spacing via prayer -->
<p>Some text</p>
<br><br><br>
<p>More text</p>
```

```css
/* Good: spacing via CSS */
.intro { margin-bottom: 3rem; }
```

---

## And, as established:

```css
position: absolute;
```

---

```css
position: absolutely-not;
```

*(ask before you absolute)*

---

It is okay to make mistakes.

### We'll get better at these as we move forward

---

## Discussion Time

Jen Simmons argues that **web layout must evolve beyond templated, single-column designs**, embracing _art direction_ and _editorial design_ principles inherited from print to **communicate the idea of the story**.

You watched *Revolutionize Your Page* last night. In groups of 2–3, 15 minutes:

- What does 'art direction on the web' mean to you after the talk?
- Which examples challenged your assumptions about web layout?
- Your grid hunt annotations: what would those print layouts look like as CSS?

---

## Flexbox taught us layouts in one dimension

Columns **or** rows.

---

For two dimensions, we have

# CSS Grid

---

## Grid has a reputation for frying brains

It doesn't deserve one, if you start in the right place.

We start with names, not numbers.<!--element class="fragment"-->

---

# grid-template-areas

You draw your layout. With words.

```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "story  aside"
    "footer footer";
}
```

That's a layout **you can read.** Three rows. The header and footer span both columns. The story sits next to the aside.

---

## Then you assign the rooms

```css
header  { grid-area: header; }
article { grid-area: story; }
aside   { grid-area: aside; }
footer  { grid-area: footer; }
```

Name the rooms. Tell each element which room it lives in. Done.

No math. No counting lines. You could build every project in this course with just this.<!--element class="fragment"-->

---

## Want the story wider than the aside?

Add column sizes, still readable:

```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "story  aside"
    "footer footer";
  grid-template-columns: 2fr 1fr;  /* story gets 2 shares, aside gets 1 */
  gap: 1.5rem;
}
```

Wait, what's `fr`? Hold that thought until the end of class. It's easier after you've used areas.

---

# Code Along 📰

Laptops open please.

---

This is a snippet from a section on [The New York Times](https://nytimes.com) that we'll recreate.

![](IMG-20250728093826270.png)

---

What does this look like as a grid?

![](IMG-20250728093826282.png)

One featured story across the top. Two columns of stories. A newsletter box across the bottom.

---

## Step 1: HTML first. Always.

```html
<main class="magazine-grid">
  <article class="article featured">
    <header class="article-header">
      <span class="author">VANITA GUPTA</span>
      <h1 class="headline">You May Not Be the Target This Time.</h1>
      <span class="read-time">5 MIN READ</span>
    </header>
  </article>

  <article class="article medium">...</article>
  <article class="article medium">...</article>
  <article class="article medium">...</article>
  <article class="article medium">...</article>

  <section class="newsletter">...</section>
</main>
```

Semantic rooms: `<article>` for each story, `<header>` for its metadata.

---

## Step 2: Say the layout in words

```css
.magazine-grid {
  display: grid;
  grid-template-areas:
    "featured featured"
    "med1     med2"
    "med3     med4"
    "letter   letter";
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}
```

Read it out loud. It IS the layout.

---

## Step 3: Assign the rooms

```css
.featured { grid-area: featured; }
.medium:nth-of-type(2) { grid-area: med1; }
.medium:nth-of-type(3) { grid-area: med2; }
.medium:nth-of-type(4) { grid-area: med3; }
.medium:nth-of-type(5) { grid-area: med4; }
.newsletter { grid-area: letter; }
```

*(`nth-of-type` = "the second `<article>`, the third…", a selector from the CSS Diner family.)*

---

## Step 4: Typography does the hierarchy

```css
.headline {
  font-weight: 700;
  line-height: 1.2;  /* yesterday's rules, working today */
}

.featured .headline { font-size: 2rem; }
.medium .headline   { font-size: 1.25rem; }

.author {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #666;
}
```

---

## Step 5: What about phones? 📱

CSS gives us the **media query**:

```css
/* Default: one column. Phones first. */
.magazine-grid {
  grid-template-areas:
    "featured"
    "med1"
    "med2"
    "med3"
    "med4"
    "letter";
}

/* Wider screens: rearrange the rooms */
@media (min-width: 768px) {
  .magazine-grid {
    grid-template-areas:
      "featured featured"
      "med1     med2"
      "med3     med4"
      "letter   letter";
  }
}
```

**Same content, different room arrangement.** That's responsive design. Areas make it *legible*.

---

## COMMIT

*(You knew this slide was coming.)*

---

# Okay. Now: r u fr? 

The unit we postponed: `fr` stands for **fraction**.

### "one share of whatever space is left over."

```css
grid-template-columns: 2fr 1fr;
/* two shares : one share. The browser does the math. */
```

That's it. That's the unit. You've already been using it for an hour.

---

## The other grid vocabulary

- **Explicit grid**: rows/columns you declared
- **Implicit grid**: rows the browser adds when content overflows (forgiving, not broken)
- Numbered lines (`grid-column: 1 / -1`): the power-user dialect. Areas first; lines when you need surgical control.

See more at [Learn CSS Grid](https://learncssgrid.com/)

---

### Game Time 🥕

[CSS Grid Garden](https://cssgridgarden.com)

Get comfortable; the later levels are optional flexing.

![](IMG-20250728093826294.png)

---

# Now you. 🏃

**Solo sprint: 20 minutes.**

Apply a grid to your **letter** layout. Even just: a generous margin column beside the letter text.

Say the layout in words first (`grid-template-areas`), then assign rooms.

Timer on. Stuck protocol applies.

---

## Homework

**Two** grid challenges. Two done thoughtfully beats five done frantically.

Assignments page. Due Monday. 90 minutes, time-boxed. **Saturday night is off.**

---

## Git minute ⏱️

Commit. Push.

Tomorrow is a Saturday and a big one: **the terminal, and Astro.** Your letter gets a new home.

Sleep well. Tomorrow needs a rested brain.
