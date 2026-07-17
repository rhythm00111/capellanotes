'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronRight, FileText, AlertCircle, Maximize2, Minimize2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NotesEditor, NoteInfoPanel } from '@features/notes/editor';
import { useNotesStore, useNoteNavigation } from '@features/notes';

interface NoteEditorPageProps {
  noteId: string;
}

export function NoteEditorPage({ noteId }: NoteEditorPageProps) {
  const loadAll = useNotesStore((s) => s.loadAll);
  const isInitialized = useNotesStore((s) => s.isInitialized);
  const isLoading = useNotesStore((s) => s.isLoading);
  const error = useNotesStore((s) => s.error);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const notes = useNotesStore((s) => s.notes);
  const folders = useNotesStore((s) => s.folders);
  const selectedNote = useMemo(() => notes.find((n) => n.id === noteId) ?? null, [notes, noteId]);
  const noteFolder = useMemo(
    () => (selectedNote?.folderId ? folders.find((f) => f.id === selectedNote.folderId) ?? null : null),
    [selectedNote, folders],
  );
  const { navigateToList, navigateToNote } = useNoteNavigation();

  // NOTE: loadAll() is intentionally NOT called here.
  // The parent notes layout (src/app/dashboard/notes/layout.tsx) handles initialization.
  // The store's guard prevents double-execution, but calling it here is redundant.

  // Reset focus mode when navigating to a different note
  useEffect(() => {
    setIsFocusMode(false);
    setIsScrolled(false);
    setIsPanelOpen(false);
  }, [noteId]);

  const handleEditorScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) setIsScrolled(el.scrollTop > 36);
  }, []);

  const handleBack = () => navigateToList();
  
  // Show spinner only on the very first load before data arrives
  if (!isInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#0a0a0a]">
        <div className="text-white/30 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  // Show error state with retry
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full gap-4 bg-[#0a0a0a]">
        <AlertCircle className="h-8 w-8 text-red-400/50" />
        <p className="text-[13px] text-white/40">{error}</p>
        <Button variant="ghost" size="sm" onClick={() => loadAll()} className="text-white/40 hover:text-white/70">
          Retry
        </Button>
      </div>
    );
  }

  // Guard: Distinguish between "loading", "not found", and "still loading after init"
  if (isInitialized && !selectedNote) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#0a0a0a]">
        <div className="flex flex-col items-center text-center gap-3">
          <FileText className="h-10 w-10 text-white/20" />
          <p className="text-[14px] font-medium text-white/50">Note not found</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white/35 hover:text-white/65 mt-1"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  // Guard: Prevent render if note hasn't loaded yet
  if (!selectedNote) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Top Bar — hidden in focus mode */}
      {!isFocusMode && (
        <div
          className={cn(
            'border-b border-white/[0.05] flex items-center justify-between px-5 shrink-0 transition-all duration-200 ease-out',
            isScrolled ? 'h-10' : 'h-[52px]',
          )}
        >
          {/* Left: back button + breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={handleBack}
              className="flex items-center justify-center h-6 w-6 rounded-md text-white/35 hover:text-white/70 hover:bg-white/[0.05] transition-all duration-150 shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50"
              aria-label="Back to notes"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-center gap-1 text-[12.5px] text-white/35 min-w-0">
              <span
                onClick={handleBack}
                data-testid="breadcrumb-notes-link"
                className="text-white/40 hover:text-white/65 cursor-pointer transition-colors duration-100 shrink-0"
              >
                Notes
              </span>
              {noteFolder && (
                <>
                  <ChevronRight className="h-3 w-3 shrink-0 text-white/15" />
                  <span className="text-white/35 truncate max-w-[90px] shrink-0">{noteFolder.name}</span>
                </>
              )}
              <ChevronRight className="h-3 w-3 shrink-0 text-white/15" />
              <span className="text-white/60 truncate max-w-[200px] font-medium">
                {selectedNote.title || 'Untitled'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Info panel toggle */}
            <button
              onClick={() => setIsPanelOpen((v) => !v)}
              className={cn(
                'flex items-center justify-center h-6 w-6 rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50',
                isPanelOpen
                  ? 'text-white/55 bg-white/[0.06] hover:text-white/80'
                  : 'text-white/25 hover:text-white/55 hover:bg-white/[0.04]',
              )}
              title="Toggle info panel"
            >
              <Info className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsFocusMode(true)}
              className="flex items-center gap-1 h-6 px-2 rounded-md text-[11px] text-white/25 hover:text-white/55 hover:bg-white/[0.04] transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50"
              title="Focus mode"
            >
              <Maximize2 className="h-3 w-3" />
              Focus
            </button>
          </div>
        </div>
      )}

      {/* Floating exit-focus button */}
      {isFocusMode && (
        <button
          onClick={() => setIsFocusMode(false)}
          className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-white/35 hover:text-white/65 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50"
          title="Exit focus mode"
        >
          <Minimize2 className="h-3 w-3" />
          Exit Focus
        </button>
      )}

      {/* Editor Area + Info Panel */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <div ref={scrollRef} onScroll={handleEditorScroll} className="flex-1 overflow-y-auto">
          <NotesEditor
            note={selectedNote}
            isFocusMode={isFocusMode}
          />
        </div>
        {/* T11: Info panel — only shown when toggled and not in focus mode */}
        {!isFocusMode && (
          <NoteInfoPanel
            note={selectedNote}
            allNotes={notes}
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            onNoteClick={(id: string) => { setIsPanelOpen(false); navigateToNote(id); }}
          />
        )}
      </div>
    </div>
  );
}
