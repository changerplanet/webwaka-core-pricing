import { UsageComponent } from '../models/pricing-components';
import { PricingContext, PricingLineItem } from '../models/pricing-context';
export declare function evaluateUsage(component: UsageComponent, context: PricingContext): PricingLineItem;
