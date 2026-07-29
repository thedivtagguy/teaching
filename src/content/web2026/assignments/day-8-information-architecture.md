---
title: "Assignment 7: Content Schemas"
due: 2026-07-29
description: Deciding the shape of our sections
published: true
date: 2026-07-29T18:00
updated: 2026-07-29T20:00
submissionUrl: https://github.com/open-making/web2026-dev-notes/issues/11
---
Each of the three "plots" or sections you chose to go ahead with for the next two weeks has often the same shape. A schema is the shape every entry of one kind shares. Write one for each of your three sections.
## Shown and hidden

A piece of content is not one blob. It is a set of named parts, and some parts are for the visitor while others are only for the website to manage itself. For example, in this recipe card: 

![A wireframe of a note. Above a dashed line marked shown, the visitor reads a title, a date, tags, and the body. Below the line, marked hidden, sit three greyed-out fields the visitor never sees: slug, draft, and updated.](/assets/assignments/day-8-information-architecture/shown-and-hidden.png)

**Shown** fields are the ones the visitor reads on the page, like `title`, `date`, and `body`.

**Hidden** fields are the ones only the website uses. `slug` is the short name that becomes part of the page's web address, so a note called "Reheating rice" lives at `/notes/reheating-rice`. `draft` keeps an unfinished entry off the site until it is ready. `updated` records the day you last changed something.

##  Examples

A few examples to give you a sense of how to break down schemas. 
### A note

![A wireframe of a note: a bold title, a line of date and tags, then a short paragraph of body text.](/assets/assignments/day-8-information-architecture/note.png)

```
# shown on the page
title:  Reheating rice without a soggy mess
date:   2026-07-31
tags:   [cooking, notes]
body:   The trick is a splash of water and a plate on top...

# hidden, used by the website
slug:   reheating-rice
draft:  false
```

### An artwork

![A wireframe of an artwork entry: a large grey image placeholder, then a title, the medium and date, and a one-line caption.](/assets/assignments/day-8-information-architecture/artwork.png)

```
# shown on the page
title:    Small hours
image:    small-hours.jpg
medium:   Ink and coffee
made:     2026-06
caption:  Drawn on the back of a train ticket.

# hidden, used by the website
slug:   small-hours
featured: true
```

### A book

![A wireframe of a book entry: a small grey cover block beside the title, the author and finish date, a five-star rating, and a one-line note.](/assets/assignments/day-8-information-architecture/book.png)

```
# shown on the page
title:     The Left Hand of Darkness
author:    Ursula K. Le Guin
finished:  2026-07-12
rating:    5
note:      I put it down and sat still for a while.

# hidden, used by the website
slug:   left-hand-of-darkness
draft:  false
```

## Your turn

For each of your three sections, write the schema for the entry it will have, in the same way as the examples above. For each field, give four things:

- **the name**: short, lowercase, no spaces (`date`, not `Date Posted`).
- **what it contains**: a few words.
- **shown or hidden**.
- **one real example** from your own content, not a placeholder.

Put this into a Google Doc and submit along with your devnotes!