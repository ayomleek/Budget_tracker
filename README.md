# SpendWise Dashboard

A personal budget and expense tracker, built up week by week as a portfolio project. What started as a single-column page in Week 1 is now a full dashboard shell with a sidebar, header, and category overview — all still plain HTML and CSS, no JavaScript yet.

## Files

```
budget-tracker/
├── index.html      # Page structure and content
├── style.css       # All styling
├── assets/
│   └── logo.svg     # Piggy bank logo used in the sidebar
└── README.md
```

## What's on the page

**Sidebar**
A fixed navigation column with the SpendWise logo/name and links to Dashboard, Add Expense, Expenses, Reports, and Settings. The first two links jump to real sections further down the page (`#dashboard-top`, `#add-expense`, `#expenses-table`); Reports and Settings are placeholders for future weeks.

**Header**
A welcome message and subheading on the left, a date label and avatar circle on the right — the kind of top bar you'd expect in a real dashboard product.

**Category cards**
Six cards (Food, Transport, Rent, Entertainment, Savings, Utilities) each showing a realistic static amount and a short "of $X budget" note, giving an at-a-glance overview before the detailed form/table below.

**Add Expense** (`#add-expense`)
A `<form>` with four fields: expense name (text input), amount (number input), category (a `<select>` dropdown with five options — Food, Transport, Rent, Entertainment, Other), and date (a native date picker input). Each input's `id` matches its `<label for>`, and those same IDs are already in place for when JavaScript hooks into the form in a later week. The "Add Expense" button is `type="button"` and doesn't submit or calculate anything yet.

**How to use this tracker**
A collapsible `<details>`/`<summary>` element explaining how the form and table work together.

**My Expenses** (`#expenses-table`)
A `<table>` with `<thead>`/`<tbody>`, four columns (Name, Amount, Category, Date), and five hardcoded sample rows, with a colored header row, alternating row backgrounds, and a hover highlight.

**Budgeting Tip Video**
A YouTube video embedded via a responsive `<iframe>`.

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

Colors and fonts are defined once as CSS custom properties in `:root` rather than hardcoded throughout the stylesheet, so the whole palette can be adjusted from one place. Headings use Fraunces (serif); body text and inputs use IBM Plex Sans, both loaded from Google Fonts.

### Week 3: visual design pass

CSS-only — no new HTML or functionality. The page background, both headings, buttons, and the table header row all draw from the same small palette; `border-radius` was unified to a consistent scale (10px for cards, 8px for buttons/inputs); the page heading was given the same card treatment (background, border, radius, shadow) as the form and table so all three read as consistent cards; the table gained its own outer border and rounded corners using per-corner-cell radius, since `border-collapse: collapse` doesn't support radius on the table element itself.

### Week 4: SpendWise Dashboard Shell (Grid & Flexbox)

This week rebuilt the page around a dashboard layout, using CSS Grid for the page-level structure and Flexbox for the content inside it — no absolute positioning anywhere.

**Layout**
- `.dashboard` is a CSS Grid with named `grid-template-areas` (`sidebar header`, `sidebar main`, `sidebar footer`), so the sidebar spans the full height while the header, main content, and footer stack in the remaining column.
- Flexbox is used inside the three places the assignment calls for: the **header** (`.dashboard-header`, space-between layout for the welcome text vs. date/avatar), the **sidebar** (`.sidebar` and `.sidebar-nav`, stacked as a flex column of links), and **each stat card** (`.stat-card`, icon and text arranged as a flex row).
- The six category cards themselves sit in a small `grid-template-columns: repeat(3, 1fr)` grid (`.stats-grid`) — a second, smaller application of CSS Grid, separate from the page-level shell.

**Theme (CSS custom properties)**
All color is driven from named variables in `:root`, matching the roles requested by the assignment:

| Variable | Role |
|---|---|
| `--brand` | Primary brand color (buttons, active nav, table header, avatar) |
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

Every color in the stylesheet routes through one of these variables — there are no hardcoded hex colors outside the `:root` definitions.

**Responsive layout**
A single `@media (max-width: 768px)` query collapses `.dashboard` to one column (`grid-template-areas: "header" "sidebar" "main" "footer"`), turns the sidebar into a horizontal, scrollable nav bar, and drops the six stat cards to a single column. Verified in DevTools' Device Toolbar at common phone/tablet widths.

**Card micro-interactions**
Every stat card has `tabindex="0"` so it's keyboard-reachable, and both `:hover` and `:focus-visible` trigger the same 200ms `transform` (a small lift) plus `box-shadow` change — under the 250ms ceiling, and the focus state additionally gets a visible focus ring for accessibility.

**Stretch goal: dark theme**
A `@media (prefers-color-scheme: dark)` block overrides *only* the `:root` custom properties — no other selectors are touched — so the entire page (including the brand-on-white button contrast) re-themes automatically based on the user's OS-level preference.

## What's next

Future weeks will layer in JavaScript to make the form actually add rows to the table and update the category cards, calculate totals, and eventually persist data — the HTML structure and element IDs here are already set up with that in mind.