---
title: Day 6 - Ask Better, Make a Clock
date: 2026-07-25
description: What can we learn about asking through a clock?
published: true
section: Building with Astro
order: 1
seo_title: Ask Better, Make a Clock
seo_description: Asking better questions, why frameworks exist, your first Astro project, and a clock to build with an LLM
seo_keywords: asking questions, debugging, Astro, static site generator, components, scoped CSS, LLM, make a clock, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-27T15:30
slug: day-6-ask-better-make-a-clock
slides: https://teaching.aman.bh/slides/web2026/day-6-ask-better-make-a-clock
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/8
readings:
  - title: How to Take Back the Internet
    author: Cory Doctorow
    url: https://www.greeneuropeanjournal.eu/cory-doctorow-how-to-take-back-the-internet/
    readingTime: 25
  - title: An app can be a home-cooked meal
    author: Robin Sloan
    url: https://www.robinsloan.com/notes/home-cooked-app/
    readingTime: 10
assignments: true
---
Week 2 begins and the training wheels start coming off. Today was about two things: asking better questions, and meeting our first framework. As your work gets more complex, your progress depends less on what you know and more on how well you ask, of yourself, an error message, a classmate, an LLM, and only then me.

Then we asked why frameworks exist and answered it from first principles: plain HTML gives you no way to write something once and reuse it everywhere. That leads to components, layouts, and scoped CSS, which is what Astro gives us. We set up a first Astro project and saw that a file in `src/pages/` becomes a URL. The day's exercise is to [make a clock, based on a segment in Kelin Zhang's "AI Studio" course @ RISD](https://risd-ai-studio.notion.site/Make-a-clock-d841eb2f3a804bc191a605f399feb0f7): sketch something that measures time, then use an LLM to bring it to life.

## Today's links

- [Kelin Zhang's "Make a clock" (AI Studio @ RISD)](https://risd-ai-studio.notion.site/Make-a-clock-d841eb2f3a804bc191a605f399feb0f7), which today's exercise is based on. Thank you, Kelin!
- [kala.watch](https://kala.watch/)
- [time.non-objective.works](https://time.non-objective.works/)
- ["Untitled" (Perfect Lovers)](https://en.wikipedia.org/wiki/%22Untitled%22_(Perfect_Lovers))
- [clocks.dev](https://clocks.dev)
- [Astro docs](https://docs.astro.build/)
- [Deploying an Astro site to Netlify](https://docs.astro.build/en/guides/deploy/netlify/#website-ui-deployment)

## Go further

- [Astro's "why Astro"](https://docs.astro.build/en/concepts/why-astro/), if you want to understand static-site generators beyond our use of them.
- [Svelte](https://svelte.dev), the other tool I reach for when a site needs to be more interactive.
- [Rubber duck debugging](https://rubberduckdebugging.com/), which is basically step two of our asking protocol.
- [Simon Willison on how he uses LLMs](https://simonwillison.net/2025/Mar/11/using-llms-for-code/), a grounded look at working with generated code without switching your brain off.
