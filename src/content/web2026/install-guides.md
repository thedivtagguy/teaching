---
title: Install Guides
date: 2026-07-13
section: Appendix
updated: 2026-07-15T12:00
published: true
slug: install-guides
---
## Needed by Day 2: GitHub Desktop

Download it from [desktop.github.com](https://desktop.github.com/) and sign in with your GitHub account. That's it!

## Needed by Day 2: Prettier (code formatting in VSCode)

While you're writing code in VSCode, things can get messy and hard for you to keep track of. VSCode gives you nice color highlighting but we can also install a **formatter** to help keep us organized.

Open up your extensions panel and search for 'Prettier'. It is the first result which has the most downloads.

![](/assets/install-guides/IMG-20250722145507551.png)

Click `Install`.

After it installs, you have to edit your VSCode settings in a way that tells it to use this formatter **every time you hit save**.

Open up the command palette in VSCode using `CTRL` + `SHIFT` + `P` (`CMD` + `SHIFT` + `P` on Mac). Search for 'Settings'.

![](/assets/install-guides/IMG-20250722145705571.png)

Select the one that says 'Preferences: Open Settings (UI)'.

It will open up something that looks like this:

![](/assets/install-guides/IMG-20250722145758024.png)

In the search field, search and configure the following things.

- **Default Formatter**: Search for `Default Formatter` and the listings should filter. In the dropdown for that setting, locate `Prettier` and select it.

![](/assets/install-guides/IMG-20250722150013159.png)

- **Format on save**: Now that the default formatter has been set, we can tell VSCode to correct our code every time we hit save. Search for `Format on Save` and enable the checkbox.

![](/assets/install-guides/IMG-20250722150138282.png)

You're done! Now no matter how you type your code, all your files will be kept nicely formatted whenever you hit save. It's a small quality-of-life improvement.

![](/assets/install-guides/IMG-20250722150636812.gif)

## Needed by Day 6: Node.js and pnpm

On Day 6 we meet the terminal and Astro, and for that we need Node.js (the thing that runs JavaScript outside a browser) and pnpm (a package manager, we'll explain what that means in class).

### Node.js

Go to [nodejs.org](https://nodejs.org/) and download the **LTS** version (the button on the left; LTS means "long-term support", i.e. the boring, stable one). Run the installer and accept the defaults.

Check it worked: open Terminal (Mac) or PowerShell (Windows) and type:

```bash
node --version
```

You should see something like `v22.x.x`. Exact numbers don't matter.

### pnpm

With Node installed, this is one command in the same terminal:

```bash
npm install -g pnpm
```

Check it worked:

```bash
pnpm --version
```

If you see a version number, you're done. If you see "command not found", close the terminal, open a new one, and try again; installers often need a fresh window to be noticed.

## Optional / Day 6: Git on the command line

Git is the version-control engine that GitHub Desktop uses under the hood. From Day 6 we'll start (optionally) using it directly in the terminal. You can install it any time before then.

### For Mac Users

Step 1: Install Homebrew

Homebrew is a package manager that makes installing things on Mac much easier. Open Terminal (you can find it in Applications > Utilities or just search for it) and paste this command:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Hit enter and let it do its thing. It might ask for your password and that's normal.

Step 2: Add Homebrew to your PATH

This tells your computer where to find Homebrew. Copy and paste these two lines one at a time:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
```

Step 3: Install Git

Now the fun part: installing Git is just one command.

```bash
brew install git
```

By the way, you can now install _a lot of software like this_, through single line commands!

Step 4: Check if it worked

```bash
git --version
```

You should see something like `git version 2.49.0` or similar. The exact numbers don't matter.

### For Windows Users

Step 1: Download Git

Go to [git-scm.com](https://git-scm.com/) and click the download button. It should automatically detect you're on Windows.

Step 2: Install Git

Run the installer you just downloaded, the defaults are fine. Just keep clicking "Next."

Step 3: Open Git Bash

After installation, you should have a new program called "Git Bash." Open it; this is where you'll type Git commands. It's like Terminal on Mac.

Step 4: Check if it worked

```bash
git --version
```

You should see the Git version number.

### Configure Git with your GitHub info

Now we need to tell Git who you are. In Terminal (Mac) or Git Bash (Windows), type these commands, replacing the placeholder text with your actual information:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

**Important**: Use the same email address you used for GitHub. This is how GitHub knows the changes that will come to it are from you.

(If you've been using GitHub Desktop, this is already configured; Desktop did it when you signed in.)

After this, you're all set! We'll be using these tools throughout the class, but don't worry about memorizing all the commands, we'll learn the Git workflow gradually as we build our websites.
