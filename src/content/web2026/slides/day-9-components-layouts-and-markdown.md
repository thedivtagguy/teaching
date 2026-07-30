---
date: 2026-07-28T23:00
updated: 2026-07-30T09:49
transition: none
---

# Components, Layouts, and Markdown

_Day 9: WEB2026_

---

## You read more code than you type


If you can read what the LLM wrote, you can fix it, change it, and keep it. 

note: Connect this to Day 7: own your space, do not rent it. Pasting code you cannot read puts the LLM in control of your site.


---

## 1. Component

A component is a piece of a page that you build once and reuse: a card, a nav, a byline.

note: Have them look at their site maps from yesterday and circle the repeated shapes. The "one page per note" box from the example map is a component.

---

## The anatomy of an Astro file

A `.astro` file has two parts, separated by two lines of three dashes. The top part is JavaScript.

```js
const { title } = Astro.props;
```

The bottom part is HTML, which you already know:

```html
<h2>{title}</h2>
```

note: Go slowly on the JavaScript line. `Astro.props` is the box of values that the page sent in. The curly braces unpack `title` from the box. The syntax is called destructuring, and it is only unpacking. They will see this exact shape in everything the LLM generates today. Draw the full file on the whiteboard with the dashes, because the slides cannot show the dashes inside a code block.

---

## 2. Prop 

The page can use a component like this, passing information to the component

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



note: The component's script section catches the values with `const { title, date } = Astro.props;` - write it on the board next to the template.


---

```js
const {title, date } = Astro.props;
```
---

## 3. Slot

A layout file contains the parts that every page shares. The `<slot />` tag marks where each page's own content goes:

```html
<html>
  <head><title>{title}</title></head>
  <body>
    <nav>...</nav>
    <main>
      <slot /> <!-- THIS IS A SLOT -->
    </main>
  </body>
</html>
```

note: A useful comparison: the layout is a frame, and the slot is the opening in the frame. Every page supplies its own picture.

---

## 4. Layout

A page wraps its content in the layout:

```html
<BaseLayout title="Notes">
  <h1>Notes</h1>
  <p>Short things I want to remember.</p>
</BaseLayout>
```

note: The page also needs an import line at the top: `import BaseLayout from "../layouts/BaseLayout.astro";`. Show it on the board with the rest of the file.

---

## Describe, read, verify, ask

1. **Describe** what you want. Keep it small and specific.
2. **Read** the code that comes back before you paste it. Find the props, the slot, and the layout.
3. **Verify** in the browser.
4. **Ask** when it breaks. Paste the error back with the file.

note: Write these four words on the whiteboard and leave them there all day. This is the Day 6 asking protocol applied to a new tool: ask yourself, ask the error, ask the LLM, then ask me.

---
# Build 1 🛠️

- [ ] `BaseLayout.astro`: nav with your labels, footer, slot
- [ ] One page each for our site map
- [ ] Every page reachable by clicking

note: The last checkbox is the assessment. During the block, walk around and ask people to explain one line of their layout. Remind them: the AI declaration goes in tonight's dev note, per the policy.

---

# The markdown garden 🌱

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

# Build 2 🛠️

With your LLM:

- [ ] One folder of markdown files for your "blog" section
- [ ] An index page that lists the files automatically
- [ ] Then add a third `.md` file by hand.


---

## Now the good part!

### Open the folder in Obsidian

note: Do this as a live demo, without hurry. File → Open folder as vault → point at the content folder. Write a note in Obsidian, save it, switch to the browser, refresh. Give the room a moment before you explain it.
