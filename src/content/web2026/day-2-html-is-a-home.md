---
title: Day 2 - HTML Is a Home
date: 2026-07-21
description: What markup really is, nesting with paper and scissors, CSS selectors, your first (ugly) deploy
published: false
section: Foundations
order: 2
seo_title: HTML Is a Home
seo_description: What markup really is, nesting with paper and scissors, CSS selectors, and deploying your first website
seo_keywords: web design, HTML, CSS, semantic HTML, web development course, portfolio website
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-19T21:49
slug: day-2-html-is-a-home
slides: https://teaching.aman.bh/slides/web2026/day-2-html-is-a-home
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/2
readings:
  - title: Scroll, Skim, Stare
    author: Orit Gat
    url: https://web.archive.org/web/20250215172659/https://www.thewhitereview.org/feature/scroll-skim-stare/
    readingTime: 20
  - title: Taking an internet walk
    author: Spencer Chang & Kristoffer Tjalve
    url: https://syllabusproject.org/syllabus-for-taking-an-internet-walk/
    readingTime: 20
assignments: true
---
## Day 2: HTML Is a Home

**We start with television:** two short videos on HTML, including a lovely one that explains nesting with physical objects. Then we put the laptops away.

**Paper layouts (30 min):** You get A4 sheets, scissors, glue, and a pen. Pick a website you use every day, or invent one, and build it out of paper. Every element is its own labelled piece; anything that lives *inside* something else gets glued *on top of* it. A menu with three links is one strip with three smaller strips glued on. The thing paper teaches you for free: a piece is either fully inside its parent or fully outside, there is no half-in. That's the hardest idea in HTML, and you'll have learned it with glue.

**Then we write it down.** *Markup* is an old print word: editors scribbling instructions on manuscripts for the typesetter. This line is the title, this bit italics. HTML is the same trick, and the browser is your typesetter. From there, the mechanics: tags come in pairs, whoever opens last closes first, and some boxes only hold certain things (a `<p>` doesn't hold a `<div>`, a `<ul>` holds only `<li>`s). Break these rules and the browser won't error; it will quietly rearrange your page and let you wonder why your CSS isn't working.

**Then CSS:** targeting the elements you wrote and styling them. Selectors are how you grab things; `id`s are unique names, classes are shared ones. We'll practice with **CSS Diner**. Fair warning: it's addictive.

**After lunch, the lab:** a tour of VS Code, Live Server, and our first *commit* with GitHub Desktop, a saved checkpoint of your work pushed safely to GitHub. We'll do this in the last five minutes of every class until it feels boring, which is the point.

**And then: the ugly site.** I've marked up the whole of **Bohemian Rhapsody** in clean, semantic HTML. Your mission is to make it the ugliest website you possibly can. Clashing colors, cursed fonts, marquee-level chaos. One rule: you have to *find out how* to commit each crime yourself (searching and asking is the skill we're actually training). We'll deploy the monstrosities to Netlify, and along the way talk about what a server actually is, what "static" means, and why any of this is free.

Details on the [assignments page](/web2026/assignments).

## Today's Links

- [Bohemian Rhapsody starter repo](https://github.com/open-making/web2026-bohemian-rhapsody) - Fork this in class
- [CSS Diner](https://flukeout.github.io/) - CSS selector practice game
- [CSS Properties List](https://github.com/open-making/web2026-bohemian-rhapsody/blob/main/css-properties.md) - A menu of possible crimes
- [MDN HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference) - Complete HTML documentation
- [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) - Complete CSS documentation
- [HTML & CSS Basics videos](https://www.youtube.com/@laurelschwulst) - Laurel Schwulst's gentle introductions
- [GitHub Desktop docs](https://docs.github.com/en/desktop) - The save-game button, explained
