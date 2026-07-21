---
date: 2026-07-15T12:00
updated: 2026-07-21T14:57
transition: none
---

# HTML Is a Home

#### _WEB2026 - Day 2_

---

## Dev-Notes

No reports, but zooming out!

❌ "We explored old websites and learned how design changed over time."

✅ "Spent 20 minutes on a 1998 fan page for a band I've never heard of but for some reason the way it was _written_ kept me hanging around. It made me think about..."

---

## Plan for today

Morning: paper, scissors, and what even is HTML??

Afternoon: VS Code, a game, and Freddie Mercury.<!--element class="fragment"-->

---
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/CkzbI1Tv_rQ?si=BYMe8b1FHbngjXl4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

# Activity: Paper Layouts ✂️

---

## Sheet happens

1. Pick between a Zomato restaurant page or a newspaper website.

2. Ask: **"what are the big regions?"** Top bar? Main area? Menu?
   Cut one sheet of paper for each. Label it and glue onto your A4.

3. Pick one region. Ask **"what's inside this?"** Cut a piece for each thing and label and glue inside it.

4. Keep going until the pieces are single things:
   one heading, one photo, one button, one link.


---

## Rules

1. If two things belong together, they share a parent piece.
   A photo + its caption = both glued onto one "card".

2. Something must be glued onto something that's glued onto something.
   **Three layers deep, minimum.**

---

## Two things to remember

A piece is either fully inside its parent, or it's outside. There is no half-in.

Small things go on big things, never the other way around.<!--element class="fragment"-->


---
## WTH is "markup"?

Before computers, an editor would take a typed manuscript and scribble instructions all over it. *This line is the title. This bit, italics. New paragraph here.*

---

![](IMG-20260719213301816.png)

[Markup](https://www.ncbi.nlm.nih.gov/staff/beck/xml/markup/I-A.html) 

---

Here's some text. Browser be like "???"

```
Bohemian Rhapsody

Is this the real life?
Is this just fantasy?
```

---

Now we scribble on it:

```html
<h1>Bohemian Rhapsody</h1>

<p>Is this the real life?</p>
<p>Is this just fantasy?</p>
```


HTML never says how things look and only says what the things are.<!--element class="fragment"-->

---

# Tag, you're it

An HTML element is a start tag, some content, and an end tag.

```html
[tag] ────── content ────────── [tag]
<p>       some text...          </p>
└────────── element ──────────────┘
```

```html
<html> is for the root document
<head> is for meta information
<p> is for paragraphs
<audio> is for (lol take a guess)
```

---

## Tags come in pairs

`<p>` opens. `</p>` closes. 

```html
<!-- This sparks joy -->
<h1> Page Title </h1>

<!-- This does not spark joy -->
<h1> Page Title
```

If you open a paragraph and never close it, the browser has to guess where it ends. Browsers are dumbasses.<!--element class="fragment"-->

---

## And pairs have to match

Whoever opened last has to close first. Kind of like brackets in math?

```html
<b><i>bold and italic</i></b>    ← yes
<b><i>bold and italic</b></i>    ← no.
```

---

![](IMG-20260719213915346.png)


---

## Sheets and strips

This morning you had two kinds of paper: big sheets you glued things onto, and small strips you glued onto them.

HTML has the same two kinds.

```html
sheets: <div> <section> <ul> <h1> <p>
strips: <a> <span> <img> <b>
```

---

## Browsers are dumb but kind

If you break these rules, browsers don't show an error, but instead rearrange your page into something "legal". 

Things will still show up! But they aren't what you want them to be.

---

So a full document is just this idea, nested a few levels deep:

```html
<!DOCTYPE html>
<html>
   <head>
      <title>Hello, it's me</title>
   </head>
   <body>
      <h1>I was wondering if after all these years</h1>
      <p>You'd still like to meet</p>
      <p>Probably not.</p>
   </body>
</html>
```

---

Your paper version, typed out:

```html
<!DOCTYPE html>
<html>
  ┌─────────────────────────────────────┐
  │             METADATA                │
  │ <head>                              │
  │    <title>Hello, it's me</title>    │
  │ </head>                             │
  └─────────────────────────────────────┘
  ┌─────────────────────────────────────┐
  │             CONTENT                 │
  │ <body>                              │
  │    <h1>I was wondering if after     │
  │        all these years</h1>         │
  │    <p>You'd still like to meet</p>  │
  │    <p>Probably not.</p>             │
  │ </body>                             │
  └─────────────────────────────────────┘
</html>
```

---

### Every webpage is an html document

### Every website is a collection of linked documents <!--element class="fragment"-->

---

# Today's Special

Since we don't want to care about all the 132 tags today, here's what you want to read up on:

```html
<h1>......Main Heading
<p>.......Text Paragraph
<a>.......Hypertext Link
<img>.....Embedded Image
<div>.....Content Division
<ul>......Unordered List
<li>......List Item
<span>....Inline Container
```


---

# HTML Attributes

Attributes provide extra information about an element and are always included in the **start tag**. The two most important ones for styling are `id` and `class`.

```html
<h1 id="title" class="page-heading">
        Hello World
</h1>
```

<span>`id` A unique name for this element. It cannot be repeated.</span><!--element class="fragment"-->

<span>`class` A name for a group of elements. Multiple elements can share a class name and get styled together.</span><!--element class="fragment"-->

We'll use these to grab elements with CSS and style them.<!--element class="fragment"-->

---

### CSS

CSS is all about targeting HTML elements that we write and styling them. It is pretty simple to understand most of the time. See if you can understand what this does:

```css
#george {
  background: #e3e3e3;
  border-style: dotted;
  border-color: red;
}
```

---

```html
<nav class="menu">
   <a href="#" class="active">Home</a>
   <a href="#">About</a>
   <a href="#">Contact</a>
</nav>
```

```css
.menu a {
  color: white;
  text-decoration: none;
}

.menu a:hover {
  background: green;
}
```

`.menu a` means "links inside the menu". Selectors nest, because the HTML nests. Paper, again.

---

# Game time #1

---

# Pick me pick me

So you have your HTML and you want to write some CSS for it. The first hurdle is learning how to **select** the element you want to style.

Head over to [CSS Diner](https://flukeout.github.io/) and get started.

**There are 32 levels, but you only need to get till level 10-12.**

**Time: 20 Minutes**

---

# Lunch 🍛

When we're back we'll meet VS Code and you'll create a travesty.

---


<iframe width="100%" height="100%" src="https://www.youtube.com/embed/BUZIaTHm_oE?si=MeYrYVMOZPGyVJM9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

# Setting Up Your Lab 👩‍🔬

---

# Self-serve counter

Please refer to the [**Guides**](https://teaching.aman.bh/web2026/guides) page on the course website.

Preflight Checklist:

1. You've [installed our class "profile" on VS Code](https://teaching.aman.bh/web2026/guides#installing-the-class-vs-code-profile). 
2. You've [logged into Github Desktop](https://teaching.aman.bh/web2026/guides#github-desktop). 


---

# Take a sad site and make it sadder

---

# Bohemian Rhapsody 👨‍🎤

By the end of this exercise, you will have a crappy website on the internet. Lessssgooooo.

---


I have marked up the entire song in clean, semantic HTML.

Your job is to give it styles. BUT, it has to be messy, ugly, a complete Dada-ist masterpiece. Ugly. A CRIMEEE!!

<div class="fragment">

**You have to find out how to commit each crime against design yourself.** Ask "how do I make text blink?" and go search.
</div>

---


1. Go to this link:

```bash
https://github.com/open-making/web2026-bohemian-rhapsody
```

2. Click **Fork** (a photocopy of my project for you to vandalize)

3. Clone your fork with GitHub Desktop

4. Open it in VS Code and fire up Live Server


---

## Knowing what to search is a huge skill

---
## Is Aman a boomer? Who searches anymore?

notes: output isn't the only point.


---

## What searching builds that asking doesn't

1. **Vocabulary.**

2. **Relationships between things** 

3. **A nose for wrongness.** 

notes:  Searching forces you to learn what things are *called*. Names are how you think about a medium. /  MDN shows you how things are related to other things. Margin sits next to padding, next to border. You get much more information in the process.  / Docs, Stack Overflow, blogs disagree. Deciding who to trust is a skill. 

---

##  Better your vocabulary, the better your prompts

"make it look nicer" → garbage in, garbage out

"increase the margin between sections" → great!

**People who read docs are *better* at using LLMs.** <!--element class="fragment"-->

You're not choosing between skills. One feeds the other.<!--element class="fragment"-->

---

## Search first, then ask

Use LLMs to *explain* things you found, not to *produce*
things you didn't.


---

### Time: 90 Minutes

Here are some sample properties to try:

https://github.com/open-making/web2026-bohemian-rhapsody/blob/main/css-properties.md

**Tips to make your life easier**

1. Enable a [split editor](https://code.visualstudio.com/docs/getstarted/userinterface#_side-by-side-editing) so you can edit two files side by side.
2. Live Server reloads as you save.

---
## The problem

`final.html`
`final-v2.html`
`final-v2-REALLY-use-this-one.html`
`final-v2-FOR-REAL-MUMMY-KASAM-use-this-one.html`


---

## The fix: commits

A **commit** is a save-game checkpoint for your projects. What changed, when, and a tiny message saying why.


You can always go back to any checkpoint.


Today we do this with GitHub Desktop: it shows you what changed, you write a message, you click **Commit**, then **Push**. Push sends your checkpoints to GitHub, safe from laptop accidents.

---

# Houston, we're ready for takeoff.

---

## Right now, your site lives on your laptop

Yesterday we dragged and dropped our websites in Netlify, but that's a pretty clumsy way to do it.

Would you want to drag and drop every single time you made a change? 

---

# Netlify and Chill

Please refer to the [**Guides**](https://teaching.aman.bh/web2026/guides#connecting-your-repository-to-netlify) page for a guide on how to set your project up. 

---

# Your site is live!

And because Netlify watches your GitHub repo: every push updates the live site. Commit, push, published.<!--element class="fragment"-->


Everything you make after this will be better.<!--element class="fragment"-->

---

## Quick Recap

You are now armed with the knowledge of:

1. Markup: labels saying what things are<!--element class="fragment"-->
2. Tags, pairs, and what nests inside what<!--element class="fragment"-->
3. CSS selectors for targeting elements<!--element class="fragment"-->
4. Forking, cloning, committing, pushing<!--element class="fragment"-->
5. Deploying a static site to Netlify<!--element class="fragment"-->

That's a massive amount for one day!<!--element class="fragment"-->

---

## Stay committed and see you tomorrow