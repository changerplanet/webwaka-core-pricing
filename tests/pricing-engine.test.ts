import { describe, it, expect, beforeEach } from 'vitest';
import {
  PricingEngine,
  createPricingEngine,
  PricingPlanVersion,
  PricingContext,
  PricingResult,
  FlatFeeComponent,
  UsageComponent,
  SeatComponent,
  TieredComponent,
  TimeBoundComponent,
  PricingPlanVersionSchema,
  PricingContextSchema,
  PricingResultSchema,
  DEFAULT_CURRENCY,
} from '../src';

function createUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function createBasePlanVersion(components: any[]): PricingPlanVersion {
  const now = new Date().toISOString();
  return {
    id: createUUID(),
    planId: createUUID(),
    version: 1,
    effectiveFrom: now,
    effectiveTo: undefined,
    components,
    currency: 'NGN',
    createdAt: now,
    isActive: true,
  };
}

function createBaseContext(overrides: Partial<PricingContext> = {}): PricingContext {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    tenantId: createUUID(),
    evaluationDate: now.toISOString(),
    billingPeriodStart: start.toISOString(),
    billingPeriodEnd: end.toISOString(),
    seatCount: 1,
    usageMetrics: [],
    currency: 'NGN',
    ...overrides,
  };
}

describe('PricingEngine', () => {
  let engine: PricingEngine;

  beforeEach(() => {
    engine = createPricingEngine();
  });

  describe('Determinism', () => {
    it('produces identical results for identical inputs', () => {
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Base Fee',
        type: 'flat',
        amount: 5000,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const context = createBaseContext();

      const result1 = engine.evaluate(planVersion, context);
      const result2 = engine.evaluate(planVersion, context);

      expect(result1.total).toBe(result2.total);
      expect(result1.subtotal).toBe(result2.subtotal);
      expect(result1.lineItems.length).toBe(result2.lineItems.length);
      expect(result1.lineItems[0].amount).toBe(result2.lineItems[0].amount);
      expect(result1.deterministic).toBe(true);
      expect(result2.deterministic).toBe(true);
      expect(result1.computedAt).toBe(result2.computedAt);
      expect(result1.computedAt).toBe(context.evaluationDate);
    });

    it('same input always produces same output (HARD STOP TEST)', () => {
      const components = [
        {
          id: createUUID(),
          name: 'Base Subscription',
          type: 'flat' as const,
          amount: 10000,
          currency: 'NGN' as const,
          billingPeriod: 'monthly' as const,
        },
        {
          id: createUUID(),
          name: 'API Calls',
          type: 'usage' as const,
          metricName: 'api_calls',
          unitPrice: 0.5,
          currency: 'NGN' as const,
          includedUnits: 1000,
        },
      ];

      const planVersion = createBasePlanVersion(components);
      const context = createBaseContext({
        usageMetrics: [{ metricName: 'api_calls', quantity: 1500 }],
      });

      const results: PricingResult[] = [];
      for (let i = 0; i < 10; i++) {
        results.push(engine.evaluate(planVersion, context));
      }

      const firstResult = results[0];
      for (const result of results) {
        expect(result.total).toBe(firstResult.total);
        expect(result.subtotal).toBe(firstResult.subtotal);
        expect(result.deterministic).toBe(true);
        expect(result.lineItems.length).toBe(firstResult.lineItems.length);
        expect(result.computedAt).toBe(firstResult.computedAt);
      }
    });
  });

  describe('Immutability of plan versions', () => {
    it('does not mutate the input plan version', () => {
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Standard Plan',
        type: 'flat',
        amount: 15000,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const originalPlanVersionJson = JSON.stringify(planVersion);

      engine.evaluate(planVersion, createBaseContext());

      expect(JSON.stringify(planVersion)).toBe(originalPlanVersionJson);
    });

    it('does not mutate the input context', () => {
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Test Plan',
        type: 'flat',
        amount: 5000,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const context = createBaseContext();
      const originalContextJson = JSON.stringify(context);

      engine.evaluate(planVersion, context);

      expect(JSON.stringify(context)).toBe(originalContextJson);
    });
  });

  describe('Flat Fee Component', () => {
    it('evaluates flat fee correctly', () => {
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Monthly Subscription',
        type: 'flat',
        amount: 25000,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const result = engine.evaluate(planVersion, createBaseContext());

      expect(result.lineItems).toHaveLength(1);
      expect(result.lineItems[0].amount).toBe(25000);
      expect(result.lineItems[0].componentType).toBe('flat');
      expect(result.total).toBe(25000);
    });

    it('handles zero flat fee', () => {
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Free Tier',
        type: 'flat',
        amount: 0,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const result = engine.evaluate(planVersion, createBaseContext());

      expect(result.total).toBe(0);
    });
  });

  describe('Usage Component', () => {
    it('evaluates usage pricing correctly', () => {
      const usageComponent: UsageComponent = {
        id: createUUID(),
        name: 'API Calls',
        type: 'usage',
        metricName: 'api_calls',
        unitPrice: 0.1,
        currency: 'NGN',
        includedUnits: 100,
      };

      const planVersion = createBasePlanVersion([usageComponent]);
      const context = createBaseContext({
        usageMetrics: [{ metricName: 'api_calls', quantity: 500 }],
      });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].quantity).toBe(400);
      expect(result.lineItems[0].amount).toBe(40);
      expect(result.total).toBe(40);
    });

    it('handles usage within included units', () => {
      const usageComponent: UsageComponent = {
        id: createUUID(),
        name: 'Messages',
        type: 'usage',
        metricName: 'messages',
        unitPrice: 1,
        currency: 'NGN',
        includedUnits: 1000,
      };

      const planVersion = createBasePlanVersion([usageComponent]);
      const context = createBaseContext({
        usageMetrics: [{ metricName: 'messages', quantity: 500 }],
      });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].quantity).toBe(0);
      expect(result.lineItems[0].amount).toBe(0);
      expect(result.total).toBe(0);
    });

    it('handles missing usage metric', () => {
      const usageComponent: UsageComponent = {
        id: createUUID(),
        name: 'Storage',
        type: 'usage',
        metricName: 'storage_gb',
        unitPrice: 100,
        currency: 'NGN',
        includedUnits: 5,
      };

      const planVersion = createBasePlanVersion([usageComponent]);
      const context = createBaseContext({ usageMetrics: [] });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].quantity).toBe(0);
      expect(result.lineItems[0].amount).toBe(0);
    });
  });

  describe('Seat Component', () => {
    it('evaluates seat pricing correctly', () => {
      const seatComponent: SeatComponent = {
        id: createUUID(),
        name: 'User Seats',
        type: 'seat',
        pricePerSeat: 2000,
        minSeats: 1,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([seatComponent]);
      const context = createBaseContext({ seatCount: 5 });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].quantity).toBe(5);
      expect(result.lineItems[0].amount).toBe(10000);
      expect(result.total).toBe(10000);
    });

    it('enforces minimum seats', () => {
      const seatComponent: SeatComponent = {
        id: createUUID(),
        name: 'Team Seats',
        type: 'seat',
        pricePerSeat: 3000,
        minSeats: 3,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([seatComponent]);
      const context = createBaseContext({ seatCount: 1 });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].quantity).toBe(3);
      expect(result.lineItems[0].amount).toBe(9000);
    });

    it('enforces maximum seats', () => {
      const seatComponent: SeatComponent = {
        id: createUUID(),
        name: 'Enterprise Seats',
        type: 'seat',
        pricePerSeat: 5000,
        minSeats: 1,
        maxSeats: 10,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([seatComponent]);
      const context = createBaseContext({ seatCount: 20 });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].quantity).toBe(10);
      expect(result.lineItems[0].amount).toBe(50000);
    });
  });

  describe('Tiered Component', () => {
    it('evaluates volume tiered pricing correctly', () => {
      const tieredComponent: TieredComponent = {
        id: createUUID(),
        name: 'Storage Tiers',
        type: 'tiered',
        metricName: 'storage_gb',
        currency: 'NGN',
        graduated: false,
        tiers: [
          { from: 0, to: 100, unitPrice: 50 },
          { from: 100, to: 500, unitPrice: 40 },
          { from: 500, unitPrice: 30 },
        ],
      };

      const planVersion = createBasePlanVersion([tieredComponent]);
      const context = createBaseContext({
        usageMetrics: [{ metricName: 'storage_gb', quantity: 75 }],
      });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].amount).toBe(3750);
    });

    it('evaluates graduated tiered pricing correctly', () => {
      const tieredComponent: TieredComponent = {
        id: createUUID(),
        name: 'API Tiers',
        type: 'tiered',
        metricName: 'api_calls',
        currency: 'NGN',
        graduated: true,
        tiers: [
          { from: 0, to: 100, unitPrice: 10 },
          { from: 100, to: 500, unitPrice: 8 },
          { from: 500, unitPrice: 5 },
        ],
      };

      const planVersion = createBasePlanVersion([tieredComponent]);
      const context = createBaseContext({
        usageMetrics: [{ metricName: 'api_calls', quantity: 250 }],
      });

      const result = engine.evaluate(planVersion, context);

      const expectedAmount = 100 * 10 + 150 * 8;
      expect(result.lineItems[0].amount).toBe(expectedAmount);
    });

    it('handles zero usage in tiered pricing', () => {
      const tieredComponent: TieredComponent = {
        id: createUUID(),
        name: 'Bandwidth',
        type: 'tiered',
        metricName: 'bandwidth_gb',
        currency: 'NGN',
        graduated: false,
        tiers: [{ from: 0, to: 100, unitPrice: 10 }],
      };

      const planVersion = createBasePlanVersion([tieredComponent]);
      const context = createBaseContext({ usageMetrics: [] });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].amount).toBe(0);
    });
  });

  describe('Time-Bound Component', () => {
    it('evaluates active time-bound component', () => {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const timeComponent: TimeBoundComponent = {
        id: createUUID(),
        name: 'Promotional Rate',
        type: 'time_bound',
        amount: 7500,
        validFrom: yesterday.toISOString(),
        validTo: tomorrow.toISOString(),
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([timeComponent]);
      const context = createBaseContext({ evaluationDate: now.toISOString() });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].amount).toBe(7500);
      expect(result.lineItems[0].metadata?.isActive).toBe(true);
    });

    it('evaluates inactive time-bound component (expired)', () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const timeComponent: TimeBoundComponent = {
        id: createUUID(),
        name: 'Expired Promo',
        type: 'time_bound',
        amount: 5000,
        validFrom: twoDaysAgo.toISOString(),
        validTo: yesterday.toISOString(),
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([timeComponent]);
      const context = createBaseContext({ evaluationDate: now.toISOString() });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].amount).toBe(0);
      expect(result.lineItems[0].metadata?.isActive).toBe(false);
    });

    it('evaluates inactive time-bound component (not yet started)', () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const timeComponent: TimeBoundComponent = {
        id: createUUID(),
        name: 'Future Promo',
        type: 'time_bound',
        amount: 3000,
        validFrom: tomorrow.toISOString(),
        validTo: nextWeek.toISOString(),
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([timeComponent]);
      const context = createBaseContext({ evaluationDate: now.toISOString() });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems[0].amount).toBe(0);
      expect(result.lineItems[0].metadata?.isActive).toBe(false);
    });
  });

  describe('Tenant Isolation', () => {
    it('result contains the correct tenantId from context', () => {
      const tenantId = createUUID();
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Basic Plan',
        type: 'flat',
        amount: 5000,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const context = createBaseContext({ tenantId });

      const result = engine.evaluate(planVersion, context);

      expect(result.tenantId).toBe(tenantId);
    });

    it('different tenants get independent results', () => {
      const tenant1 = createUUID();
      const tenant2 = createUUID();

      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Standard',
        type: 'flat',
        amount: 10000,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const context1 = createBaseContext({ tenantId: tenant1 });
      const context2 = createBaseContext({ tenantId: tenant2 });

      const result1 = engine.evaluate(planVersion, context1);
      const result2 = engine.evaluate(planVersion, context2);

      expect(result1.tenantId).toBe(tenant1);
      expect(result2.tenantId).toBe(tenant2);
      expect(result1.tenantId).not.toBe(result2.tenantId);
    });
  });

  describe('Nigeria-First Defaults (NGN)', () => {
    it('defaults to NGN currency', () => {
      expect(DEFAULT_CURRENCY).toBe('NGN');
    });

    it('result uses NGN when context specifies NGN', () => {
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Nigerian Plan',
        type: 'flat',
        amount: 50000,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const context = createBaseContext({ currency: 'NGN' });

      const result = engine.evaluate(planVersion, context);

      expect(result.currency).toBe('NGN');
    });

    it('supports other currencies when specified', () => {
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'USD Plan',
        type: 'flat',
        amount: 50,
        currency: 'USD',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const context = createBaseContext({ currency: 'USD' });

      const result = engine.evaluate(planVersion, context);

      expect(result.currency).toBe('USD');
    });
  });

  describe('Multiple Components', () => {
    it('evaluates multiple components and sums correctly', () => {
      const components = [
        {
          id: createUUID(),
          name: 'Base Fee',
          type: 'flat' as const,
          amount: 10000,
          currency: 'NGN' as const,
          billingPeriod: 'monthly' as const,
        },
        {
          id: createUUID(),
          name: 'Per Seat',
          type: 'seat' as const,
          pricePerSeat: 2000,
          minSeats: 1,
          currency: 'NGN' as const,
          billingPeriod: 'monthly' as const,
        },
        {
          id: createUUID(),
          name: 'API Calls',
          type: 'usage' as const,
          metricName: 'api_calls',
          unitPrice: 0.5,
          includedUnits: 1000,
          currency: 'NGN' as const,
        },
      ];

      const planVersion = createBasePlanVersion(components);
      const context = createBaseContext({
        seatCount: 5,
        usageMetrics: [{ metricName: 'api_calls', quantity: 2000 }],
      });

      const result = engine.evaluate(planVersion, context);

      expect(result.lineItems).toHaveLength(3);
      const flatFee = 10000;
      const seatFee = 5 * 2000;
      const usageFee = (2000 - 1000) * 0.5;
      const expectedTotal = flatFee + seatFee + usageFee;
      expect(result.total).toBe(expectedTotal);
    });
  });

  describe('Ledger Compatibility', () => {
    it('produces ledger-ready result structure', () => {
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Pro Plan',
        type: 'flat',
        amount: 25000,
        currency: 'NGN',
        billingPeriod: 'monthly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const context = createBaseContext();

      const result = engine.evaluate(planVersion, context);

      expect(result).toHaveProperty('planVersionId');
      expect(result).toHaveProperty('tenantId');
      expect(result).toHaveProperty('evaluationDate');
      expect(result).toHaveProperty('billingPeriodStart');
      expect(result).toHaveProperty('billingPeriodEnd');
      expect(result).toHaveProperty('lineItems');
      expect(result).toHaveProperty('subtotal');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('currency');
      expect(result).toHaveProperty('computedAt');
      expect(result).toHaveProperty('deterministic');
      expect(result.deterministic).toBe(true);

      for (const lineItem of result.lineItems) {
        expect(lineItem).toHaveProperty('componentId');
        expect(lineItem).toHaveProperty('componentName');
        expect(lineItem).toHaveProperty('componentType');
        expect(lineItem).toHaveProperty('description');
        expect(lineItem).toHaveProperty('quantity');
        expect(lineItem).toHaveProperty('unitPrice');
        expect(lineItem).toHaveProperty('amount');
        expect(lineItem).toHaveProperty('currency');
      }
    });
  });

  describe('Zod Validation', () => {
    it('validates pricing context schema', () => {
      const validContext = {
        tenantId: createUUID(),
        evaluationDate: new Date().toISOString(),
        billingPeriodStart: new Date().toISOString(),
        billingPeriodEnd: new Date().toISOString(),
        seatCount: 5,
        usageMetrics: [{ metricName: 'api_calls', quantity: 100 }],
        currency: 'NGN',
      };

      expect(() => PricingContextSchema.parse(validContext)).not.toThrow();
    });

    it('rejects invalid pricing context', () => {
      const invalidContext = {
        tenantId: 'not-a-uuid',
        evaluationDate: 'invalid-date',
      };

      expect(() => PricingContextSchema.parse(invalidContext)).toThrow();
    });

    it('validates pricing plan version schema', () => {
      const flatComponent = {
        id: createUUID(),
        name: 'Test',
        type: 'flat' as const,
        amount: 100,
        currency: 'NGN' as const,
        billingPeriod: 'monthly' as const,
      };

      const validPlanVersion = {
        id: createUUID(),
        planId: createUUID(),
        version: 1,
        effectiveFrom: new Date().toISOString(),
        components: [flatComponent],
        currency: 'NGN',
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      expect(() => PricingPlanVersionSchema.parse(validPlanVersion)).not.toThrow();
    });

    it('rejects plan version with empty components', () => {
      const invalidPlanVersion = {
        id: createUUID(),
        planId: createUUID(),
        version: 1,
        effectiveFrom: new Date().toISOString(),
        components: [],
        currency: 'NGN',
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      expect(() => PricingPlanVersionSchema.parse(invalidPlanVersion)).toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles very large numbers', () => {
      const flatComponent: FlatFeeComponent = {
        id: createUUID(),
        name: 'Enterprise',
        type: 'flat',
        amount: 10000000000,
        currency: 'NGN',
        billingPeriod: 'yearly',
      };

      const planVersion = createBasePlanVersion([flatComponent]);
      const result = engine.evaluate(planVersion, createBaseContext());

      expect(result.total).toBe(10000000000);
    });

    it('handles decimal precision in usage', () => {
      const usageComponent: UsageComponent = {
        id: createUUID(),
        name: 'Compute',
        type: 'usage',
        metricName: 'compute_minutes',
        unitPrice: 0.001,
        currency: 'NGN',
        includedUnits: 0,
      };

      const planVersion = createBasePlanVersion([usageComponent]);
      const context = createBaseContext({
        usageMetrics: [{ metricName: 'compute_minutes', quantity: 12345 }],
      });

      const result = engine.evaluate(planVersion, context);

      expect(result.total).toBeCloseTo(12.345, 3);
    });
  });
});

describe('HARD STOP TEST - Pricing Engine Scope Verification', () => {
  it('Given a PricingPlanVersion and PricingContext, the engine produces a deterministic, ledger-ready PricingResult without touching payments, subscriptions, or incentives', () => {
    const engine = createPricingEngine();

    const planVersion: PricingPlanVersion = {
      id: createUUID(),
      planId: createUUID(),
      version: 1,
      effectiveFrom: new Date().toISOString(),
      components: [
        {
          id: createUUID(),
          name: 'Professional Plan',
          type: 'flat',
          amount: 49900,
          currency: 'NGN',
          billingPeriod: 'monthly',
        },
        {
          id: createUUID(),
          name: 'Additional Users',
          type: 'seat',
          pricePerSeat: 9900,
          minSeats: 1,
          currency: 'NGN',
          billingPeriod: 'monthly',
        },
        {
          id: createUUID(),
          name: 'API Usage',
          type: 'usage',
          metricName: 'api_requests',
          unitPrice: 0.01,
          includedUnits: 10000,
          currency: 'NGN',
        },
      ],
      currency: 'NGN',
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const context: PricingContext = {
      tenantId: createUUID(),
      evaluationDate: new Date().toISOString(),
      billingPeriodStart: new Date(2025, 0, 1).toISOString(),
      billingPeriodEnd: new Date(2025, 0, 31).toISOString(),
      seatCount: 3,
      usageMetrics: [{ metricName: 'api_requests', quantity: 15000 }],
      currency: 'NGN',
    };

    const result1 = engine.evaluate(planVersion, context);
    const result2 = engine.evaluate(planVersion, context);

    expect(result1.deterministic).toBe(true);
    expect(result2.deterministic).toBe(true);
    expect(result1.total).toBe(result2.total);
    expect(result1.subtotal).toBe(result2.subtotal);
    expect(result1.lineItems.length).toBe(result2.lineItems.length);

    expect(result1).toHaveProperty('planVersionId');
    expect(result1).toHaveProperty('tenantId');
    expect(result1).toHaveProperty('lineItems');
    expect(result1).toHaveProperty('total');
    expect(result1).toHaveProperty('currency');
    expect(result1.currency).toBe('NGN');

    expect(result1).not.toHaveProperty('paymentId');
    expect(result1).not.toHaveProperty('subscriptionState');
    expect(result1).not.toHaveProperty('discountApplied');
    expect(result1).not.toHaveProperty('couponCode');
    expect(result1).not.toHaveProperty('taxAmount');

    const expectedFlatFee = 49900;
    const expectedSeatFee = 3 * 9900;
    const expectedUsageFee = (15000 - 10000) * 0.01;
    const expectedTotal = expectedFlatFee + expectedSeatFee + expectedUsageFee;
    expect(result1.total).toBe(expectedTotal);
  });
});
