# Risk Register

## Critical risks

### 1. Persistence gap
- Description: The current actions layer is a stub and cannot support real persistence.
- Probability: High
- Impact: Critical
- Mitigation: Establish a real backend contract before expanding the data model.
- Rollback strategy: Keep the current UI store layer isolated behind a compatibility adapter while the backend contract is introduced.

### 2. Missing auth boundary
- Description: No authentication or authorization model is present.
- Probability: High
- Impact: Critical
- Mitigation: Define identity, roles, and access policies before any multi-user feature work.
- Rollback strategy: Keep feature access scoped to local-only or demo mode until auth is defined.

## High risks

### 3. Architectural duplication
- Description: Components/modules and state/store layers overlap.
- Probability: High
- Impact: High
- Mitigation: Define and enforce a single canonical implementation surface.
- Rollback strategy: Keep shims temporarily in place while migration occurs.

### 4. Editor complexity
- Description: The editor implementation is broad and highly coupled.
- Probability: High
- Impact: High
- Mitigation: Decompose editor responsibilities before introducing major new behaviors.
- Rollback strategy: Keep current editor flows behind a stability layer while migrating incrementally.

## Medium risks

### 5. Tooling drift
- Description: The lint script is not functioning correctly in this environment.
- Probability: Medium
- Impact: Medium
- Mitigation: Normalize the developer quality workflow before heavier migration work.
- Rollback strategy: Use build verification and manual review until tooling is corrected.

### 6. Limited regression safety
- Description: There is no evidence of a mature automated test layer.
- Probability: Medium
- Impact: Medium
- Mitigation: Add regression tests around core flows as migration proceeds.
- Rollback strategy: Retain feature-level manual checks during the transition period.

## Low risks

### 7. TypeScript config deprecations
- Description: Current TypeScript settings show deprecation warnings.
- Probability: Low
- Impact: Low
- Mitigation: Update configuration in a later maintenance step.
- Rollback strategy: Keep the current compiler behavior until migration planning is complete.
