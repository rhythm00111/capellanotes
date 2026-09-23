'use client';

import { useState, useCallback } from 'react';
import { NotesList, NotesHeader, NotesSidebar, CommandPalette, useNotesList, useNotesStore, useNoteNavigation } from '@/_features/notes';
import type { ViewMode } from '@/_features/notes';

export default function NotesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { viewTitle } = useNotesList();
  const searchQuery = useNotesStore((s) => s.searchQuery);
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery);
  const createNote = useNotesStore((s) => s.createNote);
  const { navigateToNote } = useNoteNavigation();

  const handleCreateNote = useCallback(async () => {
    const note = await createNote();
    navigateToNote(note.id);
  }, [createNote, navigateToNote]);

  return (
    <div className="flex h-screen w-full">
      <NotesSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <NotesHeader
          viewTitle={viewTitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreate={handleCreateNote}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <NotesList
          viewMode={viewMode}
          onCreateNote={handleCreateNote}
        />
      </div>
      <CommandPalette />
    </div>
  );
}
