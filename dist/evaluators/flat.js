"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateFlatFee = evaluateFlatFee;
function evaluateFlatFee(component, context) {
    return {
        componentId: component.id,
        componentName: component.name,
        componentType: 'flat',
        description: `Flat fee: ${component.name}`,
        quantity: 1,
        unitPrice: component.amount,
        amount: component.amount,
        currency: component.currency,
        metadata: {
            billingPeriod: component.billingPeriod,
        },
    };
}
