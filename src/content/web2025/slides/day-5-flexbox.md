---
date: 2025-07-22T13:05
updated: 2025-07-22T19:26
transition: none
---
# Building a Flexbox Layout
## Step by Step

---

## Step 1: Basic HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flexbox Layout</title>
</head>
<body>
    <div class="container">
        <header>Header</header>
        <div class="main">
            <aside>Sidebar</aside>
            <main>Main Content</main>
        </div>
        <footer>Footer</footer>
    </div>
</body>
</html>
```

---

## Step 2: Reset & Container Setup

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    height: 100vh;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
```

**Key Concept**: Container fills viewport height and stacks children vertically

---

## Step 3: Header Styling

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    height: 100vh;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    background: #333;
    color: white;
    padding: 1rem;
    flex-shrink: 0;
}
```

**Key Concept**: `flex-shrink: 0` prevents header from getting smaller

---

## Step 4: Main Area Setup

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    height: 100vh;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    background: #333;
    color: white;
    padding: 1rem;
    flex-shrink: 0;
}

.main {
    display: flex;
    flex: 1;
}
```

**Key Concept**: `.main` uses `flex: 1` to take remaining vertical space

---

## Step 5: Sidebar Styling

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    height: 100vh;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    background: #333;
    color: white;
    padding: 1rem;
    flex-shrink: 0;
}

.main {
    display: flex;
    flex: 1;
}

aside {
    background: #666;
    color: white;
    width: 250px;
    padding: 1rem;
    flex-shrink: 0;
}
```

**Key Concept**: Fixed width sidebar that won't shrink

---

## Step 6: Main Content Area

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    height: 100vh;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    background: #333;
    color: white;
    padding: 1rem;
    flex-shrink: 0;
}

.main {
    display: flex;
    flex: 1;
}

aside {
    background: #666;
    color: white;
    width: 250px;
    padding: 1rem;
    flex-shrink: 0;
}

main {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}
```

**Key Concept**: `flex: 1` makes content area fill remaining horizontal space

---

## Step 7: Complete Layout with Footer

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    height: 100vh;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

header {
    background: #333;
    color: white;
    padding: 1rem;
    flex-shrink: 0;
}

.main {
    display: flex;
    flex: 1;
}

aside {
    background: #666;
    color: white;
    width: 250px;
    padding: 1rem;
    flex-shrink: 0;
}

main {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}

footer {
    background: #333;
    color: white;
    padding: 1rem;
    text-align: center;
    flex-shrink: 0;
}
```

**Layout Complete!**

---

## Key Flexbox Properties Used

- `display: flex` - Creates flex container
- `flex-direction: column` - Stacks children vertically
- `flex: 1` - Takes remaining available space
- `flex-shrink: 0` - Prevents element from shrinking
- `height: 100vh` - Full viewport height

**Result**: Responsive layout that fills the screen with header, sidebar, main content, and footer

---

## Flexbox Layout Pattern Summary

```
Container (flex column, 100vh)
├── Header (flex-shrink: 0)
├── Main (flex: 1, flex row)
│   ├── Sidebar (width: 250px, flex-shrink: 0)
│   └── Content (flex: 1)
└── Footer (flex-shrink: 0)
```

**Perfect for**: Dashboards, admin panels, documentation sites, and standard web layouts