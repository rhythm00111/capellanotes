/**
 * Services Layer — Feature-Level Business Operations
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * Owns all feature-level server actions and business operations for Notes CRUD.
 * 
 * OWNERSHIP RULES:
 * - Feature-level services: Core note operations (create, read, update, delete)
 * - Domain-level services: Domain-specific operations (e.g., organization/services for folders)
 * 
 * PATTERN:
 * - This layer contains server actions that interact with the database/API
 * - Domain-specific business logic should live in domain service layers
 * - Pure utility functions belong in utils/, not services/
 * 
 * CANONICAL IMPORT PATH:
 * - @features/notes/services or @features/notes
 */

// Canonical service surface for notes business operations.
export * from './actions/create-note.action';
export * from './actions/get-notes.action';
export * from './actions/update-note.action';
export * from './actions/delete-note.action';
