---
title: Install Guides
date: 2026-07-13
section: Appendix
updated: 2026-07-20T23:22
published: true
slug: install-guides
---
## GitHub Desktop

Download it from [desktop.github.com](https://desktop.github.com/) and sign in with your GitHub account. That's it!

## Installing the class VS Code profile

I've bottled our entire IDE setup into a single profile. Import it once and your VS Code will have everything we need: Live Server, auto-formatting, nice file icons, error messages that show up right next to your code, and more.

### Importing the profile

Step 1: Open VS Code.

Step 2: Click the gear icon in the bottom-left corner and go to **Profiles**, then **Import Profile...**

![](/assets/install-guides/IMG-20260720205846983.png)

![](/assets/install-guides/IMG-20260720210400226.png)

Step 3: In the box that appears, paste this link:

```
https://gist.githubusercontent.com/thedivtagguy/178fd4556ff9232725cda1c263d1b7e6/raw/37b489c7b63f508fd598d13029317ec65c722ce8/web2026
```

Step 4: A panel will open showing what the profile contains (settings and extensions). Click **Create**.

Step 5: Wait a minute or two while the extensions install. You'll see some activity in the bottom status bar. When it settles down, you're done.

### Checking the installation worked

Create a folder anywhere, open it in VS Code, and make a file called `index.html`. Type some HTML in it, right-click anywhere in the file, and you should see an option that says **Open with Live Server**.

![](/assets/install-guides/IMG-20260720210806206.png)

If you see it, congratulations, you're set up. If you don't, the extensions might still be installing, give it a minute. Still nothing? Ask for my help!

## Using GitHub Desktop

GitHub Desktop is how we'll save and publish our work for the first week.

### Cloning a repository

Cloning means downloading a copy of a project from GitHub onto your laptop, with the connection between the two kept alive. You edit the copy on your laptop, and later send your changes back up.

Step 1: In GitHub Desktop, go to **File > Clone Repository** (or click the big "Clone a repository" button if you see one).

![](/assets/install-guides/IMG-20260720223450610.png)

Step 2: Under the **GitHub.com** tab, you'll see a list of all repositories on your account, including any forks you've made. Select the one you want. You can also click the "URL" tab and paste in a Github URL. 

![](/assets/install-guides/IMG-20260720223547678.png)


Step 3: Check the **Local Path**. This is where the folder will live on your computer. 

Step 4: Click **Clone**.

That's it! The project is now a normal folder on your laptop.

### Opening a project in VS Code

Once a repository is cloned, GitHub Desktop shows you three shortcuts on its main screen. The one you want is **Open in Visual Studio Code**.

![](/assets/install-guides/IMG-20260720223652660.png)


Click it and VS Code opens with the whole project folder loaded. This is how you'll start work every time: open GitHub Desktop, pick the repository from the dropdown in the top-left, open in VS Code.

### Committing your changes

You've made some changes in VS Code. Time to checkpoint them.

Step 1: Switch to GitHub Desktop. The left panel shows every file you've changed. Click on a file and the right panel shows exactly what changed: green lines are new, red lines are deleted (1).

![](/assets/install-guides/IMG-20260720223836821.png)

Step 2: In the bottom-left corner, there's a small text box (2). Write a short message describing what you did. "Made the title enormous and red" is a perfectly good commit message. "changes" is a useless one, because in two weeks you won't remember what "changes" were.

Step 3: Click the blue **Commit to main** button (3).

Your checkpoint is saved. But only on your laptop, which brings us to:

### Pushing to GitHub

After you commit, a button appears at the top that says **Push origin**. Click it.

![](/assets/install-guides/IMG-20260720223957946.png)


That's it. Your commits travel up to GitHub, safe from anything that happens to your laptop. If your site is connected to Netlify, this is also the moment your live website updates.

## Using version control inside VS Code

Everything GitHub Desktop does, VS Code can also do without you switching windows. Some of you will prefer this. Both are fine, use whichever feels better for you.

To do this within VS Code, at the left sidebar. One of the icons looks like a branching path (three circles connected by lines). Click it. This is the Source Control panel.

When you've changed files, a number badge appears on this icon telling you how many.

![](/assets/install-guides/IMG-20260720224126196.png)

Step 1: At the top of the Source Control panel there's a message box. Type your commit message there.

Step 2: Click the **Commit** button below it.

Step 3: VS Code may ask if you want to "stage all changes and commit them directly". Say yes. (Staging is a git concept we'll get to later. For now, yes means "commit everything I changed", which is what you want.)

![](/assets/install-guides/IMG-20260720224322405.png)

After committing, the Commit button changes to say **Sync Changes**. Click it. Sync is VS Code's word for push (technically push and pull together, but that distinction won't matter for a while).

### GitHub Desktop or VS Code?

Whichever you like! GitHub Desktop shows changes more clearly and is harder to get lost in. The VS Code panel means never leaving your editor. Try both this week and pick your favourite. 

## Connecting your repository to Netlify

This is the step that puts your site on the actual internet. You do this once per project, and after that every push automatically updates your live site.

### Signing up

Step 1: Go to [netlify.com](https://netlify.com) and click **Sign up**.

Step 2: Choose **Sign up with GitHub**. This matters. Signing up with GitHub is what lets Netlify see your repositories later.

Step 3: GitHub will ask you to authorize Netlify. Click **Authorize**.

### Creating a site from your repository

Step 1: From your Netlify dashboard, click **Add new project**.

![](/assets/install-guides/IMG-20260720224517782.png)

Step 2: Choose **GitHub** as the source.

![](/assets/install-guides/IMG-20260720224555020.png)

Step 3: A window may pop up asking which repositories Netlify can access. Select all.

Step 4: Back in Netlify, find your repository in the list and click it.

![](/assets/install-guides/IMG-20260720224721556.png)

### Deploy settings

Netlify will show you a settings page before deploying. For our sites, the defaults are correct, which means:

- **Branch to deploy**: `main`
- **Build command**: leave it empty
- **Publish directory**: leave as is

Our sites are plain files, there is nothing to build.

Click **Deploy site**.

![](/assets/install-guides/IMG-20260720224835041.png)


### Finding your live URL

Netlify takes a minute or two. When it's done, you'll see a link at the top of your site's page, something like `glittery-samosa-4f2a1b.netlify.app`. That's your website! 

You can change this silly name: go to **Project configuration > Change site name** and pick something you like. The `.netlify.app` part stays for now.

![](/assets/install-guides/IMG-20260720224955245.png)

### How updates work from here

You never touch Netlify again for THIS website. From now on:

1. Edit your files in VS Code
2. Commit in GitHub Desktop or VS Code
3. Push

About a minute after you push, your live site updates by itself. Netlify is watching your GitHub repository and republishes every time something new arrives.

## Git flow: the one-pager

Print this. Stick it somewhere. This is the entire lifecycle of your website, and we will use it every single day.

```
  GITHUB (the cloud)                      YOUR LAPTOP
  ─────────────────                       ───────────

  my repo ──── you click Fork ───→  your copy on GitHub
                                          │
                                          │  Clone
                                          │  (download it, once)
                                          ▼
                                    folder on your laptop
                                          │
                                          │  Edit in VS Code
                                          │  (see it live with Live Server)
                                          ▼
                                    changed files
                                          │
                                          │  Commit
                                          │  (checkpoint + message)
                                          ▼
                                    checkpoints on your laptop
                                          │
                                          │  Push
                                          │  (send them up)
                                          ▼
  your copy on GitHub  ◄──────────────────┘
        │
        │  Netlify is watching your repo
        ▼
  your live website updates 🎉
```

### FAQs

### I have committed, but my site is not updating.

Are you forgetting to push? The site updates on push, not commits.
