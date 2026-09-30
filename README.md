# SpendWise Dashboard

A personal budget and expense tracker, built up week by week as a portfolio project. It started as a single-column page in Week 1, became a full dashboard shell with a sidebar, header, and category overview in Week 4, gained its first real JavaScript logic in Week 5, and this week — Week 6 — becomes genuinely interactive: adding or removing an expense now updates the table, the category cards, and a live budget-status message directly on the page, not just in the console.

## Files

```
budget-tracker/
├── index.html      # Page structure and content
├── style.css       # All styling
├── script.js       # Data, calculations, DOM rendering, and events (Weeks 5-6)
├── assets/
│   └── spendwise-logo-transparent.svg   # SpendWise logo used in the sidebar
└── README.md
```

## What's on the page

**Sidebar**
A fixed navigation column with the SpendWise logo and links to Dashboard, Add Expense, Expenses, Reports, and Settings. The first three links jump to real sections further down the page (`#dashboard-top`, `#add-expense`, `#expenses-table`); Reports and Settings are placeholders for future weeks.

**Header**
A welcome message and subheading on the left, a date label and avatar circle on the right.

**Budget status banner**
A single line directly under the header (`#budget-status`) that `script.js` fills in and re-colors every time the data changes — a plain-language summary of whether you're within budget, close to your limit, or over it.

**Category cards**
Six cards (Food, Transport, Rent, Entertainment, Savings, Utilities), each with a Font Awesome icon, a live spent amount, and an "of $X budget" note. Each card carries a `data-category` attribute so `script.js` can find and update it by name, and any card whose spending has passed its budget gets flagged visually.

**Add Expense** (`#add-expense`)
A `<form>` with four fields: expense name, amount, category (a `<select>` with six options — Food, Transport, Rent, Entertainment, Utilities, Other), and date. Clicking "Add Expense" now actually adds the entry to the app's data and refreshes the whole dashboard.

**How to use this tracker**
A collapsible `<details>`/`<summary>` element, updated this week to mention that expenses can also be removed.

**My Expenses** (`#expenses-table`)
A `<table>` whose `<tbody id="expenses-tbody">` is rebuilt by JavaScript every time the data changes, now with a fifth "Actions" column holding a "Remove" button per row.

**Budgeting Tip Video**
A YouTube video embedded via a responsive `<iframe>`.

## Week 6: Make SpendWise Interactive

This week connects everything Week 5 built to the actual page. The core idea: the `expenses` array is the single source of truth, and one function — `refreshDashboard()` — re-renders every part of the page from that array whenever it changes (on page load, after adding an expense, or after removing one).

### How conditionals are used

Decision-making shows up at two levels:

- **Per category** (`renderCategoryCards`): for each category, `if (spent > categoryBudget) { card.classList.add("is-over-budget") } else { card.classList.remove(...) }` decides whether that card gets a visual warning treatment.
- **Overall budget** (`renderBudgetStatus`): a three-branch `if / else if / else` picks between three outcomes — over budget (`remaining < 0`), close to the limit (`percentUsed >= 80`), or comfortably within budget — and sets both the message text and a CSS class from that decision, so the banner's color and wording are both driven by the same conditional.
- Form validation (`readExpenseFromForm`) is also a chain of `if` checks — empty name, invalid amount, missing category, missing date — each one stopping the process early with a specific, relevant `alert()`.

### How arrays are used to store data

`expenses` is a `const` array of plain objects (one object per expense — `{ name, amount, category, date }`), and it's the only place expense data lives — there's no separate set of variables per expense. Every read (table rendering, category totals, overall totals) works from this array, and every write goes through either `.push()` (adding) or `.splice()` (removing), so the array is always the current, authoritative state of the app.

### How the DOM is updated

Three functions turn the array into visible content:

- `renderExpensesTable()` clears `#expenses-tbody` (`innerHTML = ""`) and rebuilds it row by row using `document.createElement` and `textContent` — deliberately not `innerHTML` with string concatenation, since an expense name is user-typed text and `textContent` can't be tricked into injecting HTML.
- `renderCategoryCards()` finds each card's `.stat-amount` and `.stat-meta` elements and overwrites their `textContent` with freshly calculated numbers, and toggles the `.is-over-budget` class based on the conditional above.
- `renderBudgetStatus()` writes the decided message into `#budget-status` and swaps its status class.

### How user interactions are handled through events

- The "Add Expense" button has a `click` listener (`handleAddExpense`) that reads and validates the form, pushes a new expense object if it's valid, and calls `refreshDashboard()`.
- The "Remove" buttons use **event delegation**: rather than attaching a listener to every button (which would need re-attaching every time the table re-renders), one `click` listener sits on `#expenses-tbody` itself. It uses `event.target.closest(".remove-btn")` to check whether the click landed on a Remove button, reads that button's `data-index` attribute, removes that one expense with `.splice(index, 1)`, and calls `refreshDashboard()`. This one listener keeps working no matter how many rows get added or removed.

### Processing data with loops

- `renderExpensesTable()` uses a classic `for (let i = 0; i < expenseList.length; i++)` loop, specifically because each row's Remove button needs to know its own index in the array — a plain indexed loop makes that index available directly.
- `renderCategoryCards()` uses `.forEach()` over the `NodeList` of `.stat-card` elements returned by `querySelectorAll`.
- `logBudgetSummary()` (kept from Week 5, still printing to the console alongside the on-page updates) uses a `for...of` loop over `Object.keys(categoryBudgets)`.

Three different loop styles are used deliberately, matching whichever fits the task best, rather than defaulting to one everywhere.

### Connecting it all together

The flow for any user action is the same: **event → validate/update the `expenses` array → `refreshDashboard()` → all four outputs (table, cards, banner, console) redraw from the same data.** Nothing is updated in two places by hand, which is what keeps the table, the cards, the banner, and the console from ever disagreeing with each other.

### Challenges encountered

- **Keeping "Remove" working after every re-render.** An early version attached a `click` listener to each Remove button individually — but since `renderExpensesTable()` clears and rebuilds the table on every change, those listeners would have needed re-attaching every single time, and it's easy to forget one. Switching to a single delegated listener on `#expenses-tbody` (using `.closest(".remove-btn")` to check what was actually clicked) solved this once, permanently — new rows automatically work without any extra listener code.
- **A dropdown option that didn't exist.** The category cards have always shown Utilities and Savings, but the Add Expense dropdown only offered Food, Transport, Rent, Entertainment, and Other — so there was no way to ever add an expense that would actually update the Utilities card. Added a "Utilities" option to the dropdown so every spending category shown on the dashboard can actually be updated by the user (Savings is intentionally left out, since it's a savings goal rather than something the expense form is meant to log).
- **Avoiding `innerHTML` for user-typed text.** Building each table row with `innerHTML` and string concatenation would have been shorter to write, but it means anything a user types into the expense name field gets parsed as HTML. Building rows with `document.createElement()` and setting `.textContent` avoids that risk entirely, at the cost of a few more lines per row.

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

Colors and fonts are defined once as CSS custom properties in `:root` rather than hardcoded throughout the stylesheet, so the whole palette can be adjusted from one place. Headings use Fraunces (serif); body text uses Poppins, both loaded from Google Fonts. Category icons use Font Awesome. Week 6 added a `--danger` / `--danger-tint` pair (in both the light and dark themes) purely for the over-budget states, keeping the same "everything routes through a variable" rule as the rest of the palette.

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
| `--danger` / `--danger-tint` | Over-budget warning color (added Week 6) |

**Responsive layout**
A single `@media (max-width: 768px)` query collapses `.dashboard` to one column, turns the sidebar into a horizontal scrollable nav bar, and drops the six stat cards to a single column.

**Card micro-interactions**
Every stat card has `tabindex="0"`, and both `:hover` and `:focus-visible` trigger a 200ms `transform` (a small lift) plus `box-shadow` change, with the icon swapping to a filled brand-colored badge on hover/focus too.

**Stretch goal: dark theme**
A `@media (prefers-color-scheme: dark)` block overrides *only* the `:root` custom properties, so the entire page re-themes automatically based on the user's OS-level preference.

## What's next

Future weeks will add persistence (so expenses survive a page refresh), editing existing expenses in place, and a way to change the monthly/category budgets from the UI instead of only via the initial `prompt()`.