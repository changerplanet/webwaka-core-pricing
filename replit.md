# WebWaka Core Pricing

## Overview
This is a headless TypeScript library for pricing rules and discount management. It is part of the WebWaka Core Substrate and provides shared services for the WebWaka platform.

## Project Structure
```
src/           - TypeScript source files
dist/          - Compiled JavaScript output (generated)
```

## Development

### Build Commands
- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development (auto-recompile on changes)
- `npm test` - Run tests

### Workflow
The "TypeScript Build Watch" workflow runs `npm run dev` which watches for file changes and recompiles automatically.

## Architecture

This module provides:
- **PricingRule** - Defines pricing rules (percentage, fixed, tiered)
- **Discount** - Discount codes and their conditions
- **Entitlement** - Feature entitlements per user
- **PricingService** - Main service for price calculations

## Dependencies
- TypeScript (dev dependency)

## Notes
- This is a library module, not a standalone application
- No frontend or backend server - consumed by other WebWaka Suite modules
- All data is tenant-isolated via `tenantId`
