import { PricingPlanVersion } from '../models/pricing-plan';
import { PricingContext, PricingResult, PricingLineItem } from '../models/pricing-context';
import { PricingComponent } from '../models/pricing-components';
import { evaluateFlatFee } from '../evaluators/flat';
import { evaluateUsage } from '../evaluators/usage';
import { evaluateSeat } from '../evaluators/seat';
import { evaluateTiered } from '../evaluators/tiered';
import { evaluateTimeBound } from '../evaluators/time';

export class PricingEngine {
  evaluate(
    planVersion: PricingPlanVersion,
    context: PricingContext
  ): PricingResult {
    const lineItems: PricingLineItem[] = [];

    for (const component of planVersion.components) {
      const lineItem = this.evaluateComponent(component, context);
      lineItems.push(lineItem);
    }

    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal;

    const result: PricingResult = {
      planVersionId: planVersion.id,
      tenantId: context.tenantId,
      evaluationDate: context.evaluationDate,
      billingPeriodStart: context.billingPeriodStart,
      billingPeriodEnd: context.billingPeriodEnd,
      lineItems,
      subtotal,
      total,
      currency: context.currency,
      computedAt: new Date().toISOString(),
      deterministic: true,
    };

    return result;
  }

  private evaluateComponent(
    component: PricingComponent,
    context: PricingContext
  ): PricingLineItem {
    switch (component.type) {
      case 'flat':
        return evaluateFlatFee(component, context);
      case 'usage':
        return evaluateUsage(component, context);
      case 'seat':
        return evaluateSeat(component, context);
      case 'tiered':
        return evaluateTiered(component, context);
      case 'time_bound':
        return evaluateTimeBound(component, context);
      default:
        const _exhaustive: never = component;
        throw new Error(`Unknown component type: ${(_exhaustive as PricingComponent).type}`);
    }
  }
}

export function createPricingEngine(): PricingEngine {
  return new PricingEngine();
}
