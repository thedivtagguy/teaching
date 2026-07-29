---
title: Day 9 - Components, Layouts, and Markdown
date: 2026-07-30
description: Your site map becomes folders and files, with an LLM doing the typing
published: false
section: Building with Astro
order: 4
seo_title: Day 9 - Components, Layouts, and Markdown
seo_description: Astro components, props, slots, and layouts, built with an LLM assistant, plus a markdown section you can write into from Obsidian
seo_keywords: Astro, components, layouts, markdown, LLM, Obsidian, digital garden, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-28T23:00
slug: day-9-components-layouts-and-markdown
slides: https://teaching.aman.bh/slides/web2026/day-9-components-layouts-and-markdown
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/11
assignments: true
readings:
  - title: Here's how I use LLMs to help me write code
    author: Simon Willison
    url: https://simonwillison.net/2025/Mar/11/using-llms-for-code/
    readingTime: 25
---
# Day 9: Components, Layouts, and Markdown

Yesterday you drew a site map on paper. Today it becomes folders and files. You met Astro on Day 6, when a file in `src/pages/` became a URL. Today we learn the other three ideas Astro is built on, and then we build your site's skeleton.

One thing is different about today: **we build with an LLM.** The [AI policy](/web2026/ai-policy) has been clear from the start: code assistance is fine, your words are your own. Today that split becomes the whole method. The LLM types the scaffolding; every word on the site comes from your content inventory. You will spend less time typing code than reading it, and that is the skill I actually want you to leave with.

## The vocabulary

You need four words. Not to write the code from memory, but to *ask for the right thing* and to *recognize what you got*.

- **Component**: a piece of a page you build once and reuse. A card, a nav, a byline. If you can circle the same shape twice on your site map, it is a component.
- **Prop**: how a page passes information into a component. `<Card title="Hello" />` sends "Hello" in; the component catches it.
- **Slot**: the hole your content pours into. A layout is a picture frame; `<slot />` marks where the picture goes.
- **Layout**: a component that wraps a whole page. The `<head>`, the nav, the footer, written once. Every page pours itself into the same frame.

An LLM can produce all of this faster than any of us can type it. What it cannot do is know what your site is for, and you spent two days writing exactly that down. Your site map and your manifesto are the brief.

## The working loop

The method for the day, and for the rest of the course:

1. **Describe** what you want, small and specific, with your site map in the prompt. "A layout with my nav and footer, and a page for each of my three sections" beats "make me a website".
2. **Read** what came back before you paste it. Find the props, the slot, the layout. If you cannot say what a line is for, ask the LLM to explain it before you use it.
3. **Verify** in the browser. The dev server does not care what the LLM promised.
4. **When it breaks**, read the error, paste the error back with the file, and ask. Do not regenerate blindly until something compiles. Every error message you actually read makes the next one cheaper.

## The markdown garden bed

The afternoon's build: **one section of your site becomes a folder of markdown files**. Pick the section from your update plan with the fastest rhythm, the one that passed the 15-minute test most easily. Notes, links, a log.

Drop a `.md` file in the folder and it becomes a page; an index lists every file automatically. Then the part I have been waiting to show you: **open that folder in Obsidian.** Write a note in Obsidian, save, and your dev server picks it up. Your website is now a place you write into, not a codebase you reopen with dread. This loop, write a paragraph of markdown, push, done, is the thing that keeps personal sites alive after courses end.

## Homework

Finish your **content inventory** (assigned yesterday, due tomorrow morning). Tomorrow is design day, and you design with real words or not at all. If the inventory is done, collect a few websites whose look you admire; bring the links.

## Today's links

- [Astro docs: Components](https://docs.astro.build/en/basics/astro-components/)
- [Astro docs: Layouts](https://docs.astro.build/en/basics/layouts/)
- [Astro docs: Markdown](https://docs.astro.build/en/guides/markdown-content/)
- [Obsidian](https://obsidian.md/) - the markdown editor we point at your content folder
- [Simon Willison on using LLMs for code](https://simonwillison.net/2025/Mar/11/using-llms-for-code/) - linked on Day 6, assigned today. This is the grounded version of what we practiced.
