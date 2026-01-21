"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingComponentSchema = exports.TimeBoundComponentSchema = exports.TieredComponentSchema = exports.SeatComponentSchema = exports.UsageComponentSchema = exports.FlatFeeComponentSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
const BaseComponentSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    currency: types_1.CurrencySchema.default(types_1.DEFAULT_CURRENCY),
});
exports.FlatFeeComponentSchema = BaseComponentSchema.extend({
    type: zod_1.z.literal('flat'),
    amount: zod_1.z.number().nonnegative(),
    billingPeriod: types_1.BillingPeriodSchema,
});
exports.UsageComponentSchema = BaseComponentSchema.extend({
    type: zod_1.z.literal('usage'),
    metricName: zod_1.z.string().min(1),
    unitPrice: zod_1.z.number().nonnegative(),
    includedUnits: zod_1.z.number().int().nonnegative().default(0),
});
exports.SeatComponentSchema = BaseComponentSchema.extend({
    type: zod_1.z.literal('seat'),
    pricePerSeat: zod_1.z.number().nonnegative(),
    minSeats: zod_1.z.number().int().positive().default(1),
    maxSeats: zod_1.z.number().int().positive().optional(),
    billingPeriod: types_1.BillingPeriodSchema,
});
exports.TieredComponentSchema = BaseComponentSchema.extend({
    type: zod_1.z.literal('tiered'),
    metricName: zod_1.z.string().min(1),
    tiers: zod_1.z.array(types_1.TierSchema).min(1),
    graduated: zod_1.z.boolean().default(false),
});
exports.TimeBoundComponentSchema = BaseComponentSchema.extend({
    type: zod_1.z.literal('time_bound'),
    amount: zod_1.z.number().nonnegative(),
    validFrom: zod_1.z.string().datetime(),
    validTo: zod_1.z.string().datetime(),
    billingPeriod: types_1.BillingPeriodSchema,
});
exports.PricingComponentSchema = zod_1.z.discriminatedUnion('type', [
    exports.FlatFeeComponentSchema,
    exports.UsageComponentSchema,
    exports.SeatComponentSchema,
    exports.TieredComponentSchema,
    exports.TimeBoundComponentSchema,
]);
