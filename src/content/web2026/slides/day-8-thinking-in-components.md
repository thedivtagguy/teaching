---
date: 2026-07-15T12:00
updated: 2026-07-15T12:00
transition: none
---

# Thinking in Components

_Day 8: WEB2026_

---

# Spot the repeat 🔍

*(a well-known site goes on the projector)*

Find everything that's secretly **the same thing wearing different content**.

Every card. Every list row. Every button.<!--element class="fragment"-->

Count them.<!--element class="fragment"-->

---

## That repeated thing is a component

The site's designers built it **once**.

Today, so will you.

---

## Why frameworks exist, in one sentence:

### So you never have to copy-paste the same header twice.

Your letter lives in Astro but it's still one big HTML file. Let's fix that.

---

# The anatomy of a `.astro` file

```astro
---
// This top part (between the fences) is JavaScript.
// It runs ONCE, when the site is built.
// It NEVER runs in your visitor's browser.
const { title } = Astro.props;
---
<!-- This bottom part is HTML. You already know HTML. -->
<h2>{title}</h2>
```

Two rooms, one file: **code fence** up top, **template** below.

---

## The line that confuses everyone

```js
const { title } = Astro.props;
```

Slowly:

- `Astro.props`: the box of values the page sent in<!--element class="fragment"-->
- `{ title }`: *unpack* "title" from the box<!--element class="fragment"-->
- This unpacking syntax is called **destructuring**. It's just unpacking, nothing fancier.<!--element class="fragment"-->

---

## Defaults, while we're here

```js
const { title, year = "unknown" } = Astro.props;
```

"If the page didn't send a `year`, use `'unknown'` instead of breaking."

Considerate components have defaults.

---

# Props: passing things in

The page writes:

```astro
<Byline name="Rainer Maria Rilke" year="1903" />
```

The component catches:

```astro
---
const { name, year } = Astro.props;
---
<p class="byline">{name}, {year}</p>
```

**Same component, different letters, different bylines.** That's the whole trick.

---

# Slots: the hole your page pours into

A layout is a **picture frame**. `<slot />` marks where the picture goes.

```astro
---
// LetterLayout.astro
import "../styles/global.css";
const { title } = Astro.props;
---
<html>
  <head><title>{title}</title></head>
  <body>
    <nav>...</nav>
    <main>
      <slot />   <!-- ← your page lands exactly here -->
    </main>
  </body>
</html>
```

---

## And the page pours itself in:

```astro
---
import LetterLayout from "../layouts/LetterLayout.astro";
---
<LetterLayout title="Letters to a Young Poet">
  <h1>Dear Mr. Kappus...</h1>
  <p>You ask whether your verses are any good...</p>
</LetterLayout>
```

Everything between the tags → lands where `<slot />` sits.

Every page of your site can pour into this same frame.<!--element class="fragment"-->

---

# Code-along 🛠️

Together, we build for your Letters site:

1. **`LetterLayout.astro`**, the frame: head, nav, footer, slot
2. **`PullQuote.astro`**, for that one line in your letter that deserves to be huge

```astro
<PullQuote text="Go into yourself." />
```

Laptops open.

---

# Now you. 🏃

**Solo sprint: 20 minutes.**

Build the sibling: **`Byline.astro`**

- Props: `name`, `year` (give `year` a default)
- Shows the letter-writer's name and year, styled with your tokens
- Use it on your letter page

Timer on. Stuck protocol applies. The destructuring line is on a slide behind us; going back is allowed.

---

# Your second page 📄

Your reply letter (written yesterday) becomes:

```
src/pages/reply.astro
```

File = URL, remember? `yoursite.com/reply` now exists.

Add a simple `<nav>` in `LetterLayout` linking letter ↔ reply, and you have built a **multi-page website**.

Two pages and a nav: now it's somewhere you can walk around.<!--element class="fragment"-->

---

# One more thing 🚀

---

# Continuous deployment

You've done the commit ritual every day for a week.

Now we make each commit **update your actual website.**

---

## Connect the pipeline

1. [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Pick your Letters repo from GitHub
3. Netlify detects Astro (build: `pnpm run build`, publish: `dist`), accept it
4. Deploy. Rename the site to something humane.

---

## Now watch

1. Change one word in your letter
2. `git add -A && git commit -m "One word better"` (or GitHub Desktop)
3. Push
4. Wait ~40 seconds
5. Refresh your live URL

**It updated itself.**<!--element class="fragment"-->

This is the workflow you'll keep for years. Push → live. Nothing to upload, ever again.<!--element class="fragment"-->

---

## Tonight: ship the Letters 💌

Due start of tomorrow, because the anthology assembles in the morning:

- [ ] Two pages, both through `LetterLayout`
- [ ] Nav between them
- [ ] One component doing honest work
- [ ] Images pass the audit (Netlify, lowercase, compressed, alt)
- [ ] Nice URL

**90 minutes.** The bar: *would the letter-writer forgive the medium?* Unfinished-but-live beats perfect-but-local.

---

## Git minute

You know what to do. (And now, so does Netlify.)

Tomorrow: the anthology, the squint test, and a Figma guest. 🎨
