# Review: My-portfolio-website

Disclosure: Parts of this review were put together with an LLM after a thorough manual review.

## The Good

- **Every page goes through one layout.** `src/layouts/Layout.astro` holds the `<head>`, the navbar, and the Mac frame. It takes a `title` prop with a default value. When you change the frame, you edit one file. That's great!
- **Each window's content is its own small file.** `src/windows/resume.astro`, `projects.astro`, `fun.astro`, and `contact-page.astro` are short and easy to read. To change your resume text, you open one small file and edit HTML.

## Things to improve

### 1. Keep one copy of the window markup

The window markup exists in three places. `Layout.astro` has a `<template id="window-template">` (lines 41–54). `Desktop.astro` has a second template with the same id. `src/components/Window.astro` is a third copy, and no file imports it. Your script `src/scripts/desktop.js` copies the element with that id each time you open a window — and because two elements share one id, the browser only ever uses the first one, the copy in `Desktop.astro`. If you restyle the template in `Layout.astro`, nothing on screen changes, and you will not know why.

**What to do:** Delete the template block in `Layout.astro` and delete `src/components/Window.astro`. The site does not change, because `desktop.js` already uses the copy in `Desktop.astro`. One more sentence about that script, so it is not a mystery: `desktop.js` opens a window when you click a navbar button, and it moves, resizes, and closes windows when you drag or click them. It earns its place — it is the whole desktop.

### 2. Delete the leftover files from earlier versions

`src/components/` holds four old copies of your window pages: `Contact.astro`, `Fun.astro`, `Projects.astro`, and `Resume.astro`. They are placeholder versions, and no file imports them — the real content lives in `src/windows/`. `Mac.astro` and `PasswordModal.astro` are also unused, and `Password.astro`, `Pegboard.astro`, `WindowControl.astro`, and `src/windows/notes.astro` are empty. One day you will open `components/Projects.astro`, edit it, and see no change on the site.

**What to do:** Delete these ten files. Keep `notes.astro` only if a Notes window is your next task. If you want the password screen back later, get `PasswordModal.astro` from your git history.

### 3. Delete the CSS rules that fight each other

`global.css` styles the window buttons twice. Near line 420, a rule hides `.window-minimise` and `.window-maximise` with `display: none`. Near line 590, a newer block unhides them with `display: flex !important` — a flag that forces a rule to win. `.traffic-lights` and `.resize-handle` also each appear twice, and `.desktop` appears twice with different backgrounds. When you edit the first copy of a rule, the second copy wins, and your change does nothing.

**What to do:** Keep the newest block at the bottom of the file (lines 571–641). Delete the rules it overrides: the `display: none` rule for `.window-minimise` and `.window-maximise`, the first `.traffic-lights` rule, the first `.resize-handle` rule, and one of the two `.desktop` rules. Then open the site and check the window buttons still look right.

### 4. Make a ProjectCard component before you fill the cards

`src/windows/projects.astro` has four `.project-card` articles, and each one holds only a name. Your page says "Select a project to learn more", so each card will soon get an image, a title, and a description. If you paste that markup four times, every later change to the card design means four edits, and you will miss one.

**What to do:** Make the component first, then fill in your projects as props.

```astro
---
// src/components/ProjectCard.astro
const { title, blurb } = Astro.props;
---
<article class="project-card">

    <h2>{title}</h2>

    <p>{blurb}</p>

</article>
```

```astro
---
import ProjectCard from "../components/ProjectCard.astro";
---
<div class="project-grid">

    <ProjectCard title="Jaipur Portfolio" blurb="..." />

    <ProjectCard title="Editorial Newspaper" blurb="..." />

</div>
```

## Little things

- Delete the four unused images in `public/images/` — `mac-home.png` alone is 2.5 MB, and only `slot-bg.jpg` is used.
- Delete the `.scene`, `.window.hidden`, and `.window.dragging` rules in `global.css` — no markup uses those classes, and your script never adds them.
- Delete the four empty files in `.vscode/`.
