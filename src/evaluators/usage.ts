import { UsageComponent } from '../models/pricing-components';
import { PricingContext, PricingLineItem } from '../models/pricing-context';

export function evaluateUsage(
  component: UsageComponent,
  context: PricingContext
): PricingLineItem {
  const usageMetric = context.usageMetrics.find(
    (m) => m.metricName === component.metricName
  );
  
  const totalQuantity = usageMetric?.quantity ?? 0;
  const billableQuantity = Math.max(0, totalQuantity - component.includedUnits);
  const amount = billableQuantity * component.unitPrice;

  return {
    componentId: component.id,
    componentName: component.name,
    componentType: 'usage',
    description: `Usage: ${component.metricName} (${billableQuantity} billable units)`,
    quantity: billableQuantity,
    unitPrice: component.unitPrice,
    amount,
    currency: component.currency,
    metadata: {
      metricName: component.metricName,
      totalQuantity,
      includedUnits: component.includedUnits,
      billableQuantity,
    },
  };
}
