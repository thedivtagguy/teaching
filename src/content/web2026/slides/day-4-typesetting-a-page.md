---
date: 2026-07-15T12:00
updated: 2026-07-23T09:00
transition: none
---
# Typesetting a page

### Day 4: web2026

---

> made my head hurt

> I am not in a state to write anything

> Ctrl + Panic

---

> ##### JNJEBHJVBEFJNVIUESBVUIDFKJDVFEVFDVFDVFDV 

> hey there is always a rise after the fall

---

![](IMG-20260723024945025.png)

---

## CSS Detection 🔍

1. which **HTML elements** do you see?
2. which **CSS** made it look like that?

---

# Round 1: Real world

---

## Round 1 · Card 1

![nav|900](IMG-20260723024945059.png)

---

## Round 1 · Card 1 

![nav|380](IMG-20260723024945059.png)

`nav` · `a` · `button` · `svg`

- `display: flex` (logo, links, buttons in a row)
- `gap` (even space between the links)
- `border-radius` (the soft "Contact sales" button)

---

## Round 1 · Card 2

![cards|900](IMG-20260723024945085.png)

---

## Round 1 · Card 2

![cards|440](IMG-20260723024945085.png)

`div` · `h1` · `p` · `a` · `span`

- `box-shadow` (the floating look)
- `border-radius` (rounded corners)
- `flex` + `gap` (two cards, even row)

---

## Round 1 · Card 3

![hero|860](IMG-20260723024945104.png)

---

## Round 1 · Card 3

![hero|440](IMG-20260723024945104.png)

`h1` · `span` · `p` · `a` · `img`

- `font-size` (the giant headline)
- `text-align: center` (all centred)
- `background-color` + `border-radius` (the pill around one word)

---

# Round 2: CSS Zen Garden 🧘


---

## Round 2 · Card 1

![zen|860](IMG-20260723024945150.png)

---

## Round 2 · Card 1

![zen|440](IMG-20260723024945150.png)

`header` · `h1` · `h2` · `a`

- `background-image` + `cover` (the photo banner)
- `color: white` (title over the photo)
- `font-style: italic` (the subtitle)

---

## Round 2 · Card 2

![zen|760](IMG-20260723024945184.png)

---

## Round 2 · Card 2

![zen|440](IMG-20260723024945184.png)

`h1` · `div` · `p` · `a` · `h3` (same HTML as Card 1)

- `background-image` (ocean, squid, parchment)
- `background-repeat: repeat-x` (the tiling water)
- `font-family: Georgia` (old-book serif)
- 🌶️ `position: absolute` (the pinned squid, later)

---

## Round 2 · Card 3

![zen|760](IMG-20260723024945214.png)

---

## Round 2 · Card 3

![zen|420](IMG-20260723024945214.png)

`header` · `h1` · `h2` · `div` · `p`

- `background-color` (magenta field, navy column)
- `font-weight: 700` (the bold heading)
- `background-image` (the circle icons, an SVG)
- 🌶️ `transform: rotate(-90deg)` (the sideways title)

---

# Round 3: Made in This Room 

---

## Round 3 · Card 1

![chaos|860](IMG-20260723024945253.png)

---

## Round 3 · Card 1 · Answer

![chaos|440](IMG-20260723024945253.png)

`section` · `h2` · `p`

- `background-image` + `background-repeat` (tiled gold sequins)
- `color` + `font-size: 75px` (giant green lyrics)
- 🌶️ `transform: rotate()` (the tilt)

---

## Round 3 · Card 2

![chaos|900](IMG-20260723024945311.png)

---

## Round 3 · Card 2

![chaos|440](IMG-20260723024945311.png)

`header` · `h1` · `p` · `section` · `img`

- `background-color` (blue banner, orange card)
- `border: 6px dashed` (the card frame)
- `font-family: Papyrus` (the joke font)
- 🌶️ `transform: rotate(5deg)` (the tilt)

---

## Round 3 · Card 3

![chaos|880](IMG-20260723024945343.png)

---

## Round 3 · Card 3

![chaos|460](IMG-20260723024945343.png)

`section` · `h2` · `p` · `audio`

- `background-image` + `cover` (the eye fills the section)
- `color: white` (text over the image)
- `text-align: center` (all centred)

---
# Tip: How to handle pictures

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

A folder holds files. It can also hold *other* folders, like `images/` there. It nests as deep as you like.

---

## A path is directions

When you write this:

```html
<img src="images/cat.jpg">
```

you're giving the browser directions from where it's standing to the file you want.

---

## Where do the directions start from?

Say your `index.html` is looking for `cat.jpg`:

```html
<img src="cat.jpg">          <!-- right here, next to me -->
<img src="images/cat.jpg">   <!-- go into the images folder, then grab it -->
<img src="/images/cat.jpg">  <!-- start from the site's root folder, then grab it -->
```

The leading `/` means "start from the very top." No slash means "start from where I am."

---

## 1. An image is as big as its file

A photo off your phone might be 4000 pixels wide. It does not care about your layout, and it will happily blow straight through it.

```css
img {
  max-width: 100%;
  height: auto;
}
```

Now every image shrinks to fit its container instead of the other way round.

---

## Steal an idea: Jen Simmons (20 mins)

Before you move on, look at what a page *can* do. Not to copy, but to raise your ambition.

Go to [**Jen Simmons' Labs**](https://labs.jensimmons.com/). Open it, poke around, screenshot anything that makes you feel that you'd like to try it too. Choose between **multi-column layout**, **dropcaps**, **floats** and **css shapes only.**

---

## The prinCSS and the p

---
## Step 1: Pick your story

[Pick one of HCA's stories](https://www.gutenberg.org/cache/epub/32572/pg32572-images.html) after you've read a few.

---

## Step 2: Sketch

Paper or Figma, I don't mind which. Two or three quick directions, then pick one.

Sketch **what you can build for real, according to you**. If you are unsure about what CSS would be required to execute a design, first try finding references and/or CSS properties. Only design what is possible for you at the moment.

---

## Step 3: Refine and review

Come to me with:
- your story
- your designs
- your art direction
