/* ================================================================
   SpendWise Dashboard — script.js
   Week 6: Make SpendWise Interactive

   Builds on Week 5's data + calculation functions. This week adds:
     - conditional logic that decides what feedback to show
     - loops that process the expenses array
     - DOM manipulation that renders that data onto the page itself,
       not just the console
     - event listeners for both adding and removing expenses
   ================================================================ */

/* ================================
   1. Application data
   ================================ */

// A single number representing this month's total budget.
// Declared with "let" because the user may update it via prompt() below.
let monthlyBudget = 1770;

// Each category's individual budget ceiling, as an object of
// category name (string) -> budget amount (number).
// These mirror five of the six category cards on the dashboard —
// Savings is tracked separately below since it's a goal, not a limit.
const categoryBudgets = {
  Food: 500,
  Transport: 200,
  Rent: 850,
  Entertainment: 100,
  Utilities: 120,
};

const savingsGoal = 300;

// The list of expenses, mirroring the rows in the "My Expenses" table.
// This is an array of objects — each object bundles together the
// pieces of data (string, number, string, string) that belong to
// one expense. Every render function below reads from this single
// array, so it's the one source of truth for the whole dashboard.
const expenses = [
  { name: "Groceries", amount: 54.20, category: "Food", date: "2026-09-01" },
  { name: "Bus pass", amount: 32.00, category: "Transport", date: "2026-09-02" },
  { name: "Apartment rent", amount: 850.00, category: "Rent", date: "2026-09-03" },
  { name: "Movie night", amount: 18.50, category: "Entertainment", date: "2026-09-05" },
  { name: "Phone charger", amount: 12.99, category: "Other", date: "2026-09-06" },
];

/* ================================
   2. Reusable calculation functions
   ================================ */

/**
 * Adds up the "amount" field across a list of expenses.
 * @param {Array<Object>} expenseList
 * @returns {number} the total amount spent
 */
function getTotalExpenses(expenseList) {
  return expenseList.reduce((total, expense) => total + expense.amount, 0);
}

/**
 * Adds up only the expenses that belong to one category.
 * @param {Array<Object>} expenseList
 * @param {string} category
 * @returns {number} the total spent in that category
 */
function getCategoryTotal(expenseList, category) {
  return expenseList
    .filter((expense) => expense.category === category)
    .reduce((total, expense) => total + expense.amount, 0);
}

/**
 * The core budget calculation: what's left once spending is
 * subtracted from a budget. Works for the overall monthly budget
 * or for a single category budget — whichever numbers are passed in.
 * @param {number} budget
 * @param {number} amountSpent
 * @returns {number} the remaining balance (can be negative if over budget)
 */
function getRemainingBalance(budget, amountSpent) {
  return budget - amountSpent;
}

/**
 * Formats a plain number as a US dollar string for readable output.
 * @param {number} amount
 * @returns {string} e.g. "$420.50"
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Asks the user for their monthly budget using a browser prompt,
 * validates the answer, and falls back to the existing default
 * if the user cancels or types something that isn't a usable number.
 * @param {number} defaultBudget
 * @returns {number} the budget to use for this session
 */
function promptForMonthlyBudget(defaultBudget) {
  const userInput = prompt(
    "Welcome to SpendWise! Enter your total monthly budget (USD):",
    defaultBudget
  );

  if (userInput === null) {
    console.log("Budget prompt cancelled — using the default monthly budget.");
    return defaultBudget;
  }

  const parsedBudget = parseFloat(userInput);

  if (Number.isNaN(parsedBudget) || parsedBudget <= 0) {
    console.log("That didn't look like a valid amount — using the default monthly budget instead.");
    return defaultBudget;
  }

  return parsedBudget;
}

/**
 * Prints a clearly labeled budget summary to the console — kept
 * from Week 5 so the console and the on-page dashboard always
 * show the same numbers.
 * @param {number} budget
 * @param {Array<Object>} expenseList
 * @param {Object} budgetsByCategory
 */
function logBudgetSummary(budget, expenseList, budgetsByCategory) {
  console.log("========================================");
  console.log(" SPENDWISE — MONTHLY BUDGET SUMMARY");
  console.log("========================================");

  const totalSpent = getTotalExpenses(expenseList);
  const remaining = getRemainingBalance(budget, totalSpent);
  const isOverBudget = remaining < 0;

  console.log(`Monthly budget:     ${formatCurrency(budget)}`);
  console.log(`Total spent:        ${formatCurrency(totalSpent)}`);
  console.log(`Remaining balance:  ${formatCurrency(remaining)}`);
  console.log(`Status:             ${isOverBudget ? "⚠️ Over budget" : "✅ Within budget"}`);
  console.log(`Savings goal:       ${formatCurrency(savingsGoal)}`);

  console.log("----------------------------------------");
  console.log(" SPENDING BY CATEGORY");
  console.log("----------------------------------------");

  // Loop #1: a classic for...of loop over the category budgets,
  // printing a line for each one.
  for (const category of Object.keys(budgetsByCategory)) {
    const spent = getCategoryTotal(expenseList, category);
    const categoryBudget = budgetsByCategory[category];
    const categoryRemaining = getRemainingBalance(categoryBudget, spent);

    console.log(
      `${category}: ${formatCurrency(spent)} spent of ${formatCurrency(categoryBudget)}` +
      ` (${formatCurrency(categoryRemaining)} left)`
    );
  }

  console.log("========================================");
}

/* ================================
   3. DOM references
   ================================ */

const expenseForm = document.getElementById("expense-form");
const addExpenseButton = expenseForm.querySelector(".add-btn");

const nameInput = document.getElementById("expense-name");
const amountInput = document.getElementById("expense-amount");
const categoryInput = document.getElementById("expense-category");
const dateInput = document.getElementById("expense-date");

const expensesTableBody = document.getElementById("expenses-tbody");
const budgetStatusEl = document.getElementById("budget-status");
const statCardEls = document.querySelectorAll(".stat-card");

/* ================================
   4. Rendering: turning data into on-page content
   ================================ */

/**
 * Rebuilds the "My Expenses" table body from the current expenses
 * array. Uses a plain for loop (rather than forEach) to walk the
 * array by index, since each row's "Remove" button needs to know
 * its own position in the array.
 * @param {Array<Object>} expenseList
 */
function renderExpensesTable(expenseList) {
  // Clear whatever rows are currently in the table (including the
  // hardcoded sample rows from index.html) before rebuilding them.
  expensesTableBody.innerHTML = "";

  for (let i = 0; i < expenseList.length; i++) {
    const expense = expenseList[i];
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = expense.name; // textContent, not innerHTML — safe against HTML in user input
    row.appendChild(nameCell);

    const amountCell = document.createElement("td");
    amountCell.textContent = formatCurrency(expense.amount);
    row.appendChild(amountCell);

    const categoryCell = document.createElement("td");
    categoryCell.textContent = expense.category;
    row.appendChild(categoryCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = expense.date;
    row.appendChild(dateCell);

    const actionsCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-btn";
    removeButton.textContent = "Remove";
    removeButton.dataset.index = i; // records this row's position in the array
    actionsCell.appendChild(removeButton);
    row.appendChild(actionsCell);

    expensesTableBody.appendChild(row);
  }
}

/**
 * Updates each of the six category cards with live numbers, and
 * uses conditional logic to flag any category that's gone over
 * its budget by toggling the .is-over-budget class.
 * @param {Array<Object>} expenseList
 * @param {Object} budgetsByCategory
 */
function renderCategoryCards(expenseList, budgetsByCategory) {
  // Loop #2: forEach over the NodeList of stat-card elements.
  statCardEls.forEach((card) => {
    const category = card.dataset.category;
    const amountEl = card.querySelector(".stat-amount");
    const metaEl = card.querySelector(".stat-meta");

    // Savings isn't a spending category with a budget ceiling,
    // so it's handled on its own rather than compared to a budget.
    if (category === "Savings") {
      amountEl.textContent = formatCurrency(savingsGoal);
      metaEl.textContent = "this month";
      card.classList.remove("is-over-budget");
      return;
    }

    const categoryBudget = budgetsByCategory[category];
    const spent = getCategoryTotal(expenseList, category);

    amountEl.textContent = formatCurrency(spent);
    metaEl.textContent = `of ${formatCurrency(categoryBudget)} budget`;

    // Decision: only mark the card as over-budget if spending has
    // actually passed the ceiling for that category.
    if (spent > categoryBudget) {
      card.classList.add("is-over-budget");
    } else {
      card.classList.remove("is-over-budget");
    }
  });
}

/**
 * Decides what feedback to show about the overall monthly budget
 * and writes it directly onto the page, with a matching status
 * class so the banner's color reflects the message.
 * @param {number} budget
 * @param {Array<Object>} expenseList
 */
function renderBudgetStatus(budget, expenseList) {
  const totalSpent = getTotalExpenses(expenseList);
  const remaining = getRemainingBalance(budget, totalSpent);
  const percentUsed = (totalSpent / budget) * 100;

  // Decision-making: three-way conditional choosing the message
  // and the status class based on how spending compares to budget.
  let message;
  let statusClass;

  if (remaining < 0) {
    message = `⚠️ You're over budget by ${formatCurrency(Math.abs(remaining))} this month.`;
    statusClass = "is-over";
  } else if (percentUsed >= 80) {
    message = `⚠️ You've used ${percentUsed.toFixed(0)}% of your budget — ${formatCurrency(remaining)} left.`;
    statusClass = "is-warning";
  } else {
    message = `✅ You're within budget, with ${formatCurrency(remaining)} remaining.`;
    statusClass = "is-ok";
  }

  budgetStatusEl.textContent = message;
  budgetStatusEl.classList.remove("is-ok", "is-warning", "is-over");
  budgetStatusEl.classList.add(statusClass);
}

/**
 * The single function every user action calls afterward: re-runs
 * every render function (plus the Week 5 console summary) so the
 * table, the category cards, the status banner, and the console
 * always agree with the current expenses array.
 */
function refreshDashboard() {
  renderExpensesTable(expenses);
  renderCategoryCards(expenses, categoryBudgets);
  renderBudgetStatus(monthlyBudget, expenses);
  logBudgetSummary(monthlyBudget, expenses, categoryBudgets);
}

/* ================================
   5. Event handling
   ================================ */

/**
 * Reads the current values out of the Add Expense form, validates
 * them, and returns a ready-to-use expense object — or null if
 * something required is missing/invalid.
 * @returns {Object|null}
 */
function readExpenseFromForm() {
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!name) {
    alert("Please enter an expense name.");
    nameInput.focus();
    return null;
  }

  if (Number.isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than 0.");
    amountInput.focus();
    return null;
  }

  if (!category) {
    alert("Please select a category.");
    categoryInput.focus();
    return null;
  }

  if (!date) {
    alert("Please choose a date.");
    dateInput.focus();
    return null;
  }

  return { name, amount, category, date };
}

/**
 * Click handler for the "Add Expense" button: reads the form,
 * adds the new expense to the expenses array, then refreshes
 * every part of the dashboard that depends on it.
 */
function handleAddExpense() {
  const newExpense = readExpenseFromForm();

  if (newExpense === null) {
    return; // readExpenseFromForm() already alerted the user about what's wrong
  }

  expenses.push(newExpense);
  refreshDashboard();

  expenseForm.reset();
  nameInput.focus();
}

/**
 * Click handler for the expenses table, using event delegation:
 * one listener on the whole <tbody> catches clicks on any row's
 * "Remove" button, however many rows currently exist.
 * @param {MouseEvent} event
 */
function handleTableClick(event) {
  const clickedButton = event.target.closest(".remove-btn");

  if (!clickedButton) {
    return; // the click wasn't on a Remove button
  }

  const index = Number(clickedButton.dataset.index);
  expenses.splice(index, 1); // remove exactly one expense at that position
  refreshDashboard();
}

addExpenseButton.addEventListener("click", handleAddExpense);
expensesTableBody.addEventListener("click", handleTableClick);

/* ================================
   6. Run the app
   ================================ */

// Collect the user's monthly budget, then render the whole
// dashboard — table, category cards, status banner, and console —
// from the current state of the expenses array.
monthlyBudget = promptForMonthlyBudget(monthlyBudget);
refreshDashboard();