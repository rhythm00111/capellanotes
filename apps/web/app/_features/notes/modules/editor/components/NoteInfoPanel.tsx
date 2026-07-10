'use client';

import { useMemo } from 'react';
import { X, FileText, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Note } from '@features/notes/types/notes.types';
import { extractPlainTextFromJSON, formatRelativeDate, hasWikiLinkToNote } from '@features/notes/lib/notes.helpers';

interface NoteInfoPanelProps {
  note: Note;
  allNotes: Note[];
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user clicks a backlink — navigate to that note. */
  onNoteClick?: (noteId: string) => void;
}

export function NoteInfoPanel({ note, allNotes, isOpen, onClose, onNoteClick }: NoteInfoPanelProps) {
  const plainText = useMemo(() => extractPlainTextFromJSON(note.content), [note.content]);

  const wordCount = useMemo(
    () => (plainText.trim() ? plainText.trim().split(/\s+/).length : 0),
    [plainText],
  );
  const charCount = useMemo(() => plainText.length, [plainText]);

  // Backlinks: non-deleted notes (excluding this one) that contain a wikiLinkMark
  // pointing at note.id.  We scan the JSON tree for marks rather than searching
  // plain text for [[title]], because the WikiLink extension stores noteId in the
  // mark attrs — the literal [[...]] trigger text is deleted on insertion.
  const backlinks = useMemo(() => {
    return allNotes.filter(
      (n) => n.id !== note.id && !n.isDeleted && hasWikiLinkToNote(n.content, note.id),
    );
  }, [note.id, allNotes]);

  if (!isOpen) return null;

  return (
    <aside data-testid="info-panel" className="w-[220px] shrink-0 border-l border-white/[0.05] bg-[#0a0a0a] flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 shrink-0">
        <span className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">Info</span>
        <button
          onClick={onClose}
          className="h-6 w-6 flex items-center justify-center rounded-md text-white/20 hover:text-white/55 hover:bg-white/[0.05] transition-colors duration-100"
          title="Close panel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-5 px-4 pb-6">
        {/* Stats */}
        <Section label="Stats">
          <StatRow label="Words" value={wordCount.toLocaleString()} />
          <StatRow label="Characters" value={charCount.toLocaleString()} />
        </Section>

        {/* Dates */}
        <Section label="Dates">
          <StatRow label="Created" value={formatRelativeDate(note.createdAt)} />
          <StatRow label="Updated" value={formatRelativeDate(note.updatedAt)} />
        </Section>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <Section label="Tags">
            <div className="flex flex-wrap gap-1 mt-0.5">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 pl-2 pr-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/40"
                >
                  <Hash className="h-2.5 w-2.5 shrink-0 text-white/20" />
                  {tag}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Backlinks */}
        <div data-testid="backlinks-section">
        <Section label={`Backlinks${backlinks.length > 0 ? ` (${backlinks.length})` : ''}`}>
          {backlinks.length === 0 ? (
            <p className="text-[12px] text-white/28 italic">No backlinks yet</p>
          ) : (
            <ul className="flex flex-col gap-1 mt-0.5">
              {backlinks.map((n) => (
                <li key={n.id}>
                  <button
                    data-testid="backlink-item"
                    onClick={() => onNoteClick?.(n.id)}
                    className={cn(
                      'flex items-center gap-1.5 w-full min-w-0 text-left rounded px-1 -mx-1 py-0.5',
                      onNoteClick
                        ? 'text-white/50 hover:text-teal-400/80 transition-colors duration-100 cursor-pointer'
                        : 'text-white/50 cursor-default',
                    )}
                    disabled={!onNoteClick}
                  >
                    <FileText className="h-3 w-3 shrink-0 text-white/20" />
                    <span className="text-[12px] truncate">{n.title || 'Untitled'}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>
        </div>
      </div>
    </aside>
  );
}

// ─── Internal helpers ──────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-white/28 uppercase tracking-widest mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="text-[12px] text-white/35">{label}</span>
      <span className="text-[12px] text-white/60 tabular-nums">{value}</span>
    </div>
  );
}
