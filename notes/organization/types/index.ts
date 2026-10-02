/**
 * Organization Domain Types
 * 
 * DOMAIN OWNERSHIP: Organization
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * Owns all TypeScript types specific to the organization domain (folders, collections, tags).
 * 
 * OWNERSHIP GUIDELINE:
 * - Domain types that cross domain boundaries ? Should be in feature-level types/
 * - Domain types used only within organization ? Correctly placed here
 * 
 * CURRENT STATUS:
 * These types (Folder, FolderId, etc.) are also used by notes and editor domains,
 * but are semantically owned by organization. This is acceptable as they represent
 * organizational concepts.
 * 
 * CANONICAL IMPORT PATH:
 * - @/notes/organization (domain barrel)
 * - @/notes (feature barrel, if part of public API)
 */

// Organization domain types - canonical entry point
export * from './organization.types';
