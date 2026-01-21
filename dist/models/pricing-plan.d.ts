import { z } from 'zod';
export declare const PricingPlanVersionSchema: z.ZodObject<{
    id: z.ZodString;
    planId: z.ZodString;
    version: z.ZodNumber;
    effectiveFrom: z.ZodString;
    effectiveTo: z.ZodOptional<z.ZodString>;
    components: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
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
    }, z.core.$strip>], "type">>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    createdAt: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type PricingPlanVersion = z.infer<typeof PricingPlanVersionSchema>;
export declare const PricingPlanSchema: z.ZodObject<{
    id: z.ZodString;
    tenantId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    defaultBillingPeriod: z.ZodDefault<z.ZodEnum<{
        daily: "daily";
        weekly: "weekly";
        monthly: "monthly";
        quarterly: "quarterly";
        yearly: "yearly";
    }>>;
    currency: z.ZodDefault<z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>>;
    versions: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        planId: z.ZodString;
        version: z.ZodNumber;
        effectiveFrom: z.ZodString;
        effectiveTo: z.ZodOptional<z.ZodString>;
        components: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
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
        }, z.core.$strip>], "type">>;
        currency: z.ZodDefault<z.ZodEnum<{
            NGN: "NGN";
            USD: "USD";
            EUR: "EUR";
            GBP: "GBP";
        }>>;
        createdAt: z.ZodString;
        isActive: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    isArchived: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type PricingPlan = z.infer<typeof PricingPlanSchema>;
export declare function validatePricingPlan(data: unknown): PricingPlan;
export declare function validatePricingPlanVersion(data: unknown): PricingPlanVersion;
