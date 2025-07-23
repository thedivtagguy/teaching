---
date: 2025-07-22T13:05
updated: 2025-07-23T08:45
transition: none
---
# Seeing and Searching
### _Day 3 - WEB2025_

---

## Big plans ahead for the day!

And the start of our first mini-project. 

---

## Yesterday

- CSS and selectors
- Finding out what to pick
- Learning to search for stuff we want to do
- Building on pre-written markup

---

<split even gap="2">

> ...whatever we’ll create further on will somehow be better than what we did [yesterday]...

![IMG|500](https://media.tenor.com/gSH3zUtBzN4AAAAM/fist-bump-high-five.gif)

</split>

---

## How do I figure out what I want? 


---

## Before we do that, can we start seeing images as tags?

---

![](IMG-20250723001122784.png)

---

Can you spot **paragraph elements?** 

![](IMG-20250723001122784.png)

---
Can you spot **heading elements?** 

![](IMG-20250723001122784.png)

---

Can you spot **an image?** 

![](IMG-20250723001122784.png)

---

Can you spot the use of `background-color`?

![](IMG-20250723001122784.png)

---

Can you spot the use of `color`? 

![](IMG-20250723001122784.png)

---

![](IMG-20250723001122827.png)

---

What is that **space on the sides called?**

![](IMG-20250723001122827.png)

---

How do I **add space below headings**?

![](IMG-20250723001122827.png)

---

![](IMG-20250723001122841.png)

---

Okay I got an answer, but what does this mean? Why the space between the two values.

```css
margin: 0px 10px;
```

![](IMG-20250723001122851.png)

---

I went to MDN, and in the page was written...

![](IMG-20250723001122861.png)

---

# 🤠👍

---

## That was a good search!

But what made it a **good search**?

1. **We used specific keywords**: "margin", "CSS"
2. **We knew what we wanted**: "add space below"

---

## Let's practice this detective work

---


![](IMG-20250723001122873.png)

**What HTML elements do you see?**

---

## I spot:

- A `<div>` container for the whole card 
- An `<img>` for the picture 
- An `<h3>` or `<p>` for the website name 
- A `<a>` for the link 
- Another `<p>` for the label texts

---

## What CSS properties would you search for?

- "CSS card layout" <!--element class="fragment"-->
- "CSS border rounded" <!--element class="fragment"-->
- "CSS box shadow" <!--element class="fragment"-->
- "CSS side by side layout" <!--element class="fragment"-->

---

## The Browser Inspector 🦴

**Right-click → Inspect Element** on any website!

---

## Let's try it live!

1. Go to [this webpage](https://dazzling-dango-85bf7f.netlify.app/)
2. Right-click on something interesting
3. Click "Inspect" or "Inspect Element"
4. Look at the HTML structure
5. Look at the CSS styles on the right

---

![](IMG-20250723075655721.png)


---

## Activity: Sniffing Things 🕵️

**15 minutes**

1. Pick any website you visit regularly
2. Find something visually interesting
3. Inspect it with browser tools
4. Write down:
    - What HTML tags are used?
    - What CSS properties create the visual effect?
    - What would you search for to recreate this?

---

## Code-Along Session

First, copy the contents of [this settings file](https://gist.github.com/thedivtagguy/e0b41977d0c7da61d53e100bcd238db8) and keep it ready. 

1. Open VSCode
2. Type `CTRL + SHIFT + P`
3. Search for `Open User Settings JSON`
4. In the editor that opens, paste this content in and save.

Now we will have a nice, same-looking editor to work with. Please also look through the [Install Guide on How to Install Prettier](https://teaching.aman.bh/web2025/install-guides#pretty-formatting-your-code).

---

## To start off with, copy paste this into an HTML file

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Text Design</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Your content goes here -->
</body>
</html>
```


---
# The PrinCSS and the  p 🫛

---

You're going to take a piece of text and turn it into a beautifully designed webpage.

**But first**, you need to **see the design in your head**.

---


We'll be working with [Hans Christen Andersen's stories](https://www.gutenberg.org/cache/epub/27200/pg27200-images.html). Choose any one of these stories.

![](IMG-20250723001122882.png)

---

## Step 1: Read and Visualize

**1 hour**

1. Read your chosen text
2. Imagine how it should look on screen
3. Sketch it on paper (rough is fine!) or on Figma. 

Think about:

- What should stand out?
- Where should your eye go first?
- What mood should it convey?
- Do you need any images? 

---

## Step 2: Identify Your Building Blocks

Look at your sketch and identify:

- **Headings** - `<h1>`, `<h2>`, `<h3>`
- **Paragraphs** - `<p>`
- **Important words** - `<strong>` or `<span>`
- **Lists** - `<ul>`, `<ol>`, `<li>`
- **Quotes** - `<blockquote>`
- **Sections** - `<div>` or `<section>`

---

## Step 3: Plan Your Searches

Before you start coding, write down:

**What visual effects do I want?**

- "How do I change font size?"
- "How do I add background color?"
- "How do I center text?"

**What layout do I need?**

- "How do I create columns?"
- "How do I add space between elements?"

---

## Setup 🛠️


1. Create a new folder: `web2025-fairy-tales`
2. Create `index.html` and `style.css`
3. Start with the basic HTML structure
4. Style as you go, search as you need

---

## Your HTML starting template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Text Design</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Your content goes here -->
</body>
</html>
```

---

## Some search prompts to get you started:

- "CSS font family" - change the typeface
- "CSS line height" - adjust spacing between lines
- "CSS text align" - center, left, right alignment
- "CSS background gradient" - colorful backgrounds
- "CSS max width center" - limit content width and center it


---

## Need inspiration? Look around you!

How would I recreate this digitally?

- Book covers and their typography
- Magazine layouts
- Instagram posts
- Movie posters
- Other websites


---

## Pro tip: The 15-minute rule

**Stuck on something for more than 15 minutes?**

1. Take a screenshot of your problem
2. Ask a friend or instructor
3. Try a different approach
4. Save it and move to something else

Don't let one problem stop all progress!

---

## Wrapping up in 10 minutes...

**Be ready to show:**

1. Your finished design
2. One thing you searched for
3. One cool CSS property you discovered
4. One thing you want to improve next time

