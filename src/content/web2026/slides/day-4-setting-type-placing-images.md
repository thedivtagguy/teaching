---
date: 2026-07-15T12:00
updated: 2026-07-15T12:00
transition: none
---

# Setting Type, Placing Images
### _Day 4 - WEB2026_

---

# Type Crimes 🚨

Three exhibits. The class prosecutes.

For each: **name the crime.**

---

## Exhibit A

*(a menu / poster / website with the works: six fonts, centered body text, letter-spaced lowercase, lines 200 characters long)*

<!-- TODO: add 3 exhibit screenshots to the vault (local finds are funnier than famous ones) -->

What's wrong here? Shout it out.

---

## The point of the game

You already *feel* bad typography. You flinched before you could name it.

Today we learn the names, so next time you can fix it instead of just flinching.

---

> Web design is 95% typography

~ Oliver Reichenstein, [ia.net](https://ia.net/topics/the-web-is-all-about-typography-period)

The web is text. Letters, words, paragraphs. Master the type, and most of the design is done.

---

# Rule 1: Measure

**45 to 75 characters per line.**

Longer: eyes get lost on the return trip. Shorter: choppy reading.

```css
article {
  max-width: 65ch; /* the "ch" unit ≈ one character width! */
}
```

This one rule fixes more amateur websites than any other.

---

# Rule 2: Line height

Body text wants room to breathe.

```css
body {
  line-height: 1.6;  /* 1.5–1.7 for body text */
}

h1 {
  line-height: 1.2;  /* headings: tighter */
}
```

---

# Rule 3: A deliberate scale

A page needs maybe **3–4 text sizes**. Not twelve.

```css
--text-small: 0.875rem;   /* captions */
--text-normal: 1.125rem;  /* body */
--text-large: 1.5rem;     /* section headings */
--text-huge: 2.5rem;      /* the title */
```

Try [typescale.com](https://typescale.com/): pick a ratio, get a system.

---

# Rule 4: Two typefaces, max

One for **headings**, allowed to have personality.

One for **body**, which should disappear politely while you read.

Where to get them: [Google Fonts](https://fonts.google.com/), [Fontshare](https://www.fontshare.com/).

---

## Loading a web font

Google Fonts gives you a `<link>` for your `<head>`, then:

```css
body {
  font-family: 'Crimson Pro', Georgia, serif;
}
```

The names after the comma are the **fallback stack**: undershirts in case the fancy shirt doesn't arrive.

---

## One showpiece: the dropcap

```css
p:first-of-type::first-letter {
  initial-letter: 3;
  font-family: var(--font-display);
  margin-right: 0.5rem;
}
```

Browse [Jen Simmons' labs](https://labs.jensimmons.com/): dropcaps, multicolumn, shapes, overlap. You'll pick one technique for today's project.

---

# Part 2: The Image Survival Kit 🖼️

Images have a talent for eating entire evenings: wrong paths, giant files, squished faces.

This kit is how we keep those evenings.

---

## Where images live

```
project/
├── index.html
├── style.css
└── images/
    └── my-photo.jpg    ← lowercase. hyphens. always.
```

```html
<img src="images/my-photo.jpg" alt="...">
```

Yesterday's paths lab pays rent immediately.

---

## Why images blow out layouts

An image is as big as its file says it is. A 4000px photo doesn't care about your layout.

The fix, once, in your CSS, forever:

```css
img {
  max-width: 100%;
  height: auto;
}
```

Now images respect their containers.

---

## `object-fit`: cropping without squishing

Want every image in a neat 300×200 box?

```css
.card img {
  width: 300px;
  height: 200px;
  object-fit: cover;    /* fill the box, crop the overflow */
}
```

`cover` = fill and crop. `contain` = fit inside, maybe with gaps.

Use `cover` for photos of people. Faces stay un-stretched.

---

## The semantic home for images

```html
<figure>
  <img src="images/moth.jpg"
       alt="A moth resting on a lit lampshade at night">
  <figcaption>The visitor, 2am.</figcaption>
</figure>
```

`<figure>` + `<figcaption>`: the frame and the museum label.

---

## Alt text: write it like a considerate human

For screen readers, broken images, and search engines.

❌ `alt="image"` `alt="photo1"`
✅ `alt="Hand-drawn map of my neighborhood, annotated in red ink"`

Describe what matters about the image, to someone who can't see it.

---

## Compression: the 500KB rule

A 14MB photo makes your site feel broken on a phone.

1. Go to [squoosh.app](https://squoosh.app/)
2. Drop your image in
3. Watch it shrink 90% with no visible difference
4. Download, use *that* one

**If an image file is over 500KB, ask it why.**

---

## What we're NOT doing

**Floats**: a historical curiosity. We wave at them from a distance. 👋

**`position: absolute`**: the course rule is *ask before you absolute*. Nine times out of ten, flexbox or grid does it better with less pain.

(Absolute positioning is a rabbit hole at this stage. We'd rather spend those hours on type.)

---

# Part 3 💌

---

# Letters to a Young Designer

---

## The project

Real correspondence, from one human to another:

Rilke writing to a young poet. Van Gogh writing to Theo. Ada Lovelace writing to Babbage. Seneca writing to Lucilius.

**You pick one letter. You typeset it so beautifully the writer would forgive the medium.**

---

## Why letters?

- A letter is *addressed*: it already has a voice and a reader
- It's typography-first: no galleries, no gimmicks to hide behind
- And next week you'll write the reply, to a stranger, on your website<!--element class="fragment"-->

More on that after the weekend.<!--element class="fragment"-->

---

## This week's arc

| When | What |
|---|---|
| Today | Pick your letter, read it twice, sketch |
| Tomorrow | Grid arrives: layout your letter |
| Saturday | Your letter moves into Astro (!) |
| Next week | The reply, components, and shipping |

---

## Expectations (the short version)

- **Typography carries it.** Fonts that match the letter's era and mood.
- **Max two images**, processed properly.
- **One Jen Simmons technique** you haven't tried.
- **NO AI imagery.** Public domain pools or your own hands.

Full brief on the assignments page. **Design review with me before you code.**

---

## Step 1: Read and visualize

1. Read your letter twice. Notice its mood before you pick a single font.
2. Sketch the page (paper or Figma).
3. Think: what should a reader *feel* before they read a word?

---

## Go pick your letter

The menu is on the assignments page. Take 20 minutes. Read a few.

Pick the one that makes you feel something; you're going to live with it for a week.

---

## Git minute ⏱️

Commit your sketches folder, your started HTML, whatever exists. Push.

Tomorrow: grids without tears. Bring your letter.
