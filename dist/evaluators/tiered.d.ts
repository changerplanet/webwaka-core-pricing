import { TieredComponent } from '../models/pricing-components';
import { PricingContext, PricingLineItem } from '../models/pricing-context';
export declare function evaluateTiered(component: TieredComponent, context: PricingContext): PricingLineItem;
