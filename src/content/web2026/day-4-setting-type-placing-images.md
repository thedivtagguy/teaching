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
updated: 2026-07-15T12:00
slug: day-4-setting-type-placing-images
slides: https://teaching.aman.bh/slides/web2026/day-4-setting-type-placing-images
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/4
assignments: true
readings:
  - title: Revolutionize Your Page
    author: Jen Simmons
    url: https://www.youtube.com/watch?v=aYgMExb-mlo
    readingTime: 60
---
## Day 4: Setting Type, Placing Images

Ninety-five percent of web design is typography, said someone wise (it was [Oliver Reichenstein](https://ia.net/topics/the-web-is-all-about-typography-period)). Today we take that seriously, and we finally give images the lesson they deserved all along.

**Warm-up (10 min):** _Type crimes._ I'll show three real-world typographic sins: a menu, a poster, a website. The class prosecutes: what's the crime? (Too-long lines? Six fonts? Centered body text? Letter-spaced lowercase?) Learning to name what's wrong is half of learning the rules.

### Part 1: Typography on the web

- **Measure**: lines of text should be 45 to 75 characters. This one rule fixes more amateur sites than any other.
- **Line-height, size, and hierarchy**: a page needs maybe three or four text sizes, chosen deliberately.
- **Pairing**: two typefaces, maximum, for now. One for headings with personality, one for body that disappears politely.
- **Web fonts**: how to actually load a font from Google Fonts or Fontshare, and what it costs.
- One showpiece technique from **Jen Simmons' labs**: a dropcap with `initial-letter`, multicolumn text, or text wrapping a shape. Pick one that suits your letter (see below).

### Part 2: The image survival kit

Images have a way of quietly eating hours if nobody shows you the basics, so today we cover, hands-on:

- **Where image files live** in your project and how to reference them (yesterday's paths lab pays off immediately).
- **Sizing**: why images blow out layouts, `max-width: 100%`, and the difference between resizing in CSS and resizing the actual file.
- **`object-fit`**: cover vs. contain, i.e. cropping images to fit boxes without squishing anyone's face.
- **`<figure>` and `<figcaption>`**: the semantic home for images with captions.
- **Alt text**: what it's for (screen readers, broken images, search engines) and how to write it like a considerate human.
- **Compression**: a 14MB photo will make your site feel broken. We'll use [Squoosh](https://squoosh.app/) to make images web-sized. Rule of thumb: if an image file is bigger than 500KB, ask it why.

What we're deliberately **not** doing today: floats (they're a historical curiosity now; we'll wave at them from a distance) and `position: absolute` (the rule for this course is *ask before you absolute*, because nine times out of ten flexbox or grid does it better with less pain).

### Part 3: Letters to a Young Designer 💌

Our first real project launches today. You'll pick one **public-domain letter from a great artist, designer, or thinker** (Rilke writing to a young poet, Van Gogh writing to his brother Theo, Ada Lovelace, Seneca, Keats) and typeset it into a webpage so beautiful that the writer would forgive the medium.

This is your first real portfolio piece. One page, vanilla HTML and CSS, typography-first. Later next week it gains a second page (your *reply*, more on that after the weekend) and becomes your first Astro site. Today: read the letter menu, pick one that actually speaks to you, and start sketching.

Full brief on the [assignments page](/web2026/assignments). Design review with me before you code; grab me today or tomorrow.

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
