---
title: Day 4 - Setting Type, Placing Images
date: 2026-07-23
description: Web typography, the image survival kit, and the launch of Letters to a Young Designer
published: false
section: Foundations
order: 4
seo_title: Setting Type, Placing Images
seo_description: Web typography fundamentals, image handling, and the Letters to a Young Designer project
seo_keywords: web design, typography, web fonts, images, object-fit, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-21T22:47
slug: day-4-setting-type-placing-images
slides: https://teaching.aman.bh/slides/web2026/day-4-setting-type-placing-images
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/4
assignments: true
---
## Day 4: Setting Type, Placing Images

Yesterday we learned to push boxes around with flexbox. Today we ask what goes *inside* the boxes, because a webpage, once you strip everything else away, is really just two things: words and pictures. Set the words well and place the pictures without a fight, and most of the page is already good. So that's the day, and at the end of it we start a project that needs both.

**Warm-up (10 min):** _Type crimes._ I'll put three real typographic sins on the screen (a menu, a poster, a website) and the class prosecutes. What's the crime? Too-long lines? Six fonts? Centered body text? You'll wince before anyone explains a rule, because you already have design eyes. What you don't have yet is the vocabulary to say *why*, and the CSS to fix it. That's really all today's first half is: names for the wincing.

### Part 1: Type

Ninety-five percent of web design is typography, said someone wise (it was [Oliver Reichenstein](https://ia.net/topics/the-web-is-all-about-typography-period)), and I think he's mostly right. Typesetting isn't magic; it's a handful of small decisions made on purpose instead of by accident. The four that matter most:

- **Line length.** The most common mistake on amateur sites is lines that run too wide, so your eye loses its way back to the start of the next one. Aim for 45 to 75 characters. In CSS that's `max-width: 65ch` (the `ch` unit is roughly one character wide).
- **Line height.** Lines sitting too close feel cramped; a little air makes a paragraph readable. `line-height: 1.6` for body text, a bit tighter for big headings.
- **A few sizes, chosen on purpose.** A page needs maybe three or four text sizes, not twelve. Pick your handful (a title, a heading, the body, a caption) and stick to them.
- **Two typefaces, at most.** One for headings, allowed some personality; one for body, quiet enough to just let you read. A third rarely helps. We'll load them from [Google Fonts](https://fonts.google.com/) or [Fontshare](https://www.fontshare.com/) and see how the `<link>` and `font-family` actually work.

And if you want one nice flourish, pick a single technique from **[Jen Simmons' labs](https://labs.jensimmons.com/)**: a dropcap, columns, or text wrapping a shape. One is elegant. Three is a mess.

### Part 2: Pictures (and the folders they live in)

That's words handled. Now pictures. But a picture is a *file*, and before you can put a file on a page you have to be able to say where it lives. Nearly everyone trips on this at least once, so we deal with it properly first.

Your whole project is a **folder**. Open it and you'll find your `index.html`, your `style.css`, and (from today) an `images` folder sitting next to them. A folder holds files, and it can hold other folders; it nests as deep as you like. When you write `<img src="images/cat.jpg">`, you're giving the browser *directions* from where it's standing to the file you want: go into the `images` folder, then grab `cat.jpg`. Same as telling a friend the mug is on the second shelf in the kitchen.

The only wrinkle is where the directions start from. `cat.jpg` means "right here, next to me." `images/cat.jpg` means "go into that folder first." A leading slash, `/images/cat.jpg`, means "start from the very front door of the site." Most of the time you want one of the first two.

Two things bite people, so we'll break them on purpose in class:

- **Capital letters matter.** `Cat.JPG` and `cat.jpg` are two different files to a server. Your Mac shrugs and finds it anyway; Netlify doesn't, so the image works on your laptop and vanishes online. The rule for this whole course: **filenames stay lowercase, always.**
- **When an image goes missing, ask the browser.** Open devtools → the Network tab → refresh. The red line shows you exactly what the browser went looking for; compare it to what's actually in your folder, and the bug is usually right there in the difference.

Once you can find a file, the pictures themselves are easy. Four things:

- **An image is as big as its file** (a phone photo is enormous and doesn't care about your layout). Write `img { max-width: 100%; height: auto; }` once and images shrink to fit their container forever after.
- **`object-fit`** fits a picture into a fixed box: `cover` fills and crops, `contain` fits the whole thing inside. Use `cover` for photos of people, so nobody's face gets stretched.
- **`<figure>` and `<figcaption>`** are the proper home for a picture and its caption: the museum frame and its plaque.
- **Alt text** is the words that stand in for the image, for screen readers and broken links and search. Describe what matters about it to someone who can't see it. Ten seconds, means a lot.

And one habit: a 14MB photo makes a whole site feel broken on a phone. Drop it into [Squoosh](https://squoosh.app/), watch it shrink 90% with no visible difference, and use *that* one. If a file is over 500KB, ask it why.

What we're deliberately **not** doing today: floats (an old way of doing layout; we'll wave from a distance) and `position: absolute` (the rule is *ask before you absolute*, because nine times in ten flexbox does the job with far less pain, and I've lost whole evenings to a single stubborn absolutely-positioned image).

#### Image pools

When a project needs images and you don't have your own, pull from public-domain and openly-licensed collections rather than a generic image search (and never AI imagery). Good pools to start from:

- [Wikimedia Commons](https://commons.wikimedia.org/) - vast, well-labelled, check the licence on each file.
- [The Met Open Access](https://www.metmuseum.org/art/collection/search?showOnly=openAccess) - public-domain artworks in high resolution.
- [Rawpixel Public Domain](https://www.rawpixel.com/public-domain) - vintage art, illustrations, and photography.
- [The Public Domain Review](https://publicdomainreview.org/) - curated historical images with clear provenance.
- [Unsplash](https://unsplash.com/) and [Openverse](https://openverse.org/) - free-to-use photography (still credit the maker).

Or, best of all, your own drawings and scans.

### Part 3: Letters to a Young Designer 💌 (the afternoon)

You can set type now, and you can place a picture. That's genuinely everything a real page needs, so let's make one that's worth the effort. You'll pick one **public-domain letter from a great artist, designer, or thinker** (Rilke to a young poet, Van Gogh to his brother Theo, Ada Lovelace, Seneca, Keats) and set it so beautifully the writer would forgive you for putting it on a screen. A letter is a good first project because it already has a voice and someone it's speaking to, and because it's almost pure text, which means there's nowhere to hide. This is a typography project, and you just learned typography.

It's your first real portfolio piece. One page, plain HTML and CSS. Next week it grows a second page (your *reply*, more on that after the weekend) and moves into Astro.

The afternoon is a **design studio, not a coding session**. No VS Code today; the whole point is to plan well enough that tomorrow is *just building*, because a sketch in your hand is worth an hour of flailing at the keyboard. You leave with four things, in this order:

1. **A letter.** Read the menu on the [assignments page](/web2026/assignments), read a few properly, and pick the one that makes you feel something. You'll live with it for a week.
2. **A feeling.** Read it again, slowly. What's the mood, before you've chosen a single font? What should someone feel looking at the page before they've read a word? Everything else serves that.
3. **A sketch.** Paper or Figma, two or three directions, then pick one. Sketch only what you can actually build: rows and columns, generous margins, one nice moment.
4. **Your bits, in a folder.** Two fonts (one for headings, one for the body), at most two images from the pools (cleaned up in Squoosh, lowercase names), and three or four colours chosen on purpose.

**Come show me before you leave: the letter, the sketch, the folder.** That's your ticket into tomorrow; no sign-off, no building. It's the one checkpoint I'm strict about.

## Today's Links

**Typography:**

- [Butterick's Practical Typography](https://practicaltypography.com/) - especially the [summary of key rules](https://practicaltypography.com/summary-of-key-rules.html)
- [Google Fonts](https://fonts.google.com/) & [Fontshare](https://www.fontshare.com/)
- [Type Scale calculator](https://typescale.com/)
- [Jen Simmons' Labs](https://labs.jensimmons.com/) - dropcaps, multicolumn, shapes, overlap

**Images:**

- [Squoosh](https://squoosh.app/) - compress images in the browser
- [MDN: object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
- [How to write good alt text](https://www.a11yproject.com/posts/alt-text/)

**Image pools (public domain only; no AI imagery in this course):**

- [Old Book Illustrations](https://www.oldbookillustrations.com/)
- [Heritage Library](https://www.heritagetype.com/pages/free-vintage-illustrations)
- [The British Library's Public Domain Image Collection](https://www.flickr.com/photos/britishlibrary)
- [Public Domain Image Archive (The Public Domain Review)](https://publicdomainreview.org/collections/)
- [The Library of Congress "Free to Use and Reuse Sets"](https://www.loc.gov/free-to-use/)
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Main_Page)
- [Metropolitan Museum of Art (Open Access)](https://www.metmuseum.org/about-the-met/policies-and-documents/open-access)
- [National Gallery of Art (Open Access)](https://www.nga.gov/open-access-images.html)
