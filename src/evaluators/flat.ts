import { FlatFeeComponent } from '../models/pricing-components';
import { PricingContext, PricingLineItem } from '../models/pricing-context';

export function evaluateFlatFee(
  component: FlatFeeComponent,
  context: PricingContext
): PricingLineItem {
  return {
    componentId: component.id,
    componentName: component.name,
    componentType: 'flat',
    description: `Flat fee: ${component.name}`,
    quantity: 1,
    unitPrice: component.amount,
    amount: component.amount,
    currency: component.currency,
    metadata: {
      billingPeriod: component.billingPeriod,
    },
  };
}
