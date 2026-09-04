const subscriptionNamePattern = /^[a-zA-Z0-9\s]+$/;

function isValidSubscriptionName(name) {
    return subscriptionNamePattern.test(name);
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

module.exports = {
    isValidSubscriptionName,
    getMonthlyAmount,
    getYearlyAmount
};
