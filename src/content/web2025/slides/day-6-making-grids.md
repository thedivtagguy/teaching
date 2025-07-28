---
date: 2025-07-26T22:19
updated: 2025-07-28T09:40
transition: none
---
# Making Grids

_Day 6: WEB2025_

---

## Let us have Taylor Swift do a small recap

---

### Lines of code written

<split left="3" right="1">

![](IMG-20250728093825860.png)

![](IMG-20250728093825887.png)

</split>

---

### Top tags used

<split left="3" right="1">

![iMG|400](IMG-20250728093825904.png)

![](IMG-20250728093825920.png)

</split>

---

### Top properties used

<split left="3" right="1">

![](IMG-20250728093825933.png)

![](IMG-20250728093825947.png)

</split>

---

### Most of your colors

<split left="3" right="1">

![](IMG-20250728093825960.png)

![](IMG-20250728093825975.png)

</split>

---

### Fonts

<split left="3" right="1">

![](IMG-20250728093825992.png)

![](IMG-20250728093826009.png)

</split>

---

## Verdict: Great Job

But we need to clear up a few things before we move forward...

---

### Missing Doctype Declaration

Many forget `<!DOCTYPE html>` at the beginning of HTML files.

Use the boilerplate from earlier slides to avoid this from happening.

---

```html
<!-- Bad: Missing Doctype -->
<html>
  <head>
    <title>My Story</title>
  </head>
  <body>
    <p>Once upon a time...</p>
  </body>
</html>
```

---

```html
<!-- Good: Doctype included -->
<!DOCTYPE html>
<html>
  <head>
    <title>My Story</title>
  </head>
  <body>
    <p>Once upon a time...</p>
  </body>
</html>
```

---

### Missing Essential Meta Tags

- Missing `lang` attribute
- Missing `<meta charset="UTF-8">`
- Missing viewport meta tag

Boilerplate please.

---

```html
<!-- Bad: Missing lang, charset, and viewport -->
<html>
  <head>
    <title>My Story</title>
  </head>
```

---

```html
<!-- Good: Essential meta tags included -->
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Story</title>
  </head>
```

---

### Invalid HTML Elements and Syntax

Do not create non-existent HTML tags or use invalid syntax.

<br/>

- Using `<p1>`, `<p2>` instead of `<p>` with classes
- Using `<bottom>` tag (doesn't exist!)
- Invalid attribute syntax mixing HTML & CSS

The browser will try its best to render stuff _anyway_, but that doesn't always mean it is right. Google!

---

```html
<!-- Bad: Invalid tags and attributes -->
<p1 class="text">This is wrong</p1>
<bottom id="footer">Footer content</bottom>
<img src="logo.png" width="380" height: 200px;>
```

---

```html
<!-- Good: Correct tags and attributes -->
<p class="intro-text">This is correct</p>
<footer id="footer">Footer content</footer>
<img src="logo.png" width="380" height="200" alt="Company Logo">
```

---

### Improper HTML Nesting

- `<p> <h3>content</h3> </p>` - heading inside paragraph
- Unclosed tags and malformed structure

---

```html
<!-- Bad: Incorrectly nested heading -->
<p>
  <h3>This is a heading inside a paragraph, which is invalid.</h3>
</p>
```

---

```html
<!-- Good: Correctly structured heading and paragraph -->
<h3>This is a proper heading.</h3>
<p>This is a paragraph that follows the heading.</p>
```

---

## 2. CSS Organization

---

### Mixing Inline Styles with External CSS

Inconsistently using both inline styles and CSS classes makes code hard to maintain.

In general, **do not style in HTML**.

---

```html
<!-- Bad: Inline styles mixed with classes -->
<p class="para1" style="width: 1150px; color: red;">Text here</p>
<div style="text-align: center;">Content</div>
```

---

```html
<!-- Good: All styles in separate CSS -->
<p class="intro-paragraph">Text here</p>
<div class="centered-content">Content</div>
```

```css
.intro-paragraph {
  width: 1150px;
  color: red;
}
.centered-content {
  text-align: center;
}
```

---

### Embedding All CSS in `<style>` Tags

Most projects avoided external CSS files despite linking to them.

---

```html
<!-- Bad: All CSS in the HTML file -->
<head>
  <title>My Page</title>
  <style>
    body { background-color: lightblue; }
    h1 { color: navy; }
  </style>
</head>
```

---

```html
<!-- Good: CSS linked from external file -->
<head>
  <title>My Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
```

---

### What did I name that...

Avoid using non-descriptive class names that don't tell you _what something is_.

---

```css
/* Bad: Vague and inconsistent names */
.para1, .para2, .para3 { }
.P1, .P2, .P4 { }  /* Inconsistent capitalization */
.box1, .box2, .box3 { }
```

---

```css
/* Good: Descriptive and consistent names */
.story-introduction { }
.character-dialogue { }
.chapter-heading { }
```

---

### Duplicate and Unused CSS Rules

CSS rules defined multiple times or never used:

- Same class defined twice with different properties
- Empty CSS rules like `.bg{}`

---

```css
/* Bad: Duplicate and empty rules */
.campass {
  width: 50px;
}
.bg {}
.campass {
  height: 50px;
}
```

---

```css
/* Good: Combined and clean rules */
.campass {
  width: 50px;
  height: 50px;
}
```

---

## 3. Layout

---

### Overusing `<br>` Tags for Layout

Do not use `<br>` tags instead of CSS for margins/padding.

---

```html
<!-- Bad: Using <br> for spacing -->
<p>Some text</p>
<br><br><br>
<p>More text</p>
```

---

```html
<!-- Good: Using CSS for spacing -->
<p class="intro">Some text</p>
<p class="content">More text</p>
```

```css
.intro {
  margin-bottom: 3rem;
}
```

---

### Absolute Positioning

---

```css
position: absolute;
```

---

```css
position: absolutely-not;
```

---

## 4. File Management

---

### Poor File Naming

Do not use file names with spaces and special characters:

- `"Frame\ 1\ \(6\).png"` - spaces and special characters
- `IMG_4043 (1).PNG` - what is this image without opening it.
- `Untitled_design-removebg-final-final-preview.png` - please don't.

---

```
# Bad names
"My Picture 1.jpg"
"photo (2).PNG"

# Good names
"header-picture-1.jpg"
"photo-of-a-cat.png"
```

---

### Hardcoded File Paths

File paths that won't work when files are moved or deployed.

---

```css
/* Bad: Absolute path from local machine */
background-image: url("C:/Users/Student/Documents/Project/images/background.jpg");
```

---

```css
/* Good: Relative path */
background-image: url("../images/background.jpg");
```

---

## 5. Maintenance

---

### Inconsistent Indentation and Formatting

Code that's hard to read due to poor formatting. **Install Prettier from the `Install Guides` please**.

---

```html
<!-- Bad: Inconsistent indentation -->
<div>
<p>This is a paragraph.</p>
  </div>
```

---

```html
<!-- Good: Consistent indentation -->
<div>
  <p>This is a paragraph.</p>
</div>
```

---

### Duplicate Loading

Loading the same fonts or resources multiple times.

---

```html
<!-- Bad: Loading same font twice -->
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">
```

---

```html
<!-- Good: Loading font once -->
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">
```

---

It is okay to make mistakes.

### We'll get better at these as we move forward

---

## Discussion Time

Jen Simmons argues that **web layout must evolve beyond templated, single-column designs** embracing _art direction_ and _editorial design_ principles inherited from print to **communicate the idea of the story** through intentional organization of words and visuals.

---

## Discussion Time

In groups of 2-3, take 20 minutes to discuss what from her talk stuck with you.

Some opening questions to get you started:

- What does 'art direction on the web' mean to you after watching the talk?
- Which examples from her presentation challenged your assumptions about web layout?

**On some paper, draw a few quick sketches of what you remember from her examples, this can be anything that stuck out**.

---

# Lay of the land

---

## What about the process last week annoyed you?

---

## Despite potential difficulties, what made you design your pages that way?

---

## What challenges do you anticipate in translating print editorial design to the web?

---

## Web design is _finished_ in the browser

---

## Flexbox taught us layouts in one dimensions

Columns or rows

---

For two dimensions, we have

# CSS Grid


---

![](IMG-20250728093826024.png)


---

![](IMG-20250728093826039.png)


---

![](IMG-20250728093826054.png)


---

![](IMG-20250728093826068.png)


---

![](IMG-20250728093826079.png)


---

![](IMG-20250728093826090.png)

---

## Grids can be of two types

- Implicit grid
- Explicit grid

---

![](IMG-20250728093826109.png)

---

## You can mix and match units

---

## r u fr?

The coolest CSS grid unit is `fr` which stands for `fraction`.

`fr` is calculated based on the remaining space when combined with other length values.

---

![](IMG-20250728093826125.png)

---

![](IMG-20250728093826140.png)

note: In this example, `3rem` and `25%` would be subtracted from the available space before the size of `fr` is calculated: 1fr = ((width of grid) - (3rem) - (25% of width of grid)) / 3

---

![](IMG-20250728093826166.png)

---

![](IMG-20250728093826199.png)

---

![](IMG-20250728093826234.png)

---

![](IMG-20250728093826257.png)


See more at [Learn CSS Grid](https://learncssgrid.com/)


---

# Code Along

Laptops open please.

---


This is a snippet from a section on [The New York Times](https://nytimes. com) that we'll try to recreate.

![](IMG-20250728093826270.png)

---

What does this look like as a grid?

![](IMG-20250728093826282.png)

---

## Step 1: HTML Structure First

Let's start with the HTML markup for our magazine layout.

<split left="3" right="1">

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Morning - Magazine Layout</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="magazine-grid">
    <!-- Articles will go here -->
  </main>
</body>
</html>
```

Always start with proper HTML boilerplate!

</split>

---

## Step 2: Article Structure

Each article needs semantic HTML structure.

<split left="3" right="2">

```html
<article class="article featured">
  <header class="article-header">
    <span class="author">VANITA GUPTA</span>
    <h1 class="headline">
      You May Not Be Trump's Target This Time. 
      But You Could Be Next.
    </h1>
    <span class="read-time">5 MIN READ</span>
  </header>
</article>
```


- `<article>` for each story
- `<header>` for article metadata
- `<h1>` for main headlines
- `<span>` for supplementary info

</split>

---

## Step 3: Complete HTML Structure

<split left="3" right="1">

```html
<main class="magazine-grid">
  <!-- Featured article (top) -->
  <article class="article featured">
    <header class="article-header">
      <span class="author">VANITA GUPTA</span>
      <h1 class="headline">
        You May Not Be Trump's Target This Time. 
        But You Could Be Next.
      </h1>
      <span class="read-time">5 MIN READ</span>
    </header>
  </article>

  <!-- Two medium articles -->
  <article class="article medium">
    <header class="article-header">
      <span class="author">JOHN MCWHORTER</span>
      <h2 class="headline">
        A Term So Outdated, Even President 
        Trump Wouldn't Use It
      </h2>
      <span class="read-time">4 MIN READ</span>
    </header>
  </article>

  <article class="article medium">
    <header class="article-header">
      <span class="author">EMILY HOLZKNECHT AND JESSICA GROSE</span>
      <h2 class="headline">
        This Is What Having Children Cost Us
      </h2>
      <span class="read-time">4 MIN READ</span>
    </header>
  </article>
</main>
```

- `magazine-grid` for container
- `article` for base styles
- `featured`, `medium` for sizing
- Consistent structure across articles

</split>

---

## Step 4: More Articles

<split left="3" right="1">

```html
  <!-- Two more medium articles -->
  <article class="article medium">
    <header class="article-header">
      <span class="author">JAMELLE BOUIE</span>
      <h2 class="headline">
        JD Vance Claims One of Our Worst 
        Traditions as His Own
      </h2>
      <span class="read-time">8 MIN READ</span>
    </header>
  </article>

  <article class="article medium">
    <header class="article-header">
      <span class="author">JEFFREY TOOBIN</span>
      <h2 class="headline">
        The Line Trump Crossed by Accusing 
        Obama of Treason
      </h2>
      <span class="read-time">4 MIN READ</span>
    </header>
  </article>

  <!-- Newsletter section (bottom) -->
  <section class="newsletter">
    <header class="newsletter-header">
      <span class="section-name">THE MORNING</span>
      <h2 class="newsletter-title">The Protein Boom</h2>
      <p class="newsletter-description">
        Protein is remaking the food economy. 
        How much do you really need?
      </p>
      <span class="read-time">3 MIN READ</span>
    </header>
    <div class="newsletter-logo">
      <img src="https://images.unsplash.com/photo-1747767763480-a5b4c7a82aef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NTM2MzM2NTl8&ixlib=rb-4.1.0&q=80&w=400" alt="The Morning">
    </div>
  </section>
```

</split>

---

## Step 5: Reset and Base Styles

Now let's start with CSS. Always begin with a reset and base styles.

```css
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  line-height: 1.4;
  color: #333;
  background-color: #fff;
}

/* Container styles */
.magazine-grid {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
}
```

---

## Step 6: Article Base Styles

```css
.article-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.author {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #666;
  text-transform: uppercase;
}

.read-time {
  font-size: 0.75rem;
  color: #666;
  margin-top: auto;
}
```

---

## Step 7: Typography Styles

```css
/* Typography */
.headline {
  font-weight: 700;
  line-height: 1.2;
  margin: 0.5rem 0;
}

.featured .headline {
  font-size: 2rem;
}

.medium .headline {
  font-size: 1.25rem;
}

/* Newsletter styles */
.newsletter {
  background-color: #ffb3ba;
  border: 2px solid #000;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.section-name {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #666;
  text-transform: uppercase;
}

.newsletter-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.newsletter-description {
  font-size: 0.9rem;
  margin: 0.5rem 0;
}
```

---

## Now The Magic: CSS Grid

Time to create our magazine layout with CSS Grid!

---

## Step 8: Basic Grid Setup

<split left="3" right="1">

```css
.magazine-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  /* Grid setup */
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 1.5rem;
}
```

- `display: grid` creates grid container
- `grid-template-columns: 1fr 1fr` = 2 equal columns
- `grid-template-rows: auto` = rows size to content
- `gap: 1.5rem` = space between grid items

</split>

---

## Step 9: Grid Item Placement

Grid lines are numbered starting from 1:

- `grid-column: 1 / -1` = from line 1 to the last line
- `grid-column: 1 / 2` = from line 1 to line 2 (first column)
- `grid-column: 2 / 3` = from line 2 to line 3 (second column)

---

<split left="3" right="1">

```css
/* Grid item positioning */
.featured {
  grid-column: 1 / -1; /* Span full width */
  grid-row: 1;
}

.medium:nth-child(2) {
  grid-column: 1;
  grid-row: 2;
}

.medium:nth-child(3) {
  grid-column: 2;
  grid-row: 2;
}

.medium:nth-child(4) {
  grid-column: 1;
  grid-row: 3;
}

.medium:nth-child(5) {
  grid-column: 2;
  grid-row: 3;
}

.newsletter {
  grid-column: 1 / -1; /* Span full width */
  grid-row: 4;
}
```

- `grid-column: 1 / -1` spans full width
- `grid-column: 1` places in first column
- `grid-column: 2` places in second column
- `nth-child()` targets specific items

</split>

---

## What about mobile?

For dealing with mobile, CSS gives us a new kind of query called a `media query`.

```css
@media (max-width: 768px) {

/* Anything inside this targets screens sizes below 768px */

}
```

---

But you could also _start_ from mobile and say,

> Hey, these are the default styles for mobile. Once I've got that down, anything else is incremental so I will target stuff _above_ the width for mobile.

---

```css

h1 {
     font-size: 16px;
}

 @media (min-width: 768px) {
     h1 {
         font-size: 24px;
    }
}

```

Now, anything _above_ `768px` will get the font size of 24px.

---

## Step 11: Making It Responsive

<split left="3" right="1">

```css
/* Mobile-first responsive design */
.magazine-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

/* All items stack on mobile */
.featured,
.medium,
.newsletter {
  grid-column: 1;
}

/* Tablet and desktop */
@media (min-width: 768px) {
  .magazine-grid {
    grid-template-columns: 1fr 1fr;
    padding: 2rem;
  }
  
  .featured {
    grid-column: 1 / -1;
  }
  
  .newsletter {
    grid-column: 1 / -1;
  }
}
```

- Start with single column (mobile)
- Use media queries for larger screens
- Grid automatically reflows content
- Adjust padding for different screen sizes

</split>

---

## Step 12: Complete CSS

<split left="3" right="1">

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 
    'Segoe UI', Roboto, sans-serif;
  line-height: 1.4;
  color: #333;
  background-color: #fff;
}

.magazine-grid {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.article,
.newsletter {
  padding: 0.5rem;
}

.article-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.author,
.section-name {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #666;
  text-transform: uppercase;
}

.headline {
  font-weight: 700;
  line-height: 1.2;
  margin: 0.5rem 0;
}

.featured .headline {
  font-size: 2rem;
}

.medium .headline {
  font-size: 1.25rem;
}

.newsletter-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.read-time {
  font-size: 0.75rem;
  color: #666;
  margin-top: auto;
}

.newsletter {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
}

.newsletter-description {
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

@media (min-width: 768px) {
  .magazine-grid {
    grid-template-columns: 1fr 1fr;
    padding: 2rem;
  }
  
  .featured {
    grid-column: 1 / -1;
  }
  
  .newsletter {
    grid-column: 1 / -1;
    flex-direction: row;

  }
  

}
```

- Mobile-first responsive design
- Semantic HTML structure
- CSS Grid layout
- Typography hierarchy

</split>

---


- Start with HTML structure first
- Use semantic elements (`<article>`, `<header>`, etc.)
- Mobile-first responsive approach
- Test in browser dev tools
- Add CSS _after_ markup, rearrange stuff _after_ markup

---

### Game Time

Learn the grid syntax a bit better by playing the game at [CSS Grid Garden](https://cssgridgarden.com). 


![](IMG-20250728093826294.png)

---

## Exercise Time

Code at least 3 of the five layouts in a new project. 

---

![](IMG-20250728093826305.png)

---

![](IMG-20250728093826317.png)

---

![](IMG-20250728093826339.png)

---

![](IMG-20250728093826350.png)

---

![](IMG-20250728093826363.png)

