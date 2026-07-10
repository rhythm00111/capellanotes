import { useCallback, useMemo } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useNotesStore } from '@features/notes/state/notes.store';
import { useFilteredNotes } from '@features/notes/state/notes.selectors';
// Import `useNoteNavigation` directly from its implementation to avoid
// a barrel re-export cycle via `hooks/index.ts` (see P0 stabilization notes).
import { useNoteNavigation } from '../../../hooks/useNoteNavigation';

// List logic hook with shared navigation
export function useNotesList() {
  const folders = useNotesStore((s) => s.folders);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const restoreNote = useNotesStore((s) => s.restoreNote);
  const permanentDeleteNote = useNotesStore((s) => s.permanentDeleteNote);
  const togglePin = useNotesStore((s) => s.togglePin);
  const duplicateNote = useNotesStore((s) => s.duplicateNote);
  const isLoading = useNotesStore((s) => s.isLoading);
  const searchQuery = useNotesStore((s) => s.searchQuery);
  const { navigateToNote, navigateToList } = useNoteNavigation();

  const params = useParams();
  const activeNoteId = typeof params?.noteId === 'string' ? params.noteId : null;

  const filteredNotes = useFilteredNotes();

  const searchParams = useSearchParams();
  const folderParam = searchParams.get('folder');
  const viewParam = searchParams.get('view');

  const viewTitle = useMemo(() => {
    if (viewParam === 'favorites') return 'Pinned';
    if (viewParam === 'trash') return 'Trash';
    if (viewParam === 'today') return 'Today';
    if (viewParam === 'week') return 'This Week';
    if (viewParam === 'inbox') return 'Inbox';
    if (folderParam) {
      const f = folders.find((f) => f.id === folderParam);
      return f?.name ?? 'Folder';
    }
    return 'All Notes';
  }, [viewParam, folderParam, folders]);

  const handleSelectNote = useCallback((id: string | null) => {
    if (id) {
      navigateToNote(id);
    }
  }, [navigateToNote]);

  const handleDuplicateNote = useCallback(async (id: string) => {
    try {
      const created = await duplicateNote(id);
      if (created?.id) {
        navigateToNote(created.id);
      }
    } catch (error) {
      console.error('Failed to duplicate note:', error);
    }
  }, [duplicateNote, navigateToNote]);

  const handleRestoreNote = useCallback(async (id: string) => {
    await restoreNote(id);
  }, [restoreNote]);

  const handlePermanentDeleteNote = useCallback(async (id: string) => {
    await permanentDeleteNote(id);
  }, [permanentDeleteNote]);

  const handleDeleteNote = useCallback(async (id: string) => {
    await deleteNote(id);
    // If the deleted note is currently open, navigate back to the list
    if (id === activeNoteId) {
      navigateToList();
    }
  }, [deleteNote, activeNoteId, navigateToList]);

  return {
    filteredNotes,
    isLoading,
    searchQuery,
    viewTitle,
    handleSelectNote,
    handleDeleteNote,
    handleRestoreNote,
    handlePermanentDeleteNote,
    handleTogglePin: togglePin,
    handleDuplicateNote,
  };
}
