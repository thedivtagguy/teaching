---
date: 2026-07-15T12:00
updated: 2026-07-15T12:00
transition: none
---

# Hello Terminal, Hello Astro

_Day 6: WEB2026_

---

## Today the course shifts gears

Until now: single HTML files.

From today: a *project*, a *dev server*, a *framework*. The way professionals work.

It's Saturday. We keep it playful. **And there's no homework tonight.**<!--element class="fragment"-->

---

# Command Charades 🎭

The classroom is your file system.

- Walking to the door: `cd door`
- Looking around: `ls`
- Building a fort of chairs: `mkdir fort`
- Standing still, confused, asking where you are: `pwd`

Volunteers act. Class guesses. Let's go.

---

## The point

The terminal is just **moving around your computer without pictures.**

Your body now knows this. The rest of today is just typing it instead of walking it.

---

# Part 1: The terminal is a place

---

## Finder, without the pictures

| You already do | The terminal way |
|---|---|
| Double-click a folder | `cd foldername` |
| Look inside a folder | `ls` |
| Make a new folder | `mkdir name` |
| "Wait, where am I?" | `pwd` |

That's genuinely 80% of what you'll use. Ever.

---

## Try it now (5 min)

Open Terminal (Mac: `Cmd+Space`, "terminal") or Git Bash (Windows).

```bash
pwd         # where am I?
ls          # what's here?
cd Desktop  # go to the desktop
mkdir web2026-test   # make a folder
ls          # see it appear
```

Now look at your actual Desktop. The folder is there. Same computer, no pictures.

---

# Part 2: Node, packages, pnpm

---

## Node.js

JavaScript used to live only inside browsers.

**Node lets JavaScript run on your laptop directly.**

Discord, VS Code, WhatsApp Desktop, Figma Desktop: all built on it.

---

## Packages are LEGO blocks 🧱

A **package** is a chunk of code someone else wrote, that does one thing well.

Your project's `package.json` is the LEGO shopping list: "this project needs these blocks."

**pnpm** is the shop that fetches them:

```bash
pnpm install   # get me all the blocks on the list
```

---

## The commands you'll type 500 times

```bash
pnpm install    # fetch the blocks (once per project)
pnpm run dev    # start the dev server (every work session)
```

That's the whole routine.

Check yourself later: [the Node & npm quiz](https://teaching.aman.bh/web2026/quiz-node-and-npm)

---

# Git minute #2 ⏱️

You've clicked commit + push in GitHub Desktop all week.

Here's the exact same ritual, in the terminal:

```bash
git add -A                      # gather all changes
git commit -m "Add my letter"   # checkpoint, with a message
git push                        # send to GitHub
```

**Same thing, different clothes.** Use whichever you like from now on.

---

# Part 3: Hello Astro 🚀

---

## What is Astro?

A **static site generator**: you write pages and components, it builds them into plain HTML and CSS.

The exact stuff you've been writing by hand all week.<!--element class="fragment"-->

**Nothing you've learned is wasted.** Astro just stops you from copy-pasting your header into every page.<!--element class="fragment"-->

---

## Why learn it at all?

Because your personal site will want:

- The same nav on every page, written **once**
- New pages by adding **markdown files**, not engineering
- A site you can still tend six months from now

You get two full weeks with Astro before project time. By then it'll feel like home.

---

## Step 1: Clone and run

Follow along with the [starter's README](https://github.com/open-making/your-first-astro-site), steps 0 to 3. You can replay it anytime.

```bash
# after cloning with GitHub Desktop, in the project folder:
pnpm install
pnpm run dev
```

---

## localhost:4321

`localhost` = this computer.
`4321` = the door number the dev server answers at.

Your site is running *on your laptop*, rebuilt live as you type. Open it. Keep it open all day.

---

## Step 2: Edit and watch

Open `src/pages/index.astro`. Change the heading. Save.

Look at the browser. **It already updated.**

This save-and-glance loop is how you'll work from now on.

---

## Step 3: File = URL

Astro's entire routing system:

```
src/pages/index.astro    →  yoursite.com/
src/pages/about.astro    →  yoursite.com/about
src/pages/garden/        →  yoursite.com/garden/...
```

A file becomes a page. A folder becomes a path. That's the entire routing system.

---

## One new wrinkle: where images live

In an Astro project, static files go in `public/`:

```
public/images/my-photo.jpg   →  yoursite.com/images/my-photo.jpg
```

```html
<img src="/images/my-photo.jpg" alt="...">
```

Note the path: the `public` part vanishes when served.
*(Read `public/images/README.md` in the starter. It's a survival kit.)*

---

# The Migration 💌

---

## Ground rules

Your letter moves into Astro now. Before anything else:

- Your old letter folder **stays where it is, untouched.** It's the safety net; nothing we do here can hurt it.
- The dev server stays running, the browser stays open.
- We move **one thing at a time** and check after each move. Never two changes between checks.

---

## Step 1: an empty page first

Create `src/pages/letter.astro`. Put exactly one line in it:

```html
<h1>letter test</h1>
```

**Check:** `localhost:4321/letter` shows the heading.

Not there? The file isn't inside `src/pages/`, or the name has a capital letter in it. Fix that *before* pasting anything.

---

## Step 2: paste the whole letter

Open your old `index.html`. Select all. Copy.

Back in `letter.astro`: delete the test heading and paste **everything**, doctype and all. An Astro page is allowed to be a complete HTML document, and today that's exactly what we want.

**Check:** your words are on the page. If your CSS lived in a `<style>` tag, it came along in the paste and things may already look right.

---

## Step 3: rescue the CSS

Text there but the design gone? Then your CSS lived in a separate `styles.css`, and the `<link>` in your head now points at a file that didn't move.

1. Open your old `styles.css`. Select all. Copy.
2. In `letter.astro`, replace the `<link rel="stylesheet" ...>` line with:

```html
<style>
  /* paste everything here */
</style>
```

**Check:** your typography is back.

---

## Step 4: move the images

1. Copy your image files into `public/images/` (lowercase names, hyphens, no spaces)
2. Change every `src` to start with `/images/`

```html
<img src="/images/van-gogh.jpg" alt="..." />
```

**Check every image.** One missing? Network tab: what did the browser ask for vs. what exists. This is Day 3's lab paying rent.

---

## Checkpoint: side by side

Open your old letter file in one tab, `localhost:4321/letter` in the other. Flip between them.

**They should look identical.** Same letter, now living in a real project with a dev server.

---

## If something still looks off

| Symptom | Fix |
|---|---|
| Page blank, terminal shows red | The error names the file and line; usually a half-pasted tag |
| An image is missing | Network tab, then check the case and the `/images/` prefix |
| Styles behaving strangely | Change `<style>` to `<style is:global>` on this page |
| "Where's the site's nav on my letter?" | Nowhere, on purpose. On Tuesday your letter gets its own frame |

Stuck protocol applies. Saturday edition: cheerfully.

---

## Look at what you have

Your letter, the one you designed and typeset, now lives in a real project, with a dev server, in a framework.

Same page, better home.<!--element class="fragment"-->

Next week it gains a layout, components, a second page, and a URL that updates itself.<!--element class="fragment"-->

---

## Git minute, terminal edition

```bash
git add -A
git commit -m "My letter lives in Astro now"
git push
```

---

# No homework. 🛌

It's Saturday. Take the evening off properly.

*(If you absolutely must: the starter README steps 4 and 5 preview Tuesday. But honestly, go outside.)*

Monday: no code at all. We talk about gardens. 🌱
