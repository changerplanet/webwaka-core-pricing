import { z } from 'zod';

export const CurrencySchema = z.enum(['NGN', 'USD', 'EUR', 'GBP']);
export type Currency = z.infer<typeof CurrencySchema>;

export const BillingPeriodSchema = z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']);
export type BillingPeriod = z.infer<typeof BillingPeriodSchema>;

export const ComponentTypeSchema = z.enum(['flat', 'usage', 'seat', 'tiered', 'time_bound']);
export type ComponentType = z.infer<typeof ComponentTypeSchema>;

export const MoneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: CurrencySchema,
});
export type Money = z.infer<typeof MoneySchema>;

export const TierSchema = z.object({
  from: z.number().int().nonnegative(),
  to: z.number().int().positive().optional(),
  unitPrice: z.number().nonnegative(),
  flatPrice: z.number().nonnegative().optional(),
});
export type Tier = z.infer<typeof TierSchema>;

export const DEFAULT_CURRENCY: Currency = 'NGN';
