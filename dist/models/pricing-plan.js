"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingPlanSchema = exports.PricingPlanVersionSchema = void 0;
exports.validatePricingPlan = validatePricingPlan;
exports.validatePricingPlanVersion = validatePricingPlanVersion;
const zod_1 = require("zod");
const pricing_components_1 = require("./pricing-components");
const types_1 = require("../types");
exports.PricingPlanVersionSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    planId: zod_1.z.string().uuid(),
    version: zod_1.z.number().int().positive(),
    effectiveFrom: zod_1.z.string().datetime(),
    effectiveTo: zod_1.z.string().datetime().optional(),
    components: zod_1.z.array(pricing_components_1.PricingComponentSchema).min(1),
    currency: types_1.CurrencySchema.default(types_1.DEFAULT_CURRENCY),
    createdAt: zod_1.z.string().datetime(),
    isActive: zod_1.z.boolean().default(true),
});
exports.PricingPlanSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    tenantId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    defaultBillingPeriod: types_1.BillingPeriodSchema.default('monthly'),
    currency: types_1.CurrencySchema.default(types_1.DEFAULT_CURRENCY),
    versions: zod_1.z.array(exports.PricingPlanVersionSchema).default([]),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
    isArchived: zod_1.z.boolean().default(false),
});
function validatePricingPlan(data) {
    return exports.PricingPlanSchema.parse(data);
}
function validatePricingPlanVersion(data) {
    return exports.PricingPlanVersionSchema.parse(data);
}
