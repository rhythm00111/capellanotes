'use client';

import { useState, useCallback } from 'react';
import { Menu } from 'lucide-react';
import { NotesList, NotesHeader, NotesSidebar, CommandPalette, useNotesList, useNotesStore, useNoteNavigation, MobileSidebarDrawer } from '@/notes';
import type { ViewMode } from '@/notes';

export default function NotesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <div className="flex h-screen w-full overflow-hidden bg-[#0f0f0f]">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:flex">
        <NotesSidebar />
      </div>

      {/* Mobile drawer */}
      <MobileSidebarDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center px-3 py-2 border-b border-white/[0.06] bg-[#0f0f0f]">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <h1 className="ml-3 text-[13px] font-semibold text-white/80 truncate">{viewTitle}</h1>
        </div>

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
      </main>
      <CommandPalette />
    </div>
  );
}
