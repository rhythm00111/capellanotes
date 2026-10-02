/**
 * Utils Layer — Feature-Level Utility Functions
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * Owns all feature-level, pure utility functions used across multiple domains.
 * 
 * OWNERSHIP RULES:
 * - Feature-level utils: Pure functions used across multiple domains
 * - Domain-level utils: Domain-specific helpers used only within that domain
 * 
 * PATTERN:
 * - Feature-level utils (utils/): Cross-domain, stateless helper functions
 * - Domain-level utils (<domain>/utils/): Domain-specific, exported through domain barrel
 * - Utils should be pure functions with no side effects
 * 
 * GUIDELINE:
 * If a utility is used by multiple domains ? utils/
 * If a utility is domain-specific ? <domain>/utils/
 * If a utility has side effects ? consider services/ instead
 * 
 * CANONICAL IMPORT PATH:
 * - @/notes/utils or @/notes
 */

// Utils barrel
// Canonical helper exports for the Notes feature.
export * from './notes.helpers';
