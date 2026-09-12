// ============================================================
// BILL BUDDY - SUBSCRIPTIONS
// ============================================================

let subscriptions =
    JSON.parse(localStorage.getItem("subscriptions")) || [];


// Save subscriptions to browser storage
function saveSubscriptions() {

    localStorage.setItem(
        "subscriptions",
        JSON.stringify(subscriptions)
    );

}


// ============================================================
// VALIDATION
// ============================================================

const subscriptionNamePattern =
    /^[a-zA-Z0-9\s]+$/;


function isValidSubscriptionName(name) {

    return subscriptionNamePattern.test(name);

}


// ============================================================
// PAYMENT CALCULATIONS
// ============================================================

function getMonthlyAmount(subscription) {

    if (subscription.billingCycle === "Yearly") {

        return subscription.amount / 12;

    }

    return subscription.amount;

}


function getYearlyAmount(subscription) {

    if (subscription.billingCycle === "Yearly") {

        return subscription.amount;

    }

    return subscription.amount * 12;

}


// ============================================================
// PAYMENT DATES
// ============================================================

function getDaysUntilNextPayment(nextPaymentDate) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const payment = new Date(nextPaymentDate);

    payment.setHours(0, 0, 0, 0);

    const difference =
        payment.getTime() - today.getTime();

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

}


function formatPaymentDate(paymentDate) {

    const date = new Date(paymentDate);

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


function getPaymentMessage(paymentDate) {

    const days =
        getDaysUntilNextPayment(paymentDate);

    if (days > 0) {

        return `Next payment in ${days} days`;

    }

    if (days === 0) {

        return "Payment due today";

    }

    return `Payment overdue by ${Math.abs(days)} days`;

}


// ============================================================
// CATEGORY ICONS
// ============================================================

function getCategoryIcon(category) {

    const icons = {

        "Entertainment": "🎬",
        "Software": "💻",
        "Fitness": "🏋️",
        "Cloud Storage": "☁️",
        "Education": "📚",
        "Other": "📦"

    };

    return icons[category] || "📦";

}


// ============================================================
// ADD SUBSCRIPTION
// ============================================================

const subscriptionForm =
    document.getElementById("subscriptionForm");


if (subscriptionForm) {

    subscriptionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document
                    .getElementById("subscriptionName")
                    .value
                    .trim();

            const amount =
                Number(
                    document
                        .getElementById("subscriptionAmount")
                        .value
                );

            const category =
                document
                    .getElementById("subscriptionCategory")
                    .value;

            const billingCycle =
                document
                    .getElementById("billingCycle")
                    .value;

            const nextPayment =
                document
                    .getElementById("nextPayment")
                    .value;


            if (!isValidSubscriptionName(name)) {

                alert(
                    "Please enter a valid subscription name."
                );

                return;

            }


            if (isNaN(amount) || amount <= 0) {

                alert(
                    "Please enter a valid subscription amount."
                );

                return;

            }


            if (!category) {

                alert(
                    "Please select a category."
                );

                return;

            }


            if (!billingCycle) {

                alert(
                    "Please select a billing cycle."
                );

                return;

            }


            if (!nextPayment) {

                alert(
                    "Please select a valid next payment date."
                );

                return;

            }


            const paymentDate =
                new Date(nextPayment);


            if (isNaN(paymentDate.getTime())) {

                alert(
                    "Please select a valid payment date."
                );

                return;

            }


            const newSubscription = {

                id: Date.now(),

                name: name,

                amount: amount,

                category: category,

                billingCycle: billingCycle,

                nextPayment: nextPayment

            };


            subscriptions.push(newSubscription);

            saveSubscriptions();

            subscriptionForm.reset();

            alert(
                `${name} has been added successfully!`
            );

            window.location.href =
                "subscriptions.html";

        }
    );

}


// ============================================================
// DISPLAY SUBSCRIPTIONS
// ============================================================

const subscriptionsList =
    document.getElementById("subscriptionsList");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");


function displaySubscriptions() {

    if (!subscriptionsList) {

        return;

    }


    let filteredSubscriptions =
        [...subscriptions];


    // Search
    if (searchInput) {

        const searchTerm =
            searchInput.value
                .toLowerCase()
                .trim();


        if (searchTerm) {

            filteredSubscriptions =
                filteredSubscriptions.filter(
                    function (subscription) {

                        return subscription.name
                            .toLowerCase()
                            .includes(searchTerm);

                    }
                );

        }

    }


    // Category filter
    if (
        categoryFilter &&
        categoryFilter.value !== "All"
    ) {

        filteredSubscriptions =
            filteredSubscriptions.filter(
                function (subscription) {

                    return (
                        subscription.category ===
                        categoryFilter.value
                    );

                }
            );

    }


    // No subscriptions
    if (subscriptions.length === 0) {

        subscriptionsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📭
                </div>

                <h2>
                    No subscriptions yet
                </h2>

                <p>
                    Add your first subscription to start
                    tracking your recurring expenses.
                </p>

                <a href="add.html" class="primary-btn">
                    + Add Subscription
                </a>

            </div>

        `;

        return;

    }


    // Search returned nothing
    if (filteredSubscriptions.length === 0) {

        subscriptionsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔍
                </div>

                <h2>
                    No subscriptions found
                </h2>

                <p>
                    Try changing your search or category filter.
                </p>

            </div>

        `;

        return;

    }


    subscriptionsList.innerHTML =
        filteredSubscriptions
            .map(function (subscription) {

                return `

                    <div class="subscription-card">

                        <div class="subscription-info">

                            <div class="subscription-icon">
                                ${getCategoryIcon(
                                    subscription.category
                                )}
                            </div>

                            <div>

                                <h3>
                                    ${subscription.name}
                                </h3>

                                <p>
                                    ${subscription.category}
                                    ·
                                    ${subscription.billingCycle}
                                </p>

                                <small>
                                    Next payment:
                                    ${formatPaymentDate(
                                        subscription.nextPayment
                                    )}
                                </small>

                                <small>
                                    ${getPaymentMessage(
                                        subscription.nextPayment
                                    )}
                                </small>

                            </div>

                        </div>


                        <div class="subscription-cost">

                            <strong>
                                $${Number(
                                    subscription.amount
                                ).toFixed(2)}
                            </strong>

                            <span>
                                /
                                ${subscription.billingCycle.toLowerCase()}
                            </span>

                            <small>
                                $${getMonthlyAmount(
                                    subscription
                                ).toFixed(2)}
                                / month
                            </small>

                        </div>


                        <div class="subscription-actions">

                            <button
                                class="delete-btn"
                                onclick="deleteSubscription(${subscription.id})"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        displaySubscriptions
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        displaySubscriptions
    );

}


// ============================================================
// DELETE SUBSCRIPTION
// ============================================================

function deleteSubscription(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this subscription?"
        );


    if (!confirmDelete) {

        return;

    }


    subscriptions =
        subscriptions.filter(
            function (subscription) {

                return subscription.id !== id;

            }
        );


    saveSubscriptions();

    displaySubscriptions();

    displayInsights();

}


// ============================================================
// INSIGHTS
// ============================================================

function displayInsights() {

    const insightMonthly =
        document.getElementById("insightMonthly");

    const insightYearly =
        document.getElementById("insightYearly");

    const insightTotal =
        document.getElementById("insightTotal");

    const categoryInsights =
        document.getElementById("categoryInsights");

    const savingsContainer =
        document.getElementById("savingsContainer");


    if (
        !insightMonthly &&
        !insightYearly &&
        !insightTotal &&
        !categoryInsights &&
        !savingsContainer
    ) {

        return;

    }


    let monthlyTotal = 0;

    let yearlyTotal = 0;


    subscriptions.forEach(
        function (subscription) {

            monthlyTotal +=
                getMonthlyAmount(subscription);

            yearlyTotal +=
                getYearlyAmount(subscription);

        }
    );


    if (insightMonthly) {

        insightMonthly.textContent =
            `$${monthlyTotal.toFixed(2)}`;

    }


    if (insightYearly) {

        insightYearly.textContent =
            `$${yearlyTotal.toFixed(2)}`;

    }


    if (insightTotal) {

        insightTotal.textContent =
            subscriptions.length;

    }


    // Category insights
    if (categoryInsights) {

        if (subscriptions.length === 0) {

            categoryInsights.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📊
                    </div>

                    <h3>
                        No data available
                    </h3>

                    <p>
                        Add subscriptions to generate
                        spending insights.
                    </p>

                </div>

            `;

        } else {

            const categoryTotals = {};


            subscriptions.forEach(
                function (subscription) {

                    const category =
                        subscription.category;


                    if (!categoryTotals[category]) {

                        categoryTotals[category] = 0;

                    }


                    categoryTotals[category] +=
                        getMonthlyAmount(subscription);

                }
            );


            const sortedCategories =
                Object.entries(categoryTotals)
                    .sort(
                        function (a, b) {

                            return b[1] - a[1];

                        }
                    );


            categoryInsights.innerHTML =
                sortedCategories
                    .map(
                        function (item) {

                            return `

                                <div class="category-insight">

                                    <span>
                                        ${getCategoryIcon(item[0])}
                                        ${item[0]}
                                    </span>

                                    <strong>
                                        $${item[1].toFixed(2)}
                                        / month
                                    </strong>

                                </div>

                            `;

                        }
                    )
                    .join("");

        }

    }


    // Savings message
    if (savingsContainer) {

        if (subscriptions.length === 0) {

            savingsContainer.innerHTML = `

                <div class="savings-message">

                    <h3>
                        Start tracking your subscriptions
                    </h3>

                    <p>
                        Once you add subscriptions, Bill Buddy
                        will help you understand your spending.
                    </p>

                </div>

            `;

        } else {

            const mostExpensive =
                [...subscriptions]
                    .sort(
                        function (a, b) {

                            return (
                                getMonthlyAmount(b) -
                                getMonthlyAmount(a)
                            );

                        }
                    )[0];


            savingsContainer.innerHTML = `

                <div class="savings-message">

                    <h3>
                        Review your highest monthly cost
                    </h3>

                    <p>
                        <strong>
                            ${mostExpensive.name}
                        </strong>
                        costs approximately
                        <strong>
                            $${getMonthlyAmount(
                                mostExpensive
                            ).toFixed(2)}
                        </strong>
                        per month.
                    </p>

                    <p>
                        Consider whether you still use
                        this subscription regularly.
                    </p>

                </div>

            `;

        }

    }

}


// ============================================================
// LOAD CATEGORIES
// ============================================================

async function loadCategories() {

    try {

        const response =
            await fetch("categories.json");


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const categories =
            await response.json();


        const categorySelect =
            document.getElementById(
                "subscriptionCategory"
            );


        if (categorySelect) {

            categorySelect.innerHTML =
                `<option value="">
                    Select category
                </option>`;


            categories.forEach(
                function (category) {

                    const option =
                        document.createElement("option");

                    option.value = category;

                    option.textContent = category;

                    categorySelect.appendChild(option);

                }
            );

        }

    } catch (error) {

        console.error(
            "Unable to load categories:",
            error
        );

    }

}


// ============================================================
// IMPORT SUBSCRIPTIONS
// ============================================================

function importSubscriptionsFromFile(file) {

    if (!file) {

        return;

    }


    const reader =
        new FileReader();


    reader.addEventListener(
        "load",
        function (event) {

            try {

                const importedData =
                    JSON.parse(
                        event.target.result
                    );


                if (!Array.isArray(importedData)) {

                    throw new Error(
                        "The JSON file must contain an array."
                    );

                }


                const validSubscriptions =
                    importedData.filter(
                        function (subscription) {

                            return (
                                subscription &&
                                typeof subscription.name === "string" &&
                                typeof subscription.amount === "number" &&
                                typeof subscription.category === "string" &&
                                typeof subscription.billingCycle === "string" &&
                                typeof subscription.nextPayment === "string"
                            );

                        }
                    );


                if (validSubscriptions.length === 0) {

                    throw new Error(
                        "No valid subscriptions were found."
                    );

                }


                validSubscriptions.forEach(
                    function (subscription) {

                        subscription.id =
                            Date.now() +
                            Math.random();

                        subscriptions.push(
                            subscription
                        );

                    }
                );


                saveSubscriptions();

                displaySubscriptions();

                displayInsights();


                alert(
                    `${validSubscriptions.length} subscription(s) imported successfully.`
                );


            } catch (error) {

                alert(
                    `Unable to import file: ${error.message}`
                );

            }

        }
    );


    reader.addEventListener(
        "error",
        function () {

            alert(
                "There was a problem reading the file."
            );

        }
    );


    reader.readAsText(file);

}


const importFile =
    document.getElementById("importFile");


if (importFile) {

    importFile.addEventListener(
        "change",
        function (event) {

            const file =
                event.target.files[0];

            importSubscriptionsFromFile(file);

        }
    );

}


// ============================================================
// EXPORT SUBSCRIPTIONS
// ============================================================

function exportSubscriptions() {

    const data =
        JSON.stringify(
            subscriptions,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
            {
                type: "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "bill-buddy-subscriptions.json";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


// ============================================================
// SIGN UP
// ============================================================

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;

            const signupMessage =
                document.getElementById(
                    "signupMessage"
                );


            if (!name || !email || !password) {

                signupMessage.textContent =
                    "Please fill in all fields.";

                signupMessage.style.color =
                    "var(--danger)";

                return;

            }


            if (password.length < 6) {

                signupMessage.textContent =
                    "Password must be at least 6 characters.";

                signupMessage.style.color =
                    "var(--danger)";

                return;

            }


            if (password !== confirmPassword) {

                signupMessage.textContent =
                    "Passwords do not match.";

                signupMessage.style.color =
                    "var(--danger)";

                return;

            }


            signupMessage.textContent =
                "Creating account...";

            signupMessage.style.color =
                "var(--muted)";


            try {

                const response =
                    await fetch(
                        "/api/signup",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    signupMessage.textContent =
                        data.message ||
                        "Unable to create account.";

                    signupMessage.style.color =
                        "var(--danger)";

                    return;

                }


                signupMessage.textContent =
                    "Account created successfully!";

                signupMessage.style.color =
                    "var(--success)";


                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    800
                );


            } catch (error) {

                console.error(error);

                signupMessage.textContent =
                    "Could not connect to the server.";

                signupMessage.style.color =
                    "var(--danger)";

            }

        }
    );

}


// ============================================================
// LOGIN
// ============================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("password")
                    .value;

            const loginMessage =
                document.getElementById(
                    "loginMessage"
                );


            if (!email || !password) {

                loginMessage.textContent =
                    "Please enter your email and password.";

                loginMessage.style.color =
                    "var(--danger)";

                return;

            }


            loginMessage.textContent =
                "Logging in...";

            loginMessage.style.color =
                "var(--muted)";


            try {

                const response =
                    await fetch(
                        "/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    loginMessage.textContent =
                        data.message ||
                        "Invalid email or password.";

                    loginMessage.style.color =
                        "var(--danger)";

                    return;

                }


                loginMessage.textContent =
                    "Login successful!";

                loginMessage.style.color =
                    "var(--success)";


                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    500
                );


            } catch (error) {

                console.error(error);

                loginMessage.textContent =
                    "Could not connect to the server.";

                loginMessage.style.color =
                    "var(--danger)";

            }

        }
    );

}


// ============================================================
// DASHBOARD TOTALS
// ============================================================

function displayDashboardTotals() {

    const monthlyTotalElement =
        document.getElementById(
            "monthlyTotal"
        );

    const subscriptionCountElement =
        document.getElementById(
            "subscriptionCount"
        );

    const upcomingCountElement =
        document.getElementById(
            "upcomingCount"
        );


    if (
        !monthlyTotalElement &&
        !subscriptionCountElement &&
        !upcomingCountElement
    ) {

        return;

    }


    let monthlyTotal = 0;

    subscriptions.forEach(
        function (subscription) {

            monthlyTotal +=
                getMonthlyAmount(subscription);

        }
    );


    if (monthlyTotalElement) {

        monthlyTotalElement.textContent =
            `$${monthlyTotal.toFixed(2)}`;

    }


    if (subscriptionCountElement) {

        subscriptionCountElement.textContent =
            subscriptions.length;

    }


    const upcomingPayments =
        subscriptions.filter(
            function (subscription) {

                return (
                    getDaysUntilNextPayment(
                        subscription.nextPayment
                    ) >= 0
                );

            }
        );


    if (upcomingCountElement) {

        upcomingCountElement.textContent =
            upcomingPayments.length;

    }


    displayUpcomingPayments();

}



function displayUpcomingPayments() {

    const upcomingList =
        document.getElementById(
            "upcomingList"
        );

    const emptyUpcoming =
        document.getElementById(
            "emptyUpcoming"
        );


    if (!upcomingList) {

        return;

    }


    const upcoming =
        [...subscriptions]
            .filter(
                function (subscription) {

                    return (
                        getDaysUntilNextPayment(
                            subscription.nextPayment
                        ) >= 0
                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        new Date(a.nextPayment) -
                        new Date(b.nextPayment)
                    );

                }
            )
            .slice(0, 5);


    if (upcoming.length === 0) {

        upcomingList.innerHTML = "";

        if (emptyUpcoming) {

            emptyUpcoming.style.display =
                "block";

        }

        return;

    }


    if (emptyUpcoming) {

        emptyUpcoming.style.display =
            "none";

    }


    upcomingList.innerHTML =
        upcoming
            .map(
                function (subscription) {

                    const date =
                        new Date(
                            subscription.nextPayment
                        );

                    return `

                        <div class="upcoming-card">

                            <div class="upcoming-info">

                                <div class="upcoming-date">

                                    ${date.toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric"
                                        }
                                    )}

                                </div>

                                <div>

                                    <strong>
                                        ${subscription.name}
                                    </strong>

                                    <p>
                                        ${getPaymentMessage(
                                            subscription.nextPayment
                                        )}
                                    </p>

                                </div>

                            </div>

                            <strong>
                                $${Number(
                                    subscription.amount
                                ).toFixed(2)}
                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}



displaySubscriptions();

displayInsights();

displayDashboardTotals();

loadCategories();
