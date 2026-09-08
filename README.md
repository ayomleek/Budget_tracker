# My Budget Tracker

A personal budget and expense tracker, built up week by week as a portfolio project. This submission covers Week 1 (page structure) and Week 2 (tables, forms, multimedia, and interactivity), all plain HTML and CSS — no JavaScript yet.

## Files

```
budget-tracker/
├── index.html      # Page structure and content
├── style.css       # All styling
├── assets/
│   └── logo.svg     # Piggy bank logo used in the header
└── README.md
```

## What's on the page

**Header**
A logo (`assets/logo.svg`) sits next to the `<h1>` title, with a short subheading underneath describing the site's purpose.

**Add Expense** (`#add-expense`)
A `<form>` with three fields: expense name (text input), amount (number input), and category (a `<select>` dropdown with five options — Food, Transport, Rent, Entertainment, Other). Each input's `id` matches its `<label for>` so the labels are properly linked, and those same IDs are already in place for when JavaScript hooks into the form in Week 6. The "Add Expense" button is `type="button"` and doesn't submit or calculate anything yet — that logic arrives in Week 7.

**How to use this tracker**
A collapsible `<details>`/`<summary>` element giving a one-line explanation of how the form and table work together.

**My Expenses** (`.expenses-list`)
A proper `<table>` with `<thead>`/`<tbody>`, four columns (Name, Amount, Category, Date), and five hardcoded sample rows. Styled with collapsed borders, a colored header row, alternating row backgrounds, and a hover highlight.

**Budgeting Tip Video**
A YouTube video embedded via `<iframe>`, offering a real budgeting-tips video as a small bonus for anyone using the tracker.

## CSS selectors used

This project deliberately practices a range of CSS selector types:

- **Element selectors** — `body`, `h1`, `h2`, `table`, `label`
- **Class selectors** — `.card` (shared section style), `.add-expense`, `.expenses-list`, `.video-section`, `.how-to`
- **ID selectors** — `#page-title`, `#add-expense`, `#expense-form`
- **Descendant selector** — `.expenses-list td`
- **Direct child selector** — `#expense-form > .field input`
- **Positional pseudo-classes** — `tbody tr:nth-child(even)`, `tbody tr:first-child`
- **Negation pseudo-class** — `input:not([type="button"]):focus`
- **Focus state** — `input:focus`, `select:focus`
- **Hover state** — `tbody tr:hover`

## Design notes

Colors and fonts are defined once as CSS custom properties in `:root` (e.g. `--pine`, `--ochre`, `--ink`) rather than hardcoded throughout the stylesheet, so the whole palette can be adjusted from one place as the project grows in later weeks. Headings use Fraunces (serif); body text and inputs use IBM Plex Sans, both loaded from Google Fonts.

## What's next

Week 3 onward will layer in JavaScript to make the form actually add rows to the table, calculate totals, and eventually persist data — the HTML structure and element IDs here are already set up with that in mind.