// Feature barrel — P0 Ownership Map
// Canonical implementations:
//  - UI / feature modules: `modules/` (canonical)
//  - State store implementation: `store/` (canonical, Zustand)
//  - Helper utilities: `lib/` (canonical)
// Compatibility / temporary shims (deprecated, P1):
//  - `components/` (compat re-exports -> prefer `modules/`)
//  - `state/` (compat re-exports -> prefer `store/`)
//  - `utils/` (compat re-exports -> prefer `lib/`)
// These comments freeze ownership for P0: do not add new implementations
// to compatibility folders. Importers should prefer the canonical surfaces.
// Stabilized feature barrel
export * as Components from './components';
export * as Modules from './modules';
export * as Hooks from './hooks';
export * as State from './state';
export * as Services from './services';
export * as Utils from './utils';
export * as Constants from './constants/notes.constants';
// Canonical, commonly-used helpers re-exported at the feature root to
// discourage deep imports. Prefer `import { generateFallbackTitle } from '@features/notes'`.
export {
	generateId,
	getErrorMessage,
	extractPlainTextFromJSON,
	formatRelativeDate,
	generateFallbackTitle,
	hasWikiLinkToNote,
	countWikiLinks,
	filterNotes,
	getFolderNoteCount,
} from './lib/notes.helpers';

// Re-export the canonical store hook at the feature root to avoid deep imports.
export { useNotesStore } from './store/notes.store';

// Types
export * from './types/notes.types';
// Backwards compatible named exports
export { NoteEditorPage } from './components/NoteEditorPage';
export { NotesErrorBoundary } from './components/NotesErrorBoundary';
