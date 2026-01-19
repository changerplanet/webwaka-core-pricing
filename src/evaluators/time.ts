import { TimeBoundComponent } from '../models/pricing-components';
import { PricingContext, PricingLineItem } from '../models/pricing-context';

export function evaluateTimeBound(
  component: TimeBoundComponent,
  context: PricingContext
): PricingLineItem {
  const evaluationDate = new Date(context.evaluationDate);
  const validFrom = new Date(component.validFrom);
  const validTo = new Date(component.validTo);
  
  const isActive = evaluationDate >= validFrom && evaluationDate <= validTo;
  const amount = isActive ? component.amount : 0;

  return {
    componentId: component.id,
    componentName: component.name,
    componentType: 'time_bound',
    description: `Time-bound: ${component.name} (${isActive ? 'active' : 'inactive'})`,
    quantity: isActive ? 1 : 0,
    unitPrice: component.amount,
    amount,
    currency: component.currency,
    metadata: {
      validFrom: component.validFrom,
      validTo: component.validTo,
      isActive,
      billingPeriod: component.billingPeriod,
    },
  };
}
