---
date: 2025-07-12T21:50
updated: 2025-07-19T09:59
transition: none
---

# HTML, CSS and You

#### _WEB2025 - Day 2_

---


## Welcome back!

Let's do a recap.

---

## HTML is the material of the web

If you think of a website as a house, then **HTML is the the bricks and the steel**. It provides the fundamental structure and content for everything you see online.

---

## On the Menu
**We Will**
- Learn how to get started with HTML and CSS
- Learn some basic development workflows
- Help each other solve problems and get unstuck.
- Rock you. 🤘

 **We Won't**
- Learn _everything_ about CSS/HTML/JS (That's not realistic).

---

# Introduction to HTML

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
<h1> <!-- If you start with an h1, end with an h1 -->
	My name is Aman
</h1>
```

---

# Today's Special

Since we don't want to care about all the 132 tags today, here's what you want to read up on:

- `<div>` Defines a division or section within HTML document.
- `<section>` Defines a generic section.
- `<h1>, <h2>..., <p>, <span>` Used to render text.

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

# Tell me more

I will! 

But first, go back to that file and put an `id` in your heading and give all of your `<li>` elements the same class. Whatever you want.

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

Maybe this?

---

# But how would I share this file for you to get started?

---

## I'm glad you asked. Let's Git to it.

Git is a version control system. What this means is that it basically lets multiple people access a central source of what is usually code, and make alterations to it without messing it up for other people.

---


In development, its used to collaborate between teams. This works in the following way:

1. There is a central code 'repository'. <!--element class='fragment'-->
2. Each member can then copy this master copy and create their own fork, a duplicate copy. <!--element class='fragment'-->
3. If me and you are working on the same fork, it is better to create two copies of what we're working on and develop on things separately. Each copy here is called a **branch** (it is literally what you imagine in your head when you think branch). <!--element class='fragment'-->
4. Because we're able to save versions of our progress, if you screw up your branch, I can just tell Git 'Hey could you go back to the time before this monkey touched the code?' and continue working from there.<!--element class='fragment'-->

---

# We'll be learning Git thoroughly in a later session.

For now, we'll just use some simple commands

---

![Dolly the Sheep|200](https://www.statnews.com/wp-content/uploads/2016/07/DOLLY_BDAY_03-645x645.jpg)


1. First, copy this link below:
```
https://github.com/open-making/web2025-hey-jude
```

2. Now open VSCode and press **Ctrl + Shift + P** and search for `Clone`.

3. Paste in the URL and press **Enter**. You will be prompted to select a location.

4. Open the cloned files.

You just used Git to fetch from a remote source to your local machine!

*This slide is dedicated to Dolly the sheep, who was also a clone* <!--element class="fragment"-->

---


### Time: 10 Minutes

#### Tips to make your life easier

1. Enable a [split editor](https://code.visualstudio.com/docs/getstarted/userinterface#_side-by-side-editing) so you can edit two files side by side.

2. `npm run dev` to fire up a live server which reloads as you work.

---

## Here are some sample properties to try

https://github.com/open-making/web2025-hey-jude/blob/main/css-properties.md

---

# Cool cool cool stop now

---

# Houston, we're ready for takeoff.

Open up a new terminal in VS Code. Type in the following code:

```bash
git init  # This initializes a new git repository on your machine

git add -A  # Every time you want to save a new version, you have to add all files to this version

git commit -m "My First Ugly Website"  # The commit command saves the version with a message to help you keep track of things
```

---

Now go to Github and create a new repo. After you give it a name, copy the line that looks like this and paste it in your terminal:

```bash
# Connect your local folder to your new empty GitHub repo # Make sure to use the URL you copied! git remote add origin https://github.com/YourUsername/YourRepoName.git
```

Finally, write this and press Enter:
```bash
git push -u -f origin master
```

---

# Netlify and Chill

To host our website, we'll use a service called [Netlify](https://netlify.app). It is a static site hosting service, which means as long as our website doesn't have a database, we can host it for free.

1. Go to [Netlify.com](https://netlify.com) and login with your Github account
2. Add a new site. In the options, choose 'Import Existing Project'
3. Select Github and search for the repository you just created
4. Click deploy

In a few minutes, your website will be online with a silly looking URL.

---

But see, here's the cool part. Go back to VS Code and make some changes to the text. After you're done, create a new commit like so:

```bash
git add -A
git commit -m "Change of text"
git push
```

---

# Wait for it, wait for it

---

# Cool, now go back to your URL

---

# Whaaat? It updated automatically!

This is **Continuous Deployment (CI/CD)**, a core part of the modern web development workflow.

Your Netlify site is linked to your GitHub repo. Every time you `push` a new commit, Netlify automatically grabs the new code, rebuilds your site, and deploys the new version. No more manually uploading files!

---

This is very useful and as we go deeper into using modern web-development frameworks, you'll see why this is one of the best ways of working on a project.

![Excited Hazmat|300](https://c.tenor.com/Ue9Qugpw7h4AAAAC/hazmat-excited.gif) <!--element class="fragment"-->

---

# But can we make things look... actually good?

---

# Weird flex but okay

So far, our elements are in the "normal document flow"—they just stack on top of each other. To create complex, modern layouts (sidebars, galleries, navigation bars), we need more control.

![IMG|400](https://mellifluous-crumble-4fde67.netlify.app/images/flex.png)<!--element class="fragment"-->

Flexboxis a CSS layout model designed to make arranging, aligning, and distributing space among items a breeze. <!--element class="fragment"-->


---

# Game time #2

---

To understand how flexbox works, we'll play a game called Flexbox Froggy. It sounds lame but hear me out:

Its got frogs. Lets play.

![Flexbox Froggy|500](https://mellifluous-crumble-4fde67.netlify.app/images/frog.png)

```
flexboxfroggy.com
```

#### Time: 20-25 Minutes

---

## Yeah, you're done. I can see it in your eyes.

Let's wrap up.

---

## Quick Recap

You are now armed with the knowledge of:

1. HTML Tags & Attributes<!--element class="fragment"-->
2. CSS Selectors for targeting elements<!--element class="fragment"-->
3. CSS Flexbox for layout<!--element class="fragment"-->
4. Developing locally in VS Code with a Vite<!--element class="fragment"-->
5. Using Git to version control and push to GitHub<!--element class="fragment"-->
6. Deploying a site to Netlify with continuous deployment<!--element class="fragment"-->

That's a massive amount for one day!<!--element class="fragment"-->

---

# Activity 2

You'll never be asked to design the abomination you made in the earlier activity. However, being asked to code a UI screen is extremely likely. If you're interested in developing the earlier skills further, here's a challenge.

---

I've designed a product page in Figma and coded the bare, unstyled HTML for it. Can you apply CSS so that the HTML looks like the design file?

#### Files are at

```
https://github.com/thedivtagguy/activity2
```

---

![Design File](https://aman.bh/web-dev/1/images/design.png)

---

# To summarize the summary

1. Clone the repo on your machine
2. Look at the design and try to use your knowledge of CSS selectors and flexbox to recreate it

**Note:** You will still have to Google what other CSS properties you need to use. Ask questions like 'How do I make the buttons rounded?' or 'How do I change the font?' and Google them. Lather, rinse, repeat.

3. Push your files to Github
4. Deploy this new repository to Netlify.

---

![Final Image](https://aman.bh/web-dev/1/images/all.jpg)