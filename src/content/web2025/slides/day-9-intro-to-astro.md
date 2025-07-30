---
date: 2025-07-30T18:58
updated: 2025-07-30T19:11
transition: none
---
# From HTML & CSS to Modern Web Development

#### _WEB2025 - Astro & Package Managers_

  

---

  

## So you know HTML and CSS...

  

You can make websites! You understand:

- `<div>`, `<p>`, `<h1>` tags

- CSS selectors like `.my-class` and `#my-id`

- How to style text, colors, and layouts

  

But you've heard about "modern web development" and it sounds complicated...

  

---

  

## What you might be wondering

  

- Why can't I just write HTML files anymore?

- What's all this talk about "frameworks"?

- Why do I need to "install" things to make a website?

- What's npm? What's a package manager?

- Why are there so many files in these projects?

  

Let's answer these questions step by step.

  

---

  

# The Problem with Just HTML & CSS

  

---

  

## You want to add a navigation bar

  

<split left="1" right="1" gap="2">

  

```html

<!-- index.html -->

<nav>

<a href="/">Home</a>

<a href="/about">About</a>

<a href="/blog">Blog</a>

</nav>

<h1>Welcome to my site</h1>

```

  

```html

<!-- about.html -->

<nav>

<a href="/">Home</a>

<a href="/about">About</a>

<a href="/blog">Blog</a>

</nav>

<h1>About me</h1>

```

  

</split>

  

You copy the same navigation to every page...

  

---

  

## Then you want to change the navigation

  

You have to edit **every single HTML file** by hand.

  

What if you have 50 pages? 100 pages?

  

This is called **code duplication** and it's a nightmare to maintain.

  

---

  

## You want to add a "Latest Posts" section

  

You write all your blog posts as HTML files, then you have to:

  

1. Manually update your homepage with the new post

2. Manually update your blog index page

3. Make sure all the links work

4. Keep everything consistent

  

There has to be a better way...

  

---

  

# Enter: Modern Web Development

  

---

  

## The Big Idea: Don't Repeat Yourself

  

Instead of copying navigation to every page, what if you could:

  

1. Write the navigation **once**

2. Tell every page to "use this navigation"

3. Change the navigation in one place, and it updates everywhere

  

This is what **frameworks** like Astro do for you.

  

---

  

## Think of it like a template

  

<split left="1" right="1" gap="2">

  

**Old Way (HTML)**

```

Each page = Complete HTML document

🏠 index.html (full page)

📄 about.html (full page)

📝 blog.html (full page)

```

  

**New Way (Framework)**

```

Template + Content = Complete Page

📋 Layout template

+ 🏠 Home content = Home page

+ 📄 About content = About page

+ 📝 Blog content = Blog page

```

  

</split>

  

---

  

# What is Astro?

  

---

  

## Astro is like a smart HTML builder

  

It lets you:

- Write **components** (reusable pieces of code)

- Use **layouts** (page templates)

- Mix HTML with a tiny bit of JavaScript

- Still write mostly HTML and CSS

  

It's designed for people who **know HTML & CSS** but want the benefits of modern development.

  

---

  

## Let's look at our starter

  

```

web-dev-starter-astro/

├── src/

│ ├── layouts/ ← Page templates

│ ├── pages/ ← Your actual pages

│ ├── components/ ← Reusable pieces

│ └── styles/ ← Your CSS

├── public/ ← Images, files

└── package.json ← Project info

```

  

Each folder has a specific purpose. Let's explore!

  

---

  

# Understanding Package Managers

  

---

  

## Wait, what's package.json?

  

You probably saw this file and wondered what it is.

  

```json

{

"name": "web-dev-starter",

"scripts": {

"dev": "astro dev",

"build": "astro build"

},

"dependencies": {

"astro": "^5.11.0"

}

}

```

  

This tells your computer what this project needs to work.

  

---

  

## But first: What's npm?

  

**npm** = **N**ode **P**ackage **M**anager

  

But what's a package? What's a package manager?

  

---

  

## What's a package?

  

A **package** is like a tool someone else built that you can use.

  

Think of it like:

- A calculator app on your phone

- A plugin for Photoshop

- A library book you can borrow

  

In web development, a package might be:

- A tool to process your CSS

- A way to make image galleries

- A framework like Astro

  

---

  

## What's a package manager?

  

A **package manager** is like an app store for developers.

  

Instead of:

1. Going to 20 different websites

2. Downloading 20 different ZIP files

3. Figuring out how to make them work together

  

You just say: "I want Astro" and npm handles everything.

  

---

  

## Why does each language have its own package manager?

  

<split left="1" right="1" gap="2">

  

**Different languages, different needs**

  

- **npm** (JavaScript) - for web stuff

- **pip** (Python) - for Python tools

- **gem** (Ruby) - for Ruby tools

- **cargo** (Rust) - for Rust tools

  

Each one knows how to handle that language's specific requirements.

  

</split>

  

---

  

## Why can't it just be "one click" like regular software?

  

Great question! Regular software is like buying a **finished house**.

  

Development packages are like buying **building materials**:

- You might need different versions

- They need to work together

- You might want to customize them

- They need to integrate with your specific project

  

---

  

## What's a local dependency?

  

When you install Astro, it goes in your **project folder**, not on your whole computer.

  

```

your-project/

├── node_modules/ ← Astro lives here

├── src/

└── package.json

```

  

This means:

- Different projects can use different versions

- You don't mess up other projects

- Everything stays organized

  

---

  

## Essential npm commands (the only ones you need)

  

```bash

npm install # Download all packages for this project

npm run dev # Start development server

npm run build # Build final website

```

  

That's it! You don't need to memorize 50 commands.

  

---

  

# How Astro Works

  

---

  

## Astro files look familiar

  

<split left="1" right="1" gap="2">

  

**Regular HTML**

```html

<!DOCTYPE html>

<html>

<head>

<title>My Page</title>

</head>

<body>

<h1>Hello World</h1>

<p>Welcome to my site</p>

</body>

</html>

```

  

**Astro file**

```astro

---

const title = "My Page";

---

<h1>Hello World</h1>

<p>Welcome to my site</p>

```

  

</split>

  

The bottom part is just HTML. The top part is a tiny bit of JavaScript.

  

---

  

## The JavaScript part is optional

  

You can write pure HTML in Astro files:

  

```astro

<h1>Hello World</h1>

<p>This is just HTML and it works fine!</p>

```

  

But the JavaScript part lets you do powerful things when you're ready.

  

---

  

## What can the JavaScript part do?

  

<split left="1" right="1" gap="2">

  

**Set variables**

```astro

---

const title = "My Cool Site";

const year = 2025;

---

<h1>{title}</h1>

<p>Copyright {year}</p>

```

  

**Calculate things**

```astro

---

const posts = 15;

const postsPerPage = 5;

const pages = posts / postsPerPage;

---

<p>We have {pages} pages of posts</p>

```

  

</split>

  

You put variables in curly braces `{}` to use them in HTML.

  

---

  

# Components: Reusable HTML

  

---

  

## Remember the navigation problem?

  

Instead of copying navigation everywhere, make a **component**.

  

<split left="1" right="1" gap="2">

  

**Navigation.astro**

```astro

<nav>

<a href="/">Home</a>

<a href="/about">About</a>

<a href="/blog">Blog</a>

</nav>

```

  

**Use it anywhere**

```astro

---

import Navigation from '../components/Navigation.astro';

---

<Navigation />

<h1>My Page</h1>

```

  

</split>

  

Change the navigation once, it updates everywhere!

  

---

  

## Components can be customized

  

<split left="1" right="1" gap="2">

  

**Button.astro**

```astro

---

const { text = "Click me" } = Astro.props;

---

<button class="btn">{text}</button>

```

  

**Using it**

```astro

---

import Button from '../components/Button.astro';

---

<Button text="Learn More" />

<Button text="Contact Us" />

<Button text="Buy Now" />

```

  

</split>

  

One component, many uses!

  

---

  

## Looking at our Button component

  

```astro

---

// This line gets the "text" prop, or uses "Click me" as default

const { text = "Click me" } = Astro.props;

---

  

<button class="btn">

{text}

</button>

```

  

**Props** are like settings you can pass to a component.

  

---

  

## How to make your own component

  

1. Create a new `.astro` file in `src/components/`

2. Write some HTML (and optionally some JavaScript)

3. Import and use it in your pages

  

Let's try making a simple one!

  

---

  

## Exercise: Make a Quote component

  

<split left="1" right="1" gap="2">

  

**Quote.astro**

```astro

---

const { quote, author } = Astro.props;

---

<blockquote>

<p>"{quote}"</p>

<cite>— {author}</cite>

</blockquote>

```

  

**Using it**

```astro

<Quote

quote="The best way to learn is by doing"

author="Someone Smart"

/>

```

  

</split>

  

---

  

# Layouts: Page Templates

  

---

  

## Every website has repeated elements

  

- Header/navigation

- Footer

- Meta tags in `<head>`

- Basic HTML structure

  

Instead of copying this to every page, use a **layout**.

  

---

  

## Looking at MainLayout.astro

  

```astro

---

const { title } = Astro.props;

---

<!doctype html>

<html lang="en">

<head>

<meta charset="UTF-8" />

<title>{title}</title>

<link rel="stylesheet" href="/src/styles/global.css" />

</head>

<body>

<nav>

<ul>

<li><a href="/">Home</a></li>

<li><a href="/about">About</a></li>

<li><a href="/blog">Blog</a></li>

</ul>

</nav>

<main>

<slot /> <!-- Page content goes here -->

</main>

<footer>

<p>&copy; 2025 My Website</p>

</footer>

</body>

</html>

```

  

---

  

## The `<slot />` tag

  

This is where each page's unique content gets inserted.

  

Think of it like a placeholder:

- Layout provides the frame

- Each page provides the content

- Astro puts them together

  

---

  

## Using a layout

  

<split left="1" right="1" gap="2">

  

**about.astro**

```astro

---

import MainLayout from '../layouts/MainLayout.astro';

---

<MainLayout title="About Me">

<h1>About Me</h1>

<p>I'm learning web development!</p>

</MainLayout>

```

  

**Result**

- Gets full HTML structure

- Navigation and footer

- Title becomes "About Me"

- Content goes where `<slot />` is

  

</split>

  

---

  

# Pages: How URLs Work

  

---

  

## File-based routing

  

In Astro, files in `src/pages/` become URLs automatically:

  

```

src/pages/index.astro → yoursite.com/

src/pages/about.astro → yoursite.com/about

src/pages/contact.astro → yoursite.com/contact

src/pages/blog/index.astro → yoursite.com/blog

src/pages/blog/my-post.md → yoursite.com/blog/my-post

```

  

No configuration needed!

  

---

  

## Markdown files become pages too

  

You can write blog posts in Markdown:

  

```markdown

---

layout: ../../layouts/BlogLayout.astro

title: "My First Post"

date: "2025-01-30"

---

  

# My First Post

  

This is **much easier** than writing HTML for blog posts!

  

- I can use

- Simple markdown

- Syntax

```

  

---

  

# Styling: It's Still Just CSS

  

---

  

## Your CSS works exactly the same

  

```css

/* src/styles/global.css */

body {

font-family: Arial, sans-serif;

max-width: 1050px;

margin: 0 auto;

}

  

.btn {

background: #444;

color: white;

padding: 8px 16px;

}

  

.btn:hover {

background: #666;

}

```

  

Nothing new here! Same CSS you already know.

  

---

  

## CSS gets linked in your layout

  

```astro

<!-- MainLayout.astro -->

<head>

<link rel="stylesheet" href="/src/styles/global.css" />

</head>

```

  

One CSS file, available on all pages that use this layout.

  

---

  

# Development Workflow

  

---

  

## The development server

  

Instead of opening HTML files directly, you run:

  

```bash

npm run dev

```

  

This starts a **development server** at `http://localhost:4321`

  

---

  

## Why use a development server?

  

**Magic features:**

- **Live reload** - Changes appear instantly in browser

- **File processing** - Astro converts your `.astro` files to HTML

- **Error messages** - See helpful errors when something breaks

- **Local URLs** - Test how links work between pages

  

---

  

## Your workflow becomes:

  

1. Run `npm run dev`

2. Open `http://localhost:4321` in browser

3. Edit files

4. See changes instantly

5. Repeat until happy

6. Run `npm run build` to create final website

  

---

  

# Let's Explore the Starter

  

---

  

## Open the starter and run it

  

```bash

npm install # Download Astro (first time only)

npm run dev # Start development server

```

  

Open `http://localhost:4321` and click around.

  

---

  

## Exercise: Make small changes

  

Try these one by one, and see what happens:

  

1. **Change homepage text** - Edit `src/pages/index.astro`

2. **Change site colors** - Edit `src/styles/global.css`

3. **Add a new navigation link** - Edit `src/layouts/MainLayout.astro`

4. **Create a new page** - Add `src/pages/projects.astro`

  

Each change should appear immediately in your browser!

  

---

  

## Understanding the file structure

  

```

src/

├── layouts/

│ ├── MainLayout.astro ← Template for most pages

│ └── BlogLayout.astro ← Different template for blog

├── pages/

│ ├── index.astro ← Homepage

│ ├── about.astro ← About page

│ └── blog/ ← Blog posts

├── components/

│ ├── Button.astro ← Reusable button

│ └── Card.astro ← Reusable card

└── styles/

└── global.css ← All your CSS

```

  

---

  

# Common Beginner Questions

  

---

  

## "Why so many files?"

  

Each file has a specific job:

- **Layouts** = Page templates (write once, use everywhere)

- **Components** = Reusable pieces (write once, use many times)

- **Pages** = Actual content (one file = one URL)

- **Styles** = Same CSS you know

  

More files = better organization!

  

---

  

## "Can I still write regular HTML?"

  

**Absolutely!**

  

Astro files are 95% regular HTML. The framework parts are optional upgrades:

  

- Start with HTML you know

- Add components when you see repetition

- Use layouts when you want consistent pages

- Learn JavaScript features as needed

  

---

  

## "What if I break something?"

  

**Good news:** You can't really break anything permanently!

  

- Files are just text - you can always undo changes

- Development server shows helpful error messages

- Start simple and add features gradually

- When in doubt, check the working examples

  

---

  

## "Do I need to learn JavaScript?"

  

**Not much!** For basic Astro usage, you need:

  

- Variables: `const name = "John"`

- Using variables in HTML: `<h1>{name}</h1>`

- Importing components: `import Button from './Button.astro'`

  

That's maybe 5% JavaScript, 95% HTML/CSS.

  

---

  

# Hands-on Time

  

---

  

## Let's customize the starter together

  

1. **Change the site title** in MainLayout.astro

2. **Pick new colors** in global.css

3. **Edit the homepage** content

4. **Create a new page** (like "Projects")

5. **Make a simple component** (like a "Warning" box)

  

We'll do each step together, so you can see how it works.

  

---

  

## Exercise 1: Change the site title

  

**File:** `src/layouts/MainLayout.astro`

  

Find this line:

```html

<title>{title}</title>

```

  

And change the footer from:

```html

<p>&copy; 2025 My Website</p>

```

  

To:

```html

<p>&copy; 2025 [Your Name]'s Site</p>

```

  

---

  

## Exercise 2: Pick your colors

  

**File:** `src/styles/global.css`

  

Try changing:

```css

body {

color: #444; /* Change this to your favorite color */

}

  

.btn {

background: #444; /* And this one too */

}

```

  

Maybe try `#2c5aa0` for blue or `#8b4513` for brown?

  

---

  

## Exercise 3: Make it yours

  

**File:** `src/pages/index.astro`

  

Replace the placeholder content with:

- Your actual name

- Something you're interested in

- Your own button text

- Cards about things you like

  

---

  

## Exercise 4: Add a new page

  

1. Create `src/pages/projects.astro`

2. Use the MainLayout

3. Add some content about projects you want to work on

4. Add it to the navigation in MainLayout.astro

  

---

  

## Exercise 5: Your first component

  

Let's make a simple Alert component:

  

**File:** `src/components/Alert.astro`

```astro

---

const { message, type = "info" } = Astro.props;

---

<div class="alert alert-{type}">

<strong>Note:</strong> {message}

</div>

```

  

Then add CSS for `.alert` in your global.css and use it in a page!

  

---

  

# Building for Production

  

---

  

## When you're ready to share your site

  

```bash

npm run build

```

  

This creates a `dist/` folder with your final website - just regular HTML, CSS, and JavaScript files that work anywhere.

  

---

  

## Deploy to the web

  

Upload the `dist/` folder to:

- **Netlify** (drag and drop)

- **Vercel** (connect your GitHub)

- **GitHub Pages** (free hosting)

- Any web host

  

Your Astro site becomes a regular static website that works everywhere.

  

---

  

# What's Next?

  

---

  

## You now understand:

  

- **Why** modern frameworks exist (avoid repetition)

- **What** package managers do (organize dependencies)

- **How** Astro works (smart HTML with components)

- **When** to use components vs layouts vs pages

  

You're ready to build real websites!

  

---

  

## Ideas for your next steps:

  

1. **Build a personal portfolio** with your own design

2. **Start a blog** using Markdown files

3. **Try more components** - image galleries, contact forms

4. **Explore CSS frameworks** like Tailwind (another package!)

5. **Learn more Astro features** as you need them

  

---

  

## Remember the "Just-Enough" rule

  

You don't need to learn everything at once.

  

- Start with what you know (HTML/CSS)

- Add one new concept at a time

- Build something you care about

- Google specific questions as they come up

  

---

  

## The best way to learn is by doing

  

Pick a website you want to build and start building it.

  

You'll encounter problems, look up solutions, and gradually learn more advanced techniques.

  

That's how all developers learn!

  

---

  

# Questions?

  

---

  

## Common "I'm stuck" moments:

  

**"My changes don't show up"**

- Is the dev server running? (`npm run dev`)

- Did you save the file?

- Check the terminal for error messages

  

**"I got an error message"**

- Read it carefully - Astro gives helpful hints

- Check for typos in file names and imports

- Make sure all tags are closed properly

  

**"I don't know how to do X"**

- Google "Astro how to X"

- Check the [Astro docs](https://docs.astro.build)

- Start with HTML/CSS approach, then enhance

  

---

  

## You've got this!

  

Modern web development isn't as scary as it seems.

  

You already know the hard parts (HTML & CSS).

  

Frameworks like Astro just help you organize and reuse your code better.

  

Start building! 🚀

  

---

  

# Welcome to Modern Web Development!

  

#### _You're ready to build amazing things._