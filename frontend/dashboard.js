// ============================================
// BEIGEPAY DASHBOARD
// ============================================


// ============================================
// FINANCIAL DATA
// ============================================

const financeData = {
    monthlyIncome: 6850,
    monthlyExpenses: 3420,
    totalBalance: 50580
};


// ============================================
// TRANSACTIONS
// ============================================

const transactions = [
    {
        id: 1,
        description: "Grocery Shopping",
        category: "Food",
        amount: -128.50,
        date: "2026-08-10",
        status: "Completed"
    },

    {
        id: 2,
        description: "Salary",
        category: "Income",
        amount: 4500,
        date: "2026-08-09",
        status: "Completed"
    },

    {
        id: 3,
        description: "Transportation",
        category: "Transport",
        amount: -45,
        date: "2026-08-08",
        status: "Completed"
    },

    {
        id: 4,
        description: "Movie Night",
        category: "Entertainment",
        amount: -65,
        date: "2026-08-07",
        status: "Pending"
    },

    {
        id: 5,
        description: "Freelance Payment",
        category: "Income",
        amount: 750,
        date: "2026-08-05",
        status: "Completed"
    }
];


// ============================================
// CALCULATIONS
// ============================================

function calculateBalance() {
    return (
        financeData.monthlyIncome -
        financeData.monthlyExpenses
    );
}


function calculateGoalPercentage(current, target) {

    if (target <= 0) {
        return 0;
    }

    return Math.min(
        (current / target) * 100,
        100
    );
}


// ============================================
// FORMATTING
// ============================================

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(amount);
}


function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });
}


// ============================================
// RENDER DASHBOARD
// ============================================

function renderDashboard() {

    const incomeElement =
        document.getElementById("monthly-income");

    const expensesElement =
        document.getElementById("monthly-expenses");

    const balanceElement =
        document.getElementById("total-balance");

    const savingsElement =
        document.getElementById("net-savings");


    // Monthly Income

    incomeElement.textContent =
        formatCurrency(
            financeData.monthlyIncome
        );


    // Monthly Expenses

    expensesElement.textContent =
        formatCurrency(
            financeData.monthlyExpenses
        );


    // Total Balance

    balanceElement.textContent =
        formatCurrency(
            financeData.totalBalance
        );


    // Net Savings

    savingsElement.textContent =
        formatCurrency(
            calculateBalance()
        );
}


// ============================================
// RENDER TRANSACTIONS
// ============================================

function renderTransactions() {

    const transactionsBody =
        document.getElementById("transactions-body");


    // Clear existing table rows

    transactionsBody.innerHTML = "";


    // Create a table row for every transaction

    transactions.forEach(function (transaction) {

        const row =
            document.createElement("tr");


        // Determine income or expense

        const amountClass =
            transaction.amount >= 0
                ? "income"
                : "expense";


        // Determine + sign for income

        const amountSign =
            transaction.amount >= 0
                ? "+"
                : "";


        // Determine transaction icon

        const transactionIcon =
            transaction.amount >= 0
                ? "💵"
                : "💸";


        row.innerHTML = `

            <td>
                ${formatDate(transaction.date)}
            </td>


            <td>

                <div class="transaction-name">

                    <span class="transaction-icon ${
                        transaction.amount >= 0
                            ? "income-icon"
                            : ""
                    }">

                        ${transactionIcon}

                    </span>

                    ${transaction.description}

                </div>

            </td>


            <td>

                <span class="category">

                    ${transaction.category}

                </span>

            </td>


            <td class="${amountClass}">

                ${amountSign}${formatCurrency(
                    Math.abs(transaction.amount)
                )}

            </td>


            <td>

                <span class="status ${
                    transaction.status.toLowerCase()
                }">

                    ${transaction.status}

                </span>

            </td>

        `;


        transactionsBody.appendChild(row);

    });
}


// ============================================
// TRANSACTION MODAL ELEMENTS
// ============================================

const transactionModal =
    document.getElementById("transaction-modal");


const addTransactionBtn =
    document.getElementById("add-transaction-btn");


const closeTransactionBtn =
    document.getElementById(
        "close-transaction-modal"
    );


const cancelTransactionBtn =
    document.getElementById(
        "cancel-transaction"
    );


const transactionForm =
    document.getElementById(
        "transaction-form"
    );


// ============================================
// OPEN TRANSACTION MODAL
// ============================================

function openTransactionModal() {

    transactionModal.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";
}


// ============================================
// CLOSE TRANSACTION MODAL
// ============================================

function closeTransactionModal() {

    transactionModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";
}


// ============================================
// MODAL EVENT LISTENERS
// ============================================


// Open modal

addTransactionBtn.addEventListener(
    "click",
    openTransactionModal
);


// Close using X button

closeTransactionBtn.addEventListener(
    "click",
    closeTransactionModal
);


// Close using Cancel button

cancelTransactionBtn.addEventListener(
    "click",
    closeTransactionModal
);


// Close by clicking outside modal

transactionModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            transactionModal
        ) {

            closeTransactionModal();

        }

    }
);


// ============================================
// ADD TRANSACTION
// ============================================

transactionForm.addEventListener(
    "submit",
    function (event) {

        // Prevent page refresh

        event.preventDefault();


        // Get form values

        const description =
            document.getElementById(
                "transaction-description"
            ).value.trim();


        const amount =
            Number(
                document.getElementById(
                    "transaction-amount"
                ).value
            );


        const type =
            document.getElementById(
                "transaction-type"
            ).value;


        const category =
            document.getElementById(
                "transaction-category"
            ).value;


        const date =
            document.getElementById(
                "transaction-date"
            ).value;


        // Create transaction object

        const transaction = {

            id: Date.now(),

            description: description,

            category: category,

            amount:
                type === "expense"
                    ? -amount
                    : amount,

            date: date,

            status: "Completed"

        };


        // Add new transaction
        // to the beginning

        transactions.unshift(
            transaction
        );


        // Re-render transaction table

        renderTransactions();


        // Reset form

        transactionForm.reset();


        // Close modal

        closeTransactionModal();


        // Show created transaction
        // in browser console

        console.log(
            "Transaction added:",
            transaction
        );

    }
);


// ============================================
// INITIALIZE DASHBOARD
// ============================================

renderDashboard();

renderTransactions();
