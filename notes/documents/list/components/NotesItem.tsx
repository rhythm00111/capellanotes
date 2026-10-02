'use client';

import { memo, useRef, useCallback } from 'react';
import { Note } from '@/notes/types/notes.types';
import { cn } from '@/notes/utils/ui.utils';
import { Link2, MoreHorizontal, Star } from 'lucide-react';
import { countWikiLinks, extractPlainTextFromJSON, formatRelativeDate, generateFallbackTitle } from '@/notes';

interface NotesItemProps {
  note: Note;
  selected: boolean;
  onClick: () => void;
  /** Called when the user clicks the pin star. Must not trigger row navigation. */
  onTogglePin?: () => void;
}

export const NotesItem = memo(function NotesItem({ note, selected, onClick, onTogglePin }: NotesItemProps) {
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
  const snippet = extractPlainTextFromJSON(note.content).slice(0, 140).trim();
  const tags = note.tags ?? [];
  const linkedCount = countWikiLinks(note.content);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        'group relative flex flex-col gap-2 px-4 py-4 rounded-lg cursor-pointer transition-all duration-150 ease-in-out select-none outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50',
        selected
          ? 'bg-white/[0.07] ring-1 ring-white/[0.07]'
          : 'hover:bg-white/[0.035]',
      )}
    >
      {selected && (
        <span className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r-full bg-teal-400/80" />
      )}

      <div className="flex items-center justify-between gap-2 min-w-0">
        <span
          className={cn(
            'truncate text-[13px] font-medium leading-snug min-w-0',
            selected ? 'text-white' : 'text-white/85',
          )}
        >
          {displayTitle}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin?.(); }}
            title={note.isPinned ? 'Unpin' : 'Pin'}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
            className={cn(
              'flex items-center justify-center w-5 h-5 rounded transition-opacity duration-100',
              note.isPinned
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
            )}
          >
            <Star
              className={cn(
                'h-3 w-3 transition-colors duration-100',
                note.isPinned
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-white/45 hover:text-amber-400',
              )}
            />
          </button>
          <button
            onClick={handleMoreClick}
            title="More options"
            aria-label="More options"
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 flex items-center justify-center w-5 h-5 rounded transition-opacity duration-100"
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-white/45 hover:text-white/65 transition-colors duration-100" />
          </button>
          <span className="text-[11px] text-white/32 tabular-nums whitespace-nowrap ml-1">
            {formatRelativeDate(note.updatedAt)}
          </span>
        </div>
      </div>

      {snippet && (
        <p
          className="text-[12px] text-white/45 leading-[1.6] overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {snippet}
        </p>
      )}

      {(tags.length > 0 || linkedCount > 0) && (
        <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pb-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-white/35 bg-white/[0.04] border border-white/[0.06] leading-none whitespace-nowrap shrink-0"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-white/45 leading-none whitespace-nowrap shrink-0">
              +{tags.length - 3}
            </span>
          )}
          {linkedCount > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-white/45 bg-white/[0.03] border border-white/[0.04] leading-none whitespace-nowrap shrink-0">
              <Link2 className="h-2.5 w-2.5" />
              {linkedCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
