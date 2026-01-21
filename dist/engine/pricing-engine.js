"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingEngine = void 0;
exports.createPricingEngine = createPricingEngine;
const flat_1 = require("../evaluators/flat");
const usage_1 = require("../evaluators/usage");
const seat_1 = require("../evaluators/seat");
const tiered_1 = require("../evaluators/tiered");
const time_1 = require("../evaluators/time");
class PricingEngine {
    evaluate(planVersion, context) {
        const lineItems = [];
        for (const component of planVersion.components) {
            const lineItem = this.evaluateComponent(component, context);
            lineItems.push(lineItem);
        }
        const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
        const total = subtotal;
        const result = {
            planVersionId: planVersion.id,
            tenantId: context.tenantId,
            evaluationDate: context.evaluationDate,
            billingPeriodStart: context.billingPeriodStart,
            billingPeriodEnd: context.billingPeriodEnd,
            lineItems,
            subtotal,
            total,
            currency: context.currency,
            computedAt: context.evaluationDate,
            deterministic: true,
        };
        return result;
    }
    evaluateComponent(component, context) {
        switch (component.type) {
            case 'flat':
                return (0, flat_1.evaluateFlatFee)(component, context);
            case 'usage':
                return (0, usage_1.evaluateUsage)(component, context);
            case 'seat':
                return (0, seat_1.evaluateSeat)(component, context);
            case 'tiered':
                return (0, tiered_1.evaluateTiered)(component, context);
            case 'time_bound':
                return (0, time_1.evaluateTimeBound)(component, context);
            default:
                const _exhaustive = component;
                throw new Error(`Unknown component type: ${_exhaustive.type}`);
        }
    }
}
exports.PricingEngine = PricingEngine;
function createPricingEngine() {
    return new PricingEngine();
}
