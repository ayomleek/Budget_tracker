/* ================================================================
   SpendWise Dashboard — script.js
   Week 5: JavaScript Foundation

   This script doesn't touch the DOM yet — it works entirely with
   variables, functions, and the console, per this week's brief.
   The IDs already on the form (expense-name, expense-amount,
   expense-category, expense-date) are what a later week will use
   to wire this logic up to the actual page.
   ================================================================ */

/* ================================
   1. Application data
   ================================ */

// A single number representing this month's total budget.
// Declared with "let" because the user may update it via prompt() below.
let monthlyBudget = 1770;

// Each category's individual budget ceiling, as an object of
// category name (string) -> budget amount (number).
// These mirror the six category cards on the dashboard.
const categoryBudgets = {
  Food: 500,
  Transport: 200,
  Rent: 850,
  Entertainment: 100,
  Utilities: 120,
};

// The month's savings goal is tracked separately, since it isn't
// a spending category with a "budget ceiling" the way the others are.
const savingsGoal = 300;

// The list of expenses, mirroring the rows in the "My Expenses" table.
// This is an array of objects — each object bundles together the
// four pieces of data (string, number, string, string) that belong
// to one expense.
const expenses = [
  { name: "Groceries", amount: 54.20, category: "Food", date: "2026-09-01" },
  { name: "Bus pass", amount: 32.00, category: "Transport", date: "2026-09-02" },
  { name: "Apartment rent", amount: 850.00, category: "Rent", date: "2026-09-03" },
  { name: "Movie night", amount: 18.50, category: "Entertainment", date: "2026-09-05" },
  { name: "Phone charger", amount: 12.99, category: "Other", date: "2026-09-06" },
];

/* ================================
   2. Reusable functions
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
 * Formats a plain number as a US dollar string for readable console output.
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

  // The user clicked "Cancel" — prompt() returns null in that case.
  if (userInput === null) {
    console.log("Budget prompt cancelled — using the default monthly budget.");
    return defaultBudget;
  }

  const parsedBudget = parseFloat(userInput);

  // parseFloat() returns NaN for anything that isn't a usable number
  // (an empty string, letters, etc.), so guard against that too.
  if (Number.isNaN(parsedBudget) || parsedBudget <= 0) {
    console.log("That didn't look like a valid amount — using the default monthly budget instead.");
    return defaultBudget;
  }

  return parsedBudget;
}

/**
 * Pulls the calculations above together and prints a clearly
 * labeled summary to the console: the overall budget picture,
 * then a breakdown for every tracked category.
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
  const isOverBudget = remaining < 0; // boolean, built from the calculation above

  console.log(`Monthly budget:     ${formatCurrency(budget)}`);
  console.log(`Total spent:        ${formatCurrency(totalSpent)}`);
  console.log(`Remaining balance:  ${formatCurrency(remaining)}`);
  console.log(`Status:             ${isOverBudget ? "⚠️ Over budget" : "✅ Within budget"}`);
  console.log(`Savings goal:       ${formatCurrency(savingsGoal)}`);

  console.log("----------------------------------------");
  console.log(" SPENDING BY CATEGORY");
  console.log("----------------------------------------");

  Object.keys(budgetsByCategory).forEach((category) => {
    const spent = getCategoryTotal(expenseList, category);
    const categoryBudget = budgetsByCategory[category];
    const categoryRemaining = getRemainingBalance(categoryBudget, spent);

    console.log(
      `${category}: ${formatCurrency(spent)} spent of ${formatCurrency(categoryBudget)}` +
      ` (${formatCurrency(categoryRemaining)} left)`
    );
  });

  console.log("========================================");
}

/* ================================
   3. Run the app
   ================================ */

// Collect the user's monthly budget (falls back to the default above
// if they cancel the prompt or enter something invalid).
monthlyBudget = promptForMonthlyBudget(monthlyBudget);

// Display the full calculated summary in the console.
logBudgetSummary(monthlyBudget, expenses, categoryBudgets);