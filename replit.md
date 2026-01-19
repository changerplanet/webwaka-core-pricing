# WebWaka Core Pricing

## Overview
A headless TypeScript library for pricing rules and discount management. Part of the WebWaka Core Substrate providing shared services for the WebWaka platform.

## Project Structure
```
src/
  ├─ engine/
  │   └─ pricing-engine.ts      # Core PricingEngine class
  ├─ models/
  │   ├─ pricing-plan.ts        # PricingPlan & PricingPlanVersion
  │   ├─ pricing-components.ts  # All component types (Flat, Usage, Seat, Tiered, TimeBound)
  │   └─ pricing-context.ts     # Context, LineItem, Result models
  ├─ evaluators/
  │   ├─ flat.ts                # Flat fee evaluator
  │   ├─ usage.ts               # Usage-based evaluator
  │   ├─ seat.ts                # Seat-based evaluator
  │   ├─ tiered.ts              # Tiered pricing evaluator (volume & graduated)
  │   └─ time.ts                # Time-bound evaluator
  ├─ types.ts                   # Shared types (Currency, BillingPeriod, etc)
  └─ index.ts                   # Module exports
tests/
  └─ pricing-engine.test.ts     # Comprehensive test suite
dist/                           # Compiled output (generated)
```

## Development Commands
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode (auto-recompile on changes)
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` / `npm run typecheck` - Type checking

## Architecture

### Capabilities
- `pricing:evaluate` - Evaluate pricing for a plan version
- `pricing:plan.define` - Define pricing plans
- `pricing:plan.version` - Version pricing plans
- `pricing:preview` - Preview pricing calculations

### Dependencies
- `webwaka-core-ledger` - Ledger integration (output compatible)
- `webwaka-core-entitlements` - Entitlement checks

### Component Types
1. **FlatFeeComponent** - Fixed recurring charges
2. **UsageComponent** - Usage-based pricing with included units
3. **SeatComponent** - Per-seat pricing with min/max limits
4. **TieredComponent** - Tiered pricing (volume or graduated)
5. **TimeBoundComponent** - Time-limited pricing

### Design Principles
- Pure functions - No side effects
- Deterministic - Same input = same output
- Immutable - Never mutates inputs
- Ledger-ready - Output compatible with core-ledger
- Nigeria-first - NGN as default currency
- Tenant-isolated - All data scoped by tenantId

## Testing
- 32 tests covering all component types
- 89%+ code coverage
- Hard Stop test proving scope boundaries
