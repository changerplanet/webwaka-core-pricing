import { SeatComponent } from '../models/pricing-components';
import { PricingContext, PricingLineItem } from '../models/pricing-context';

export function evaluateSeat(
  component: SeatComponent,
  context: PricingContext
): PricingLineItem {
  const requestedSeats = context.seatCount;
  const effectiveSeats = Math.max(component.minSeats, requestedSeats);
  const finalSeats = component.maxSeats 
    ? Math.min(effectiveSeats, component.maxSeats) 
    : effectiveSeats;
  
  const amount = finalSeats * component.pricePerSeat;

  return {
    componentId: component.id,
    componentName: component.name,
    componentType: 'seat',
    description: `Seat pricing: ${finalSeats} seats @ ${component.pricePerSeat}`,
    quantity: finalSeats,
    unitPrice: component.pricePerSeat,
    amount,
    currency: component.currency,
    metadata: {
      requestedSeats,
      effectiveSeats: finalSeats,
      minSeats: component.minSeats,
      maxSeats: component.maxSeats,
      billingPeriod: component.billingPeriod,
    },
  };
}
