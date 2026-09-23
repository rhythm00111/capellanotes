/**
 * Feature-Level Hooks
 * 
 * ARCHITECTURAL PRINCIPLE:
 * This barrel exports ONLY feature-level hooks that are used across multiple domains.
 * Domain-specific hooks should be imported directly from their domain barrels.
 * 
 * OWNERSHIP RULES:
 * - Feature hooks: Cross-domain orchestration, pure infrastructure, store accessors
 * - Domain hooks: Domain-specific logic, imported from domain barrels (editor/, notes/, organization/)
 * 
 * CANONICAL IMPORT PATHS:
 * - Feature hooks: @features/notes/hooks or @features/notes
 * - Domain hooks: @features/notes/<domain> (e.g., @features/notes/editor, @features/notes/organization)
 */

// Feature-level hooks (shared across domains)
export { useNotes, useFolders, useNotesLoading } from './useNotes';
export { useNoteNavigation } from './useNoteNavigation';
export { useCommandPalette, openCommandPalette } from './useCommandPalette';

// Domain hooks are NOT re-exported here. Import from domain barrels:
// - useEditor: import from '@features/notes/editor'
// - useNotesList, recordVisit: import from '@features/notes/notes'
// - useSidebar: import from '@features/notes/organization'
