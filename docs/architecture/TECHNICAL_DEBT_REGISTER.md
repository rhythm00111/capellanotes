# Technical Debt Register

## Critical
### 1. Stubbed persistence layer
- Why it exists: the action implementations currently delay and return empty or placeholder values instead of using a real data backend.
- Migration impact: high; the current data layer cannot support real persistence, sync, or collaboration.
- Maintenance cost: high; the UI layer and store logic have already assumed a more mature backend contract.

### 2. Missing authentication and authorization boundaries
- Why it exists: no auth flow or permission system was found in the repository.
- Migration impact: critical; any real SaaS use will require a formal identity and access model.
- Maintenance cost: high; application security and product boundaries cannot be safely expanded without this.

## High
### 3. Duplicate architecture surfaces
- Why it exists: the feature has overlapping component/module and state/store layers.
- Migration impact: high; every future migration will need to resolve the canonical surface.
- Maintenance cost: high; developers must navigate ambiguity.

### 4. Overloaded editor implementation
- Why it exists: the main editor orchestration files combine rendering, state, navigation, persistence, and UI behavior.
- Migration impact: high; the editor will be hard to split, test, or evolve if left as-is.
- Maintenance cost: high; future editor enhancements will increase complexity.

### 5. Feature-level public API churn
- Why it exists: the feature exports from many layers and compatibility shims.
- Migration impact: medium-high; import stability is weaker than it should be.
- Maintenance cost: medium-high; deep imports and barrel churn can break future consumers.

## Medium
### 6. Incomplete tooling hygiene
- Why it exists: the current lint script is not functioning as expected in this environment.
- Migration impact: medium; developer confidence is reduced.
- Maintenance cost: medium; CI and quality gates will be harder to trust.

### 7. Limited test coverage evidence
- Why it exists: there are no test files or obvious automated regression infrastructure in the repository.
- Migration impact: medium; migration safety will be lower.
- Maintenance cost: medium; regressions may be harder to catch.

## Low
### 8. Minor type-configuration warnings
- Why it exists: TypeScript configuration still uses older settings that raise deprecation warnings.
- Migration impact: low.
- Maintenance cost: low.
