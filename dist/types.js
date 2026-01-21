"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CURRENCY = exports.TierSchema = exports.MoneySchema = exports.ComponentTypeSchema = exports.BillingPeriodSchema = exports.CurrencySchema = void 0;
const zod_1 = require("zod");
exports.CurrencySchema = zod_1.z.enum(['NGN', 'USD', 'EUR', 'GBP']);
exports.BillingPeriodSchema = zod_1.z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']);
exports.ComponentTypeSchema = zod_1.z.enum(['flat', 'usage', 'seat', 'tiered', 'time_bound']);
exports.MoneySchema = zod_1.z.object({
    amount: zod_1.z.number().nonnegative(),
    currency: exports.CurrencySchema,
});
exports.TierSchema = zod_1.z.object({
    from: zod_1.z.number().int().nonnegative(),
    to: zod_1.z.number().int().positive().optional(),
    unitPrice: zod_1.z.number().nonnegative(),
    flatPrice: zod_1.z.number().nonnegative().optional(),
});
exports.DEFAULT_CURRENCY = 'NGN';
