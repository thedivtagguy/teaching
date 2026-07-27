---
title: Day 6 - Hello Terminal, Hello Astro
date: 2026-07-25
description: Why frameworks exist, the tools that run them, and moving your letter into our shared Astro site
published: false
section: Building with Astro
order: 1
seo_title: Hello Terminal, Hello Astro
seo_description: Why static site generators exist, terminal basics, and your first Astro project
seo_keywords: terminal, command line, node, pnpm, Astro, static site generator, web development course
seo_type: article
seo_author: Aman Bhargava
updated: 2026-07-27T06:52
slug: day-6-hello-terminal-hello-astro
slides: https://teaching.aman.bh/slides/web2026/day-6-hello-terminal-hello-astro
show_metadata_card: true
devNotes: https://github.com/open-making/web2026-dev-notes/issues/6
---
## Day 6: Hello Terminal, Hello Astro

Last week you wrote HTML and CSS by hand, designed a letter, and put it on the internet. You know what a web page is made of because you have made one yourself. None of that changes today. What changes is the setup around it.

The limit of last week's way of working is the second page. As soon as a site has more than one page, plain HTML forces you to copy shared things (a navigation bar, a footer, the `<head>`) into every file and keep every copy in sync by hand. Today you will watch that problem happen, and then see how a tool called [Astro](https://astro.build) solves it. The rest of the day's material (the terminal, Node, pnpm) exists to make that solution run.

### One site, all of us

Today we do not each build a separate practice project. We build one site together.

I have set up a class repository: an Astro project with a navigation that already lists all seven of you, and a stub page waiting for each of your letters. You will get a collaborator invite from GitHub; once you accept it, the repository shows up in your GitHub Desktop list like any of your own. Everyone pushes directly to the same repository, and the site is already connected to Netlify, so every push from anyone updates the live site.

Seven people pushing to one repository works because of one rule, and we will hold to it all day: **you edit your own files only.** Your files are your letter page (`src/pages/letters/yourname.astro`) and, if you write one, your garden note. The layout, the homepage, and everyone else's pages belong to their owners. Look at anything; edit only yours.

You will touch git exactly four times today, and each time something visible happens: accept the invite and clone in the morning, push your letter in the afternoon, pull to receive everyone else's letters, and push one word at the very end to watch the live site rebuild itself.

By 4:00 pm the class site will be live on the internet with seven letters on it, and you will have done every step of that from your own machine.

### Background: the three languages of the web

Web pages are made of up to three languages, each with one job:

- **HTML** describes structure: this is a heading, this is a paragraph, this is an image.
- **CSS** describes appearance: this heading is set in Caslon, this column is 60 characters wide.
- **JavaScript** describes behaviour: when this button is clicked, do this. It is a full programming language, and it is the only one of the three that browsers run as a program.

You have written the first two since Day 2 and Day 3. You will not write the third in this course. But JavaScript still matters to you indirectly: the tools we install today, Astro included, are programs written in JavaScript. You will use them without writing any, the same way you use a camera without building one.

### How today runs

| Time | What we do | Mode |
| --- | --- | --- |
| 9:30 | Where we are; the three languages; the cast of characters; accept your invite | Together |
| 10:00 | Terminal basics | Solo, 10 min |
| 10:10 | Demo: a multi-page site the old way, then the same site in Astro | Watch |
| 10:35 | Clone our repo, look around, install, run | Pairs |
| 11:15 | File = URL | Together |
| 11:25 | Break it on purpose: three sabotages | Together-ish |
| 11:50 | The CSS repair, practiced once | Solo, 15 min |
| 12:15 | Lunch | |
| 1:15 | The migration: what moves, and a demo, by hand and with Copilot | Watch |
| 1:45 | Migrate your letter and push it | Solo, the big block |
| 3:00 | Pull: everyone's letters arrive; a garden note, written together; two changes to the layout | Together |
| 3:30 | The live site: watch a build, then everyone pushes one word | Together |

### The cast of characters

You meet several new tools today. Each exists because a specific problem needed solving. You do not need to memorise this table; we meet each tool properly at the moment we use it. It is here so the names have somewhere to live and so you can look them up again later.

| Name | What it is | The problem it solves |
| --- | --- | --- |
| **Terminal** | A text interface to your computer. The same folders and files you see in Finder or Explorer, controlled by typing commands. | Most developer tools have no buttons. They are operated by typed commands, because typed commands are precise and repeatable. |
| **Node.js** | A program that runs JavaScript on your computer, outside a browser. | JavaScript could originally run only inside browsers. Node freed it, which made it possible to build tools like Astro that run on your laptop. Astro is written in JavaScript, so it needs Node. You install Node; you do not write JavaScript. |
| **pnpm** | A package manager: it downloads and organises the code libraries a project depends on. | Nobody rewrites solved problems. A project lists what it needs in a file called `package.json`, and pnpm fetches all of it with one command. |
| **Astro** | A static site generator. You write pages in HTML and CSS; Astro assembles them into a finished website. | The copy-paste problem from the morning demo: shared parts of a site should be written once, not once per page. |
| **Dev server** | A small web server running on your own laptop while you work. | You need to see your site as you edit it, without uploading anything. It refreshes the browser every time you save. |
| **localhost:4321** | The address of your dev server. `localhost` is every computer's name for itself; `4321` is the port Astro answers on. | Your browser needs an address for the dev server. This one points at your own machine. Nothing at this address is on the internet. |
| **Build** | The step where Astro converts your project into a plain folder of HTML, CSS and images. | The internet serves finished files. The build produces them, in a folder called `dist/`, and that folder is what gets deployed. |

### 10:00, terminal basics

The terminal shows the same folders and files as Finder or Explorer; you control it by typing instead of clicking. Three commands cover almost everything you will type in this course:

```bash
pwd    # print which folder I am standing in
ls     # list what is here
cd x   # move into folder x
```

Open a terminal (Mac: press `Cmd+Space`, type "terminal"; Windows: open Git Bash) and try them. Then the actual exercise: navigate to the folder where your letter project from this week lives, using only these three commands, and run `ls` there to see your own files listed.

That is all the terminal skill today requires. The two commands we run later (`pnpm install` and `pnpm run dev`) will be typed into the terminal built into VS Code, which opens in the right folder automatically.

### 10:10, the demo: the old way, then Astro

You do not need to type during the demos.

**Demo 1, the old way.** I take a finished letter like yours and turn it into a three-page site using only what we knew last week: copy `index.html` three times, paste a navigation bar into each copy. Then I change one word in the navigation, which means editing three files. Then I add a fourth page, which means editing four. Every page owns a private copy of everything, and nothing warns you when the copies drift apart. Forty pages would mean forty edits for a one-word change.

**Demo 2, the same site in Astro.** The same three pages, but the navigation is written once, in a file called a layout. I change one word in the layout and every page updates. Then I add a new page by creating one markdown file, and it appears in the site's page list without any other edit.

Astro is a **static site generator**: a program that takes pages where shared parts are written once and generates the finished site, with every copy filled in. The output is plain HTML and CSS, the same kind of files you wrote by hand last week. Astro automates the copying; it does not replace what you learned.

Two things about the word "static" that matter to you:

- Static means the output is finished files, the same for every visitor. WordPress, by contrast, assembles each page freshly on every visit and needs a database running to do it. Static sites are faster, usually free to host, and have less that can break.
- Unlike Wix or Squarespace, where your site lives inside a company's builder, this project is a folder of files that you own. You can move it to any host, open it in ten years, or hand it to someone else. This is the same reason the course had you write HTML by hand before introducing any tool.

One more thing before we open the project: **`.astro` files are not a new language.** An Astro page is an HTML file that is allowed some extras. Your letter, pasted in whole with its doctype and head, is a valid Astro page. You will prove that this afternoon.

### 10:35, code along: clone, look around, install, run

In pairs, working on both laptops.

**1. Clone and open.** The class repository is in your GitHub Desktop list now that you have accepted the invite. Clone it, then open it in VS Code with **File → Open Folder**, choosing the project folder itself. Open the folder, not a single file: VS Code treats the opened folder as the project, and its built-in terminal starts inside it. If you open one file on its own, the terminal starts in the wrong place and commands fail.

**2. Look around.** Before running anything, spend two minutes in the sidebar and find three things: where the footer text lives, which file makes the `/now` page exist, and the list of packages this project needs. You will find them in `src/layouts/MainLayout.astro`, `src/pages/now.astro`, and `package.json`. Also find your own stub: `src/pages/letters/yourname.astro` is already there, waiting for the afternoon.

While you are looking, open `src/pages/index.astro`:

```text
 ---
 import MainLayout from "../layouts/MainLayout.astro";
 ---

 <MainLayout title="Our class site">
   <h1>Our class site</h1>
 </MainLayout>
```

The section between the two `---` lines is where a page tells Astro what it needs. In this course it only ever contains import lines. Everything below it is normal HTML. A page without that section is fine too; plain HTML works as a page.

Three things on this screen you can safely ignore today:

1. A tag with a capital letter, like `<MainLayout>`, is a tag someone made themselves. Astro lets you make your own tags; this one wraps the page in the site's shared frame. Astro calls these homemade tags components, and they are Tuesday's whole lesson.
2. `title="..."` on that tag is a setting passed into a homemade tag, the way `src` is a setting on `img`. Ignore it today.
3. `<slot />`, which you will find inside MainLayout, is something you will figure out before lunch, by breaking it.

**3. Install.** In VS Code's terminal (`Terminal → New Terminal`):

```bash
pnpm install
```

This reads `package.json`, the project's list of what it needs, and downloads all of it into a folder called `node_modules`. Thousands of files appear, and that is normal. Three rules about `node_modules`: you never edit it, you never commit it (the project's `.gitignore` already excludes it), and you can delete it at any time because `pnpm install` recreates it. It is a download cache, not your work.

While the install runs, the naming question everyone has: **what are npm and pnpm?** npm is two things with the same name: the public registry where packages are published, and the standard command-line tool that downloads from it. pnpm is a different tool that uses the same registry; it is faster, and it is what this course's projects are set up for. The two tools do not mix inside one project, because each keeps its own records and they disagree. The rule: when a tutorial or an LLM says `npm something`, you type `pnpm something`.

**4. Run.**

```bash
pnpm run dev
```

This starts the dev server and prints an address, `http://localhost:4321`. Open it in your browser and keep the tab open for the rest of the day.

- `localhost` is the name every computer uses for itself. The address points at your own machine.
- `4321` is a **port**: a numbered door. Many programs can answer requests on one computer, so each listens at its own number. Astro uses 4321, and if that door is busy it picks the next one and tells you.

The site in your browser right now is your local copy of the class site. Nobody else sees it, even on the same wifi; changes reach the shared site only when you push. Your terminal also now looks stuck. It is not: it is serving the site, and it keeps doing that until you stop it with `Ctrl+C` or close the laptop. Stopping the server never affects your files, and `pnpm run dev` starts it again any time. If you need to type other commands while it runs, open a second terminal.

**5. Edit and watch.** Open your own stub, `src/pages/letters/yourname.astro`, change the test heading to anything you like, and save. The browser updates on its own at `localhost:4321/letters/yourname`. The dev server watches for saved changes, so saving is what triggers the update; if the browser seems to ignore you, check for the white dot on the file tab that means unsaved changes. This edit stays on your machine; nothing is pushed yet.

### 11:15, file = URL

Astro's routing is one rule: **a file in `src/pages/` becomes a page at the matching URL.** `about.astro` is `/about`. A folder adds a section to the URL, which you have already seen from your own stub: `letters/yourname.astro` is `/letters/yourname`. There is no configuration.

We test the rule as a quick game: I show the repo's file tree and the room calls out each URL, then I call out URLs and you name the file that creates each one. Your stub was your proof that the rule works; there is nothing else to build here.

### 11:25, lab: break it on purpose

You now have a working project, so this is a good time to learn what a broken one looks like. Everything in this lab happens on your own machine only: nothing you break here can reach the shared site, because you never commit or push it. Undo each sabotage before starting the next.

For each one: **predict** out loud what will happen, **break** it, **observe** what actually happens, then **undo** it and confirm the site recovers.

1. **Rename `about.astro` to `About.astro`.** Prediction: what happens to `/about`? Observation: it returns a 404. The capitalisation rules from Day 4 now have a server enforcing them.
2. **Delete the `<slot />` line from `MainLayout.astro`.** Prediction: what do the pages show? Observation: every page keeps its nav and footer but loses its own content. You have found the exact spot where page content enters the layout, and you now know what that third ignorable thing from this morning does. Tuesday's class is about this mechanism.
3. **Press `Ctrl+C` in the terminal.** Observation: the browser can no longer reach `localhost:4321`, because the server is gone. Your files are all still there. Run `pnpm run dev` and everything returns. This is also what happens when you close your laptop tonight, so now you know the way back.

Two more breakages exist that we will only mention: a wrongly capitalised image path (the Network tab shows the browser asking for a file that does not exist), and a damaged `---` line at the top of a page (the terminal prints an error naming the file and line). In every case the method is the same: read the error; it is usually right.

### 11:50, the CSS repair, practiced once

This afternoon, one specific repair stands between your letter and the shared site, so we practice it now, on the stub, where nothing can go wrong.

The situation: your letter's CSS lives in a separate `styles.css`, connected by a `<link>` line in the head. When the letter moves into the Astro project, `styles.css` does not come with it, so the `<link>` points at a file that is not there and the page loses its design. The repair: delete the `<link>` line and put the CSS itself into a `<style>` tag in the same place.

Practice it in your stub:

1. Add this line inside your stub, anywhere: `<link rel="stylesheet" href="letter-styles.css">`. Nothing changes; the file does not exist, which is exactly the situation your letter will be in.
2. Replace that line with a `<style>` tag containing one rule: `h1 { color: crimson; }`. Your test heading turns crimson.
3. Delete the `<style>` tag again. Back to normal.

One thing to know about that `<style>` tag, because it is new: a `<style>` tag inside an `.astro` file is **scoped**. Its rules apply only to that one file; Astro renames the selectors during the build so they cannot affect anything else. Last week, every rule you wrote applied to the whole page. This is why seven letters, each carrying its own CSS, can live in one site without restyling each other, and it is why this afternoon's paste is safe. The site-wide CSS lives in one shared place, `src/styles/global.css`, which belongs to the layout owner: me. If a page ever genuinely needs its style to reach the whole site, `<style is:global>` exists, but you will not need it today.

### 1:15, the migration

Your letter moves into the class site. First, what actually moves:

| Part of your letter | What happens to it |
| --- | --- |
| The HTML: your words and tags | Pasted in unchanged. A complete HTML document, doctype and head included, is a valid Astro page. |
| `styles.css` | Its contents move into a `<style>` tag in the page: the repair you practiced at 11:50. |
| Images | The files move into `public/images/yourname/`. Every `src` changes to start with `/images/yourname/`. |
| Font links in your `<head>` | They stay; the head came along with your document. |
| Your old folder | Stays on your disk, untouched. |

Two details in that table answer the questions people ask here. You do not need to add a doctype or a head, because your letter already has both, and today it keeps them (pages that use a layout do not carry their own head; that is Tuesday's topic). And your images go into a folder named after you, because `public/images/` is shared by all seven of us and two people will otherwise both have a `photo.jpg`.

I will migrate a spare letter at the front twice: once by hand, and once by asking Copilot to do the rewrite. Then you do yours, whichever way you prefer. The ground rules: your old folder is not touched, the dev server stays running, you check the browser after every change, and you edit only your own two paths: `src/pages/letters/yourname.astro` and `public/images/yourname/`.

**The manual path:**

1. Open your stub, `src/pages/letters/yourname.astro`, and confirm `localhost:4321/letters/yourname` still shows it.
2. Open your old `index.html`, select all, copy, and paste it over everything in the stub. Check that your words are on the page.
3. Do the CSS repair for real: delete the old `<link rel="stylesheet" ...>` line, add a `<style>` tag in its place, and paste the contents of your `styles.css` inside it. Check that your typography is back.
4. Copy your image files into `public/images/yourname/` (lowercase names, hyphens, no spaces) and change every `src` to start with `/images/yourname/`. Check every image. Files in `public/` are served from the site's root as they are, which is why "public" does not appear in the URL.
5. **Push it.** In GitHub Desktop: commit your two paths with a message like "Add my letter", then push. If the push is refused, that only means a classmate pushed since you last pulled: click "Pull origin", let it merge (it will, because your files do not overlap with anyone's), then push again. Your letter is now in the shared repository, and the live site is already rebuilding itself.

**The Copilot path.** Open Copilot chat in VS Code, or ChatGPT in a browser, and give it everything it needs:

> I am moving a plain HTML page into an Astro project, as `src/pages/letters/yourname.astro`. Astro accepts a complete HTML document as a page. Combine my two files into that one file: put the contents of styles.css into a `<style>` tag in the head and delete the `<link>` line, and change every image src to start with `/images/yourname/`. Keep my HTML structure and wording exactly as they are. No JavaScript, no React. Here is index.html: (paste). Here is styles.css: (paste).

Read the result before saving it, and know what the LLM cannot do:

- It cannot copy your image files into `public/images/yourname/`. You move the files yourself, in Finder. If you skip this, every image breaks even though the paths look right.
- It cannot see your browser. Whether the page looks right is checked by you, against the old version.
- It sometimes changes things it was not asked to change. Compare the wording; it should be identical.

The same rules cover any question you ask an LLM today: say what world you are in ("an Astro project, plain HTML and CSS only, no JavaScript, no React"), say what you did, what you expected, and what happened, paste the full error from the terminal if there is one, and do not save code you cannot read. Most Astro-related code on the internet is React, so a question without that first sentence gets answers for a different setup. And where any answer says `npm`, type `pnpm`.

**Either way, finish the same way:** open the old file and the new page side by side. They should look identical. Then push. If something is off before you push: a blank page means a half-pasted tag, and the terminal error names the file and line; a missing image means the path or the capitalisation, and the Network tab shows what the browser asked for. Your letter will not have the site's navigation styling wrapped around it, because it uses no layout; that is Tuesday's first exercise.

**If you finish early:** write a garden note in `src/pages/garden/`, copying the frontmatter of an existing note. That is your second owned path.

**If your setup fights you at 2:45:** send me your two files. I commit them from the front, your letter ships today, and we repair your machine on Monday. The letter is never hostage to one laptop.

### 3:00, one site, together

Three things in a row, all on the projector and your machines at once.

**Pull.** In GitHub Desktop, pull origin. Then look at `localhost:4321` on your own machine: everyone's letters are now on your laptop, fetched in one move. Seven people worked alone for an hour, and one pull assembled it.

**A garden note, written together.** I create one markdown file in `src/pages/garden/`, live, with the class dictating the lines. When I save it, watch two things: the note becomes a page, and the garden index lists it without anyone editing the index. A file with no HTML in it became part of the site. Markdown becomes your main writing surface on Tuesday.

**Two changes to the layout.** I edit `MainLayout.astro` twice: a wording change in the nav, then a colour in the shared CSS. After each, you pull and look at your local site: every page changed, including your letter's URL bar frame, and nobody touched their own files. One file, written once, controlling every page: this is the mechanism the whole day has been pointing at, and on Tuesday you build with it.

### 3:30, the live site

The class repository has been connected to Netlify since before class: every push, from any of us, triggers a build of the site and publishes the result. Your letters have been going live all afternoon as you pushed them.

Now we watch it happen properly. On the projector: the Netlify deploy log from the last push. What it shows is a **build**: Astro assembling the project into `dist/`, the plain folder of HTML, CSS and images that the internet receives. Install, build, upload: the same three stages every time.

Then the closing step, everyone at once: change one word in your letter, commit, push (pull first if the push is refused), and reload the live site. Within a minute or two, all seven changes are on the internet. From today, publishing means pushing. This is called continuous deployment, and it is the same workflow professional teams use.

You will set this up for a repository of your own on Day 8, and for your personal site in project week. Today you used the pipeline; soon you will own one.

### Questions you will have

Honest answers to the questions this day tends to generate. If yours is not here, ask it.

**Is JavaScript something I will have to learn eventually?** Not in this course. If you keep making websites, some JavaScript may eventually earn its place (a menu that opens, a filter that filters), and you can learn the little you need at that point. Everything you build in the next two weeks is HTML, CSS and markdown.

**If Astro is written in JavaScript, why am I not writing JavaScript?** Because using a tool does not require building one. Astro is a finished program; Node runs it; your material is HTML and CSS.

**Why do developers use the terminal at all?** Typed commands are precise, repeatable, and universal: every developer tool can be driven from the terminal, and only some have buttons. You need about five commands for this course.

**What exactly is a package?** A folder of code someone published so that others do not have to rewrite a solved problem. Astro itself is a package; so are the smaller pieces it depends on. `package.json` lists the ones this project uses.

**Why did thousands of files appear when I ran `pnpm install`?** Packages depend on other packages. Everything lands in `node_modules`, which is a download cache: never edit it, never commit it, delete and regenerate it freely.

**Is my local site the same as the live site?** Your laptop holds a full copy of the project, and `localhost:4321` shows that copy. The live site updates only when someone pushes. Between your pushes and pulls, the two can differ, and that is normal.

**What if my push is refused?** A classmate pushed since you last pulled. Pull, then push again; GitHub Desktop turns the button into "Pull origin" for you. The merge is automatic because you each edit different files. This is the whole reason for the "edit only your own files" rule.

**What is a port?** A numbered door on your computer. Many programs can answer requests at once, so each listens at its own number. Astro prefers 4321; other tools prefer other numbers.

**Is `.astro` a language I have to learn?** No. An Astro page is HTML plus optional extras. The extras you will meet in this course are the `---` section at the top (imports), homemade tags (components, from Tuesday), and scoped styles. Your hand-written letter is already a valid Astro page.

**Why do `---` lines appear in markdown files too?** In `.astro` files, the `---` section holds imports. In `.md` files, a block between `---` lines is called frontmatter and holds facts about the page, like its title and date. The punctuation is the same; the jobs are unrelated. You saw the markdown kind in the garden note demo, and you will use it on Tuesday.

**What happens when I close my laptop?** The dev server stops; your files are untouched. Next time: open the project in VS Code, run `pnpm run dev`, and continue where you left off. Pull first if you want your classmates' latest work.

**Why did Day 5's Netlify not need a build, but today's does?** On Day 5 your files were already finished HTML and CSS, so Netlify served them directly. An Astro project needs assembling first. Netlify runs `pnpm run build` on every push and serves the `dist/` folder it produces.

**Is the class site my website?** No, it is our practice ground and it stays up as a class artifact. Your own site starts in the mini-project on Day 8 and becomes your personal site in project week. Your letter is one file; moving it there when the time comes takes two minutes.

### Today's Links

- [Our Astro starter](https://github.com/open-making/your-first-astro-site). The class repo is built from this starter, and its README is a written version of everything we did today (Part 1) plus a preview of Tuesday (Part 2), shaped for working on a project of your own.
- [The CommonMark markdown tutorial](https://commonmark.org/help/tutorial/), ten interactive minutes. Good Sunday preparation for Tuesday, when you start writing pages in markdown.
- [Astro documentation](https://docs.astro.build/), for the curious. It assumes JavaScript knowledge you do not need yet; the starter's README is the better reference for now.
- [Node & npm quiz](/web2026/quiz-node-and-npm), optional, for Sunday.
- [The terminal, explained gently (MDN)](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line)

### No homework

It is Saturday, and the schedule builds in rest on purpose. The links above are all optional. Monday has no code at all: we talk about digital gardens. On Tuesday your letter gets the site's layout, and you learn to build the mechanism you found in the second sabotage.
