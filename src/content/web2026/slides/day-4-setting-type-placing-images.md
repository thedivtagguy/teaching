---
date: 2026-07-15T12:00
updated: 2026-07-23T09:00
transition: none
---
# Typesetting a page

### Day 4: web2026

---

## CSS Detection 🔍

1. which **HTML elements** do you see?
2. which **CSS** made it look like that?

---

# Round 1: Real world

---

## Round 1 · Card 1

![nav|900](assets/slides/day-4-setting-type-placing-images/r1-stripe-nav-q.png)

---

## Round 1 · Card 1 

![nav|380](assets/slides/day-4-setting-type-placing-images/r1-stripe-nav-q.png)

`nav` · `a` · `button` · `svg`

- `display: flex` (logo, links, buttons in a row)
- `gap` (even space between the links)
- `border-radius` (the soft "Contact sales" button)

---

## Round 1 · Card 2

![cards|900](assets/slides/day-4-setting-type-placing-images/r1-stripe-cards-q.png)

---

## Round 1 · Card 2

![cards|440](assets/slides/day-4-setting-type-placing-images/r1-stripe-cards-q.png)

`div` · `h1` · `p` · `a` · `span`

- `box-shadow` (the floating look)
- `border-radius` (rounded corners)
- `flex` + `gap` (two cards, even row)

---

## Round 1 · Card 3

![hero|860](assets/slides/day-4-setting-type-placing-images/r1-notion-hero-q.png)

---

## Round 1 · Card 3

![hero|440](assets/slides/day-4-setting-type-placing-images/r1-notion-hero-q.png)

`h1` · `span` · `p` · `a` · `img`

- `font-size` (the giant headline)
- `text-align: center` (all centred)
- `background-color` + `border-radius` (the pill around one word)

---

# Round 2: CSS Zen Garden 🧘


---

## Round 2 · Card 1

![zen|860](assets/slides/day-4-setting-type-placing-images/r2-zen214-q.png)

---

## Round 2 · Card 1

![zen|440](assets/slides/day-4-setting-type-placing-images/r2-zen214-q.png)

`header` · `h1` · `h2` · `a`

- `background-image` + `cover` (the photo banner)
- `color: white` (title over the photo)
- `font-style: italic` (the subtitle)

---

## Round 2 · Card 2

![zen|760](assets/slides/day-4-setting-type-placing-images/r2-zen213-q.png)

---

## Round 2 · Card 2

![zen|440](assets/slides/day-4-setting-type-placing-images/r2-zen213-q.png)

`h1` · `div` · `p` · `a` · `h3` (same HTML as Card 1)

- `background-image` (ocean, squid, parchment)
- `background-repeat: repeat-x` (the tiling water)
- `font-family: Georgia` (old-book serif)
- 🌶️ `position: absolute` (the pinned squid, later)

---

## Round 2 · Card 3

![zen|760](assets/slides/day-4-setting-type-placing-images/r2-zen221-q.png)

---

## Round 2 · Card 3

![zen|420](assets/slides/day-4-setting-type-placing-images/r2-zen221-q.png)

`header` · `h1` · `h2` · `div` · `p`

- `background-color` (magenta field, navy column)
- `font-weight: 700` (the bold heading)
- `background-image` (the circle icons, an SVG)
- 🌶️ `transform: rotate(-90deg)` (the sideways title)

---

# Round 3: Made in This Room 

---

## Round 3 · Card 1

![chaos|860](assets/slides/day-4-setting-type-placing-images/r3-anchita-q.png)

---

## Round 3 · Card 1 · Answer

![chaos|440](assets/slides/day-4-setting-type-placing-images/r3-anchita-q.png)

`section` · `h2` · `p`

- `background-image` + `background-repeat` (tiled gold sequins)
- `color` + `font-size: 75px` (giant green lyrics)
- 🌶️ `transform: rotate()` (the tilt)

---

## Round 3 · Card 2

![chaos|900](assets/slides/day-4-setting-type-placing-images/r3-darshan-q.png)

---

## Round 3 · Card 2

![chaos|440](assets/slides/day-4-setting-type-placing-images/r3-darshan-q.png)

`header` · `h1` · `p` · `section` · `img`

- `background-color` (blue banner, orange card)
- `border: 6px dashed` (the card frame)
- `font-family: Papyrus` (the joke font)
- 🌶️ `transform: rotate(5deg)` (the tilt)

---

## Round 3 · Card 3

![chaos|880](assets/slides/day-4-setting-type-placing-images/r3-sanskar-q.png)

---

## Round 3 · Card 3

![chaos|460](assets/slides/day-4-setting-type-placing-images/r3-sanskar-q.png)

`section` · `h2` · `p` · `audio`

- `background-image` + `cover` (the eye fills the section)
- `color: white` (text over the image)
- `text-align: center` (all centred)

---
# How to handle pictures

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

---
## Step 1: Pick your letter

The menu's on the assignments page. Take twenty minutes. Read a few properly.

Pick the one that makes you feel *something*. You'll be living with it for a week.

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
