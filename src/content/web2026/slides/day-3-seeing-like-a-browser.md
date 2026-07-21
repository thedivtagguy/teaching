---
date: 2026-07-15T12:00
updated: 2026-07-21T23:53
transition: none
---
# Seeing Like a Browser
### _Day 3 - WEB2026_

---

## Yesterday
- Understanding HTML in terms of sheets and strips
- CSS selectors for grabbing elements to style them
- Deploying a monstrosity to the internet







---

> it sounded easy at first. But the more I thought about it, it was not easy? or is it? coz we were thinking and taking certain decison to make it ugly. Even an "ugly" website is designed in its own way.


---

> On the other hand traditional method (learning step by step, like syntax/property-wise) could have been like deep learning , but would have wasted lot of time. And that doesn't make sense.

---

<split even gap="2">

> "It felt like [the] filmmaking process. HTML code is... structure and content, but then there are things like art direction, lighting, [and] set design... which is similar to the CSS part where we style the frame."

![IMG|500](https://media.tenor.com/gSH3zUtBzN4AAAAM/fist-bump-high-five.gif)

</split>

---


## Action Replayy

Things we need to remember from now on.

---

## How to select classes, ids, children and parents

- `#id` for ids
- `.className` for classes
- and everything else you learnt in CSS Diner

---

## VS Code tells you about your errors, pay attention 

![](IMG-20260721230316849.png)

---

## If things don't show up, you've typed something wrong

Is it the correct file name? Is it in the right folder? Is it the correct className? 

There's a different between `thisclass` and `Thisclass` even though they look the same!


---

> I don't yet have the full grasp of what exactly are the things that can be achieved from CSS


---

## CSS Zen Garden

[This was a project from over a decade ago](https://csszengarden.com/) where people got the same HTML file but styled it in all sorts of ways. 

---

![](IMG-20260721230702305.png)

---

![](IMG-20260721230723127.png)

---

![](IMG-20260721230738239.png)

---

![](IMG-20260721230750418.png)

---

![](IMG-20260721230802199.png)

---


## Can we start seeing pages as tags?

---

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot **paragraph elements?**

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot **heading elements?**

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot **an image?**

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot the use of `background-color`?

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

Can you spot the use of `color`?

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122784.png)

---

# The Box Model 📦


```
┌─ margin ────────────────────────────┐
│  ┌─ border ─────────────────────┐   │
│  │  ┌─ padding ─────────────┐   │   │
│  │  │                       │   │   │
│  │  │       content         │   │   │
│  │  │                       │   │   │
│  │  └───────────────────────┘   │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Padding**: space inside the walls.

**Margin**: space between houses.

---

## First, let's practice this detective work

---

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723001122873.png)

**What HTML elements do you see?**

---

## What CSS techniques would you search for?

- "CSS card layout" <!--element class="fragment"-->
- "CSS border rounded" <!--element class="fragment"-->
- "CSS box shadow" <!--element class="fragment"-->
- "CSS side by side layout" <!--element class="fragment"-->

---

## The Browser Inspector 🦴

**Right-click → Inspect Element** on any website!

See the boxes, tweak the values, break things for fun.

---

## Let's try it live!

1. Open one of your Bohemian Rhapsody monstrosities from yesterday
2. Right-click on something interesting
3. Click "Inspect" or "Inspect Element"
4. Look at the HTML structure
5. Look at the CSS styles on the right and change them

---

![](/assets/slides/day-3-seeing-and-searching/IMG-20250723075655721.png)

---

## Activity: Sniffing Things 🕵️

**20 minutes**

1. Pick any website from [CSS Zen Garden Gallery](https://csszengarden.com/pages/alldesigns/)
2. Inspect it with browser tools
3. Write down:
    - What is the effect (in words)?
    - What HTML tags are used?
    - What CSS properties create the visual effect?
    - What would you search for to recreate this?

---

## So how do things sit side by side?

---

# Flexbox 🐸

Put boxes in a **row** or a **column**, sharing the space between them.

<split even gap="2">

![display block|360](/assets/slides/day-3-seeing-like-a-browser/flex-off.png)

![display flex|360](/assets/slides/day-3-seeing-like-a-browser/flex-on.png)

</split>

---

## Which way does the line go?

<split even gap="2">

![row|360](/assets/slides/day-3-seeing-like-a-browser/flex-row.png)

![column|360](/assets/slides/day-3-seeing-like-a-browser/flex-column.png)

</split>

One property flips a navbar into a sidebar.

---

## Two axes

<split even gap="2">

![justify-content|360](/assets/slides/day-3-seeing-like-a-browser/flex-justify.png)

![align-items|360](/assets/slides/day-3-seeing-like-a-browser/flex-align.png)

</split>

**justify-content** works along the row. **align-items** works across it.

---

## Spaces between us...

<split even gap="2">

![no gap|360](/assets/slides/day-3-seeing-like-a-browser/flex-gap-off.png)

![gap|360](/assets/slides/day-3-seeing-like-a-browser/flex-gap-on.png)

</split>

`gap` adds space between children. More of the family (`flex-wrap`, `order`, `flex-grow`) shows up in the exercises!

---

## Game time

Head to [Flexbox Froggy](https://flexboxfroggy.com).

**35 minutes.** Get to around level 13 at least.

---


## Exercise Time: Space Oddity

You know the scene! Make the same moves as Bohemian Rhapsody:

1. **Fork** [open-making/web2026-space-oddity](https://github.com/open-making/web2026-space-oddity) on GitHub
2. Open **GitHub Desktop** → Clone *your* fork
3. **Open in VS Code**
4. Right-click `index.html` → **Open with Live Server**

---

## How it works

- The landing page links every exercise
- Each folder has its own README with the task
- Most have a `goal.png` to check against
- Fix the CSS, write the CSS, write the HTML, build from a screenshot

---

# Stuck? 🦆

1. **Rubber duck it**
2. **Check the docs**
3. **Ask a neighbor**
4. **Ask me or an LLM**, with the actual error, the actual code, expected vs. got

---

## Git minute ⏱️

---

## Letters of Note

Tomorrow we start designing some letters! The start of your first properly designed project. 