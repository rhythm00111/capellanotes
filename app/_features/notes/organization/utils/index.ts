/**
 * Organization Domain Utils
 * 
 * DOMAIN OWNERSHIP: Organization
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * Owns utility functions specific to organizational operations (folders, collections).
 * 
 * OWNERSHIP GUIDELINE:
 * - Domain utils used only within organization → Correctly placed here
 * - Domain utils needed by other domains → Consider feature-level utils/
 * 
 * CURRENT STATUS:
 * getFolderNoteCount is used by other domains (notes, sidebar) but semantically belongs
 * to organization. It's re-exported through feature barrel for convenience.
 * 
 * PATTERN:
 * This is acceptable: domain-owned utility, exported through both domain and feature barrels.
 * Alternative: Move to feature-level utils/ if used heavily across domains.
 * 
 * CANONICAL IMPORT PATH:
 * - @features/notes/organization (domain barrel)
 * - @features/notes (feature barrel, via utils re-export)
 */

// Organization domain utilities - canonical entry point
export * from './folder.utils';
