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

// Canonical feature-level hooks (cross-domain, shared infrastructure).
export { useNoteNavigation } from './hooks/useNoteNavigation';
export { useCommandPalette, openCommandPalette } from './hooks/useCommandPalette';
export { useNotes, useFolders, useNotesLoading } from './hooks/useNotes';

// Canonical domain hooks (imported from domain barrels for convenience).
// Consumers can also import these directly from their domains:
// - notes/organization (useSidebar)
// - notes/documents (useNotesList, recordVisit)
export { useSidebar } from './organization/sidebar/hooks/useSidebar';
export { useNotesList } from './documents/list/hooks/useNotesList';
export { recordVisit } from './documents/list/hooks/useDiscovery';

// Canonical domain types.
export * from './types';

// Canonical UI entry points for route consumers.
export { NoteEditorPage } from './documents/index';
export { NotesErrorBoundary } from './widgets/NotesErrorBoundary';
export { NotesSidebar } from './organization/sidebar/components/NotesSidebar';
export { NotesList, NotesHeader, ViewToggle } from './documents/index';
export type { ViewMode } from './documents/index';
export { CommandPalette } from './editor';
export { MobileSidebarDrawer } from './organization/sidebar/components/MobileSidebarDrawer';

// Canonical root wrapper components.
export { NotesLayout } from './NotesLayout';
export { NotesProvider } from './NotesProvider';
export { NotesLoader } from './NotesLoader';
export { NotesError } from './NotesError';


// UI Components (moved from app/)
export { Button } from './components/ui/button';
export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
export { Input } from './components/ui/input';
export { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from './components/ui/context-menu';
export { ScrollArea } from './components/ui/scroll-area';
export { Toast, ToastAction, ToastProvider, ToastViewport, ToastTitle, ToastDescription, ToastClose } from './components/ui/toast';
export type { ToastProps, ToastActionElement } from './components/ui/toast';
export { Toaster } from './components/ui/toaster';

// UI Utilities (moved from app/)
export { cn } from './utils/ui.utils';
export { useToast, toast } from './hooks/use-toast';
