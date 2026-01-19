export interface PricingRule {
  id: string;
  tenantId: string;
  name: string;
  type: 'percentage' | 'fixed' | 'tiered';
  value: number;
  conditions?: PricingCondition[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin';
  value: unknown;
}

export interface Discount {
  id: string;
  tenantId: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: Date;
  validTo?: Date;
  active: boolean;
}

export interface Entitlement {
  id: string;
  tenantId: string;
  userId: string;
  feature: string;
  granted: boolean;
  expiresAt?: Date;
}

export interface PricingContext {
  tenantId: string;
  userId?: string;
  items: PricingItem[];
  discountCode?: string;
}

export interface PricingItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface PricingResult {
  subtotal: number;
  discountAmount: number;
  total: number;
  appliedRules: string[];
  appliedDiscount?: string;
}

export class PricingService {
  calculatePrice(context: PricingContext): PricingResult {
    const subtotal = context.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    return {
      subtotal,
      discountAmount: 0,
      total: subtotal,
      appliedRules: [],
    };
  }
}

export const VERSION = '0.0.0';
