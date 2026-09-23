/**
 * Store Layer — Feature-Level State Management
 * 
 * ARCHITECTURAL RESPONSIBILITY:
 * Owns all state management for the Notes feature using Zustand.
 * Provides centralized state, actions, and derived selectors.
 * 
 * OWNERSHIP RULES:
 * - Feature-level store: Single source of truth for notes and folders data
 * - State actions: Business operations that modify state (create, update, delete)
 * - Selectors: Derived state and computed values (filtering, sorting)
 * 
 * PATTERN:
 * - notes.store.ts: Zustand store definition with state + actions
 * - notes.selectors.ts: Derived state selectors and hooks
 * - index.ts: Public API exports
 * 
 * ARCHITECTURAL JUSTIFICATION:
 * The store/ layer was added as an architectural enhancement to the TARGET specification.
 * It provides essential state management that was implicit in the TARGET but not explicitly listed.
 * This follows modern React patterns and prevents state logic pollution in components.
 * 
 * STATE MANAGEMENT PHILOSOPHY:
 * - Optimistic updates for better UX (immediate feedback)
 * - Server actions for persistence (async operations)
 * - Reconciliation on load (merge optimistic + server state)
 * - Guards against concurrent operations
 * 
 * CANONICAL IMPORT PATH:
 * - @features/notes/store or @features/notes
 * 
 * STATUS: ✅ CANONICAL LAYER (Approved Phase X)
 */

export { useNotesStore } from './notes.store';
export { useFilteredNotes } from './notes.selectors';
