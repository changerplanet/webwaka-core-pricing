import { PricingPlanVersion } from '../models/pricing-plan';
import { PricingContext, PricingResult } from '../models/pricing-context';
export declare class PricingEngine {
    evaluate(planVersion: PricingPlanVersion, context: PricingContext): PricingResult;
    private evaluateComponent;
}
export declare function createPricingEngine(): PricingEngine;
