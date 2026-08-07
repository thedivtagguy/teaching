# Review: Anchita's corner

Disclosure: Parts of this review were put together with an LLM after a thorough manual review.

## The Good

- **You have zero JavaScript.** You can read every line in this repo yourself. That's great!
- **Your class names describe purpose.** `.top-header`, `.main-text`, `.footer-text` tell you what each part is. Good naming practices.

## Things to improve

### 1. Make one layout before you build the three sections

Your site is one `index.html`. Your README plans a blog page, a quiz page, and a Virtual Spaces page. Each of these pages needs the same `<head>`, the same pink header, and the same footer. The easy next step is to copy `index.html` three times and edit each copy. Then you have four copies of the same frame.

**What to do:** Move the site into an Astro project now, while it is small. Put the shared frame in one layout:

```astro
<!-- src/layouts/BaseLayout.astro -->
---
const { title } = Astro.props;
---
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="container">
    <div class="top-header"></div>

    <slot />

    <div class="footer">
      <p class="footer-text">© 2026 Anchita's corner. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

The `<slot />` is the opening where each page puts its own content. Your homepage becomes small:

```astro
<!-- src/pages/index.astro -->
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Anchita's corner">
  <div class="main-text">
    <h1 class="h1">Welcome to</h1>
    <h2 class="anchita-text">Anchita's corner</h2>
  </div>
</BaseLayout>
```

Each new page then starts as five lines, not as a copy of `index.html`. The Astro docs show this pattern: https://docs.astro.build/en/basics/layouts/

For the blog: write each post as one markdown file in one folder.

### 2. Put your repeated colors and font in CSS variables

In `style.css`, `#ec008c` appears in two rules. `#f85cba` appears in two rules. The `font-family` line appears in two rules. These repeats grow with every new section. When you adjust your pink later, you must find and change every copy. With variables, you change one line.

**What to do:** Define the values once at the top of `style.css`, then use them by name:

```css
:root {
  --pink-dark: #ec008c;
  --pink-light: #f85cba;
  --font-display: "DynaPuff", system-ui, sans-serif;
}

.top-header {
  background-color: var(--pink-light);
}
.h1 {
  font-family: var(--font-display);
  color: var(--pink-dark);
}
```

### 3. Use HTML elements that say what they are

Your page is built from `<div>` elements: `<div class="top-header">`, `<div class="main-text">`, `<div class="footer">`. HTML has elements for these parts: `<header>`, `<main>`, `<footer>`.

**What to do:** Change the tags. Keep the classes, so your CSS still works:

```html
  <header class="top-header"></header>

  <main class="main-text">
    <h1 class="h1">Welcome to</h1>
    <h2 class="anchita-text">Anchita's corner</h2>
  </main>

  <footer class="footer">
    <p class="footer-text">© 2026 Anchita's corner. All rights reserved.</p>
  </footer>
```

## Little things

- `shelf.png` is 1.2MB. Compress it at https://squoosh.app before you put it on a page. Large images make pages slow on phones.
- The class `.h1` is named after its tag. A name like `.welcome-text` is clearer.
- Your site name sits in an `<h2>` and "Welcome to" sits in the `<h1>`. Swap them. The `<h1>` should have the most important heading on the page.

