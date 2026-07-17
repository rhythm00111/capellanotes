// Feature barrel — intentional public API for the Notes feature.
// Keep this surface narrow and aligned with the canonical domain entry points.

// Canonical helpers used directly by route-level consumers.
export {
  generateId,
  getErrorMessage,
  isValidNoteId,
  extractPlainTextFromJSON,
  formatRelativeDate,
  generateFallbackTitle,
  hasWikiLinkToNote,
  countWikiLinks,
  filterNotes,
  getFolderNoteCount,
} from './utils/notes.helpers';

// Canonical store and selectors.
export { useNotesStore, useFilteredNotes } from './store';

// Canonical hooks used by consumers.
export { useNoteNavigation } from './hooks/useNoteNavigation';
export { useCommandPalette, openCommandPalette } from './hooks/useCommandPalette';
export { useSidebar } from './organization/sidebar/hooks/useSidebar';
export { useNotesList } from './notes/list/hooks/useNotesList';
export { recordVisit } from './notes/list/hooks/useDiscovery';

// Canonical domain types.
export * from './types';

// Canonical UI entry points for route consumers.
export { NoteEditorPage } from './notes/index';
export { NotesErrorBoundary } from './widgets/NotesErrorBoundary';
export { NotesSidebar } from './organization/sidebar/components/NotesSidebar';
export { NotesList, NotesHeader, ViewToggle } from './notes/index';
export type { ViewMode } from './notes/index';
export { CommandPalette } from './editor';

// Canonical root wrapper components.
export { NotesLayout } from './NotesLayout';
export { NotesProvider } from './NotesProvider';
export { NotesLoader } from './NotesLoader';
export { NotesError } from './NotesError';
