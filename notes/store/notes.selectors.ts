'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNotesStore } from './notes.store';
import { filterNotes } from '../utils';
import { ALL_NOTES_FOLDER_ID, type NotesView } from '../types/notes.types';

// Internal helpers
const useNotes = () => useNotesStore((s) => s.notes);
const useSearchQuery = () => useNotesStore((s) => s.searchQuery);

export const useFilteredNotes = () => {
  const notes = useNotes();
  const searchQuery = useSearchQuery();
  const searchParams = useSearchParams();

  const folderParam = searchParams.get('folder');
  const viewParam = searchParams.get('view');

  const view: NotesView = folderParam ? 'folder' : ((viewParam as NotesView) || 'all');
  const folderId = folderParam ?? ALL_NOTES_FOLDER_ID;

  return useMemo(
    () => filterNotes(notes, { view, folderId, searchQuery }),
    [notes, folderId, searchQuery, view],
  );
};
