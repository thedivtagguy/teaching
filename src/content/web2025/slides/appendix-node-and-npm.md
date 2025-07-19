---
date: 2025-07-17T19:50
updated: 2025-07-17T21:45
transition: none
---
# Node.js, npm, and pnpm

#### _Getting Your Tools Ready_

---

## Let's start with a simple question

How do you usually install software on your computer?

---

You probably:

1. Go to a website
2. Click "Download"
3. Run an installer
4. Click "Next" a bunch of times

---

## That works great for big software

Like Photoshop, Chrome, or Spotify.

---

## But what about tiny pieces of code?

---

## Imagine you're building a website

You need:

- A way to resize images
- A calendar widget
- A tool to compress CSS
- A thing that converts markdown to HTML

---

## You could write all of this yourself

But that would take months.

---

## Or you could use code that someone else already wrote
<split even gap="2">

This is called a **package**.


![](Pasted%20image%2020250717212349.png)


</split>

---

## What is a package?

A small piece of code that does one specific thing.

---

## Think of it like LEGO blocks

Each block (package) does something simple. But you can combine them to build something of your own.

![IMG|400](Pasted%20image%2020250717212540.png)

---

## So why can't we just download packages like regular software?

---

## Because there are thousands of them

And they depend on each other.

---

## What do I mean by "depend on each other"?

---

### Let's say you want to use a calendar widget

That calendar widget might need:

- A date formatting package
- A package to handle clicks
- A package to make it look pretty

---

### And those packages might need other packages

- The date formatter needs a timezone package
- The click handler needs an event package
- The pretty styles need a color package

---

## This is called the "dependency tree"

It's like a family tree, but for code.

---

![](Pasted%20image%2020250717212702.png)

---

## Imagine downloading all of this manually

You'd need to:

1. Find each package
2. Download it
3. Put it in the right folder
4. Make sure the versions work together
5. Update them when new versions come out

---

## That sounds awful

---

## Enter: The Package Manager

---

## What is a package manager?

A tool that handles all the boring stuff for you.

---

## You say: "I want a calendar widget"

The package manager:

1. Finds the calendar widget
2. Figures out what it depends on
3. Downloads everything
4. Puts it in the right place
5. Makes sure versions work together

---

## It's like having a smart assistant

Who knows where everything is and how it all fits together. You ask for it and he gets it for you.


---

## What is npm?

**N**ode **P**ackage **M**anager

The package manager for JavaScript.

---

## But wait, what is Node.js?

---

## JavaScript used to only run in browsers

You write JavaScript, put it on a webpage, and browsers run it.

That's it. Just webpages.

---

## Node.js changed that

It lets JavaScript run directly on your computer.

---

## What does that mean?

---

## Think about the apps on your computer

- Photoshop
- Spotify
- Your text editor
- Calculator

These all run directly on your computer, not in a browser.

---

## Before Node.js

JavaScript could only make websites interactive.

---

## After Node.js

JavaScript can build actual programs that run on your computer. Instead of using other languages, if you knew Javascript, you could build software with it too.

---

## Like what kind of programs?

---

## The tools we use to build websites

- Image resizers
- File organizers
- Code formatters
- Website builders

---

## Even some apps you might know

- Discord (desktop version)
- WhatsApp Desktop
- Figma Desktop
- VS Code (code editor)

---

## All built with JavaScript, thanks to Node.js

We don't have to worry about the technicalities at the moment. 

Node makes JS powerful. 

JS makes your websites work.

---

## And npm is the package manager for all of that

---

## What are the different npm commands?

---

## The ones you actually need to know:

---

### `npm install package-name`

Downloads a package for your current project. To find a package, search for it. 


---

if I wanted to add an emoji picker to my site, I'd search for one and just copy paste that command. 

![](Pasted%20image%2020250717213137.png)

---

### `npm install -g package-name`

Downloads a package globally (for your whole computer).

---

### `npm install`

Downloads all packages listed in your project. We usually do this before starting a new project that we have just downloaded from somewhere. It sets up your entire system to use all the packages that are required.

---

### `npm run script-name`

Runs a command that's defined in your project. 

You'll often here me ask you to run `npm run dev`. `dev` is a command that starts your local server.

---

## That's it

Four commands. Everything else is advanced stuff.

---

## Still with me?

Let's talk about pnpm.

---

## What is pnpm?

A faster, more efficient version of npm.

---

## How is it faster?

---

## npm downloads packages separately for each project

- Project A downloads XYZ package 
- Project B downloads XYZ package 
- Project C downloads XYZ package 

Three copies of the same thing.

---

## pnpm is smarter

It downloads XYZ package once and shares it between all projects.

---

## Should you use npm or pnpm?

For this class: **pnpm**

---

## Why?

1. It's faster
2. It uses less disk space
3. The commands are almost identical

---

## Actually installing these tools

---

## Step 1: Install Node.js

Go to [nodejs.org](https://nodejs.org)

Download the latest version.

---

## Install it like any other program

Next, next, next, finish.

---

## Step 2: npm comes with Node.js

You don't need to do anything extra.

---

## Step 3: Install pnpm

Open your terminal and run:

```bash
npm install -g pnpm
```

---

## Let's test everything

---

### Check Node.js:

```bash
node --version
```

### Check npm:

```bash
npm --version
```

### Check pnpm:

```bash
pnpm --version
```

---

## If you see version numbers

You're good to go!

---

## If something doesn't work

1. Try restarting your terminal
2. Try restarting your computer
3. Ask for help

---

## What we just accomplished

We installed the foundation for modern web development. It's not very nice, but it's what we've got.

---

## Tomorrow

We'll use these tools to start building websites.

