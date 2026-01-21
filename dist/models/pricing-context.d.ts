import { z } from 'zod';
export declare const UsageMetricSchema: z.ZodObject<{
    metricName: z.ZodString;
    quantity: z.ZodNumber;
}, z.core.$strip>;
export type UsageMetric = z.infer<typeof UsageMetricSchema>;
export declare const PricingContextSchema: z.ZodObject<{
    tenantId: z.ZodString;
    subscriptionId: z.ZodOptional<z.ZodString>;
    customerId: z.ZodOptional<z.ZodString>;
    evaluationDate: z.ZodString;
    billingPeriodStart: z.ZodString;
    billingPeriodEnd: z.ZodString;
    seatCount: z.ZodDefault<z.ZodNumber>;
    usageMetrics: z.ZodDefault<z.ZodArray<z.ZodObject<{
        metricName: z.ZodString;
        quantity: z.ZodNumber;
    }, z.core.$strip>>>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
}, z.core.$strip>;
export type PricingContext = z.infer<typeof PricingContextSchema>;
export declare const PricingLineItemSchema: z.ZodObject<{
    componentId: z.ZodString;
    componentName: z.ZodString;
    componentType: z.ZodString;
    description: z.ZodString;
    quantity: z.ZodNumber;
    unitPrice: z.ZodNumber;
    amount: z.ZodNumber;
    currency: z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type PricingLineItem = z.infer<typeof PricingLineItemSchema>;
export declare const PricingResultSchema: z.ZodObject<{
    planVersionId: z.ZodString;
    tenantId: z.ZodString;
    evaluationDate: z.ZodString;
    billingPeriodStart: z.ZodString;
    billingPeriodEnd: z.ZodString;
    lineItems: z.ZodArray<z.ZodObject<{
        componentId: z.ZodString;
        componentName: z.ZodString;
        componentType: z.ZodString;
        description: z.ZodString;
        quantity: z.ZodNumber;
        unitPrice: z.ZodNumber;
        amount: z.ZodNumber;
        currency: z.ZodEnum<{
            NGN: "NGN";
            USD: "USD";
            EUR: "EUR";
            GBP: "GBP";
        }>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    subtotal: z.ZodNumber;
    total: z.ZodNumber;
    currency: z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>;
    computedAt: z.ZodString;
    deterministic: z.ZodLiteral<true>;
}, z.core.$strip>;
export type PricingResult = z.infer<typeof PricingResultSchema>;
export declare function validatePricingContext(data: unknown): PricingContext;
export declare function validatePricingResult(data: unknown): PricingResult;
