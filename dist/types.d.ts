import { z } from 'zod';
export declare const CurrencySchema: z.ZodEnum<{
    NGN: "NGN";
    USD: "USD";
    EUR: "EUR";
    GBP: "GBP";
}>;
export type Currency = z.infer<typeof CurrencySchema>;
export declare const BillingPeriodSchema: z.ZodEnum<{
    daily: "daily";
    weekly: "weekly";
    monthly: "monthly";
    quarterly: "quarterly";
    yearly: "yearly";
}>;
export type BillingPeriod = z.infer<typeof BillingPeriodSchema>;
export declare const ComponentTypeSchema: z.ZodEnum<{
    flat: "flat";
    usage: "usage";
    seat: "seat";
    tiered: "tiered";
    time_bound: "time_bound";
}>;
export type ComponentType = z.infer<typeof ComponentTypeSchema>;
export declare const MoneySchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodEnum<{
        NGN: "NGN";
        USD: "USD";
        EUR: "EUR";
        GBP: "GBP";
    }>;
}, z.core.$strip>;
export type Money = z.infer<typeof MoneySchema>;
export declare const TierSchema: z.ZodObject<{
    from: z.ZodNumber;
    to: z.ZodOptional<z.ZodNumber>;
    unitPrice: z.ZodNumber;
    flatPrice: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type Tier = z.infer<typeof TierSchema>;
export declare const DEFAULT_CURRENCY: Currency;
