'use client';

import { memo, useRef, useCallback } from 'react';
import { MoreHorizontal, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note } from '@features/notes/types/notes.types';
import { cn } from '@/lib/utils';
import { extractPlainTextFromJSON, formatRelativeDate, generateFallbackTitle } from '@features/notes';

interface NoteCardProps {
  note: Note;
  selected: boolean;
  onClick: () => void;
  onTogglePin?: () => void;
}

export const NoteCard = memo(function NoteCard({ note, selected, onClick, onTogglePin }: NoteCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    el.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: e.clientX,
      clientY: e.clientY,
    }));
  }, []);

  if (!note) return null;
  const displayTitle = generateFallbackTitle(note.title, note.content);
  const snippet = extractPlainTextFromJSON(note.content).slice(0, 220).trim();
  const tags = note.tags ?? [];

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={cn(
        'group relative flex flex-col gap-2 p-4 rounded-xl cursor-pointer select-none outline-none border focus-visible:ring-1 focus-visible:ring-teal-500/50',
        'transition-all duration-150 ease-in-out',
        selected
          ? 'bg-white/[0.07] border-teal-500/20 shadow-[0_0_0_1px_rgba(20,184,166,0.12)]'
          : 'bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.055] hover:border-white/[0.09] hover:shadow-md',
      )}
    >
      <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => { e.stopPropagation(); onTogglePin?.(); }}
          title={note.isPinned ? 'Unpin' : 'Pin'}
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          className={cn(
            'transition-opacity duration-100',
            note.isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          )}
        >
          <Star
            className={cn(
              'h-3 w-3 transition-colors duration-100',
              note.isPinned ? 'fill-amber-400 text-amber-400' : 'text-white/25 hover:text-amber-400',
            )}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleMoreClick}
          title="More options"
          aria-label="More options"
          className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-100"
        >
          <MoreHorizontal className="h-3 w-3 text-white/25 hover:text-white/55 transition-colors duration-100" />
        </Button>
      </div>

      <p
        className={cn(
          'text-[13px] font-medium leading-snug pr-10 truncate',
          selected ? 'text-white' : 'text-white/85',
        )}
      >
        {displayTitle}
      </p>

      {snippet ? (
        <p
          className="text-[12px] text-white/45 leading-[1.55] overflow-hidden"
          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
        >
          {snippet}
        </p>
      ) : (
        <p className="text-[12px] text-white/28 italic leading-snug">Empty note</p>
      )}

      <div className="flex items-end justify-between gap-2 mt-auto pt-1.5">
        <div className="flex flex-wrap gap-1 min-w-0 overflow-hidden">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-white/30 bg-white/[0.04] border border-white/[0.05] leading-none"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-[10px] text-white/28 leading-none self-center">
              +{tags.length - 2}
            </span>
          )}
        </div>

        <span className="shrink-0 text-[11px] text-white/32 tabular-nums whitespace-nowrap">
          {formatRelativeDate(note.updatedAt)}
        </span>
      </div>
    </div>
  );
});
 
