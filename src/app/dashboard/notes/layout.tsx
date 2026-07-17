'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { NotesErrorBoundary, CommandPalette, useNotesStore, useNoteNavigation, openCommandPalette } from '@features/notes';

function NotesLayoutContent({ children }: { children: React.ReactNode }) {
  const loadAll = useNotesStore((s) => s.loadAll);
  const setSearchQuery = useNotesStore((s) => s.setSearchQuery);
  const searchParams = useSearchParams();
  const { createAndNavigate } = useNoteNavigation();

  // Load all notes on mount
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Clear search when navigating away from a search state
  useEffect(() => {
    setSearchQuery('');
  }, [searchParams, setSearchQuery]);

  // Global ⌘N / Ctrl+N shortcut to create a new note
  // Global ⌘K / Ctrl+K shortcut to open the command palette
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
        return;
      }
      if (e.key === 'n') {
        const active = document.activeElement;
        if (
          active?.closest?.('.ProseMirror') ||
          active?.tagName === 'INPUT' ||
          active?.tagName === 'TEXTAREA'
        ) return;
        e.preventDefault();
        try { await createAndNavigate(); } catch { /* errors handled in hook */ }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createAndNavigate]);

  return (
    <>
      <CommandPalette />
      {children}
    </>
  );
}

export default function NotesRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotesErrorBoundary>
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
          <div className="text-white/30 text-sm animate-pulse">Loading…</div>
        </div>
      }>
        <NotesLayoutContent>{children}</NotesLayoutContent>
      </Suspense>
    </NotesErrorBoundary>
  );
}
