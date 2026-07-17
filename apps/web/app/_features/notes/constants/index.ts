/**
 * Constants Domain
 * 
 * Owns all constants and enums for the Notes feature.
 * Re-exports domain constants from their canonical sources.
 */

// Re-export organization constants
export {
  DEFAULT_FOLDER_COLOR,
  ALL_NOTES_FOLDER_ID,
  ALL_NOTES_FOLDER,
} from '../types/notes.types';

// Feature-level constants
export const NOTES_FEATURE_NAME = 'notes' as const;
export const NOTES_VERSION = '1.0.0' as const;
