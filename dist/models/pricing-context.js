"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingResultSchema = exports.PricingLineItemSchema = exports.PricingContextSchema = exports.UsageMetricSchema = void 0;
exports.validatePricingContext = validatePricingContext;
exports.validatePricingResult = validatePricingResult;
const zod_1 = require("zod");
const types_1 = require("../types");
exports.UsageMetricSchema = zod_1.z.object({
    metricName: zod_1.z.string().min(1),
    quantity: zod_1.z.number().nonnegative(),
});
exports.PricingContextSchema = zod_1.z.object({
    tenantId: zod_1.z.string().uuid(),
    subscriptionId: zod_1.z.string().uuid().optional(),
    customerId: zod_1.z.string().uuid().optional(),
    evaluationDate: zod_1.z.string().datetime(),
    billingPeriodStart: zod_1.z.string().datetime(),
    billingPeriodEnd: zod_1.z.string().datetime(),
    seatCount: zod_1.z.number().int().nonnegative().default(1),
    usageMetrics: zod_1.z.array(exports.UsageMetricSchema).default([]),
    currency: types_1.CurrencySchema.default(types_1.DEFAULT_CURRENCY),
});
exports.PricingLineItemSchema = zod_1.z.object({
    componentId: zod_1.z.string().uuid(),
    componentName: zod_1.z.string(),
    componentType: zod_1.z.string(),
    description: zod_1.z.string(),
    quantity: zod_1.z.number().nonnegative(),
    unitPrice: zod_1.z.number().nonnegative(),
    amount: zod_1.z.number().nonnegative(),
    currency: types_1.CurrencySchema,
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
exports.PricingResultSchema = zod_1.z.object({
    planVersionId: zod_1.z.string().uuid(),
    tenantId: zod_1.z.string().uuid(),
    evaluationDate: zod_1.z.string().datetime(),
    billingPeriodStart: zod_1.z.string().datetime(),
    billingPeriodEnd: zod_1.z.string().datetime(),
    lineItems: zod_1.z.array(exports.PricingLineItemSchema),
    subtotal: zod_1.z.number().nonnegative(),
    total: zod_1.z.number().nonnegative(),
    currency: types_1.CurrencySchema,
    computedAt: zod_1.z.string().datetime(),
    deterministic: zod_1.z.literal(true),
});
function validatePricingContext(data) {
    return exports.PricingContextSchema.parse(data);
}
function validatePricingResult(data) {
    return exports.PricingResultSchema.parse(data);
}
