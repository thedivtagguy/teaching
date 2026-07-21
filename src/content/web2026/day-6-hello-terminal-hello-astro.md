---
title: Day 6 - Hello Terminal, Hello Astro
date: 2026-07-25
description: The terminal as a place, node and pnpm, and moving your letter into its first real project
published: false
section: Building with Astro
order: 1
seo_title: Hello Terminal, Hello Astro
seo_description: Terminal basics, node and pnpm, and your first Astro project
seo_keywords: terminal, command line, node, npm, pnpm, Astro, static site generator, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-21T15:49
slug: day-6-hello-terminal-hello-astro
slides: https://teaching.aman.bh/slides/web2026/day-6-hello-terminal-hello-astro
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/6
---
## Day 6: Hello Terminal, Hello Astro

Today's the day the course shifts gears. Until now you've been making single HTML files. From today, you work the way professionals do: in a *project*, with a *dev server*, inside a *framework*. It's a big jump, and you have two full weeks ahead to make it feel like home. It's a Saturday, so we're keeping it hands-on and playful, and there is **no homework tonight**.

**Warm-up (10 min):** _Command charades._ The classroom is your file system. Walking to the door is `cd door`. Looking around is `ls`. Building a fort of chairs is `mkdir fort`. Volunteers act out commands, class guesses. Ridiculous? Yes. But the terminal is just *moving around your computer without pictures*, and once your body knows that, the black window stops being scary.

### Morning: the terminal is a place

- **The terminal**: Finder/Explorer without the pictures. `cd`, `ls`, `pwd` (where am I?), and that's genuinely 80% of what you'll use.
- **Node.js**: the thing that lets JavaScript run on your laptop instead of only inside a browser. Discord, VS Code, and WhatsApp Desktop are all built on it.
- **Packages and pnpm**: packages are LEGO blocks of code other people wrote; `pnpm` fetches and organizes them. When you run `pnpm install`, you're saying "get me all the blocks this project's `package.json` asks for."
- Take the [Node & npm quiz](/web2026/quiz-node-and-npm) to check yourself.
- **Git minute #2:** the same commit-and-push ritual you've done all week in GitHub Desktop, now shown once on the command line (`git add`, `git commit`, `git push`). Use whichever you prefer from here on; they are the same thing wearing different clothes.

### Afternoon: hello Astro

Astro is a **static site generator**: you write pages and components, it builds them into plain HTML/CSS, the exact stuff you've been writing by hand all week. Nothing you've learned is wasted; Astro just stops you from copy-pasting your header into every page.

Together, step by step (this follows the [starter's README](https://github.com/open-making/your-first-astro-site) exactly, so you can replay it anytime):

1. Clone the starter, `pnpm install`, `pnpm dev`, and understand what `localhost:4321` means.
2. Edit the homepage, watch the browser hot-reload.
3. **File-based routing**: a file at `src/pages/about.astro` *is* the page `/about`. File = URL. That's the whole routing system.
4. Learn where images go in Astro (`public/`): your Day 4 paths knowledge, with one new wrinkle.

### The migration 💌

Then the payoff: **your letter moves into Astro.** We do this as a script, together, one move at a time with a check after each:

1. Your old letter folder stays where it is, untouched. It's the safety net; nothing in this exercise can hurt it.
2. Create an empty `src/pages/letter.astro` containing a single test heading, and confirm `localhost:4321/letter` exists *before* pasting anything.
3. Paste your entire `index.html` over the test heading, doctype and all. An Astro page is allowed to be a complete HTML document, and today that's exactly what we want.
4. If your CSS lived in a separate `styles.css`, its old `<link>` now points at nothing: paste the file's contents into a `<style>` tag in its place.
5. Copy your images into `public/images/` (lowercase, hyphens) and point every `src` at `/images/...`.
6. Final check: old file and new page side by side. They should look identical.

If something breaks along the way, that's Day 4's paths lab paying rent: the Network tab for missing images, the terminal for everything else (Astro's errors name the file and line). Stuck protocol applies. And no, your letter doesn't get the starter's nav today; that's on purpose, and on Tuesday it gains a layout, components, and a second page.

The same script lives in the [starter's README](https://github.com/open-making/your-first-astro-site#interlude-moving-a-page-you-already-built) so you can replay it anytime, or catch up at your own pace if the afternoon ran fast.

**No homework tonight**; it's Saturday, and the schedule builds in rest on purpose. If you absolutely must touch a computer, poke around the starter's README, where steps 4 and 5 preview what Tuesday holds.

## Today's Links

- [Our Astro starter](https://github.com/open-making/your-first-astro-site) - the README is a full tutorial; today we did steps 0 to 3
- [Astro documentation](https://docs.astro.build/) - for the curious
- [Node & npm quiz](/web2026/quiz-node-and-npm)
- [The terminal, explained gently (MDN)](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line)
