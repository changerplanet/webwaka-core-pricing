import { z } from 'zod';
import { PricingComponentSchema } from './pricing-components';
import { CurrencySchema, BillingPeriodSchema, DEFAULT_CURRENCY } from '../types';

export const PricingPlanVersionSchema = z.object({
  id: z.string().uuid(),
  planId: z.string().uuid(),
  version: z.number().int().positive(),
  effectiveFrom: z.string().datetime(),
  effectiveTo: z.string().datetime().optional(),
  components: z.array(PricingComponentSchema).min(1),
  currency: CurrencySchema.default(DEFAULT_CURRENCY),
  createdAt: z.string().datetime(),
  isActive: z.boolean().default(true),
});
export type PricingPlanVersion = z.infer<typeof PricingPlanVersionSchema>;

export const PricingPlanSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  defaultBillingPeriod: BillingPeriodSchema.default('monthly'),
  currency: CurrencySchema.default(DEFAULT_CURRENCY),
  versions: z.array(PricingPlanVersionSchema).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isArchived: z.boolean().default(false),
});
export type PricingPlan = z.infer<typeof PricingPlanSchema>;

export function validatePricingPlan(data: unknown): PricingPlan {
  return PricingPlanSchema.parse(data);
}

export function validatePricingPlanVersion(data: unknown): PricingPlanVersion {
  return PricingPlanVersionSchema.parse(data);
}
