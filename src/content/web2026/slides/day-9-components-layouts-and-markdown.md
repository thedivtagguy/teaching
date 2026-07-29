---
date: 2026-07-28T23:00
updated: 2026-07-29T00:15
transition: none
---

# Components, Layouts, and Markdown

_Day 9: WEB2026_

---

## Where we are

- Day 6: a file in `src/pages/` becomes a URL, and everyone made a clock.
- Day 7: you decided what your site is for.
- Day 8: you decided how it is organized.
- Today: the site map on paper becomes folders and files.

---

## One thing is different today

### We build with an LLM.

The AI policy has said this from day one: **code help is allowed, and your words are your own.** <!--element class="fragment"-->

Today the LLM types the code. Every word on the site comes from your inventory. <!--element class="fragment"-->

note: Say this directly so that nobody feels they are cheating. The policy line was always "technical help is fine, declare it". Today we practice how to do that well, because most people do it badly: they paste code without reading it.

---

## Today you read more code than you type

Reading code that you did not write is a professional skill, and it is the skill this day teaches.

If you can read what the LLM wrote, you can fix it, change it, and keep it. <!--element class="fragment"-->

If you cannot read it, you do not control your own website. <!--element class="fragment"-->

note: Connect this to Day 7: own your space, do not rent it. Pasting code you cannot read puts the LLM in control of your site.

---

# The vocabulary

You need four words. You do not need to write this code from memory. You need enough vocabulary to ask for the right thing, and to recognize what you got.

---

## 1. Component

A component is a piece of a page that you build once and reuse: a card, a nav, a byline.

**If the same shape appears twice on your site map, it is a component.** <!--element class="fragment"-->

note: Have them look at their site maps from yesterday and circle the repeated shapes. The "one page per note" box from the example map is a component.

---

## The anatomy of a `.astro` file

A `.astro` file has two parts, separated by two lines of three dashes.

The top part is JavaScript. It runs once, when the site is built. It never runs in the visitor's browser:

```js
const { title } = Astro.props;
```

The bottom part is HTML, which you already know:

```html
<h2>{title}</h2>
```

note: Go slowly on the JavaScript line. `Astro.props` is the box of values that the page sent in. The curly braces unpack `title` from the box. The syntax is called destructuring, and it is only unpacking. They will see this exact shape in everything the LLM generates today. Draw the full file on the whiteboard with the dashes, because the slides cannot show the dashes inside a code block.

---

## 2. Prop: how a page passes information in

The page writes this:

```html
<NoteCard title="Every bus I took this week" date="2026-07-30" />
```

The component receives the values and uses them:

```html
<article>
  <h3>{title}</h3>
  <time>{date}</time>
</article>
```

The same component shows different content each time. That is the purpose of props.

note: The component's script section catches the values with `const { title, date } = Astro.props;` - write it on the board next to the template.

---

## 3. Slot: where the page content goes

A layout file contains the parts that every page shares. The `<slot />` tag marks where each page's own content goes:

```html
<html>
  <head><title>{title}</title></head>
  <body>
    <nav>...</nav>
    <main>
      <slot />
    </main>
  </body>
</html>
```

note: A useful comparison: the layout is a frame, and the slot is the opening in the frame. Every page supplies its own picture.

---

## 4. Layout: the frame that every page shares

A page wraps its content in the layout:

```html
<BaseLayout title="Notes">
  <h1>Notes</h1>
  <p>Short things I want to remember.</p>
</BaseLayout>
```

You write the nav once, in the layout. Every page then shares it.

Your nav labels from yesterday go here, exactly as you chose them. <!--element class="fragment"-->

note: The page also needs an import line at the top: `import BaseLayout from "../layouts/BaseLayout.astro";`. Show it on the board with the rest of the file.

---

## Why these four words matter today

The LLM can produce all of this code faster than any of us can type it.

The LLM does not know what your site is for. <!--element class="fragment"-->

You spent two days writing that down. Your site map and your manifesto are the brief. <!--element class="fragment"-->

note: Make this explicit: a student with a clear site map gets much better output than "make me a portfolio site" ever produces. This is why Days 7 and 8 came before today.

---

# The working loop

---

## Describe, read, verify, ask

1. **Describe** what you want. Keep it small and specific, and put your site map in the prompt.
2. **Read** the code that comes back before you paste it. Find the props, the slot, and the layout.
3. **Verify** in the browser. The browser is the judge, not the chat window.
4. **Ask** when it breaks. Paste the error back with the file. Do not ask for a fresh attempt.

note: Write these four words on the whiteboard and leave them there all day. This is the Day 6 asking protocol applied to a new tool: ask yourself, ask the error, ask the LLM, then ask me.

---

## A prompt that works

> Here is my site map: [the map]. Set up an Astro layout called BaseLayout with a nav for my three sections: Notes, Paintings, Everything else. Then make one page per section that uses the layout. No styling yet.

## A prompt that does not work

> make me a personal website <!--element class="fragment"-->

A specific brief produces code you can read. A vague wish produces someone else's website. <!--element class="fragment"-->

---

## When the code breaks

1. Read the error message. It usually names the file and the line.
2. Paste the error and the file back to the LLM. Ask what the error means, not only for a fix.
3. Verify the fix in the browser.
4. Still stuck after two rounds? Use the stuck protocol: neighbor first, then me.

Do not regenerate the code again and again until something compiles. <!--element class="fragment"-->

note: Name this failure mode clearly: blind regeneration sometimes works, teaches nothing, and produces a project that nobody in the room understands, including the LLM.

---

# Build block 1 🛠️

**Your skeleton, before lunch:**

- [ ] `BaseLayout.astro`: nav with your labels, footer, slot
- [ ] One page per section on your site map
- [ ] Every page reachable by clicking
- [ ] You can explain every file to your neighbor

Ugly is fine. Empty is fine. Unexplainable is not.

note: The last checkbox is the assessment. During the block, walk around and ask people to explain one line of their layout. Remind them: the AI declaration goes in tonight's dev note, per the policy.

---

# The markdown garden bed 🌱

---

## Pick your fastest section

Look at your update plan and pick the section with the quickest rhythm: notes, links, or a log.

Pick the one that passed the 15-minute test without hesitation. <!--element class="fragment"-->

That section now becomes **a folder of markdown files**. <!--element class="fragment"-->

---

## A page from a markdown file

A markdown file starts with a small block of information between two lines of three dashes:

```yaml
title: "Things I learnt this week"
date: 2026-07-30
```

The rest of the file is plain writing. No HTML is required:

```markdown
Real words go here.
```

Put the file in the folder, and it becomes a page. An index page lists every file in the folder, newest first, automatically. <!--element class="fragment"-->

note: Show the real file in the editor, with the dashes. Depending on the group, the LLM will propose either `import.meta.glob` or a content collection for the index. Both are fine. The concept to land: file goes in the folder, list updates itself, and nobody edits an index by hand.

---

# Build block 2 🛠️

With your LLM, and with the working loop in force:

- [ ] One folder of markdown files for your fastest section
- [ ] An index page that lists the files automatically
- [ ] Two real entries, with words from your inventory
- [ ] Then add a third `.md` file by hand, and watch it appear in the list

The last checkbox is the point of the afternoon.

---

## Now the good part

### Open the folder in Obsidian

note: Do this as a live demo, without hurry. File → Open folder as vault → point at the content folder. Write a note in Obsidian, save it, switch to the browser, refresh. Give the room a moment before you explain it.

---

## What you just saw

You write in Obsidian, you save, and the text is a page on your website.

Your website is now a place that you write into, not a project that you reopen with effort. <!--element class="fragment"-->

Write a paragraph, push, done. This loop is what keeps a personal site alive after the course ends. <!--element class="fragment"-->

note: Connect this to the 15-minute Tuesday test: this workflow is how a tired-Tuesday addition actually happens.

---

## In your dev notes today

- A link to your repo, with the skeleton pushed
- A screenshot of your markdown index listing real entries
- Your AI declaration: which tool, what it wrote, what you changed
- One thing the LLM got wrong today, and how you caught it

note: The last bullet is the best writing prompt of the day. It rewards the reading habit, and it produces good retrospective material.

---

## Tonight

**Finish your content inventory.** It is due tomorrow morning.

Tomorrow is design day, and you design with real words. <!--element class="fragment"-->

If the inventory is done, collect a few websites whose look you admire, and bring the links. <!--element class="fragment"-->

---

## To read

- Simon Willison, *Here's how I use LLMs to help me write code* - what we practiced today, described by a professional who does it carefully

Linked from today's page.
