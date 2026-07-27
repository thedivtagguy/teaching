---
date: 2026-07-15T12:00
updated: 2026-07-27T09:00
transition: none
---

# Hello Terminal, Hello Astro
#### _WEB2026 - Day 6_

---

## Where we are

Last week you wrote HTML and CSS by hand, designed a letter, and put it on the internet.

<div class="fragment">

Today we set up the tools professionals use for multi-page sites, and we use them to build one site, together. The HTML and CSS you write stays the same; the setup around it changes.

</div>

note: Quick recap round: ask one or two people what they shipped yesterday. State the day's outcome plainly: by 4pm the class site is live on the internet with seven letters on it, and everyone will have pushed to it from their own machine.

---

## Today

| Time | Block | Mode |
|---|---|---|
| 9:30 | The three languages; the cast; accept your invite | Together |
| 10:00 | Terminal basics | Solo |
| 10:10 | The old way vs. Astro | Watch |
| 10:35 | Clone our repo, look around, install, run | Pairs |
| 11:15 | File = URL | Together |
| 11:25 | Break it on purpose | Together |
| 11:50 | The CSS repair, practiced | Solo |
| 1:15 | The migration, demonstrated | Watch |
| 1:45 | Migrate your letter and push it | Solo |
| 3:00 | Pull, a garden note, two layout changes | Together |
| 3:30 | The live site | Together |

No homework tonight.

---

## One site, all of us

Today we do not each build a separate practice project. We build one site together.

- One repository, on my account. Each of you is a collaborator.
- The navigation already lists all seven of you, and a stub page is waiting for each letter.
- The site is already connected to Netlify: every push, from anyone, updates the live site.

<div class="fragment">

The one rule that makes this work: **you edit your own files only.** Yours are `src/pages/letters/yourname.astro` and, later, your garden note. Look at anything; edit only yours.

</div>

note: This is the day's frame; take the time to land it. Ownership is the conflict-prevention strategy: no branches, no pull requests, no forks, because each person's files do not overlap with anyone else's. Say the rule out loud and have the room repeat the two paths they own.

---

## Accept your invite

You have a collaborator invitation from GitHub, by email and in your GitHub notifications.

1. Accept it now.
2. Open GitHub Desktop: the class repository appears in your repository list.

That is the first of exactly four times you touch git today. The other three: push your letter this afternoon, pull to receive everyone else's, and push one word at the end.

note: Wait until all seven have accepted; it takes two minutes and everything downstream depends on it. Naming the four git touches up front removes the "git is a constant burden" feeling: each touch has a visible result.

---

## The three languages of the web

| Language | Its job | Do you write it? |
|---|---|---|
| HTML | Structure: headings, paragraphs, images | Yes, since Day 2 |
| CSS | Appearance: type, color, layout | Yes, since Day 3 |
| JavaScript | Behaviour: programs the browser runs | No, not in this course |

<div class="fragment">

The tools we install today, Astro included, are programs written in JavaScript. You will use them without writing any, the same way you use a camera without building one.

</div>

note: Students have written two of the three languages without anyone naming the third. Make the distinction clear: the tools are made of JavaScript, their own material stays HTML and CSS. Node, packages, and Astro all make sense once this lands.

---

<style>
.cast-intro { font-family: var(--font-archivo); font-size: 0.55em; text-align: left; margin-bottom: 0.8em; }
.cast-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.45em; font-family: var(--font-archivo); text-align: left; }
.cast-grid p { margin: 0; }
.cast-card { border: 1px solid var(--color-neutral); border-radius: 6px; padding: 0.45em 0.65em; }
.cast-card .cast-name { font-weight: 700; color: var(--color-orange); font-size: 0.5em; }
.cast-card .cast-role { font-weight: 300; font-size: 0.42em; line-height: 1.35; margin-top: 0.15em; }
.cast-card.wide { grid-column: span 2; }
</style>

## The cast of characters

<div class="cast-intro">Seven tools do today's work. Each one exists because a specific problem needed solving. We will meet each one properly at the moment we use it; for now, just attach each name to its problem.</div>

<div class="cast-grid">
  <div class="cast-card fragment" data-fragment-index="0"><p class="cast-name">Terminal</p><p class="cast-role">Your computer, controlled by typing. Exists because most developer tools have no buttons: typed commands are precise and repeatable.</p></div>
  <div class="cast-card fragment" data-fragment-index="1"><p class="cast-name">Node.js</p><p class="cast-role">Runs JavaScript outside the browser. Exists so tools like Astro can run on your laptop. You install it; you do not write JavaScript.</p></div>
  <div class="cast-card fragment" data-fragment-index="2"><p class="cast-name">pnpm</p><p class="cast-role">Downloads the code libraries a project depends on. Exists so nobody rewrites already-solved problems.</p></div>
  <div class="cast-card fragment" data-fragment-index="3"><p class="cast-name">Astro</p><p class="cast-role">Assembles the HTML and CSS you write into a finished site. Exists to end the copy-paste problem in the 10:10 demo.</p></div>
  <div class="cast-card fragment" data-fragment-index="4"><p class="cast-name">Dev server</p><p class="cast-role">Shows your site on your own laptop, refreshing on every save. Exists so you can see your work without uploading it.</p></div>
  <div class="cast-card fragment" data-fragment-index="5"><p class="cast-name">localhost:4321</p><p class="cast-role">The dev server's address: this computer, door number 4321. Nothing at this address is on the internet.</p></div>
  <div class="cast-card wide fragment" data-fragment-index="6"><p class="cast-name">Build</p><p class="cast-role">Turns the project into a plain folder of HTML, CSS and images. Exists because the internet serves finished files, and that folder is what gets deployed.</p></div>
</div>

note: Walk each card as it appears, one sentence each. Every tool answers an ordinary problem. This table is also in today's page and the starter README, so nobody needs to memorise it.

---

# The terminal

---

## Finder and the terminal

The terminal shows the same folders and files as Finder or Explorer. You control it by typing instead of clicking.

| In Finder | In the terminal |
|---|---|
| Double-click a folder | `cd foldername` |
| Look inside a folder | `ls` |
| "Which folder am I in?" | `pwd` |

These three commands cover almost everything you will type in this course.

note: Keep this short. Nothing in the terminal is hidden or dangerous; it is a different view of the computer they already use. Today needs the terminal for two project commands, both typed into VS Code's built-in terminal.

---

## Try it (10 minutes)

Open a terminal. Mac: press `Cmd+Space` and type "terminal". Windows: open Git Bash.

```bash
pwd
ls
cd Desktop
ls
```

Now navigate to the folder where your letter project lives, using only `cd`, `ls` and `pwd`. When you are there, run `ls` and check that you can see your own files.

note: Finding their own project is the whole exercise. Common snags: Windows students in cmd instead of Git Bash, and folder names with spaces, which need quotes. When most of the room has arrived at their project, move on.

---

# Why a framework?

---

## Demo: a three-page site by hand

I will turn a finished letter into a three-page site using only what we knew last week:

```text
letter-site/
├── index.html      ← nav pasted here
├── about.html      ← nav pasted here
└── contact.html    ← nav pasted here
```

You do not need to type along; just watch what happens when I change the nav, and then when I add a fourth page.

note: Perform it slowly. Duplicate index.html twice, paste a nav into all three. Announce a one-word nav change and edit all three files on screen. Add a fourth page: another copy, four navs to keep identical. Ask the room: how many files do I edit when this site has forty pages? Ten minutes maximum.

---

## What went wrong

- Every page carries its own copy of the navigation<!--element class="fragment"-->
- Changing one word means editing every file<!--element class="fragment"-->
- Adding a page means updating every existing page<!--element class="fragment"-->
- Nothing warns you when the copies drift apart<!--element class="fragment"-->

<div class="fragment">

This is not a skill problem. Plain HTML has no way to write something once and reuse it on every page.

</div>

note: Connect it to their own week: repeated values inside one page were already annoying. The missing feature named in the last line is exactly what the next demo shows.

---

## Demo: the same site in Astro

The navigation is written once, in a file called a layout.

Two things to watch for:

1. I edit the layout once, and every page changes.
2. I add one markdown file, and a new page appears, already listed on the site.

note: In the class repo: edit the nav text in MainLayout.astro, save, flip through several pages including two letter stubs. Then drop a prepared markdown note into src/pages/garden/ and show the new page plus the garden index listing it. Say once, plainly, what they saw: shared parts written once, and files becoming pages. Tuesday teaches them to build this.

---

## What Astro is

<style>
.flow { display: flex; align-items: stretch; justify-content: center; gap: 0.6em; font-family: var(--font-archivo); }
.flow p { margin: 0; }
.flow .box { border: 1px solid var(--color-neutral); border-radius: 6px; padding: 0.6em 0.9em; font-size: 0.48em; text-align: left; line-height: 1.4; display: flex; flex-direction: column; justify-content: center; }
.flow .box .t { font-weight: 700; }
.flow .box .s { font-weight: 300; }
.flow .arrow { font-size: 0.8em; align-self: center; }
.flow .astro-box { border: 2px solid var(--color-orange); }
</style>

<div class="flow">
  <div class="box"><span class="t">Your pages</span><span class="s">HTML and CSS, shared parts written once</span></div>
  <div class="arrow">→</div>
  <div class="box astro-box"><span class="t">Astro</span><span class="s">fills in every copy</span></div>
  <div class="arrow">→</div>
  <div class="box"><span class="t">A finished site</span><span class="s">plain HTML and CSS files</span></div>
</div>

<br/>

Astro is a static site generator: a program that takes pages where shared parts are written once, and generates the finished site with every copy filled in.

The output is the same kind of files you wrote by hand last week.

note: The day's central definition. Point at the right-hand box: the output of the tool is exactly what they hand-made in Week 1. Astro automates the copying; it does not replace their skills or their files.

---

## Static sites, WordPress, Wix

Static means the output is finished files, the same for every visitor.

- WordPress assembles each page freshly on every visit. It needs a database running, which means more machinery, more cost, and more that can break.
- Wix and Squarespace keep your site inside their builder. You rent access to your own work.
- A static site is a folder of files that you own. It is free to host, works on any server, and will still open in ten years.

note: This connects the tooling choice to the course's ownership argument. Monday's IndieWeb day picks this thread up properly.

---

## An Astro page is an HTML file

`.astro` files are not a new language. An Astro page is an HTML file that is allowed some extras.

Your letter, pasted in whole, with its doctype and head, is a valid Astro page. You will prove this yourself this afternoon.

note: Say this before anyone opens a file, because the first .astro file they see starts with a code fence and looks alien for a moment. The afternoon migration is the proof of the claim.

---

# Running the project

In pairs from here until 11:15.

---

## Step 1: clone and open the folder

1. In GitHub Desktop: the class repository is in your list now that you accepted the invite. Clone it.
2. In VS Code: File → Open Folder, and choose the project folder itself.

Open the folder, not a single file. VS Code treats the opened folder as the project, and its terminal starts inside it. If you open one file on its own, the terminal starts in the wrong place and commands fail.

note: Have everyone confirm the project name shows in VS Code's sidebar before moving on. This rule quietly prevents the most common day-one failure.

---

## Step 2: look around

Two minutes in the sidebar, before we run anything. Find:

1. Where the footer text lives
2. Which file makes the `/now` page exist
3. The list of packages this project needs
4. Your own stub page, waiting for your letter

<div class="fragment">

Answers: `src/layouts/MainLayout.astro`, `src/pages/now.astro`, `package.json`, and `src/pages/letters/yourname.astro`.

</div>

note: Students drive; confirm the answers on the projector afterwards. Finding their own stub matters: it makes the afternoon concrete and shows them their name is already in the nav.

---

## Inside index.astro

Open `src/pages/index.astro`:

```text
 ---
 import MainLayout from "../layouts/MainLayout.astro";
 ---

 <MainLayout title="Our class site">
   <h1>Our class site</h1>
 </MainLayout>
```

The section between the two `---` lines is where a page tells Astro what it needs. In this course it only ever contains import lines. Everything below it is normal HTML.

A page without that section is fine too; plain HTML works as a page.

note: Keep this light. The import line is an address, not a program; nobody is writing JavaScript. The next slide gives explicit permission to ignore the rest of the syntax.

---

## Three things you can ignore today

1. A tag with a capital letter, like `<MainLayout>`, is a tag someone made themselves. Astro lets you make your own tags; this one wraps the page in the site's shared frame. Astro calls these homemade tags components, and they are Tuesday's whole lesson.
2. `title="..."` on that tag is a setting passed into a homemade tag, the way `src` is a setting on `img`. Ignore it today.
3. `<slot />`, inside MainLayout, is something you will figure out before lunch, by breaking it.

note: Explicit permission to ignore is the point of this slide: without it, everyone privately burns attention on the alien tags. Each sentence anchors to Week 1 vocabulary: a tag, but homemade; an attribute, but yours. Use the word component exactly once, here, so Tuesday's title is familiar, and build nothing more on it today.

---

## Step 3: install

```bash
pnpm install
```

This reads `package.json`, the project's list of what it needs, and downloads all of it into a folder called `node_modules`.

note: Run it live and narrate over the scrolling output. The next slide handles the panic about the thousands of files. Snag: "command not found" right after installing pnpm means the terminal needs to be closed and reopened.

---

## node_modules and package.json

`package.json` is the list of what the project needs. `node_modules` is where the downloads go.

Thousands of files appear in `node_modules`. That is normal. Three rules:

1. You never edit it
2. You never commit it (`.gitignore` already excludes it)
3. You can delete it at any time; `pnpm install` recreates it

It is a download cache, not your work.

note: Defuse this the moment the folder appears in their sidebar. Every cohort has someone who tries to read node_modules or commits it.

---

## npm and pnpm

npm is two things with the same name: the public registry where packages are published, and the standard command-line tool that downloads from it.

pnpm is a different tool that uses the same registry. It is faster, and it is what this course's projects are set up for.

<div class="fragment">

The two tools do not mix inside one project, because each keeps its own records and they disagree.

The rule: when a tutorial or an LLM says `npm something`, you type `pnpm something`.

</div>

note: This rule protects them at home more than in class. The reasoning is here for whoever asks; the habit is what matters.

---

## Step 4: run

```bash
pnpm run dev
```

The terminal prints an address:

```text
http://localhost:4321
```

Open it in your browser and keep the tab open for the rest of the day.

note: Wait until every screen shows the class site homepage. The next two slides explain localhost and the busy terminal, in that order.

---

## localhost and ports

<style>
.port-flow { display: flex; align-items: stretch; justify-content: center; gap: 0.6em; font-family: var(--font-archivo); }
.port-flow p { margin: 0; }
.port-flow .box { border: 1px solid var(--color-neutral); border-radius: 6px; padding: 0.6em 0.9em; font-size: 0.48em; text-align: left; line-height: 1.4; display: flex; flex-direction: column; justify-content: center; }
.port-flow .box .t { font-weight: 700; }
.port-flow .box .s { font-weight: 300; }
.port-flow .arrow { font-size: 0.7em; align-self: center; }
.port-flow .hl { border: 2px solid var(--color-orange); }
</style>

<div class="port-flow">
  <div class="box"><span class="t">Your browser</span><span class="s">asks for the page</span></div>
  <div class="arrow">→</div>
  <div class="box hl"><span class="t">localhost:4321</span><span class="s">the dev server, on this same laptop</span></div>
</div>

<br/>

- localhost is the name every computer uses for itself. The address points at your own machine.
- A port is a numbered door. Many programs can answer requests on one computer, so each listens at its own number. Astro uses 4321.

<div class="fragment">

What you see at this address is your local copy of the class site. Nobody else sees it, and your changes reach the shared site only when you push.

</div>

note: The local-copy point matters more than usual today, because the site is shared: local changes are private until pushed, which is also why the sabotage lab later is safe. If someone's port is taken, Astro picks the next number and prints it.

---

## While the dev server runs

The terminal looks stuck. It is not: it is serving your site, and it keeps doing that until you stop it.

- `Ctrl+C` stops the server. Your files are not affected.
- `pnpm run dev` starts it again, any time.
- If you need to type other commands meanwhile, open a second terminal.
- Closing the laptop stops the server too. Tomorrow: open the project, run `pnpm run dev`, and continue.

note: This removes tomorrow morning's confusion today. Sabotage three makes them do it with their own hands, so keep this brisk.

---

## Step 5: edit your page

1. Open your stub: `src/pages/letters/yourname.astro`
2. Change the test heading to anything you like
3. Save
4. Look at `localhost:4321/letters/yourname`

The page updates on its own. The dev server watches for saved changes, so saving is what triggers the update. If the browser seems to ignore you, check for the white dot on the file tab; it means unsaved changes.

This edit stays on your machine. Nothing is pushed yet.

note: Editing their own stub, not the homepage, keeps the ownership rule intact from the first edit. Let everyone see one hot reload before continuing.

---

# File = URL

---

## The rule

A file in `src/pages/` becomes a page at the matching URL. A folder adds a section to the URL. There is no configuration.

<style>
.route-list { font-family: var(--font-archivo); font-size: 0.55em; text-align: left; display: flex; flex-direction: column; gap: 0.5em; margin-top: 0.6em; }
.route-list p { margin: 0; }
.route-row { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.8em; align-items: center; }
.route-row code { background: rgba(128,128,128,0.15); padding: 0.15em 0.45em; border-radius: 4px; }
.route-row .to { color: var(--color-orange); }
</style>

Before each answer appears, say it out loud:

<div class="route-list">
  <div class="route-row"><code>src/pages/index.astro</code> <span class="to">→</span> <span class="fragment">oursite.com/</span></div>
  <div class="route-row"><code>src/pages/about.astro</code> <span class="to">→</span> <span class="fragment">oursite.com/about</span></div>
  <div class="route-row"><code>src/pages/letters/amina.astro</code> <span class="to">→</span> <span class="fragment">oursite.com/letters/amina</span></div>
  <div class="route-row"><code>src/pages/garden/moss.md</code> <span class="to">→</span> <span class="fragment">oursite.com/garden/moss</span></div>
</div>

<div class="fragment">

Then in reverse: I say a URL, you tell me which file creates it. Your stub already proved the rule works; there is nothing to build here.

</div>

note: Run it quickly, whole room answering together. In the reverse round, ask what pages/Letters/Amina.astro would produce: a different URL with capital letters, which tees up the first sabotage. Use real student names in the examples when presenting.

---

# Break it on purpose

---

## How this lab works

You have a working project, so this is a good time to learn what a broken one looks like. Everything here happens on your own machine only: nothing you break can reach the shared site, because you never commit or push it.

For each item on the next slide:

1. Predict out loud what will happen
2. Break it
3. Look at what actually happens
4. Undo it, and check that the site recovers

note: Insist on the prediction step, spoken to a neighbour. With seven people this can also run as one conversation at one screen per pair. The local-only point is worth repeating once: git does not send anything anywhere until you commit and push.

---

## The three sabotages

1. Rename `about.astro` to `About.astro`. What happens to `/about`?<!--element class="fragment"-->
2. Delete the `<slot />` line from `MainLayout.astro`. What do the pages show now?<!--element class="fragment"-->
3. Press `Ctrl+C` in the terminal. What happens in the browser? What happens to your files?<!--element class="fragment"-->

Undo each one before starting the next.

<div class="fragment">

Two more breakages exist that we will only describe: a wrongly capitalised image path, and a damaged `---` line at the top of a page. In every case the method is the same: read the error, it names the file and the line.

</div>

note: Reveal one at a time and let the room work. Debrief lines: (1) the server enforces capitalisation; (2) they just found where page content enters the layout, and now know what the third ignorable thing from this morning does; Tuesday is about this mechanism; (3) the server is a program that stops and starts, the files are separate from it.

---

## What the lab showed

- Errors name the file and the line. Read them; they are usually right.
- `<slot />` is the spot where each page's content lands inside the layout.
- The dev server stops and starts freely. Your files do not depend on it.

note: Three lines, then move to the CSS repair. The details were experienced first-hand, which is the point of the lab.

---

# The CSS repair

One specific repair stands between your letter and the shared site. We practice it now, where nothing can go wrong.

---

## The situation and the repair

Your letter's CSS lives in a separate `styles.css`, connected by a `<link>` line in the head. When the letter moves into the Astro project, `styles.css` does not come with it, so the `<link>` points at a file that is not there, and the page loses its design.

The repair: delete the `<link>` line, and put the CSS itself into a `<style>` tag in the same place.

```html
<link rel="stylesheet" href="styles.css">   <!-- this line goes -->

<style>
  /* the contents of styles.css go here */
</style>
```

note: Name the cause precisely: the link points at a neighbouring file, and the file did not move. The style tag carries the same rules inside the page, so there is nothing left to point at.

---

## Practice it in your stub (15 minutes)

1. Add this line inside your stub, anywhere: `<link rel="stylesheet" href="letter-styles.css">`. Nothing changes, because the file does not exist. This is exactly the situation your letter will be in this afternoon.
2. Replace that line with a `<style>` tag containing one rule: `h1 { color: crimson; }`. Your test heading turns crimson.
3. Delete the `<style>` tag. Back to normal.

note: A dry run of the exact repair, on a page where mistakes cost nothing. Everyone should see the crimson heading before lunch; that is the checkpoint for this block.

---

## Scoped styles

A `<style>` tag inside an `.astro` file is scoped: its rules apply only to that one file. Astro renames the selectors during the build so they cannot affect anything else.

This is new. Last week, every rule you wrote applied to the whole page.

<div class="fragment">

It is also why the class site works: seven letters, each carrying its own CSS, can live in one site without restyling each other. The site-wide CSS lives in `src/styles/global.css`, which belongs to the layout owner.

</div>

note: If a page ever genuinely needs site-wide reach there is style is:global, but nobody needs it today. The seven-letters point is the concrete payoff: their h1 rules and a classmate's h1 rules will coexist without conflict, and now they know why.

---

# The migration

Your letter joins the class site.

---

## What migrates, and how

| Part of your letter | What happens to it |
|---|---|
| The HTML: your words and tags | Pasted in unchanged. A complete HTML document, doctype and head included, is a valid Astro page. |
| `styles.css` | Its contents move into a `<style>` tag: the repair you practiced at 11:50. |
| Images | The files move into `public/images/yourname/`. Every `src` changes to start with `/images/yourname/`. |
| Font links in your `<head>` | They stay; the head came along with your document. |
| Your old folder | Stays on your disk, untouched. |

note: This table answers the questions before they come up: no doctype or head needs adding, the letter already has both and keeps them today. The per-name image folder exists because public/images/ is shared by seven people, and two of them will otherwise both have a photo.jpg. Pages that use a layout will not carry their own head; that is Tuesday.

---

## Ground rules

- Your old letter folder is not touched at any point.
- The dev server stays running, the browser stays open.
- One change at a time, and check the browser after each change.
- You edit only your own two paths: `src/pages/letters/yourname.astro` and `public/images/yourname/`.

I will migrate a spare letter at the front twice: once by hand, and once with Copilot. Then you do yours, whichever way you prefer.

note: Demo both paths. By hand: the steps on the next slides, narrating the check after each change. Then reset and do it again by asking Copilot with the prompt from its slide, reading the result critically before saving. In the manual pass, hit the prepared error (a half-pasted tag) and repair it calmly from the terminal message.

---

## Step 1: start from your stub

Open `src/pages/letters/yourname.astro` and confirm `localhost:4321/letters/yourname` still shows it.

This is the page-exists check, and your stub already passed it this morning. Everything you do next happens in this one file.

note: The stub replaces the create-an-empty-page step: existence is already proven, ownership is already established, and no stray practice pages accumulate in the shared repo.

---

## Step 2: paste the letter

1. Open your old `index.html`. Select all. Copy.
2. In your stub: select all, delete, paste everything.

The whole document, doctype included.

Check: your words are on the page.

note: If their CSS was in a style tag in the head, it came along and the page may already look right, so they skip step 3. A blank page means a half-pasted tag; the terminal error names the file and line.

---

## Step 3: the repair, for real

If your CSS lived in a separate `styles.css`:

1. Delete the old `<link rel="stylesheet" ...>` line.
2. Add a `<style>` tag in its place.
3. Paste the contents of your `styles.css` inside it.

Check: your typography is back. Scoping keeps these rules inside your page, so nothing else on the site changes.

note: This is the practiced repair with real content. Anyone who did the 11:50 dry run has already done this once today.

---

## Step 4: the images

1. Copy your image files into `public/images/yourname/`. Lowercase names, hyphens, no spaces.
2. Change every `src` to start with `/images/yourname/`:

```html
<img src="/images/amina/van-gogh.jpg" alt="The Starry Night">
```

Check every image.

Files in `public/` are served from the site's root as they are, which is why "public" does not appear in the URL.

note: The per-name folder is the ownership rule applied to images; it also prevents two students' photo.jpg from colliding. A missing image: Network tab, compare what the browser asked for with what exists, check the capitalisation.

---

## Step 5: push it

In GitHub Desktop:

1. Commit your changes with a message like "Add my letter"
2. Push

<div class="fragment">

If the push is refused, a classmate pushed since you last pulled. The push button becomes "Pull origin": click it, let the merge happen (it will, because your files do not overlap with anyone's), then push again.

Your letter is now in the shared repository, and the live site is already rebuilding.

</div>

note: The refused-push rule is the one piece of git rhythm today needs; teach it once, projected. Because everyone finishes at different times, pushes stagger naturally and most students will not even hit it. Anyone whose git fights them at 2:45 sends you their two files; you commit from the front, and their machine gets fixed on Monday.

---

## Or: ask Copilot to do the rewrite

Open Copilot chat in VS Code, or ChatGPT in a browser, and give it everything it needs:

> I am moving a plain HTML page into an Astro project, as `src/pages/letters/yourname.astro`. Astro accepts a complete HTML document as a page. Combine my two files into that one file: put the contents of styles.css into a `<style>` tag in the head and delete the `<link>` line, and change every image src to start with `/images/yourname/`. Keep my HTML structure and wording exactly as they are. No JavaScript, no React. Here is index.html: (paste). Here is styles.css: (paste).

Read the result before saving it. Your wording should be untouched. Then continue from step 4: the images, and the push.

note: A legitimate way to do today's work, and how many of them will work after the course. The discipline is reading the output; the morning was spent making and breaking files by hand exactly so they can judge a generated one.

---

## What Copilot cannot do

- It cannot copy your image files into `public/images/yourname/`. You move the files yourself, in Finder.
- It cannot see your browser. Whether the page looks right is checked by you, against the old version.
- It sometimes changes things it was not asked to change. Compare the wording; it should be identical.

note: The image-files point catches almost everyone on the Copilot path: the paths update, the files never moved, every image breaks. Treat it as a teaching moment when it happens.

---

## Asking a good question

When something breaks and you ask an LLM, include four things:

1. What world you are in: "an Astro project, plain HTML and CSS only, no JavaScript, no React." Most Astro-related code online is React; without this sentence you get answers for a different setup.
2. What you did, what you expected, and what happened.
3. The full error from the terminal, which names the file and the line.
4. The question "what is wrong, and which line should I look at", rather than a request for replacement code.

And where any answer says `npm`, type `pnpm`.

note: One slide, because they are about to spend an hour where this matters. The full worked example of a bad and a better question is in today's page for later reference.

---

## Check your work

Open your old letter file in one tab and `localhost:4321/letters/yourname` in the other. They should look identical. Then push.

<div class="fragment">

Finished early? Write a garden note in `src/pages/garden/`, copying the frontmatter of an existing note. That is your second owned path.

</div>

note: Circulate through the whole studio block. The letter has no layout wrapped around it on purpose; making it use one is Tuesday's first exercise, and anyone who asks for the nav early is ready for Tuesday.

---

## If something breaks

| Symptom | Where to look |
|---|---|
| Page blank, terminal shows an error | The error names the file and line. Usually a half-pasted tag. |
| An image is missing | Network tab. Check the capitalisation and the `/images/yourname/` prefix. |
| The push is refused | Pull origin, then push again. A classmate pushed first; the merge is automatic. |
| The letter has no site navigation | Correct. It uses no layout yet. Tuesday. |

---

# One site, together

---

## Pull: everyone's letters

In GitHub Desktop: pull origin.

Now look at `localhost:4321` on your own machine. Everyone's letters are on your laptop, fetched in one move.

Seven people worked alone for an hour. One pull assembled the result.

note: Give this a real pause and let people click through each other's letters locally. This is the payoff of the shared-repo model, and the first time git produces something for them rather than asking something of them.

---

## A garden note, written together

I create one markdown file in `src/pages/garden/`, live, and the class dictates the lines.

When it is saved, watch two things:

1. The note becomes a page.
2. The garden index lists it, without anyone editing the index.

A file with no HTML in it just became part of the site. Markdown becomes your main writing surface on Tuesday.

note: Class dictates, you type; keep it under ten minutes and keep the note honest, about today. Point at the two --- lines in the file once: in markdown files this block holds facts about the page, the title and the date, and Tuesday explains it properly.

---

## Two changes to the layout

I edit the shared frame twice. After each change, pull, and look at your local site.

1. A wording change in the nav
2. A colour change in the shared CSS

Every page changes, including pages nobody touched. One file, written once, controlling the whole site: this is the mechanism today has been pointing at. On Tuesday you build with it.

note: Two rounds is enough to feel the lever; resist doing more. The pull-after-each-change also rehearses the git rhythm one more time without making it the subject.

---

# The live site

---

## It has been live all afternoon

The class repository is connected to Netlify: every push, from any of us, triggers a build and publishes the result. Your letters went live as you pushed them.

You will set this up for a repository of your own on Day 8, and for your personal site in project week. Today we use the pipeline; soon you will own one.

note: Open the live site on the projector for the first time here, letters already on it. The reveal that it was live all along lands better than a setup ceremony, and individual Netlify plumbing is deliberately deferred to Day 8 and Day 10, per the course decision log.

---

## The build

<style>
.deploy-flow { display: flex; align-items: stretch; justify-content: center; gap: 0.5em; font-family: var(--font-archivo); }
.deploy-flow p { margin: 0; }
.deploy-flow .box { border: 1px solid var(--color-neutral); border-radius: 6px; padding: 0.55em 0.8em; font-size: 0.44em; line-height: 1.4; text-align: left; display: flex; flex-direction: column; justify-content: center; }
.deploy-flow .box .t { font-weight: 700; }
.deploy-flow .box .s { font-weight: 300; }
.deploy-flow .arrow { font-size: 0.7em; align-self: center; }
.deploy-flow .hl { border: 2px solid var(--color-orange); }
</style>

<div class="deploy-flow">
  <div class="box fragment" data-fragment-index="0"><span class="t">Our repo</span><span class="s">on GitHub</span></div>
  <div class="arrow fragment" data-fragment-index="1">→</div>
  <div class="box hl fragment" data-fragment-index="1"><span class="t">Build</span><span class="s">pnpm run build</span></div>
  <div class="arrow fragment" data-fragment-index="2">→</div>
  <div class="box fragment" data-fragment-index="2"><span class="t">dist/</span><span class="s">plain HTML, CSS, images</span></div>
  <div class="arrow fragment" data-fragment-index="3">→</div>
  <div class="box fragment" data-fragment-index="3"><span class="t">The live site</span><span class="s">on the internet</span></div>
</div>

<div class="fragment" data-fragment-index="4">

On the projector: the deploy log from the last push. The stages in the log are the stages in this diagram: install, build, upload. The `dist/` folder contains the same kind of files you wrote by hand in Week 1.

</div>

note: Walk the log against the diagram. On Day 5 they handed Netlify finished files; today Netlify runs the build first, because an Astro project needs assembling. Same Netlify, new division of labour.

---

## Everyone pushes one word

1. Change one word in your letter
2. Commit and push (pull first if the push is refused)
3. Reload the live site

Within a minute or two, all seven changes are on the internet.

<div class="fragment">

From today, publishing means pushing. This is called continuous deployment, and it is the same workflow professional teams use.

</div>

note: The fourth and final git touch of the day, done all at once so the staggered pull-then-push rhythm gets one last rehearsal. Watch the deploy queue on the projector while the pushes land.

---

## What we covered

1. A framework writes the repeated parts of a site from a single source. The output is still plain HTML and CSS.
2. A file in `src/pages/` is a page. A `<style>` tag in a page styles only that page.
3. Seven people can share one repository by owning their own files, pulling, and pushing.
4. Publishing means pushing.

---

# No homework

It is Saturday.

If you want something light on Sunday: the [markdown tutorial](https://commonmark.org/help/tutorial/) takes ten minutes and prepares you for Tuesday, and the [Node & npm quiz](https://teaching.aman.bh/web2026/quiz-node-and-npm) checks today's concepts.

Monday: digital gardens, no code. Tuesday: your letter gets the site's layout, and you build the mechanism from the second sabotage.

note: Keep the ending short. The links are genuinely optional.
