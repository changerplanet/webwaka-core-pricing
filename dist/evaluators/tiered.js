"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateTiered = evaluateTiered;
function calculateGraduatedTierAmount(tiers, quantity) {
    let remaining = quantity;
    let total = 0;
    for (const tier of tiers) {
        if (remaining <= 0)
            break;
        const tierMax = tier.to ?? Infinity;
        const tierRange = tierMax - tier.from;
        const unitsInTier = Math.min(remaining, tierRange);
        total += unitsInTier * tier.unitPrice;
        if (tier.flatPrice && unitsInTier > 0) {
            total += tier.flatPrice;
        }
        remaining -= unitsInTier;
    }
    return total;
}
function calculateVolumeTierAmount(tiers, quantity) {
    const applicableTier = tiers.find((tier) => {
        const max = tier.to ?? Infinity;
        return quantity >= tier.from && quantity < max;
    });
    if (!applicableTier) {
        const lastTier = tiers[tiers.length - 1];
        return quantity * lastTier.unitPrice + (lastTier.flatPrice ?? 0);
    }
    return quantity * applicableTier.unitPrice + (applicableTier.flatPrice ?? 0);
}
function evaluateTiered(component, context) {
    const usageMetric = context.usageMetrics.find((m) => m.metricName === component.metricName);
    const quantity = usageMetric?.quantity ?? 0;
    const amount = component.graduated
        ? calculateGraduatedTierAmount(component.tiers, quantity)
        : calculateVolumeTierAmount(component.tiers, quantity);
    return {
        componentId: component.id,
        componentName: component.name,
        componentType: 'tiered',
        description: `Tiered pricing: ${component.metricName} (${quantity} units, ${component.graduated ? 'graduated' : 'volume'})`,
        quantity,
        unitPrice: quantity > 0 ? amount / quantity : 0,
        amount,
        currency: component.currency,
        metadata: {
            metricName: component.metricName,
            graduated: component.graduated,
            tierCount: component.tiers.length,
        },
    };
}
