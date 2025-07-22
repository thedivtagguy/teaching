---
date: 2025-07-12T21:50
updated: 2025-07-22T13:10
transition: none
---

# HTML, CSS and You

#### _WEB2025 - Day 2_

---


## Welcome back!

Let's do a recap.

---



# Introduction to HTML


---




<video autoplay loop muted preload="none"
       src="../assets/slides/day-2-html-css-and-you/youtube.mp4"
       style="max-width: 660px; display: flex; justify-content:center;">
</video>


---

<iframe width="100%" height="100%" src="https://www.youtube.com/embed/CkzbI1Tv_rQ?si=BYMe8b1FHbngjXl4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

# HTML

---

# Hyper
# Text
# Markup
# Language


---

## HTML is the material of the web

If you think of a website as a house, then **HTML is the bricks**. It provides the fundamental structure and content for everything you see online.

<br/>

**It organizes your page for the browser to understand.**


---


## Markup

- Human-readable, so it contains words rather than "programming" syntax
- Uses tags

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
  │    <br/>                        │
  │    <p>Probably not.</p>             │
  │ </body>                             │
  └─────────────────────────────────────┘
</html>
```


---

```html
┌─────────────────────────────────────────┐
│            HTML DOCUMENT                │
│ ┌─────────────────────────────────────┐ │
│ │         <!DOCTYPE html>             │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │              <html>                 │ │
│ │    ┌─────────────────────────────┐  │ │
│ │    │             METADATA        │  │ │
│ │    │ ┌─────────────────────────┐ │  │ │
│ │    │ │        <head>           │ │  │ │
│ │    │ │ ┌─────────────────────┐ │ │  │ │
│ │    │ │ │      <title>        │ │ │  │ │
│ │    │ │ │ Hello, it's me      │ │ │  │ │
│ │    │ │ │     </title>        │ │ │  │ │
│ │    │ │ └─────────────────────┘ │ │  │ │
│ │    │ │       </head>           │ │  │ │
│ │    │ └─────────────────────────┘ │  │ │
│ │    └─────────────────────────────┘  │ │
│ │    ┌─────────────────────────────┐  │ │
│ │    │             CONTENT         │  │ │
│ │    │ ┌─────────────────────────┐ │  │ │
│ │    │ │        <body>           │ │  │ │
│ │    │ │ ┌─────────────────────┐ │ │  │ │
│ │    │ │ │        <h1>         │ │ │  │ │
│ │    │ │ │ I was wondering if  │ │ │  │ │
│ │    │ │ │ after all these yrs │ │ │  │ │
│ │    │ │ │       </h1>         │ │ │  │ │
│ │    │ │ └─────────────────────┘ │ │  │ │
│ │    │ │ ┌─────────────────────┐ │ │  │ │
│ │    │ │ │         <p>         │ │ │  │ │
│ │    │ │ │ You'd still like    │ │ │  │ │
│ │    │ │ │    to meet          │ │ │  │ │
│ │    │ │ │        </p>         │ │ │  │ │
│ │    │ │ └─────────────────────┘ │ │  │ │
│ │    │ │ ┌─────────────────────┐ │ │  │ │
│ │    │ │ │         <p>         │ │ │  │ │
│ │    │ │ │   Probably not.     │ │ │  │ │
│ │    │ │ │        </p>         │ │ │  │ │
│ │    │ │ └─────────────────────┘ │ │  │ │
│ │    │ │       </body>           │ │  │ │
│ │    │ └─────────────────────────┘ │  │ │
│ │    └─────────────────────────────┘  │ │
│ │              </html>                │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---
# Tag, you're it

An HTML element is defined by a start tag, some content, and an end tag.

```html
<html> is for the root document
<head> is for meta information
<p> is for paragraphs
<audio> is for (lol take a guess)
```

---

Tags always come in pairs.

```html
[tag] ────── content ────────── [tag]
<p>       some text...          </p>
└────────── element ──────────────┘
```

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

```html
<div class="container">
    <section>
        <h1>Main Title</h1>
        <h2>Subtitle</h2>
        <p>This is a paragraph with <span>highlighted text</span> inside.</p>
    </section>
</div>
```

---

## There are divs and sections  everywhere for those with the eyes to see


---

![](IMG-20250716222043779.png)


---

```html
<!-- This sparks joy -->

[tag] ─────── content ─────────── [tag] 
<h1>         Page Title           </h1> 
  └────────── element ──────────────┘

<!-- This does not spark joy -->
[tag] ────── content 
<h1>        Page Title        
```
---

## Mini-Activity: Your First Webpage

---

Let's make something! No fancy tools yet, just a plain text editor. 


- Open a simple text editor (like Notepad on Windows or TextEdit on Mac).
    
- Type out the HTML skeleton below. Make the content your own, tweak a bit.
    
- Save the file as `index.html`. **Make sure the extension is `.html`, not `.txt`.**
    
- Find the file on your computer and double-click to open it in a browser.
  
```html
<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>[Your Name]'s Website</h1>
    <p>I am learning to code and this is my very first webpage!</p>
    <ul>
      <li>One thing I want to learn</li>
      <li>Another thing I want to build</li>
    </ul>
  </body>
</html>
```
---
# HTML Attributes 

Attributes provide extra information about an element and are always included in the **start tag**. The two most important ones for styling are `id` and `class`.

```html
<h1 id="title" class="page-heading"> 
		Hello World 
</h1>

```


The attributes are:

<span>`h1` The tag itself. </span> <!--element class="fragment"-->

<span>`id` A unique name for this element. It cannot be repeated.</span><!--element class="fragment"-->

<span>`class` A name for this class of elements. Multiple elements can share a class name and will be assigned the same properties defined in that class.</span><!--element class="fragment"-->

We'll use to grab these elements with CSS and style them.<!--element class="fragment"-->

---

### CSS

CSS is all about targeting HTML elements that we write and styling them. It is pretty simple to understand most of the time. See if you can understand what this does:

```html
<div id="george">
   <p> My paragraph here. </p>
   <ul>
      <li> List Item 1</li>
      <li> List Item 2</li>
   </ul>

   <ul>
      <li> List Item 3</li>
      <li> List Item 4</li>
   </ul>   
</div>
```

```css
#george {
  background: #e3e3e3;
  border-style: dotted;
  border-color: red;
}
```

---

<div id="george" class="isolated" style="background: #e3e3e3 !important; border-style: dotted !important; border-color: red !important; width:100%;">
   <p> My paragraph here. </p>
   <ul>
      <li> List Item 1</li>
      <li> List Item 2</li>
   </ul>
   <ul>
      <li> List Item 3</li>
      <li> List Item 4</li>
   </ul>   
</div>

<br/>
The CSS above creates a div with:
- Light gray background (#e3e3e3)
- Red dotted border



---

# Tell me more

I will! 

But let's circle back to Laurel for a bit. 

---

![](IMG-20250722093859529.png)

---

<iframe width="100%" height="100%" src="https://www.youtube.com/embed/BUZIaTHm_oE?si=MeYrYVMOZPGyVJM9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

```html
<nav class="menu">
   <a href="#" class="active">Home</a>
   <a href="#">About</a>
   <a href="#">Contact</a>
</nav>
```

```css
.menu {
  background: gray;
  padding: 10px;
}

.menu a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  margin-right: 10px;
}

.menu a:hover {
  background: green;
}

.menu a.active {
  background: red;
}
```

---

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/bakerstreetirregular/embed/xbwwzwJ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/bakerstreetirregular/pen/xbwwzwJ">
  Untitled</a> by bakerstreetirregular (<a href="https://codepen.io/bakerstreetirregular">@bakerstreetirregular</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>




---

![Breaking Bad Yeah Science](https://c.tenor.com/vr7gSfuJjQYAAAAd/breaking-bad-yeah-science.gif)

---

# Game time #1

---

# Pick me pick me

![MOG|600](https://mellifluous-crumble-4fde67.netlify.app/images/selectors.png)

So you have your HTML and you want to write some CSS for it. The first hurdle is learning how to **select** the element you want to style.

CSS has *many* different ways of allowing you to select objects using **selectors**. It is important to get an understanding of this before we move further.

---

Head over to [CSS Diner](https://flukeout.github.io/) and get started.

**There are 32 levels, but you only need to get till level 10-12.**

#### Time: 20 Minutes

---

# Lets get codinggggg!

---

# Setting Up Your Lab 👩‍🔬

Preflight Checklist:

1. You've installed VSCode
2. You've installed Git
3. You've installed [Node](https://nodejs.org/en/download).
4. You've installed [pnpm](https://pnpm.io/installation#using-npm)
5. You have an account on Github.

---

# Take a sad site and make it sadder

---

# Hey Jude

By the end of this short exercise, you will have a crappy website on the internet. Lets go.


I have a barebones HTML page. Your job is to give it some styles. BUT, it has to be messy, ugly, a complete Dada-ist masterpiece.


---

## But how would I share this file for you to get started?

---

## I'm glad you asked. Let's get that code!

---

## GitHub makes sharing code easy

We can "fork" a repository to make our own copy.

---

## What's a "fork"?

It's like making a photocopy of someone's project that you can edit.

---

## Then we download it as a ZIP file

No complicated commands needed - just click and download!




---
<split left="2" right="1">

<div>

1. Go to this link:

```bash
https://github.com/open-making/web2025-hey-jude
```

2. Click the **Fork** button in the top right

3. Once forked, click the green **Code** button

4. Select **Download ZIP**

5. Extract the ZIP file and open in VS Code

You now have your own copy to work with!

</div>

![Fork Icon|200](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)

</split>

---


### Time: 40 Minutes

#### Tips to make your life easier

1. Enable a [split editor](https://code.visualstudio.com/docs/getstarted/userinterface#_side-by-side-editing) so you can edit two files side by side.

2. Use `Live Server` described in the README to fire up a server which reloads as you work.

---

## Here are some sample properties to try

https://github.com/open-making/web2025-hey-jude/blob/main/css-properties.md

---

<iframe src="https://teaching.aman.bh/buzzer" width="100%" height="100%"/>

---

# Houston, we're ready for takeoff.

We'll learn Git commands in our next session. For now, we'll deploy directly to Netlify.

---

# Netlify and Chill

To host our website, we'll use a service called [Netlify](https://netlify.app). It is a static site hosting service, which means as long as our website doesn't have a database, we can host it for free.

1. Go to [Netlify.com](https://netlify.com) and login with your Github account
2. Add a new site. In the options, choose 'Import Existing Project'
3. Select Github and search for the repository you just created
4. Click deploy

In a few minutes, your website will be online with a silly looking URL.

---

# Your changes are live!

This is how we can quickly iterate and test our designs online.

---

This is very useful and as we go deeper into using modern web-development frameworks, you'll see how some small "magic" can be added to this to make it one of the best ways of working on a project.

![Excited Hazmat|300](https://c.tenor.com/Ue9Qugpw7h4AAAAC/hazmat-excited.gif) <!--element class="fragment"-->



---

## Yeah, you're done. I can see it in your eyes.

Let's wrap up.

---

## Quick Recap

You are now armed with the knowledge of:

1. HTML Tags & Attributes<!--element class="fragment"-->
2. CSS Selectors for targeting elements<!--element class="fragment"-->
3. Developing locally in VS Code<!--element class="fragment"-->
4. Forking repositories and downloading code<!--element class="fragment"-->
5. Deploying a site to Netlify<!--element class="fragment"-->

That's a massive amount for one day!<!--element class="fragment"-->

---

# Activity 2

You'll never be asked to design the abomination you made in the earlier activity. For this next exercise, can you do the whole game yourself? Choose a song that you like, an essay, an interview, some piece of text and try to structure it with HTML and then style it in CSS yourself?


---

### To summarize the summary

1. Create a fork of my original Hey Jude repo
2. Download it as a ZIP file to your machine
3. Remove almost all of the HTML and figure out how you'd want it to look yourself
4. Style your structure with CSS.
5. Deploy your updated folder to Netlify by dragging and dropping.

**FYI:** You will still have to Google what other CSS properties you need to use. Ask questions like 'How do I make the buttons rounded?' or 'How do I change the font?' and Google them. Lather, rinse, repeat.


