import { z } from 'zod';
export declare const FlatFeeComponentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"flat">;
    amount: z.ZodNumber;
    billingPeriod: z.ZodEnum<{
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        quarterly: "quarterly";
        yearly: "yearly";
    }>;
}, z.core.$strip>;
export type FlatFeeComponent = z.infer<typeof FlatFeeComponentSchema>;
export declare const UsageComponentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"usage">;
    metricName: z.ZodString;
    unitPrice: z.ZodNumber;
    includedUnits: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type UsageComponent = z.infer<typeof UsageComponentSchema>;
export declare const SeatComponentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"seat">;
    pricePerSeat: z.ZodNumber;
    minSeats: z.ZodDefault<z.ZodNumber>;
    maxSeats: z.ZodOptional<z.ZodNumber>;
    billingPeriod: z.ZodEnum<{
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        quarterly: "quarterly";
        yearly: "yearly";
    }>;
}, z.core.$strip>;
export type SeatComponent = z.infer<typeof SeatComponentSchema>;
export declare const TieredComponentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"tiered">;
    metricName: z.ZodString;
    tiers: z.ZodArray<z.ZodObject<{
        from: z.ZodNumber;
        to: z.ZodOptional<z.ZodNumber>;
        unitPrice: z.ZodNumber;
        flatPrice: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    graduated: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type TieredComponent = z.infer<typeof TieredComponentSchema>;
export declare const TimeBoundComponentSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"time_bound">;
    amount: z.ZodNumber;
    validFrom: z.ZodString;
    validTo: z.ZodString;
    billingPeriod: z.ZodEnum<{
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        quarterly: "quarterly";
        yearly: "yearly";
    }>;
}, z.core.$strip>;
export type TimeBoundComponent = z.infer<typeof TimeBoundComponentSchema>;
export declare const PricingComponentSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"flat">;
    amount: z.ZodNumber;
    billingPeriod: z.ZodEnum<{
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        quarterly: "quarterly";
        yearly: "yearly";
    }>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"usage">;
    metricName: z.ZodString;
    unitPrice: z.ZodNumber;
    includedUnits: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"seat">;
    pricePerSeat: z.ZodNumber;
    minSeats: z.ZodDefault<z.ZodNumber>;
    maxSeats: z.ZodOptional<z.ZodNumber>;
    billingPeriod: z.ZodEnum<{
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        quarterly: "quarterly";
        yearly: "yearly";
    }>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"tiered">;
    metricName: z.ZodString;
    tiers: z.ZodArray<z.ZodObject<{
        from: z.ZodNumber;
        to: z.ZodOptional<z.ZodNumber>;
        unitPrice: z.ZodNumber;
        flatPrice: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    graduated: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    type: z.ZodLiteral<"time_bound">;
    amount: z.ZodNumber;
    validFrom: z.ZodString;
    validTo: z.ZodString;
    billingPeriod: z.ZodEnum<{
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        quarterly: "quarterly";
        yearly: "yearly";
    }>;
}, z.core.$strip>], "type">;
export type PricingComponent = z.infer<typeof PricingComponentSchema>;
