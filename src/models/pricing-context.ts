import { z } from 'zod';
import { CurrencySchema, DEFAULT_CURRENCY } from '../types';

export const UsageMetricSchema = z.object({
  metricName: z.string().min(1),
  quantity: z.number().nonnegative(),
});
export type UsageMetric = z.infer<typeof UsageMetricSchema>;

export const PricingContextSchema = z.object({
  tenantId: z.string().uuid(),
  subscriptionId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  evaluationDate: z.string().datetime(),
  billingPeriodStart: z.string().datetime(),
  billingPeriodEnd: z.string().datetime(),
  seatCount: z.number().int().nonnegative().default(1),
  usageMetrics: z.array(UsageMetricSchema).default([]),
  currency: CurrencySchema.default(DEFAULT_CURRENCY),
});
export type PricingContext = z.infer<typeof PricingContextSchema>;

export const PricingLineItemSchema = z.object({
  componentId: z.string().uuid(),
  componentName: z.string(),
  componentType: z.string(),
  description: z.string(),
  quantity: z.number().nonnegative(),
  unitPrice: z.number().nonnegative(),
  amount: z.number().nonnegative(),
  currency: CurrencySchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type PricingLineItem = z.infer<typeof PricingLineItemSchema>;

export const PricingResultSchema = z.object({
  planVersionId: z.string().uuid(),
  tenantId: z.string().uuid(),
  evaluationDate: z.string().datetime(),
  billingPeriodStart: z.string().datetime(),
  billingPeriodEnd: z.string().datetime(),
  lineItems: z.array(PricingLineItemSchema),
  subtotal: z.number().nonnegative(),
  total: z.number().nonnegative(),
  currency: CurrencySchema,
  computedAt: z.string().datetime(),
  deterministic: z.literal(true),
});
export type PricingResult = z.infer<typeof PricingResultSchema>;

export function validatePricingContext(data: unknown): PricingContext {
  return PricingContextSchema.parse(data);
}

export function validatePricingResult(data: unknown): PricingResult {
  return PricingResultSchema.parse(data);
}
