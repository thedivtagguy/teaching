---
date: 2026-07-15T12:00
updated: 2026-07-21T22:47
transition: none
---

# Setting Type, Placing Images
### _Day 4 - WEB2026_

---

## Where we are

Yesterday we learned to push boxes around. Flexbox: a parent, its children, who sits where.

But we never asked what goes *inside* the boxes.

---

## That's today.

A webpage, when you strip everything else away, is two things:

**words, and pictures.**

Type and images. Get those right and most of the page is already good. So that's the whole day: how to set text well, how to place an image without it fighting you, and then a project that needs both.

---

# Part 1: Type

---

Most of a page is text. So most of designing a page is really just deciding how the text looks.

Someone put a number on it:

> Web design is 95% typography

~ Oliver Reichenstein, [ia.net](https://ia.net/topics/the-web-is-all-about-typography-period)

I think he's mostly right.

---

# But first, a game: Type Crimes 🚨

Three exhibits on the screen. The class is the jury.

For each one: **what's wrong here?** Shout it out.

---

## Exhibit A

*(a menu / poster / website with the works: six fonts, centered body text, letter-spaced lowercase, lines running 200 characters wide)*

<!-- TODO: add 3 exhibit screenshots to the vault (local finds are funnier than famous ones) -->

---

## Here's the thing

You already *felt* what was wrong. You winced before anyone explained a rule.

You have design eyes. What you don't have yet is the vocabulary to say *why*, and the CSS to fix it.

That's all today is: names for the wincing.<!--element class="fragment"-->

---

## Typesetting isn't magic

It's four small decisions, made on purpose instead of by accident.

Here they are, in order of how much they matter.

---

# Decision 1: Line length

The single most common mistake on amateur sites: lines that run too wide. Your eye gets lost finding the way back to the start of the next line.

Aim for **45 to 75 characters** per line.

```css
article {
  max-width: 65ch;
}
```

`ch` is a unit that means "the width of a character." So `65ch` is roughly 65 letters wide. Neat, isn't it.

---

# Decision 2: Line height

Lines of text sitting too close together feel cramped. A little air makes a paragraph readable.

```css
body {
  line-height: 1.6;   /* 1.5 to 1.7 reads nicely */
}

h1 {
  line-height: 1.2;   /* big headings can sit tighter */
}
```

`1.6` means "one-and-a-bit times the font's own height." No units, just a multiplier.

---

# Decision 3: A few sizes, chosen on purpose

A page needs maybe **three or four** text sizes. Not twelve.

```css
h1 { font-size: 2.5rem; }     /* the title */
h2 { font-size: 1.5rem; }     /* section headings */
p  { font-size: 1.1rem; }     /* the body */
small { font-size: 0.85rem; } /* captions, footnotes */
```

Pick your handful and stick to them. If you want help picking, [typescale.com](https://typescale.com/) hands you a set.

---

# Decision 4: Two typefaces, at most

One for **headings**, allowed some personality.

One for **body text**, which should be quiet and just let you read.

That's it. Two. A third rarely helps and usually hurts.

Free fonts: [Google Fonts](https://fonts.google.com/), [Fontshare](https://www.fontshare.com/).

---

## Actually using a web font

Google Fonts gives you a `<link>` to paste in your `<head>`. Then you name the font in CSS:

```css
body {
  font-family: 'Crimson Pro', Georgia, serif;
}
```

The names after the comma are backups. If the first font hasn't loaded yet, the browser falls back to the next one, and so on. Always leave a backup or two.

---

## One nice thing, if you want it

A dropcap, the big first letter like an old book:

```css
p:first-of-type::first-letter {
  initial-letter: 3;
}
```

Poke around [Jen Simmons' labs](https://labs.jensimmons.com/): dropcaps, columns, text wrapping a shape. Pick *one* for your project. One is elegant. Three is a mess.

---

# Part 2: Pictures

---

That's words handled. Now pictures.

But there's a small thing standing in the way, and nearly everyone trips on it at least once. So we're going to deal with it first, properly.

**A picture is a file. And before you can put a file on a page, you have to be able to say where the file lives.**

---

## Your project is a folder

Everything for one website sits in one folder. Open it and you'll see:

```
my-site/
├── index.html
├── style.css
└── images/
    └── cat.jpg
```

A folder holds files. It can also hold *other* folders, like `images/` there. It nests as deep as you like. That's the whole idea of a folder.

---

## A path is just directions

When you write this:

```html
<img src="images/cat.jpg">
```

you're giving the browser directions from where it's standing to the file you want.

It's no different from telling a friend: *go into the kitchen, the mug's on the second shelf.*

---

## Where do the directions start from?

Say your `index.html` is looking for `cat.jpg`:

```html
<img src="cat.jpg">          <!-- right here, next to me -->
<img src="images/cat.jpg">   <!-- go into the images folder, then grab it -->
<img src="/images/cat.jpg">  <!-- start from the site's front door, then follow -->
```

The leading `/` means "start from the very top." No slash means "start from where I am." Most of the time you want one of the first two.

---

## Two ways this bites you

**One: capital letters matter.** `Cat.JPG` and `cat.jpg` are two different files as far as the server is concerned.

Your Mac shrugs and finds it anyway. Netlify does not. The image works on your laptop, vanishes online, and you lose an hour.

**So, a rule for this whole course: filenames stay lowercase. Always.**<!--element class="fragment"-->

---

## Two: when it goes missing, ask the browser

Image not showing? Open devtools → the **Network** tab → refresh.

The red line shows you *exactly* what the browser went looking for. Compare that to what's actually in your folder.

Nine times out of ten the bug is right there in the difference: a capital letter, a wrong folder, a typo.<!--element class="fragment"-->

---

## Right. Now the pictures themselves. 🖼️

Four things to know, and images stop fighting you.

---

## 1. An image is as big as its file

A photo off your phone might be 4000 pixels wide. It does not care about your layout, and it will happily blow straight through it.

Write this once and forget about it:

```css
img {
  max-width: 100%;
  height: auto;
}
```

Now every image shrinks to fit its container instead of the other way round.

---

## 2. Fitting an image to a box

Want every picture in a tidy box the same shape?

```css
.card img {
  width: 300px;
  height: 200px;
  object-fit: cover;
}
```

`cover` fills the box and crops whatever spills over. `contain` fits the whole thing inside, gaps and all.

For photos of people, use `cover`. Nobody wants their face stretched.

---

## 3. Give an image a proper home

```html
<figure>
  <img src="images/moth.jpg"
       alt="A moth on a lit lampshade at night">
  <figcaption>The visitor, 2am.</figcaption>
</figure>
```

`<figure>` wraps the picture, `<figcaption>` is the little label underneath. The museum frame and its plaque.

---

## 4. Write the alt text like a person

`alt` is the text that stands in for the image: for screen readers, for a broken link, for search.

```html
❌ alt="image"        ❌ alt="photo1"
✅ alt="Hand-drawn map of my street, annotated in red"
```

Describe what matters about the picture, to someone who can't see it. Takes ten seconds, means a lot.

---

## And one habit: shrink your files

A 14MB photo will make your whole site feel broken on a phone.

Drop it into [squoosh.app](https://squoosh.app/), watch it get 90% smaller with no visible difference, and use *that* one.

Rough rule: if a file is over 500KB, ask it why.

---

## What we're leaving alone today

**Floats**: an old way of doing layout. We'll wave from a distance.

**`position: absolute`**: the course rule is *ask before you absolute*. Nine times in ten, flexbox does the job with far less pain. I've lost whole evenings to a single stubborn absolutely-positioned image, and I'd rather you spend those evenings on type.

---

# Part 3 💌

You can set type. You can place a picture. That's genuinely everything a real page needs.

So let's make one that's worth the effort.

---

# Letters to a Young Designer

---

## The project

Real letters, one human writing to another:

Rilke to a young poet. Van Gogh to his brother Theo. Ada Lovelace to Babbage. Seneca to Lucilius.

**You pick one. You set it so beautifully the writer would forgive you for putting it on a screen.**

---

## Why a letter?

- A letter already has a voice, and someone it's speaking to. Half the design brief is written for you.
- It's almost pure text, so there's nowhere to hide. This is a typography project, and you just learned typography.
- And next week, you write the reply. On your own website.<!--element class="fragment"-->

More on that after the weekend.<!--element class="fragment"-->

---

## How the week goes

| When | What |
|---|---|
| Today, afternoon | Pick it, read it, sketch it, gather your bits, **no code** |
| Tomorrow | The make day. You build it, all day, in the browser |
| Saturday | It moves into Astro (yes, really) |
| Next week | The reply, and shipping it |

---

## What I'll be looking for

- **Typography doing the work.** Fonts that suit the letter's age and mood.
- **Two images at most**, cleaned up properly. Restraint is part of the brief.
- **One Jen Simmons technique** you haven't tried before.
- **No AI images.** Public-domain pools, or your own hands.

Full brief's on the assignments page.

---

## This afternoon, you don't write code

No VS Code. No `index.html`. Not today.

The whole point of today is to plan well enough that tomorrow is *just building*. A sketch in your hand is worth an hour of flailing at the keyboard, I promise you.

---

## Step 1: Pick your letter

The menu's on the assignments page. Take twenty minutes. Read a few properly.

Pick the one that makes you feel *something*. You'll be living with it for a week.

---

## Step 2: Read it twice, and listen

Read it again, slowly. What's the mood, before you've chosen a single font?

What should someone feel looking at this page, before they've read a word of it?

Whatever that feeling is, everything else you do serves it.

---

## Step 3: Sketch

Paper or Figma, I don't mind which. Two or three quick directions, then pick one.

Sketch **what you can actually build**: rows and columns, generous margins, one nice moment. No magic, only the tools you already have.

---

## Step 4: Gather your bits

- **Fonts**: two, one for headings, one for the body
- **Images**: at most two, from the [public-domain pools](/web2026/day-4-setting-type-placing-images#image-pools), cleaned up in Squoosh (cropped, shrunk, lowercase names)
- **Colors**: three or four, chosen on purpose, not grabbed at random

---

## Step 5: Show me before you leave

Come find me with:

- your letter
- your sketch
- your bits, in a folder

That's your ticket into tomorrow. No sign-off, no building. This is the one checkpoint I'm strict about.

---

## Git minute ⏱️

Commit your sketches and your assets. Push. (Yes, even with no code written, you always leave with *something* saved.)

Tomorrow: the make day. Bring your sketch, your bits, and a rested head.
