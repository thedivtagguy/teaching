---
date: 2025-07-22T13:05
updated: 2025-07-22T13:05
transition: none
---

# Git and Version Control

#### _WEB2025 - Day 3_

---

## Welcome back!

Today we're diving into Git - the tool that powers collaboration in software development.

---

# Why do we need version control?

---

## Imagine you're writing a book with friends

You're all working on different chapters.

---

## How would you share your work?

---

## Option 1: Email

"Here's Chapter 3 v2.docx"

"Wait, I also edited Chapter 3, here's my version!"

"Which one do we use??"

---

## Option 2: Shared Google Doc

Everyone types at the same time. Someone "accidentally" deletes a section you were working on. Sus.

---

## Option 3: USB drives

"Hey, can you give me the latest version?"

"Oh no, I forgot to save my changes!"

---

## None of these work well for code

Code is way more fragile than text documents.

---

## Enter: Version Control

A system that tracks every change to your files.

---

## Version control is your code's time machine

- You can see what your code looked like yesterday
- Or last week
- Or last month
- And go back to any of those versions

---

## Git is a version control system

The most popular one in the world.

---

## What does Git track?

- Who changed what
- When they changed it
- What exactly they changed
- Why they changed it (if they write a good message)

---

## Let's see this in action

```
Version 1: "This parrot is dead"
Version 2: "This parrot has ceased to be" 
Version 3: "This is an ex-parrot"
```

Git remembers all three versions.

---

## But Git lives on your computer

What if your computer breaks?

What if you want to collaborate with others?

---

## Enter: GitHub

---

## GitHub is where your code lives online

Think Google Drive, but built specifically for code.

---

## GitHub stores your Git repositories

A repository (or "repo") is just a fancy word for "a folder full of code that Git is tracking."

---

## Here's how it works:

1. You work on code on your computer
2. Git tracks your changes
3. You "push" your changes to GitHub
4. Your friends can "pull" your changes to their computers

---

## GitHub becomes your central hub

Where all the code lives and everyone can access it.

---

## Before we dive into commands

Let's talk about the **terminal**.

---

## What is the terminal?

A way to talk to your computer using text instead of clicking buttons.

---

## Why use text instead of clicking?

---

## Because clicking is slow

To create a new folder, you'd:

1. Right-click
2. Find "New Folder"
3. Click it
4. Type the name
5. Press enter

---

## In terminal:

```bash
mkdir my-new-folder
```

Done. One line.

---

## The terminal might look intimidating

But it's just another way to do things you already know how to do.

---

## Common terminal commands:

```bash
ls          # List files (like opening a folder)
cd          # Change directory (like double-clicking a folder)  
mkdir       # Make directory (like creating a new folder)
pwd         # Print working directory (where am I?)
```

On Windows, some commands are different in regular Command Prompt:

```bash
dir         # Windows version of ls (list files)
cd          # Same on both
mkdir       # Same on both  
cd          # Shows current directory (Windows version of pwd)
```

---

## Let's practice

Open your terminal:

- **Windows:** Press `Win + R`, type `cmd`, press Enter _OR_ use Git Bash (recommended)
- **Mac:** Press `Cmd + Space`, type `terminal`, press Enter

**Note for Windows users:** If you have Git installed, you can use "Git Bash" which lets you use the Mac/Linux commands. Right-click in any folder and select "Git Bash Here".

---

## Try these commands:

**Mac/Linux/Git Bash:**

```bash
pwd         # See where you are
ls          # See what's in this folder
cd Desktop  # Go to your Desktop
ls          # See what's on your Desktop
mkdir test  # Create a folder called "test"
ls          # See your new folder
```

**Windows Command Prompt:**

```bash
cd          # See where you are  
dir         # See what's in this folder
cd Desktop  # Go to your Desktop
dir         # See what's on your Desktop
mkdir test  # Create a folder called "test"
dir         # See your new folder
```

---

## See? Pretty straightforward

You just navigated your computer using text commands.

---

## Now let's learn Git

---

## Git commands you need to know:

---

### `git init`

"Hey Git, start tracking changes in this folder"

---

### `git add filename`

"Hey Git, I want to save this file in the next version"

---

### `git add -A`

"Hey Git, I want to save ALL my changes in the next version"

---

### `git commit -m "message"`

"Hey Git, create a new version with this message"

The message should describe what you changed.

---

### Good commit messages:

```bash
git commit -m "Add navigation menu"
git commit -m "Fix broken link on about page"  
git commit -m "Change background color to blue"
```

---

### Bad commit messages:

```bash
git commit -m "stuff"
git commit -m "changes"
git commit -m "idk"
```

Future you will hate present you.

---

### `git push`

"Hey Git, send my changes to GitHub"

---

### `git pull`

"Hey Git, get the latest changes from GitHub"

---

## The typical workflow:

1. Make changes to your files
2. `git add -A` (stage all changes)
3. `git commit -m "describe what you did"` (save version)
4. `git push` (send to GitHub)

---

## Let's see this in action

We're about to clone a repository.

"Clone" means "download a copy of code from GitHub to my computer"

---

<split left="2" right="1">

<div>

Copy this link

```bash
https://github.com/open-making/web2025-hey-jude

```

Now open VSCode and press **Ctrl + Shift + P** and search for `Clone`.

Paste in the URL and press **Enter**. You will be prompted to select a location.

Open the cloned files.

You just used Git to fetch from a remote source to your local machine!

</div>

![Dolly the Sheep|200](https://www.statnews.com/wp-content/uploads/2016/07/DOLLY_BDAY_03-645x645.jpg)

</split>

*This slide is dedicated to Dolly the sheep, who was also a clone* <!--element class="fragment"-->

---

### Time: 20 Minutes

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

Open up a new terminal in VS Code. Type in the following code:

```bash
git init  # This initializes a new git repository on your machine

git add -A  # Every time you want to save a new version, you have to add all files to this version

git commit -m "My First Ugly Website"  # The commit command saves the version with a message to help you keep track of things
```

---

Now go to Github and create a new repo. After you give it a name, copy the line that looks like this and paste it in your terminal:

```bash
# Connect your local folder to your new empty GitHub repo 
# Make sure to use the URL you copied! 
git remote add origin https://github.com/YourUsername/YourRepoName.git
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

## Quick Recap

You are now armed with the knowledge of:

1. Version control concepts and why we need Git<!--element class="fragment"-->
2. Terminal basics and common commands<!--element class="fragment"-->
3. Essential Git commands: init, add, commit, push<!--element class="fragment"-->
4. GitHub repositories and remote collaboration<!--element class="fragment"-->
5. Continuous deployment with Netlify<!--element class="fragment"-->

That's the foundation of modern development workflows!<!--element class="fragment"-->

---

# Practice Time

Let's reinforce what we learned:

1. Create a new project folder
2. Initialize a Git repository
3. Make some HTML/CSS files
4. Commit your changes with meaningful messages
5. Push to GitHub
6. Deploy to Netlify

---

### Common Git Problems

Don't worry - everyone gets stuck with Git sometimes!

- Forgot to commit before making new changes?
- Accidentally committed the wrong files?
- Can't remember what you changed?

We'll cover troubleshooting in future sessions. For now, just remember: Git is your friend, even when it doesn't feel like it!