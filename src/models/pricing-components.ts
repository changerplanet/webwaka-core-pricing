import { z } from 'zod';
import { CurrencySchema, TierSchema, BillingPeriodSchema, DEFAULT_CURRENCY } from '../types';

const BaseComponentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  currency: CurrencySchema.default(DEFAULT_CURRENCY),
});

export const FlatFeeComponentSchema = BaseComponentSchema.extend({
  type: z.literal('flat'),
  amount: z.number().nonnegative(),
  billingPeriod: BillingPeriodSchema,
});
export type FlatFeeComponent = z.infer<typeof FlatFeeComponentSchema>;

export const UsageComponentSchema = BaseComponentSchema.extend({
  type: z.literal('usage'),
  metricName: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  includedUnits: z.number().int().nonnegative().default(0),
});
export type UsageComponent = z.infer<typeof UsageComponentSchema>;

export const SeatComponentSchema = BaseComponentSchema.extend({
  type: z.literal('seat'),
  pricePerSeat: z.number().nonnegative(),
  minSeats: z.number().int().positive().default(1),
  maxSeats: z.number().int().positive().optional(),
  billingPeriod: BillingPeriodSchema,
});
export type SeatComponent = z.infer<typeof SeatComponentSchema>;

export const TieredComponentSchema = BaseComponentSchema.extend({
  type: z.literal('tiered'),
  metricName: z.string().min(1),
  tiers: z.array(TierSchema).min(1),
  graduated: z.boolean().default(false),
});
export type TieredComponent = z.infer<typeof TieredComponentSchema>;

export const TimeBoundComponentSchema = BaseComponentSchema.extend({
  type: z.literal('time_bound'),
  amount: z.number().nonnegative(),
  validFrom: z.string().datetime(),
  validTo: z.string().datetime(),
  billingPeriod: BillingPeriodSchema,
});
export type TimeBoundComponent = z.infer<typeof TimeBoundComponentSchema>;

export const PricingComponentSchema = z.discriminatedUnion('type', [
  FlatFeeComponentSchema,
  UsageComponentSchema,
  SeatComponentSchema,
  TieredComponentSchema,
  TimeBoundComponentSchema,
]);
export type PricingComponent = z.infer<typeof PricingComponentSchema>;
