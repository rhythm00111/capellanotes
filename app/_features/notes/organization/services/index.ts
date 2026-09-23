/**
 * Organization Domain Services
 * 
 * DOMAIN OWNERSHIP: Organization
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * Owns business operations specific to organizational entities (folders, collections, tags).
 * 
 * OWNERSHIP GUIDELINE:
 * - Feature-level services (services/): Core note CRUD operations
 * - Domain-level services (<domain>/services/): Domain-specific operations
 * 
 * PATTERN:
 * Domain services provide domain-specific business logic and operations.
 * They may delegate to feature-level services or call server actions directly.
 * 
 * CURRENT STATUS:
 * Folder operations (create, delete, rename) correctly belong to organization domain.
 * 
 * CANONICAL IMPORT PATH:
 * - @features/notes/organization (domain barrel)
 */

// Organization domain services - canonical entry point
export * from './folders.service';
