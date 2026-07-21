---
date: 2026-07-15T12:00
updated: 2026-07-21T15:28
transition: none
---
# Seeing Like a Browser
### _Day 3 - WEB2026_

---

## Yesterday
- Understanding HTML in terms of sheets and strips
- CSS selectors for grabbing elements to style them
- Deploying a monstrosity to the internet

---

<split even gap="2">

> ...whatever we'll create further on will somehow be better than what we did [yesterday]...

![IMG|500](https://media.tenor.com/gSH3zUtBzN4AAAAM/fist-bump-high-five.gif)

</split>

---

## Can we start seeing pages as tags?

---

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot **paragraph elements?**

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot **heading elements?**

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot **an image?**

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot the use of `background-color`?

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot the use of `color`?

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122827.png)

---

What is that **space on the sides called?**

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122827.png)

---

How do I **add space below headings**?

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122827.png)

---

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122841.png)

---

Okay I got an answer, but what does this mean? Why the space between the two values?

```css
margin: 0px 10px;
```

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122851.png)

---

I went to MDN, and in the page was written...

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122861.png)

---

# 🤠👍

---

## That was a good search!

But what made it a **good search**?

1. **We used specific keywords**: "margin", "CSS"
2. **We knew what we wanted**: "add space below"

---

## That space has a name.

In fact, *every* element carries four layers of space around its content.

---

# The Box Model 📦


```
┌─ margin ────────────────────────────┐
│  ┌─ border ─────────────────────┐   │
│  │  ┌─ padding ─────────────┐   │   │
│  │  │                       │   │   │
│  │  │       content         │   │   │
│  │  │                       │   │   │
│  │  └───────────────────────┘   │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Padding**: space inside the walls.

**Margin**: space between houses.

---

Once you see the boxes, you can't unsee them.

And in a minute, the browser will show you the *actual* boxes on any live website.<!--element class="fragment"-->

---

## First, let's practice this detective work

---

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122873.png)

**What HTML elements do you see?**

---

## I spot:

- A `<div>` container for the whole card
- An `<img>` for the picture
- An `<h3>` or `<p>` for the website name
- A `<a>` for the link
- Another `<p>` for the label texts

---

## What CSS properties would you search for?

- "CSS card layout" <!--element class="fragment"-->
- "CSS border rounded" <!--element class="fragment"-->
- "CSS box shadow" <!--element class="fragment"-->
- "CSS side by side layout" <!--element class="fragment"-->

*(hold that last one in your head; it's the second half of today)* <!--element class="fragment"-->

---

## The Browser Inspector 🦴

**Right-click → Inspect Element** on any website!

X-ray specs for web pages. See the boxes, tweak the values, break things for fun.

---

## Let's try it live!

1. Open one of *your* Bohemian Rhapsody monstrosities from yesterday
2. Right-click on something interesting
3. Click "Inspect" or "Inspect Element"
4. Look at the HTML structure
5. Look at the CSS styles on the right — and *change them*

---

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723075655721.png)

---

## Activity: Sniffing Things 🕵️

**15 minutes**

1. Pick any website you visit regularly
2. Find something visually interesting
3. Inspect it with browser tools
4. Write down:
    - What HTML tags are used?
    - What CSS properties create the visual effect?
    - What would you search for to recreate this?

---

## So how *do* things sit side by side?

Remember "CSS side by side layout"?

The answer, nine times out of ten, is...

---

# Flexbox 🐸

Boxes in a **row** or a **column**, sharing space sensibly.

```css
.parent {
  display: flex;
}
```

The parent becomes the boss of the row. Children fall in line.

---

## Which way does the line go?

```css
.parent {
  display: flex;
  flex-direction: row;     /* → the default */
  /* flex-direction: column;  ↓ stack instead */
}
```

One property flips a navbar into a sidebar.

---

## Two axes, two questions

```css
.parent {
  display: flex;
  justify-content: center;  /* along the row: left? right? spread out? */
  align-items: center;      /* across the row: top? middle? bottom? */
}
```

**justify-content** pushes things along the direction of travel.

**align-items** lines them up across it.

*(Yes, these two centered a div. The legend is real.)*<!--element class="fragment"-->

---

## And the space between?

```css
.parent {
  display: flex;
  gap: 1rem;   /* breathing room between children, no margin math */
}
```

There's more in the family — `flex-wrap`, `order`, `flex-grow` — and you'll meet all of them in about twenty minutes.

---

## Game time

Head to [Flexbox Froggy](https://flexboxfroggy.com).

**15–20 minutes.** Get to around level 13; that covers everything we need today.

**Revisiting this game later is normal and encouraged**; plenty of people come back to it mid-project.

---

## Time to leave the frog pond 🚀

One repo. Seven small design jobs. Each one a real layout you'll build again someday.

# `web2026-space-oddity`

---

## You know this dance

Same moves as Bohemian Rhapsody:

1. **Fork** [open-making/web2026-space-oddity](https://github.com/open-making/web2026-space-oddity) on GitHub
2. Open **GitHub Desktop** → Clone *your* fork
3. **Open in VS Code**
4. Right-click `index.html` → **Open with Live Server**

---

## How it works

- The landing page links every exercise
- Each folder has its **own README** telling you the job
- Each page shows the **goal** — refresh your browser to check yourself
- Fix the CSS → write the CSS → write the HTML → build the whole thing

The training wheels come off one at a time.<!--element class="fragment"-->

---

## Today, in class:

**01 — Ground Control**: fix four bugs, watch the panel snap together

**02 — Comic Strip**: unscramble the panels so the joke lands

**03 — Gallery Wall**: hang a painting dead center (yes, *that* div)

**04 — Sticker Sheet**: make it wrap, make it breathe

Homework: **05, 06, and 07**. More on that at the end.

---

# The Stuck Protocol 🦆


1. **Read the error out loud.**
2. **Rubber duck it**
3. **Check the docs**
4. **Ask a neighbor**
5. **Ask me or an LLM**, with the actual error, the actual code, expected vs. got


---

## Wrapping up

**Be ready to show:**

1. One thing you searched for today
2. One exercise payoff moment (before → after)
3. One CSS property you discovered

---

## Git minute ⏱️

Commit. Push. Leave.

Homework: exercises **05 (mixtape shelf), 06 (boarding pass), 07 (katas)** in the flexbox repo. 75 minutes, time-boxed. Stuck-notes count.

Tomorrow: typography, images, and the start of the letters project. 💌
