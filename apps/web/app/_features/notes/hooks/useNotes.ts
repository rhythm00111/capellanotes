import { useFilteredNotes } from '@features/notes/state/notes.selectors';
import { useNotesStore } from '@features/notes/state/notes.store';

export const useNotes = () => useNotesStore((s) => s.notes);
export const useFolders = () => useNotesStore((s) => s.folders);
export const useNotesLoading = () => useNotesStore((s) => ({ isInitialized: s.isInitialized, isLoading: s.isLoading, error: s.error }));
export { useFilteredNotes };
