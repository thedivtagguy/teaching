---
title: Day 5 - The Make Day
date: 2026-07-24
description: A full studio day building your pages in HTML and CSS
published: true
section: Foundations
order: 5
seo_title: The Make Day
seo_description: Bringing print pages to life with HTML and CSS
seo_keywords: web design, HTML, CSS, typography, flexbox, portfolio project, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-23T22:08
slug: day-5-the-make-day
slides:
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/7
assignments: true
---
## Day 5: Make Day

No new concepts today! We continue making our designs from yesterday. The one rule of today is to build in the right order. Sometimes we try to do everything at once and drown. We'll go one layer at a time.

| Order | Layer       | Checkpoint                                                                                                                                                         |
| ----- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | Basic HTML  | Translate your text into your bare, unstyled HTML. Does it read correctly? Without flexboxes or anything?                                                          |
| 2     | Typography  | Add your fonts, style them and get a good visual hierarchy going that can be understood from a distance.                                                           |
| 3     | Layout      | Style your CSS to create your layouts, positioning and any other other flourishes. Since the HTML is done by this point, you can now focus on the styles.css fi;e. |
| 4     | Polish      | Keep refining, add flourishes and refine the site as you go along.                                                                                                 |
| 5     | Deploy      | Make it live on Netlify!                                                                                                                                           |

## Starter Kit

To help you get started, I have written some minimal HTML and CSS boilerplate code (which means, code that just scaffolds the page but you have to add to it) [in this repository](https://github.com/open-making/web2026-fit-to-print). 

It has two set of starter files, one for each track. Fork and clone it, and then delete the folder you don't need and move things to the root folder. You are welcome to use this as a starting point for both of your projects. But please note that this is **strictly for getting started only**. I expect to see different layouts and decisions.

## Common traps & quick fixes

As your page grows, your code will get harder and harder to keep track of. At some point if you feel you are doing something that makes you feel like its wrong, it probably is and maybe there's a better way to do it! Try searching, or asking properly. 
### HTML

**Mark up meaning first.** Ensure that you use the right tag for what it is. Does it read fine with zero CSS?

```html
<!-- Bad -->
<div class="big-bold">The Nightingale</div>
<div class="quote">"A quote."</div>

<!-- Good -->
<h1>The Nightingale</h1>
<blockquote>"A quote."</blockquote>
```

**Use semantic tags, not `<div>` all the time.**

```html
<!-- Bad -->
<div class="top">...</div>
<div class="main">...</div>

<!-- Good -->
<header>...</header>
<main><article>...</article></main>
```

Reach for `<header>`, `<main>`, `<article>`, `<section>`, `<figure>` + `<figcaption>`, `<blockquote>`, `<em>`, `<strong>`.

`<div>` is the last resort.

**There is only one `<h1>` per page.** Then `<h2>`, `<h3>`, in order, no skipping. Pick by structure, but if you're worried about size, then style it in CSS.

**No blocks inside a `<p>`.** A `<p>` can't hold a `<div>`, `<blockquote>`, or another `<p>`.

```html
<!-- Bad -->
<p>Intro<blockquote>quote</blockquote></p>

<!-- Good -->
<p>Intro</p>
<blockquote>quote</blockquote>
```

**No style in the HTML.** No `style=""`. No `<br><br>` for spacing. No `<b>`/`<i>` for looks.

```html
<!-- Bad -->
<p style="margin-top: 40px; color: gray;">...</p>

<!-- Good -->
<p class="byline">...</p>
```

### CSS

**Name the className for what it is.** `.pull-quote`, not `.box3`.

**Don't repeat yourself. Group selectors if the styles are the same with commas**

```css
/* Bad */
.headline { font-family: Georgia, serif; color: #222; }
.deck     { font-family: Georgia, serif; color: #222; }

/* Good */
.headline, .deck { font-family: Georgia, serif; color: #222; }
```

**Repeated value? Set it once.** Use a variable. Change one line and you will see that every other value that uses it will update. It is defined like so:

```css
:root {
  --ink: #1a1a1a;
  --paper: #f4f1ea;
}

body { color: var(--ink); background: var(--paper); }
```

Very useful for setting your color palette, your font sizes and other values that you might be reusing again and again.

### As you work

- **Build in order.** HTML first and only then you style it.
- **Commit when a piece works.** Save progress all the time, otherwise who knows what can happen!
- **Use DevTools.** Right-click, Inspect. See the box, test CSS live before you write it.

### If you are stuck, ask LLMs the right way

The goal is to learn, not to copy. Ask so you understand the fix and can do it yourself next time.

**Ask *why*, not "fix it."**

```
Bad:   Fix my CSS.
Good:  My columns won't sit side by side. Why, and which property controls it?
```

**Give it context.** Paste the code, what you expected, and what happened instead.

```
Bad:   My layout is broken.
Good:  This <p> won't center. I tried text-align: center. Here's the code.
       I expected it centered, but it's still left. What am I missing?
```

**Ask which property or concept, then make the change yourself.** Get the pointer, do the edit.

**Ask "what's this called?"** so you can search it and learn it properly.

```
Good:  What's it called when text flows around an image? I want to read about it.
```

Besides this, please reach out to Aman over the course of the day to clear up any doubts and/or get some pointers if you are stuck. Looking forward to seeing what we've made on Monday!