/**
 * Providers Layer — Extension Points and Provider Registry
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * Defines extension points and provider contracts for external integrations.
 * Provider implementations live OUTSIDE the feature and depend on feature contracts.
 * 
 * OWNERSHIP RULES:
 * - This layer: Contracts and coordination only (interfaces, types, registry)
 * - External: Provider implementations (packages/*, integrations/*)
 * 
 * PATTERN:
 * - Feature-level providers: Extension point definitions
 * - Domain-specific providers: Not applicable (use feature-level contracts)
 * - React Context providers: NotesProvider lives at feature root (NotesProvider.tsx)
 * 
 * CANONICAL IMPORT PATH:
 * - @/notes/providers or @/notes
 */

// Providers domain placeholder — extension points only. Provider implementations
// must live outside the feature and depend on the feature contracts. This
// module remains a coordination layer and should not host business rules.

export interface NotesProviderEntry {
  id: string;
  displayName: string;
}

export const RegisteredProviders: readonly NotesProviderEntry[] = [];
