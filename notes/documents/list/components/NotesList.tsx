"use client";

import { useMemo, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { NotesEmptyState } from '@/notes/widgets';
import { useNotesStore } from '@/notes/store/notes.store';
import { type Note } from '@/notes/types';
import { useNotesList } from '../hooks/useNotesList';
import { NotesItem } from './NotesItem';
import { NoteCard } from './NoteCard';
import { NoteContextMenu } from './NoteContextMenu';
import { NotesFilters, type ActiveFilter } from './NotesFilters';
import { type ViewMode } from './ViewToggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/notes/components/ui/dialog';
import { Button } from '@/notes/components/ui/button';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function NoteSkeletonRow({ height }: { height: 'sm' | 'md' | 'lg' }) {
  const snippetW = height === 'sm' ? 'w-3/4' : height === 'md' ? 'w-full' : 'w-5/6';
  return (
    <div className="flex flex-col gap-2 px-4 py-4 rounded-lg animate-pulse">
      <div className="flex items-center justify-between gap-2">
        <div className="h-3.5 rounded bg-white/[0.06] w-2/3" />
        <div className="h-2.5 rounded bg-white/[0.04] w-10 shrink-0" />
      </div>
      <div className={`h-3 rounded bg-white/[0.04] ${snippetW}`} />
    </div>
  );
}

function NoteSkeletonCard() {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-white/[0.05] animate-pulse">
      <div className="h-3.5 rounded bg-white/[0.06] w-3/4" />
      <div className="h-3 rounded bg-white/[0.04] w-full" />
      <div className="h-3 rounded bg-white/[0.04] w-5/6" />
      <div className="h-3 rounded bg-white/[0.04] w-2/3" />
      <div className="h-2.5 rounded bg-white/[0.03] w-1/3 mt-1" />
    </div>
  );
}

const SKELETON_HEIGHTS = ['md', 'lg', 'sm', 'md', 'lg'] as const;

function NotesSkeletonList() {
  return (
    <div className="py-1 px-2">
      {SKELETON_HEIGHTS.map((h, i) => <NoteSkeletonRow key={i} height={h} />)}
    </div>
  );
}

function NotesSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {Array.from({ length: 6 }, (_, i) => <NoteSkeletonCard key={i} />)}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-4 pt-3 pb-1">
      <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function applyLocalFilter(notes: Note[], filter: ActiveFilter): Note[] {
  if (filter === 'all') return notes;
  if (filter === 'pinned') return notes.filter((n) => n.isPinned);
  if (filter === 'recent') {
    const cutoff = Date.now() - SEVEN_DAYS_MS;
    return notes.filter((n) => new Date(n.updatedAt).getTime() > cutoff);
  }
  return notes.filter((n) => n.tags?.includes(filter));
}

function collectTags(notes: Note[]): string[] {
  const seen = new Set<string>();
  for (const note of notes) {
    for (const tag of note.tags ?? []) seen.add(tag);
  }
  return Array.from(seen).sort();
}

interface DateGroup {
  label: string;
  notes: Note[];
}

function groupNotesByDate(notes: Note[]): DateGroup[] {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayTs = startOfToday.getTime();
  const yesterdayTs = todayTs - 24 * 60 * 60 * 1000;

  const today: Note[] = [];
  const yesterday: Note[] = [];
  const older: Note[] = [];

  for (const note of notes) {
    const t = new Date(note.updatedAt).getTime();
    if (t >= todayTs) today.push(note);
    else if (t >= yesterdayTs) yesterday.push(note);
    else older.push(note);
  }

  const groups: DateGroup[] = [];
  if (today.length > 0) groups.push({ label: 'Today', notes: today });
  if (yesterday.length > 0) groups.push({ label: 'Yesterday', notes: yesterday });
  if (older.length > 0) groups.push({ label: 'Older', notes: older });
  return groups;
}

function TodaySection() {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
      <span className="text-[12px] font-medium text-white/55">{weekday}</span>
      <span className="text-[11px] text-white/38">— {dateStr}</span>
    </div>
  );
}

interface NotesListProps {
  viewMode: ViewMode;
  onCreateNote: () => void;
}

export function NotesList({ viewMode, onCreateNote }: NotesListProps) {
  const {
    filteredNotes,
    isLoading,
    viewTitle,
    handleSelectNote,
    handleDeleteNote,
    handleRestoreNote,
    handlePermanentDeleteNote,
    handleTogglePin,
    handleDuplicateNote,
  } = useNotesList();

  const isInitialized = useNotesStore((s) => s.isInitialized);
  const searchQuery = useNotesStore((s) => s.searchQuery);
  const emptyTrash = useNotesStore((s) => s.emptyTrash);
  const updateNote = useNotesStore((s) => s.updateNote);
  const params = useParams();
  const activeNoteId = typeof params?.noteId === 'string' ? params.noteId : null;

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [emptyTrashConfirmOpen, setEmptyTrashConfirmOpen] = useState(false);
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false);

  const showLoading = isLoading || !isInitialized;

  const availableTags = useMemo(() => collectTags(filteredNotes), [filteredNotes]);

  const locallyFiltered = useMemo(
    () => applyLocalFilter(filteredNotes, activeFilter),
    [filteredNotes, activeFilter],
  );

  const { pinned, rest } = useMemo(() => ({
    pinned: locallyFiltered.filter((n) => n.isPinned),
    rest: locallyFiltered.filter((n) => !n.isPinned),
  }), [locallyFiltered]);

  const showSections = pinned.length > 0 && rest.length > 0;

  const makeRow = useCallback((note: Note | null | undefined) => {
    if (!note) return null;
    return (
      <div key={note.id} className="w-full px-3">
        <NoteContextMenu
          noteTitle={note.title}
          onOpen={() => handleSelectNote(note.id)}
          onDuplicate={() => handleDuplicateNote(note.id)}
          onTogglePin={() => handleTogglePin(note.id)}
          onDelete={() => handleDeleteNote(note.id)}
          onRestore={() => handleRestoreNote(note.id)}
          onPermanentDelete={() => handlePermanentDeleteNote(note.id)}
          onRename={(title) => updateNote(note.id, { title })}
          isPinned={note.isPinned}
          isDeleted={note.isDeleted}
        >
          <NotesItem
            note={note}
            selected={note.id === activeNoteId}
            onClick={() => handleSelectNote(note.id)}
            onTogglePin={() => handleTogglePin(note.id)}
          />
        </NoteContextMenu>
      </div>
    );
  }, [activeNoteId, handleDeleteNote, handleDuplicateNote, handlePermanentDeleteNote, handleRestoreNote, handleSelectNote, handleTogglePin, updateNote]);

  const makeCard = useCallback((note: Note | null | undefined) => {
    if (!note) return null;
    return (
      <NoteContextMenu
        key={note.id}
        noteTitle={note.title}
        onOpen={() => handleSelectNote(note.id)}
        onDuplicate={() => handleDuplicateNote(note.id)}
        onTogglePin={() => handleTogglePin(note.id)}
        onDelete={() => handleDeleteNote(note.id)}
        onRestore={() => handleRestoreNote(note.id)}
        onPermanentDelete={() => handlePermanentDeleteNote(note.id)}
        onRename={(title) => updateNote(note.id, { title })}
        isPinned={note.isPinned}
        isDeleted={note.isDeleted}
      >
        <NoteCard
          note={note}
          selected={note.id === activeNoteId}
          onClick={() => handleSelectNote(note.id)}
          onTogglePin={() => handleTogglePin(note.id)}
          onOpen={() => handleSelectNote(note.id)}
          onDuplicate={() => handleDuplicateNote(note.id)}
          onDelete={() => handleDeleteNote(note.id)}
        />
      </NoteContextMenu>
    );
  }, [activeNoteId, handleDeleteNote, handleDuplicateNote, handlePermanentDeleteNote, handleRestoreNote, handleSelectNote, handleTogglePin, updateNote]);

  const pinnedRows = useMemo(() => pinned.map(makeRow), [pinned, makeRow]);
  const restRows = useMemo(() => rest.map(makeRow), [rest, makeRow]);
  const pinnedCards = useMemo(() => pinned.map(makeCard), [pinned, makeCard]);
  const restCards = useMemo(() => rest.map(makeCard), [rest, makeCard]);

  const showDateGroups =
    !searchQuery.trim() &&
    activeFilter === 'all' &&
    viewTitle !== 'Trash' &&
    !showLoading;

  const renderListContent = () => {
    if (!showDateGroups || rest.length === 0) return restRows;
    const groups = groupNotesByDate(rest);
    return groups.flatMap(({ label, notes: gNotes }) => [
      <SectionLabel key={`label-${label}`} label={label} />,
      ...gNotes.map(makeRow),
    ]);
  };

  const renderContent = () => {
    if (showLoading) {
      return viewMode === 'grid' ? <NotesSkeletonGrid /> : <NotesSkeletonList />;
    }
    if (locallyFiltered.length === 0) {
      if (viewMode === 'grid') {
        return (
          <div className="p-3">
            <Button
              onClick={onCreateNote}
              variant="ghost"
              className="w-full h-[130px] rounded-xl border border-dashed border-white/[0.08] bg-transparent hover:border-teal-500/25 hover:bg-teal-500/[0.025] transition-all duration-200 flex flex-col items-center justify-center gap-1.5 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50"
            >
              <span className="text-[12px] text-white/45 group-hover:text-white/55 transition-colors duration-150">
                Your first note goes here
              </span>
              <span className="text-[11px] text-teal-500/35 group-hover:text-teal-400/65 transition-colors duration-150">
                + New note
              </span>
            </Button>
          </div>
        );
      }
      return <NotesEmptyState context="list" />;
    }
    if (viewMode === 'grid') {
      return showSections ? (
        <div className="p-3 space-y-2">
          <SectionLabel label="Pinned" />
          <div className="grid grid-cols-2 gap-3">{pinnedCards}</div>
          <SectionLabel label="All Notes" />
          <div className="grid grid-cols-2 gap-3">{restCards}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-3">
          {(pinned.length > 0 ? pinnedCards : restCards)}
        </div>
      );
    }
    return showSections ? (
      <div className="py-2 space-y-2.5">
        <SectionLabel label="Pinned" />
        {pinnedRows}
        {renderListContent()}
      </div>
    ) : (
      <div className="py-2 space-y-2.5">
        {pinned.length > 0 ? pinnedRows : renderListContent()}
      </div>
    );
  };

  const isTrashView = viewTitle === 'Trash';
  const trashCount = filteredNotes.length;
  const showTodayAnchor = !isTrashView && !showLoading && !searchQuery.trim() &&
    (viewTitle === 'All Notes' || viewTitle === 'Today');

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[#0f0f0f]">
      {availableTags.length > 0 && (
        <NotesFilters
          activeFilter={activeFilter}
          availableTags={availableTags}
          onChange={setActiveFilter}
        />
      )}

      {showTodayAnchor && <TodaySection />}

      {isTrashView && !showLoading && trashCount > 0 && (
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
          <span className="text-[11px] text-white/45">
            {trashCount} item{trashCount !== 1 ? 's' : ''} in trash
          </span>
          <Button
            onClick={() => setEmptyTrashConfirmOpen(true)}
            variant="ghost"
            size="sm"
            className={isEmptyingTrash ? 'text-white/20 cursor-not-allowed' : 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10'}
            disabled={isEmptyingTrash}
          >
            <Trash2 className="h-3 w-3" />
            {isEmptyingTrash ? 'Deleting—' : 'Empty Trash'}
          </Button>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>

      <Dialog open={emptyTrashConfirmOpen} onOpenChange={setEmptyTrashConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Empty Trash?</DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-white/50 leading-relaxed">
            {trashCount} item{trashCount !== 1 ? 's' : ''} will be permanently deleted.
            This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" onClick={() => setEmptyTrashConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                setIsEmptyingTrash(true);
                setEmptyTrashConfirmOpen(false);
                try {
                  await emptyTrash();
                } finally {
                  setIsEmptyingTrash(false);
                }
              }}
            >
              Delete Forever
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
