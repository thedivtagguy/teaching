---
date: 2026-07-15T12:00
updated: 2026-07-23T02:42
transition: none
---

# The Make Day
### _Day 5 - WEB2026_

Today you build the thing.

---

## No new concepts today.

That's on purpose.

HTML, the box model, flexbox, four type rules, the image kit. You have all of it. Today we *use* it.

---

## You walked in with a ticket

A letter. A sketch. A folder of assets.

*(That was yesterday's deal. If you're missing one, grab me in the first ten minutes.)*

---

## Let us have Taylor Swift do a small recap

<!-- TODO: regenerate class-stats slides (lines of code, top tags, properties, colors, fonts) from 2026 submissions -->

---

## Verdict: Great job

But a few things to clean up before we build all day...

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
.letter-opening { }
.signature { }
.pull-quote { }
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

### We'll get better at these as we build.

---

# The plan for today 🗺️

One page. Five layers. A checkpoint at each.

---

## The timetable

| Time | Layer |
|---|---|
| 10:00 | Blocks on paper |
| 10:30 | HTML done (unstyled) |
| 11:30 | Typography pass |
| 13:00 | *lunch* |
| 14:00 | Layout pass |
| 15:30 | The flourish |
| 16:15 | Ship + show-and-tell |

Slower than you'd like. Faster than doing it all at once and drowning.

---

## Step 0: Identify your building blocks

A letter is almost pre-structured:

- **Headings**: `<h1>`, `<h2>`
- **Paragraphs**: `<p>`
- **Emphasized lines**: `<strong>`, `<em>`
- **A quote**: `<blockquote>`
- **The signature**: a `<p>` or a `<footer>`

Name them before you type them.

---

## Step 1: HTML first. Always. 🧱

Write the whole letter as plain, unstyled HTML.

Get it reading top-to-bottom **before you write one line of CSS.**

**Checkpoint:** show a neighbor your *naked* HTML. Does it make sense with zero styling? If not, no font will save it.

---

## Step 2: Typography pass ✍️

Yesterday's four rules, in order:

1. Load your fonts (`<link>` + `font-family`)
2. Set the measure: `max-width: 65ch`
3. Set line-height (1.6 body, 1.2 headings)
4. Apply your 3-4 size scale

**Checkpoint:** the squint test. Can you feel the hierarchy from across the room?

---

## Step 3: Layout pass 📐

Flexbox only. And honestly, mostly margins.

A generous margin column. A centered text column. Maybe a header row.

**Your letter needs *less* layout than you think.**

*(No grid today. Grid arrives later, and your letter doesn't need it.)*<!--element class="fragment"-->

---

## Step 4: The flourish ✨

**One** Jen Simmons technique. One.

A dropcap. A pull quote. Text wrapping a shape.

Set a timer. One is elegant. Three is a mess.

---

## Flourish: text that hugs an image ✨

If your one flourish is a picture with text wrapping around it, that's a **float**. By default the image sits *in the way*: the text stops, the picture takes the line, the words resume below. One property fixes it:

```css
.portrait {
  float: left;              /* or right */
  margin: 0 1.5rem 1rem 0;  /* space on the text side */
  width: 260px;
}
```

The image steps aside; the paragraph wraps around it.

---

## Before / after

<split even gap="2">

![no float|360](assets/slides/day-5-the-make-day/float-none.png)

![float: left|360](assets/slides/day-5-the-make-day/float-left.png)

</split>

**Without `float`** the picture is a block: the paragraph starts below it. **With `float: left`** it tucks aside and the words flow up into the gap.

---

## Which side?

<split even gap="2">

![float: left|360](assets/slides/day-5-the-make-day/float-left.png)

![float: right|360](assets/slides/day-5-the-make-day/float-right.png)

</split>

`float: left` hugs the left and the text runs down its right. `float: right` is the mirror image.

---

## If the next bit creeps up

A float steps out of the normal flow, so whatever comes next can slide *up* beside it instead of starting below.

<split even gap="2">

![no clear|360](assets/slides/day-5-the-make-day/clear-off.png)

![clear: both|360](assets/slides/day-5-the-make-day/clear-on.png)

</split>

`clear: both` on that next element sends it back down where it belongs.

---

## When you get stuck: the 15-minute rule ⏳

Stuck on one thing for more than fifteen minutes?

1. Screenshot the problem
2. Try a different approach
3. Ask a neighbor or me
4. Park it and move to another section

**Don't let one problem freeze the whole page.**

---

## Search prompts to keep moving

- `CSS font family`: change the typeface
- `CSS line height`: space between lines
- `CSS max width center`: the measure, centered
- `CSS drop cap first letter`: the showpiece
- `CSS blockquote styling`: make the quote sing
- `CSS letter spacing uppercase`: refined small caps

---

## Images: the kit, deployed 🖼️

Before any image goes in:

- **lowercase** filename
- **under 500KB** (Squoosh it)
- real **alt text**
- `max-width: 100%` so it can't blow out the layout

---

## Show-and-tell 🎤

**Last 30 minutes. Each of you shows your page and names:**

1. One thing you searched for
2. One property you discovered
3. One thing you'd still improve

Kind, specific, useful.

---

## Git minute ⏱️: ship it

Commit. Push. Deploy to Netlify.

**A live, unfinished page beats a perfect one stuck on localhost.**

Homework: finish your first full pass. Due at the start of Day 6.

---

## Tomorrow

Saturday, and a big one: **the terminal, and Astro.**

Your letter gets a new home.

Sleep well. Tomorrow needs a rested brain.
