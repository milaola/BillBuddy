
let subscriptions =
    JSON.parse(localStorage.getItem("subscriptions")) || [];



function saveSubscriptions() {

    localStorage.setItem(
        "subscriptions",
        JSON.stringify(subscriptions)
    );

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


function displaySubscriptions() {


    if (!subscriptionsList) {
        return;
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


   
    subscriptionsList.innerHTML =
        subscriptions.map(function (subscription) {

            return `

                <div class="subscription-card">

                    <div class="subscription-info">

                        <div class="subscription-icon">
                            ${getCategoryIcon(subscription.category)}
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

                        </div>

                    </div>


                    <div class="subscription-cost">

                        <strong>
                            $${subscription.amount.toFixed(2)}
                        </strong>

                        <span>
                            / ${subscription.billingCycle.toLowerCase()}
                        </span>

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

        }).join("");

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
        subscriptions.filter(function (subscription) {

            return subscription.id !== id;

        });


    saveSubscriptions();

    displaySubscriptions();

}



displaySubscriptions();
