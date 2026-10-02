'use client';

import { useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useNoteNavigation } from '../../../hooks/useNoteNavigation';
import { useNotesStore } from '@/notes/store/notes.store';
import { useFilteredNotes } from '@/notes/store/notes.selectors';
export { recordVisit } from './useDiscovery';

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
