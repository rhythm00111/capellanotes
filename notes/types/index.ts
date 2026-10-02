/**
 * Types Layer — Feature-Level TypeScript Type Definitions
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * Owns all feature-level, cross-domain TypeScript types and interfaces.
 * 
 * OWNERSHIP RULES:
 * - Feature-level types: Types shared across multiple domains (Note, NoteId, Folder, etc.)
 * - Domain-level types: Domain-private types that don't cross domain boundaries
 * 
 * PATTERN:
 * - Feature-level types (types/): Cross-domain, exported through feature barrel
 * - Domain-level types (<domain>/types/): Domain-specific, exported through domain barrel
 * - Constants co-located with types are acceptable and re-exported through constants/
 * 
 * GUIDELINE:
 * If a type is used by multiple domains ? types/
 * If a type is used only within one domain ? <domain>/types/
 * 
 * CANONICAL IMPORT PATH:
 * - @/notes/types or @/notes
 */

export * from './notes.types';
