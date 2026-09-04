let subscriptions =
    JSON.parse(localStorage.getItem("subscriptions")) || [];


function saveSubscriptions() {

    localStorage.setItem(
        "subscriptions",
        JSON.stringify(subscriptions)
    );

}


const subscriptionNamePattern = /^[a-zA-Z0-9\s]+$/;


function isValidSubscriptionName(name) {

    return subscriptionNamePattern.test(name);

}


function getDaysUntilNextPayment(nextPaymentDate) {

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const payment = new Date(nextPaymentDate);

    payment.setHours(0, 0, 0, 0);

    const difference =
        payment.getTime() - today.getTime();

    const daysUntilNextPayment =
        Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );

    return daysUntilNextPayment;

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

    } else if (days === 0) {

        return "Payment due today";

    } else {

        return `Payment overdue by ${Math.abs(days)} days`;

    }

}


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


const subscriptionForm =
    document.getElementById("subscriptionForm");


if (subscriptionForm) {

    subscriptionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "subscriptionName"
                ).value.trim();

            const amount =
                Number(
                    document.getElementById(
                        "subscriptionAmount"
                    ).value
                );

            const category =
                document.getElementById(
                    "subscriptionCategory"
                ).value;

            const billingCycle =
                document.getElementById(
                    "billingCycle"
                ).value;

            const nextPayment =
                document.getElementById(
                    "nextPayment"
                ).value;


            if (!isValidSubscriptionName(name)) {

                alert(
                    "Please enter a valid subscription name."
                );

                return;

            }


            if (
                isNaN(amount) ||
                amount <= 0
            ) {

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


    if (subscriptions.length === 0) {

        subscriptionsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📭
                </div>

                <h2>No subscriptions yet</h2>

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


    if (filteredSubscriptions.length === 0) {

        subscriptionsList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔍
                </div>

                <h2>No subscriptions found</h2>

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
                                $${subscription.amount.toFixed(2)}
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
        !insightTotal
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


    if (categoryInsights) {

        if (subscriptions.length === 0) {

            categoryInsights.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📊
                    </div>

                    <h3>No data available</h3>

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


    link.click();


    URL.revokeObjectURL(url);

}


displaySubscriptions();

displayInsights();

loadCategories();
