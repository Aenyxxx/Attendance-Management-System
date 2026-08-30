// ============================================
// MONAEY DASHBOARD
// Month-aware, Excel-style financial dashboard
// ============================================

const STORAGE_KEY = "monaey-dashboard-data-v2";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// ============================================
// DEFAULT DATA
// ============================================

const defaultData = {

    "2026-08": {

        statement: {
            income: 8068.31,
            balance: 8610.31,
            toPay: 4050.00,
            spends: 4560.31
        },

        totalBalance: 1824.12,

        expenses: [
            {
                name: "Internet",
                amount: 1500
            },
            {
                name: "Adjustment",
                amount: 1000
            },
            {
                name: "Ichan's cake",
                amount: 1000
            },
            {
                name: "Gala w/ Gy",
                amount: 500
            },
            {
                name: "Baby load",
                amount: 50
            }
        ],

        transfers: [
            {
                bank: "GCASH",
                amount: 4050.00
            },
            {
                bank: "MARIBANK",
                amount: 1824.12
            },
            {
                bank: "MAYA",
                amount: 2736.19
            }
        ],

        transactions: [
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
        ]
    }

};


// ============================================
// STATE
// ============================================

let dashboardData = loadData();

let selectedMonth = "2026-08";

let searchTerm = "";


// ============================================
// STORAGE
// ============================================

function loadData() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (saved) {

            return mergeData(
                JSON.parse(saved)
            );

        }

    } catch (error) {

        console.warn(
            "Could not load saved dashboard data.",
            error
        );

    }

    return structuredClone(defaultData);

}


function mergeData(savedData) {

    const data =
        structuredClone(defaultData);


    Object.keys(savedData || {}).forEach(
        (monthKey) => {

            data[monthKey] = {

                statement: {

                    income: 0,

                    balance: 0,

                    toPay: 0,

                    spends: 0,

                    ...(savedData[monthKey]?.statement || {})

                },

                totalBalance:
                    Number(
                        savedData[monthKey]?.totalBalance || 0
                    ),

                expenses:
                    Array.isArray(
                        savedData[monthKey]?.expenses
                    )
                        ? savedData[monthKey].expenses
                        : [],

                transfers:
                    Array.isArray(
                        savedData[monthKey]?.transfers
                    )
                        ? savedData[monthKey].transfers
                        : [],

                transactions:
                    Array.isArray(
                        savedData[monthKey]?.transactions
                    )
                        ? savedData[monthKey].transactions
                        : []

            };

        }
    );


    return data;

}


function saveData() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(dashboardData)
        );

    } catch (error) {

        console.warn(
            "Could not save dashboard data.",
            error
        );

    }

}


// ============================================
// GET MONTH DATA
// ============================================

function getMonthData(monthKey) {

    if (!dashboardData[monthKey]) {

        dashboardData[monthKey] = {

            statement: {

                income: 0,

                balance: 0,

                toPay: 0,

                spends: 0

            },

            totalBalance: 0,

            expenses: [],

            transfers: [],

            transactions: []

        };

    }


    return dashboardData[monthKey];

}


// ============================================
// FORMATTING
// ============================================

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP"
        }
    ).format(
        Number(amount) || 0
    );

}


function formatDate(dateString) {

    if (!dateString) {

        return "—";

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return date.toLocaleDateString(
        "en-PH",
        {
            month: "short",
            day: "2-digit",
            year: "numeric"
        }
    );

}


function getMonthLabel(monthKey) {

    const [year, month] =
        monthKey
            .split("-")
            .map(Number);


    return `${monthNames[month - 1]} ${year}`;

}


function monthFromDate(dateString) {

    return String(dateString || "")
        .slice(0, 7);

}


function escapeHtml(value) {

    return String(value ?? "")

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


// ============================================
// MONTH SELECTOR
// ============================================

function buildMonthSelector() {

    const select =
        document.getElementById(
            "month-select"
        );


    if (!select) {

        return;

    }


    const currentYear = 2026;


    select.innerHTML = "";


    for (
        let month = 1;
        month <= 12;
        month++
    ) {

        const key =
            `${currentYear}-${String(month).padStart(2, "0")}`;


        const option =
            document.createElement("option");


        option.value = key;


        option.textContent =
            getMonthLabel(key);


        select.appendChild(option);

    }


    select.value =
        selectedMonth;

}


// ============================================
// CHANGE MONTH
// ============================================

function changeMonth(offset) {

    const [year, month] =
        selectedMonth
            .split("-")
            .map(Number);


    const nextDate =
        new Date(
            year,
            month - 1 + offset,
            1
        );


    if (
        nextDate.getFullYear() !== 2026
    ) {

        return;

    }


    selectedMonth =
        `${nextDate.getFullYear()}-${String(
            nextDate.getMonth() + 1
        ).padStart(2, "0")}`;


    const monthSelect =
        document.getElementById(
            "month-select"
        );


    if (monthSelect) {

        monthSelect.value =
            selectedMonth;

    }


    searchTerm = "";


    const searchInput =
        document.getElementById(
            "search-input"
        );


    if (searchInput) {

        searchInput.value = "";

    }


    renderDashboard();

}


// ============================================
// SET MONTH
// ============================================

function setSelectedMonth(monthKey) {

    selectedMonth =
        monthKey;


    searchTerm = "";


    const searchInput =
        document.getElementById(
            "search-input"
        );


    if (searchInput) {

        searchInput.value = "";

    }


    renderDashboard();

}


// ============================================
// RENDER EXCEL-STYLE STATEMENT
// ============================================

function renderStatement(data) {

    const monthName =
        getMonthLabel(
            selectedMonth
        ).split(" ")[0];


    const year =
        selectedMonth.slice(0, 4);


    const statementMonth =
        document.getElementById(
            "statement-month"
        );


    const statementYear =
        document.getElementById(
            "statement-year"
        );


    const transferMonth =
        document.getElementById(
            "transfer-month"
        );


    if (statementMonth) {

        statementMonth.textContent =
            monthName.toUpperCase();

    }


    if (statementYear) {

        statementYear.textContent =
            year;

    }


    if (transferMonth) {

        transferMonth.textContent =
            monthName.toUpperCase();

    }


    const income =
        document.getElementById(
            "statement-income"
        );


    const balance =
        document.getElementById(
            "statement-balance"
        );


    const toPay =
        document.getElementById(
            "statement-to-pay"
        );


    const spends =
        document.getElementById(
            "statement-spends"
        );


    if (income) {

        income.textContent =
            formatCurrency(
                data.statement.income
            );

    }


    if (balance) {

        balance.textContent =
            formatCurrency(
                data.statement.balance
            );

    }


    if (toPay) {

        toPay.textContent =
            formatCurrency(
                data.statement.toPay
            );

    }


    if (spends) {

        spends.textContent =
            formatCurrency(
                data.statement.spends
            );

    }

}


// ============================================
// RENDER EXPENSES
// ============================================

function renderExpenses(data) {

    const body =
        document.getElementById(
            "expenses-body"
        );


    if (!body) {

        return;

    }


    if (
        !data.expenses ||
        data.expenses.length === 0
    ) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="2"
                    class="empty-ledger"
                >
                    No bills recorded.
                </td>

            </tr>

        `;

    } else {

        body.innerHTML =
            data.expenses
                .map(
                    (expense) => `

                        <tr>

                            <td>
                                ${escapeHtml(
                                    expense.name
                                )}
                            </td>

                            <td>
                                ${formatCurrency(
                                    expense.amount
                                )}
                            </td>

                        </tr>

                    `
                )
                .join("");

    }


    const total =
        data.expenses.reduce(

            (sum, expense) =>

                sum +
                Number(
                    expense.amount || 0
                ),

            0

        );


    const expenseTotal =
        document.getElementById(
            "expense-total"
        );


    const footerTotal =
        document.getElementById(
            "expenses-footer-total"
        );


    if (expenseTotal) {

        expenseTotal.textContent =
            formatCurrency(total);

    }


    if (footerTotal) {

        footerTotal.textContent =
            formatCurrency(total);

    }

}


// ============================================
// RENDER BANK TRANSFERS
// ============================================

function renderTransfers(data) {

    const body =
        document.getElementById(
            "transfers-body"
        );


    if (!body) {

        return;

    }


    if (
        !data.transfers ||
        data.transfers.length === 0
    ) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="2"
                    class="empty-ledger"
                >
                    No bank transfers recorded.
                </td>

            </tr>

        `;

    } else {

        body.innerHTML =
            data.transfers
                .map(
                    (transfer) => `

                        <tr>

                            <td>
                                ${escapeHtml(
                                    transfer.bank
                                )}
                            </td>

                            <td>
                                ${formatCurrency(
                                    transfer.amount
                                )}
                            </td>

                        </tr>

                    `
                )
                .join("");

    }


    const total =
        data.transfers.reduce(

            (sum, transfer) =>

                sum +
                Number(
                    transfer.amount || 0
                ),

            0

        );


    const transferTotal =
        document.getElementById(
            "transfer-total"
        );


    const footerTotal =
        document.getElementById(
            "transfers-footer-total"
        );


    if (transferTotal) {

        transferTotal.textContent =
            formatCurrency(total);

    }


    if (footerTotal) {

        footerTotal.textContent =
            formatCurrency(total);

    }

}


// ============================================
// RENDER TOTAL BALANCE
// ============================================

function renderTotalBalance(data) {

    const totalBalance =
        document.getElementById(
            "total-balance"
        );


    if (totalBalance) {

        totalBalance.textContent =
            formatCurrency(
                data.totalBalance
            );

    }

}


// ============================================
// RENDER TRANSACTIONS
// ============================================

function renderTransactions(data) {

    const body =
        document.getElementById(
            "transactions-body"
        );


    if (!body) {

        return;

    }


    const emptyState =
        document.getElementById(
            "empty-transactions"
        );


    let filtered =
        data.transactions || [];


    if (searchTerm) {

        const query =
            searchTerm.toLowerCase();


        filtered =
            filtered.filter(
                (transaction) => {

                    const haystack = [

                        transaction.description,

                        transaction.category,

                        transaction.status,

                        transaction.amount

                    ]
                        .join(" ")
                        .toLowerCase();


                    return haystack.includes(
                        query
                    );

                }
            );

    }


    filtered.sort(
        (a, b) =>
            String(b.date)
                .localeCompare(
                    String(a.date)
                )
    );


    body.innerHTML = "";


    filtered.forEach(
        (transaction) => {

            const row =
                document.createElement(
                    "tr"
                );


            const isIncome =
                Number(
                    transaction.amount
                ) >= 0;


            const amountClass =
                isIncome
                    ? "income"
                    : "expense";


            const amountSign =
                isIncome
                    ? "+"
                    : "";


            const icon =
                isIncome
                    ? "💵"
                    : "💸";


            const statusClass =
                String(
                    transaction.status
                ).toLowerCase() ===
                "pending"

                    ? "pending"

                    : "completed";


            row.innerHTML = `

                <td>
                    ${formatDate(
                        transaction.date
                    )}
                </td>


                <td>

                    <div class="transaction-name">

                        <span
                            class="transaction-icon ${
                                isIncome
                                    ? "income-icon"
                                    : ""
                            }"
                        >

                            ${icon}

                        </span>

                        ${escapeHtml(
                            transaction.description
                        )}

                    </div>

                </td>


                <td>

                    <span class="category">

                        ${escapeHtml(
                            transaction.category
                        )}

                    </span>

                </td>


                <td class="${amountClass}">

                    ${amountSign}${formatCurrency(
                        Math.abs(
                            Number(
                                transaction.amount
                            ) || 0
                        )
                    )}

                </td>


                <td>

                    <span
                        class="status ${statusClass}"
                    >

                        ${escapeHtml(
                            transaction.status
                        )}

                    </span>

                </td>

            `;


            body.appendChild(row);

        }
    );


    if (emptyState) {

        emptyState.classList.toggle(
            "visible",
            filtered.length === 0
        );

    }


    const transactionCount =
        document.getElementById(
            "transaction-count"
        );


    if (transactionCount) {

        transactionCount.textContent =

            `${filtered.length} transaction${
                filtered.length === 1
                    ? ""
                    : "s"
            } in ${
                getMonthLabel(
                    selectedMonth
                )
            }`;

    }

}


// ============================================
// RENDER EVERYTHING
// ============================================

function renderDashboard() {

    const data =
        getMonthData(
            selectedMonth
        );


    const monthDescription =
        document.getElementById(
            "month-description"
        );


    if (monthDescription) {

        monthDescription.textContent =
            `Financial statement for ${
                getMonthLabel(
                    selectedMonth
                )
            }`;

    }


    renderStatement(data);

    renderExpenses(data);

    renderTransfers(data);

    renderTotalBalance(data);

    renderTransactions(data);

}


// ============================================
// TRANSACTION MODAL
// ============================================

const transactionModal =
    document.getElementById(
        "transaction-modal"
    );


const addTransactionBtn =
    document.getElementById(
        "add-transaction-btn"
    );


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


const transactionDate =
    document.getElementById(
        "transaction-date"
    );


// ============================================
// OPEN MODAL
// ============================================

function openTransactionModal() {

    if (!transactionModal) {

        return;

    }


    if (transactionDate) {

        transactionDate.value =
            `${selectedMonth}-01`;

    }


    transactionModal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";

}


// ============================================
// CLOSE MODAL
// ============================================

function closeTransactionModal() {

    if (!transactionModal) {

        return;

    }


    transactionModal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";

}


// ============================================
// MODAL EVENTS
// ============================================

if (addTransactionBtn) {

    addTransactionBtn.addEventListener(
        "click",
        openTransactionModal
    );

}


if (closeTransactionBtn) {

    closeTransactionBtn.addEventListener(
        "click",
        closeTransactionModal
    );

}


if (cancelTransactionBtn) {

    cancelTransactionBtn.addEventListener(
        "click",
        closeTransactionModal
    );

}


if (transactionModal) {

    transactionModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                transactionModal
            ) {

                closeTransactionModal();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeTransactionModal();

        }

    }
);


// ============================================
// ADD TRANSACTION
// ============================================

if (transactionForm) {

    transactionForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


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


            if (
                !description ||
                !amount ||
                amount < 0 ||
                !date
            ) {

                return;

            }


            const transactionMonth =
                monthFromDate(date);


            const monthData =
                getMonthData(
                    transactionMonth
                );


            const transaction = {

                id: Date.now(),

                description:

                    description,

                category:

                    category,

                amount:

                    type === "expense"

                        ? -amount

                        : amount,

                date:

                    date,

                status:

                    "Completed"

            };


            monthData.transactions.unshift(
                transaction
            );


            // ========================================
            // UPDATE MONTHLY STATEMENT
            // ========================================

            if (
                type === "income"
            ) {

                monthData.statement.income +=
                    amount;


                monthData.statement.balance +=
                    amount;


                monthData.totalBalance +=
                    amount;

            } else {

                monthData.statement.spends +=
                    amount;


                monthData.statement.balance -=
                    amount;


                monthData.totalBalance -=
                    amount;


                if (
                    category === "Bills"
                ) {

                    monthData.statement.toPay +=
                        amount;

                }

            }


            saveData();


            selectedMonth =
                transactionMonth;


            buildMonthSelector();


            const monthSelect =
                document.getElementById(
                    "month-select"
                );


            if (monthSelect) {

                monthSelect.value =
                    selectedMonth;

            }


            transactionForm.reset();


            closeTransactionModal();


            renderDashboard();

        }
    );

}


// ============================================
// SEARCH
// ============================================

const searchInput =
    document.getElementById(
        "search-input"
    );


const clearSearch =
    document.getElementById(
        "clear-search"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        (event) => {

            searchTerm =
                event.target.value.trim();


            renderTransactions(
                getMonthData(
                    selectedMonth
                )
            );

        }
    );

}


if (clearSearch) {

    clearSearch.addEventListener(
        "click",
        () => {

            searchTerm = "";


            if (searchInput) {

                searchInput.value = "";

            }


            renderTransactions(
                getMonthData(
                    selectedMonth
                )
            );

        }
    );

}


// ============================================
// MONTH CONTROLS
// ============================================

const monthSelect =
    document.getElementById(
        "month-select"
    );


const previousMonth =
    document.getElementById(
        "previous-month"
    );


const nextMonth =
    document.getElementById(
        "next-month"
    );


if (monthSelect) {

    monthSelect.addEventListener(
        "change",
        (event) => {

            setSelectedMonth(
                event.target.value
            );

        }
    );

}


if (previousMonth) {

    previousMonth.addEventListener(
        "click",
        () => {

            changeMonth(-1);

        }
    );

}


if (nextMonth) {

    nextMonth.addEventListener(
        "click",
        () => {

            changeMonth(1);

        }
    );

}


// ============================================
// INITIALIZE DASHBOARD
// ============================================

buildMonthSelector();

renderDashboard();