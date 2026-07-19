---
date: 2026-07-15T12:00
updated: 2026-07-19T17:35
transition: none
---

# HTML Is a Home

#### _WEB2026 - Day 2_

---

## Welcome back!

Yesterday you made a website in four minutes with Notepad.

Using the same understanding, we'll build something a little bigger today.

---

## But first: sticky notes

**Markup the room.**

You have sticky notes with tags on them:
`<header>` `<nav>` `<main>` `<aside>` `<footer>` `<h1>` `<p>` `<img>`

In pairs: stick them on things in this room. Or on each other.

Where's the `<header>` of a person? What's the `<aside>` of this classroom?<!--element class="fragment"-->

---

# HTML

---

# Hyper
# Text
# Markup
# Language

---

## HTML is the material of the web

**It organizes your page for the browser to understand.**

Human-readable. Words, not "programming" syntax. Uses tags.

---

### Every webpage is an html document

### Every website is a collection of linked documents <!--element class="fragment"-->

---

```html
<!DOCTYPE html>
<html>
   <head>
      <title>Hello, it's me</title>
   </head>
   <body>
      <h1>I was wondering if after all these years</h1>
      <p>You'd still like to meet</p>
      <br/>
      <p>Probably not.</p>
   </body>
</html>
```

---

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
  │    <br/>                            │
  │    <p>Probably not.</p>             │
  └─────────────────────────────────────┘
</html>
```

---

# Tag, you're it

An HTML element is defined by a start tag, some content, and an end tag.

```html
[tag] ────── content ────────── [tag]
<p>       some text...          </p>
└────────── element ──────────────┘
```

Tags always come in pairs.

---

# Now: HTML is a home 🏠

Yesterday's file was a room. A real page is a house.

---

```html
<body>
  <header>   the porch & nameplate: who lives here     </header>
  <nav>      the hallway signage: where things are     </nav>
  <main>     the living room: where living happens     </main>
  <aside>    the shelf of curiosities along the wall   </aside>
  <footer>   the basement: important, rarely visited   </footer>
</body>
```

---

## And a `<div>`?

A `<div>` is a **cardboard box**.

Fine for storage. Genuinely useful.<!--element class="fragment"-->

But if your whole house is cardboard boxes, your guests get confused. <!--element class="fragment"-->

So: rooms first (`header`, `main`, `footer`...), boxes when nothing else fits.<!--element class="fragment"-->

---

## Why bother with rooms?

- **Browsers** read them (Reader Mode knows what `<main>` is)
- **Screen readers** navigate by them: a blind visitor can jump straight to `<main>`
- **Search engines** rank them
- **Future you** understands the house they built

---

# The second metaphor: 📰

Grab a newspaper from the stack. Yes, a real one.

---

## Label it in pen

Find and circle:

- The **masthead** (the paper's name)
- A **headline**, and the **byline** under it
- The **lede** paragraph
- A **pull-quote**
- A **caption** under a photo

---

## Now translate

| On paper | On the web |
|---|---|
| Masthead | `<header><h1>` |
| Headline | `<h2>` |
| Byline | `<p class="byline">` |
| Lede | `<p>` (maybe with a big first letter, later!) |
| Pull-quote | `<blockquote>` |
| Caption | `<figcaption>` |

Newspapers solved information hierarchy a century before the web. We get to borrow all of it.

---

# Today's Special

The tags to actually remember today:

```html
<h1>......Main Heading
<p>.......Text Paragraph
<a>.......Hypertext Link
<img>.....Embedded Image
<div>.....Content Division (the cardboard box)
<ul>......Unordered List
<li>......List Item
<span>....Inline Container
```

---

# HTML Attributes

Attributes provide extra information about an element, in the **start tag**. The two that matter for styling: `id` and `class`.

```html
<h1 id="title" class="page-heading">
        Hello World
</h1>
```

<span>`id`: a unique name for this ONE element. Cannot repeat.</span> <!--element class="fragment"-->

<span>`class`: a name shared by a GROUP of elements, styled together.</span> <!--element class="fragment"-->

---

### CSS

CSS is all about targeting the HTML elements we write, and styling them. See if you can read this:

```css
#george {
  background: #e3e3e3;
  border-style: dotted;
  border-color: red;
}
```

"Find the element with `id="george"`. Gray background. Dotted red border."<!--element class="fragment"-->

That's it. Selector, then declarations. That's CSS.<!--element class="fragment"-->

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

`.menu a` means "links inside the menu". Selectors can *combine*.

---

# Game time 🍽️

---

# Pick me pick me

The first hurdle in CSS is learning how to **select** the element you want to style.

Head over to [CSS Diner](https://flukeout.github.io/) and get started.

**32 levels; you only need to reach level 10–12.**

#### Time: 20 Minutes

---

# Git minute #1 ⏱️

*(This will take five minutes today, and five minutes every day, until it feels completely routine.)*

---

## The problem

`final.html`
`final-v2.html`
`final-v2-REAL.html`
`final-v2-REAL-use-this-one.html`

We've all been there.<!--element class="fragment"-->

---

## The fix: commits

A **commit** is a save-game checkpoint for your whole project.

- What changed
- When
- And *why* (you write a tiny message)

You can always go back to any checkpoint. It's a time machine.

---

## Today: GitHub Desktop

1. Open GitHub Desktop, add your project folder
2. It shows you *exactly* what changed
3. Type a short message: `"Make the background offensive"`
4. Click **Commit**, then **Push**

Push = send your checkpoints to GitHub, where your code lives online, safe from laptop accidents.

**Last five minutes of every class, forever: commit + push.**

---

# Take a sad site and make it sadder

---

# Hey Jude 🎸

By the end of this exercise, you will have a crappy website on the internet.

I have a barebones HTML page. Your job: give it styles. BUT it has to be messy, ugly, a complete Dada-ist masterpiece.

**One rule: you must find out how to commit each crime yourself.** Search. Ask. That's the skill.

---

<split left="2" right="1">

<div>

1. Go to this link:

```bash
https://github.com/open-making/web2026-hey-jude
```

2. Click **Fork** (a photocopy of my project, for you to vandalize)

3. Clone your fork with GitHub Desktop

4. Open in VS Code, fire up Live Server

</div>

![Fork Icon|200](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)

</split>

---

### Time: 90 Minutes

Sample properties to try:

https://github.com/open-making/web2026-hey-jude/blob/main/css-properties.md

Tips:
1. [Split editor](https://code.visualstudio.com/docs/getstarted/userinterface#_side-by-side-editing): HTML and CSS side by side
2. Live Server reloads as you save

---

# Houston, we're ready for takeoff 🚀

---

# Netlify and Chill

[Netlify](https://netlify.app) takes our code and puts it on a URL anyone, anywhere can access. Free.

1. Go to [Netlify.com](https://netlify.com), login **with your GitHub account**
2. Add a new site → 'Import Existing Project'
3. Select GitHub, find your hey-jude fork
4. Click deploy

In a few minutes: your monstrosity, live, with a silly URL.

---

# Your site is LIVE

Day two, and you have deployed a website to the actual internet.

It's hideous. That's exactly right.<!--element class="fragment"-->

Everything you make after this will be better.<!--element class="fragment"-->

---

## Quick Recap

You are now armed with:

1. HTML tags, and the house they build<!--element class="fragment"-->
2. CSS selectors for targeting elements<!--element class="fragment"-->
3. Commit + push: the save-game ritual<!--element class="fragment"-->
4. Forking and cloning repositories<!--element class="fragment"-->
5. Deploying to Netlify<!--element class="fragment"-->

That's a massive amount for one day!<!--element class="fragment"-->

---

## Before you go

**Git minute.** Commit today's chaos. Push it.

(Message suggestion: `"Committed crimes against design, on purpose"`)

Homework: finish your ugly site, due **start of Day 4**. Two evenings, 90 minutes each, stuck-notes count.
