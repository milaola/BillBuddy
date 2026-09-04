const {
    isValidSubscriptionName,
    getMonthlyAmount,
    getYearlyAmount
} = require("../functions");

describe("Bill Buddy Functions", () => {

    test("validates a correct subscription name", () => {
        expect(isValidSubscriptionName("Netflix")).toBe(true);
    });

    test("rejects a subscription name with special characters", () => {
        expect(isValidSubscriptionName("Netflix!")).toBe(false);
    });

    test("calculates monthly amount for monthly subscription", () => {
        const subscription = {
            amount: 15.99,
            billingCycle: "Monthly"
        };

        expect(getMonthlyAmount(subscription)).toBe(15.99);
    });

    test("calculates monthly amount for yearly subscription", () => {
        const subscription = {
            amount: 120,
            billingCycle: "Yearly"
        };

        expect(getMonthlyAmount(subscription)).toBe(10);
    });

    test("calculates yearly amount for monthly subscription", () => {
        const subscription = {
            amount: 15,
            billingCycle: "Monthly"
        };

        expect(getYearlyAmount(subscription)).toBe(180);
    });

    test("calculates yearly amount for yearly subscription", () => {
        const subscription = {
            amount: 120,
            billingCycle: "Yearly"
        };

        expect(getYearlyAmount(subscription)).toBe(120);
    });

});
