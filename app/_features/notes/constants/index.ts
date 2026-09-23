/**
 * Constants Layer — Feature-Level Constants and Enums
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * Owns all feature-level constants, enums, and sentinel values.
 * Re-exports domain constants that are part of the public API.
 * 
 * OWNERSHIP RULES:
 * - Feature-level constants: Feature metadata, feature-wide constants
 * - Domain constants: Can be defined in domain types/ and re-exported here if part of public API
 * 
 * PATTERN:
 * - Feature constants: NOTES_FEATURE_NAME, NOTES_VERSION, etc.
 * - Domain constants re-export: Acceptable for public API surface
 * - Constants co-located with types: Acceptable pattern
 * 
 * GUIDELINE:
 * Constants that are part of the feature's public API should be re-exported here.
 * Domain-private constants should remain in domain barrels.
 * 
 * CANONICAL IMPORT PATH:
 * - @features/notes/constants or @features/notes
 */

// Re-export organization constants (part of public API)
export {
  DEFAULT_FOLDER_COLOR,
  ALL_NOTES_FOLDER_ID,
  ALL_NOTES_FOLDER,
} from '../types/notes.types';

// Feature-level constants
export const NOTES_FEATURE_NAME = 'notes' as const;
export const NOTES_VERSION = '1.0.0' as const;
