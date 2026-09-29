# SpendWise Dashboard

A personal budget and expense tracker, built up week by week as a portfolio project. It started as a single-column page in Week 1, became a full dashboard shell with a sidebar, header, and category overview in Week 4, and this week gains its first real JavaScript logic — turning the static numbers on the page into values the app can actually calculate with.

## Files

```
budget-tracker/
├── index.html      # Page structure and content
├── style.css       # All styling
├── script.js       # Budget data, user input, and calculations (Week 5)
├── assets/
│   └── spendwise-logo-transparent.svg   # SpendWise logo used in the sidebar
└── README.md
```

## What's on the page

**Sidebar**
A fixed navigation column with the SpendWise logo and links to Dashboard, Add Expense, Expenses, Reports, and Settings. The first three links jump to real sections further down the page (`#dashboard-top`, `#add-expense`, `#expenses-table`); Reports and Settings are placeholders for future weeks.

**Header**
A welcome message and subheading on the left, a date label and avatar circle on the right.

**Category cards**
Six cards (Food, Transport, Rent, Entertainment, Savings, Utilities), each showing a Font Awesome icon and a realistic static amount, with an "of $X budget" note. These same six numbers are what `script.js` now works with behind the scenes.

**Add Expense** (`#add-expense`)
A `<form>` with four fields: expense name, amount, category (a `<select>` with five options), and date. Each input's `id` matches its `<label for>`, and those IDs (`expense-name`, `expense-amount`, `expense-category`, `expense-date`) are what a future week's JavaScript will read from when the button is wired up to actually add a row.

**How to use this tracker**
A collapsible `<details>`/`<summary>` element explaining how the form and table work together.

**My Expenses** (`#expenses-table`)
A `<table>` with `<thead>`/`<tbody>`, four columns (Name, Amount, Category, Date), and five hardcoded sample rows — the same five expenses `script.js` uses for its calculations, so the console output matches what's visible on the page.

**Budgeting Tip Video**
A YouTube video embedded via a responsive `<iframe>`.

## Week 5: JavaScript Foundation

This week's goal was to start working with SpendWise's data in JavaScript — variables, user input, and calculations — without touching the page's HTML yet. Everything happens in `script.js` and prints to the browser console; open DevTools → Console to see it.

### What script.js does

When the page loads, it:
1. Asks the visitor for their monthly budget with a `prompt()`.
2. Calculates the total spent, the remaining balance, and a per-category breakdown.
3. Prints all of it to the console as a clearly labeled summary.

### How variables are used

- `let monthlyBudget` holds the one piece of data that changes during the session — it starts as a default (`1770`) and gets reassigned once the user answers the prompt, which is why it's declared with `let` rather than `const`.
- `const categoryBudgets` is an **object**, pairing each category name (a string key) with its budget ceiling (a number value) — `{ Food: 500, Transport: 200, ... }`.
- `const savingsGoal` is a single number, kept separate from `categoryBudgets` since savings isn't a spending limit.
- `const expenses` is an **array of objects** — one object per expense, each bundling a string (`name`), a number (`amount`), a string (`category`), and a string (`date`). This mirrors the five rows in the HTML table.
- Inside the functions below, a `const isOverBudget` boolean is calculated from a comparison (`remaining < 0`), showing all four data types the assignment covers — string, number, object/array, and boolean — in active use.

### How user input is collected

`promptForMonthlyBudget()` calls the browser's built-in `prompt()`, pre-filled with the current default budget so the user can just confirm it or type a new number. The raw value from `prompt()` is always a string (or `null` if the user hits Cancel), so the function:
- Checks for `null` first (Cancel was clicked) and falls back to the default.
- Otherwise runs the input through `parseFloat()` to convert it to a number, and checks `Number.isNaN()` plus a `> 0` check to catch empty input, text, or negative numbers, falling back to the default in any of those cases too.

This means the app never crashes or shows `NaN` in the console, whatever the user types.

### How calculations are performed

Three small functions each do one calculation, so they can be reused for both the overall budget and any individual category:
- `getTotalExpenses(list)` uses `.reduce()` to sum every expense's `amount`.
- `getCategoryTotal(list, category)` uses `.filter()` to keep only that category's expenses, then `.reduce()` to sum them.
- `getRemainingBalance(budget, spent)` is a simple subtraction (`budget - spent`), used both for the whole month and for each category by passing in different numbers.

`logBudgetSummary()` calls all three, then loops over `categoryBudgets` with `Object.keys(...).forEach(...)` to print a remaining-balance line for every category, not just the total.

### How functions help organize the code

Instead of one long script, the logic is split into single-purpose functions: three pure calculation functions (`getTotalExpenses`, `getCategoryTotal`, `getRemainingBalance`) that take inputs and return a number with no side effects, one formatting helper (`formatCurrency`) so every dollar amount in the console looks the same, one input-handling function (`promptForMonthlyBudget`) that isolates all the validation logic in one place, and one "run everything" function (`logBudgetSummary`) that ties the others together and handles all the console output. Each function can be tested or reused on its own — for example, `getCategoryTotal()` works for any category without needing to be rewritten.

### Displaying results

Every calculated value is printed with a clear label (`Monthly budget:`, `Total spent:`, `Remaining balance:`, etc.), grouped into an overall summary block followed by a per-category breakdown block, with header/divider lines so the output is easy to scan in the console rather than one wall of numbers.

## CSS selectors used (Weeks 1-2)

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

Colors and fonts are defined once as CSS custom properties in `:root` rather than hardcoded throughout the stylesheet, so the whole palette can be adjusted from one place. Headings use Fraunces (serif); body text uses Poppins, both loaded from Google Fonts. Category icons use Font Awesome.

### Week 3: visual design pass

CSS-only — no new HTML or functionality. The page background, both headings, buttons, and the table header row all draw from the same small palette; `border-radius` was unified to a consistent scale; the page heading was given the same card treatment as the form and table; the table gained its own outer border and rounded corners using per-corner-cell radius, since `border-collapse: collapse` doesn't support radius on the table element itself.

### Week 4: SpendWise Dashboard Shell (Grid & Flexbox)

Rebuilt the page around a dashboard layout, using CSS Grid for the page-level structure and Flexbox for the content inside it — no absolute positioning anywhere.

**Layout**
- `.dashboard` is a CSS Grid with named `grid-template-areas` (`sidebar header`, `sidebar main`, `sidebar footer`), so the sidebar spans the full height while the header, main content, and footer stack in the remaining column.
- Flexbox is used inside the header (`.dashboard-header`), the sidebar (`.sidebar`, `.sidebar-nav`), and each stat card (`.stat-card`).
- The six category cards sit in their own `grid-template-columns: repeat(3, 1fr)` grid (`.stats-grid`).

**Theme (CSS custom properties)**
All color is driven from named variables in `:root`:

| Variable | Role |
|---|---|
| `--brand` | Primary brand color (buttons, active nav, table header, avatar, icon fill on hover) |
| `--accent` | Secondary/accent color (dropdown arrow, card top-accents) |
| `--surface` | Page background |
| `--surface-elevated` | Card/sidebar/header background |
| `--text-primary` | Main text color |
| `--text-secondary` | Muted/supporting text |
| `--line` | Hairline borders |
| `--brand-tint` | Subtle hover/active backgrounds derived from the brand color |
| `--brand-hover` | Darkened brand color for button hover |
| `--focus-ring` | Keyboard focus ring color |
| `--shadow-color` | Card shadow color |
| `--row-alt` | Alternating table row background |
| `--on-brand` | Text/icon color placed on top of brand-colored elements |

**Responsive layout**
A single `@media (max-width: 768px)` query collapses `.dashboard` to one column, turns the sidebar into a horizontal scrollable nav bar, and drops the six stat cards to a single column.

**Card micro-interactions**
Every stat card has `tabindex="0"`, and both `:hover` and `:focus-visible` trigger a 200ms `transform` (a small lift) plus `box-shadow` change, with the icon swapping to a filled brand-colored badge on hover/focus too.

**Stretch goal: dark theme**
A `@media (prefers-color-scheme: dark)` block overrides *only* the `:root` custom properties, so the entire page re-themes automatically based on the user's OS-level preference.

## What's next

Future weeks will connect `script.js` to the actual page — reading the Add Expense form's inputs, pushing new entries into the `expenses` array, re-rendering the table and category cards, and persisting data between visits.