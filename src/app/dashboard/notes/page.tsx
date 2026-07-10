'use client';

import { useCallback, useEffect, useState } from 'react';
import { NotesSidebar } from '@features/notes/components/sidebar';
import { NotesList, NotesHeader } from '@features/notes/components/list';
import { useNotesList } from '@features/notes/hooks';
import { useNoteNavigation } from '@features/notes/hooks';
import { useNotesStore } from '@features/notes/state/notes.store';
import type { ViewMode } from '@features/notes/components/list/ViewToggle';

const VIEW_MODE_KEY = 'notes-view-mode';

/**
 * Notes home page — full-width top bar + sidebar + list
 *
 * Layout:
 *   [ NotesHeader — full width, 100% across sidebar + content ]
 *   [ NotesSidebar (220px) ][ NotesList (flex-1) ]
 */
export default function NotesListPage() {
  const searchQuery = useNotesStore((s) => s.searchQuery);
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery);
  const { viewTitle } = useNotesList();
  const { createAndNavigate } = useNoteNavigation();

  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Hydrate from localStorage after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEW_MODE_KEY);
      if (stored === 'grid' || stored === 'list') setViewMode(stored as ViewMode);
    } catch { /* localStorage unavailable */ }
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    try { localStorage.setItem(VIEW_MODE_KEY, mode); } catch { /* ignore */ }
  }, []);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Top bar — spans full width including above sidebar */}
      <NotesHeader
        viewTitle={viewTitle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreate={() => createAndNavigate()}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Body row: sidebar + scrollable list */}
      <div className="flex flex-1 overflow-hidden">
        <NotesSidebar />
        <NotesList viewMode={viewMode} onCreateNote={() => createAndNavigate()} />
      </div>
    </div>
  );
}
