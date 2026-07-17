// Public hooks surface for the notes feature.
export { useEditor } from '../editor/hooks/useEditor';
export { useNotes, useFolders, useNotesLoading } from './useNotes';
export { useNoteNavigation } from './useNoteNavigation';
export { useCommandPalette, openCommandPalette } from './useCommandPalette';
export { useNotesList } from '../notes/list/hooks/useNotesList';
export { recordVisit } from '../notes/list/hooks/useDiscovery';
export { useSidebar } from '../organization/sidebar/hooks/useSidebar';
