// Providers domain placeholder — extension points only. Provider implementations
// must live outside the feature and depend on the feature contracts. This
// module remains a coordination layer and should not host business rules.

export interface NotesProviderEntry {
  id: string;
  displayName: string;
}

export const RegisteredProviders: readonly NotesProviderEntry[] = [];
