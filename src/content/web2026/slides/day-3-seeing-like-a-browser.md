---
date: 2026-07-15T12:00
updated: 2026-07-19T16:19
transition: none
---

<!-- NOTE: image assets (IMG-2025...) live in the web2025 Obsidian vault.
     Copy or re-link them into the web2026 vault before exporting. -->

# Seeing Like a Browser
### _Day 3 - WEB2026_

---

## But first: pens out 🖊️

**Box-spotting.** You have a printed screenshot of a website.

Draw the boxes. Every heading, every image, every column: box it.

This drawing is the layout code you'll write today.<!--element class="fragment"-->
If you can box it, you can build it.<!--element class="fragment"-->

---

## Yesterday

- HTML is a home; tags are rooms
- CSS selectors grab elements to style them
- You deployed a monstrosity to the actual internet

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

Can you spot the use of `background-color`?

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

# The Box Model 📦

Every element is a box. Four layers, inside out:

```
┌─ margin ────────────────────────────┐
│  ┌─ border ─────────────────────┐   │
│  │  ┌─ padding ─────────────┐   │   │
│  │  │                       │   │   │
│  │  │       content         │   │   │
│  │  │                       │   │   │
│  │  └───────────────────────┘   │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

**Padding**: space inside the walls. **Margin**: space between houses.

Once you see the boxes, you can't unsee them.

---

What is that **space on the sides called?**

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122827.png)

---

Okay, I searched, and got an answer. But what does this mean?

```css
margin: 0px 10px;
```

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122851.png)

---

I went to MDN, and in the page was written...

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122861.png)

---

## That was a good search!

What made it a **good search**?

1. **Specific keywords**: "margin", "CSS"
2. **We knew what we wanted**: "add space below"

---

## The Browser Inspector 🦴

**Right-click → Inspect Element** on any website!

X-ray specs for web pages. See the boxes, tweak the values, break things for fun. (Refresh un-breaks them.)

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

# Flexbox 🐸

Boxes in a **row** or a **column**, sharing space sensibly.

```css
.parent {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
```

The parent becomes the boss of the row. Children fall in line.

---

## Game time

Head to [Flexbox Froggy](https://flexboxfroggy.com).

Get as far as feels good. **Revisiting this game later is normal and encouraged**; plenty of people come back to it mid-project.

#### Time: 25 Minutes

---

# The File-Paths Lab 🔨

We are now going to break things. **On purpose.**

File paths eat more homework hours than any CSS concept. Twenty minutes of deliberate breakage now saves whole evenings later.

---

## Break #1: The Case of the Vanishing Image

1. Your page shows `photo.jpg`. Lovely.
2. Rename the file to `Photo.JPG`.
3. Still works on your laptop? **It won't on the server.**

Your Mac forgives. Netlify does not.<!--element class="fragment"-->

**Rule for this course: filenames are always lowercase. Always.**<!--element class="fragment"-->

---

## Break #2: Where does the path start?

Move your image into a folder called `images/`. Now which of these works?

```html
<img src="photo.jpg">          <!-- nope: not next to the HTML anymore -->
<img src="images/photo.jpg">   <!-- yes: relative to this file -->
<img src="/images/photo.jpg">  <!-- yes: from the site's root -->
```

`./` = "starting from where this file lives"
`/` = "starting from the front door of the site"

---

## Break #3: Reading a 404

Open devtools → **Network tab** → refresh.

The red line tells you *exactly* what the browser asked for and didn't get.

Compare what it asked for with what actually exists. Spot the difference and you've found your bug.<!--element class="fragment"-->

---

# The Stuck Protocol 🦆

This poster now governs the rest of the course:

1. **Read the error out loud.** Actually out loud.
2. **Rubber duck it**: explain what *should* happen to a duck, neighbor, or water bottle
3. **Check the docs** (MDN first)
4. **Ask a neighbor**
5. **Ask me or an LLM**, with the actual error, the actual code, expected vs. got

Steps 1–4 aren't bureaucracy. They're where the learning happens.

---

## Also: the 15-minute rule

**Stuck on one thing for more than 15 minutes?**

Screenshot it, protocol it, or park it and move on.

Don't let one problem stop all progress.

---

# Now you. 🏃

**First solo sprint: 10 minutes.**

We just built a small flexbox layout together. Now build its sibling (same skills, different content) on your own. Timer's on.

(These sprints get longer every week, as the life jacket comes off a little at a time.)

---

## Wrapping up

**Be ready to show:**

1. One thing you searched for today
2. One thing you broke on purpose (and fixed)
3. One CSS property you discovered

---

## Git minute ⏱️

Commit. Push. Leave.

Homework: three flexbox katas. Assignments page, 60 minutes, stuck-notes count.

Tomorrow: typography, images, and the start of the letters project. 💌
