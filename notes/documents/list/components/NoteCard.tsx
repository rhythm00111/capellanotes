'use client';

import { memo, useRef, useCallback, useState, useEffect } from 'react';
import { MoreHorizontal, Star, ArrowUpRight, Copy, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/notes/components/ui/button';
import { Note } from '@/notes/types/notes.types';
import { cn } from '@/notes/utils/ui.utils';
import { extractPlainTextFromJSON, formatRelativeDate, generateFallbackTitle } from '@/notes';

interface NoteCardProps {
  note: Note;
  selected: boolean;
  onClick: () => void;
  onTogglePin?: () => void;
  onOpen?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export const NoteCard = memo(function NoteCard({ note, selected, onClick, onTogglePin, onOpen, onDuplicate, onDelete }: NoteCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  }, []);

  const handleMenuAction = useCallback((action: () => void) => {
    setShowMenu(false);
    action();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMenu]);

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
              note.isPinned ? 'fill-amber-400 text-amber-400' : 'text-white/45 hover:text-amber-400',
            )}
          />
        </Button>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleMoreClick}
            title="More options"
            aria-label="More options"
            aria-expanded={showMenu}
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-100"
          >
            <MoreHorizontal className="h-3 w-3 text-white/45 hover:text-white/65 transition-colors duration-100" />
          </Button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-1 w-44 py-1 rounded-xl bg-[#141414] border border-white/[0.09] shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleMenuAction(() => onOpen?.())}
                className="flex items-center gap-2.5 w-full text-left text-[13px] text-white/65 hover:text-white hover:bg-white/[0.06] rounded-lg px-3 py-2 transition-colors duration-100"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-white/35 shrink-0" />
                Open
              </button>
              <button
                onClick={() => handleMenuAction(() => onDuplicate?.())}
                className="flex items-center gap-2.5 w-full text-left text-[13px] text-white/65 hover:text-white hover:bg-white/[0.06] rounded-lg px-3 py-2 transition-colors duration-100"
              >
                <Copy className="h-3.5 w-3.5 text-white/35 shrink-0" />
                Duplicate
              </button>
              <button
                onClick={() => handleMenuAction(() => onTogglePin?.())}
                className="flex items-center gap-2.5 w-full text-left text-[13px] text-white/65 hover:text-white hover:bg-white/[0.06] rounded-lg px-3 py-2 transition-colors duration-100"
              >
                <Star className="h-3.5 w-3.5 text-white/35 shrink-0" />
                {note.isPinned ? 'Unpin' : 'Pin'}
              </button>
              <div className="my-1 h-px bg-white/[0.06]" />
              <button
                onClick={() => handleMenuAction(() => onDelete?.())}
                className="flex items-center gap-2.5 w-full text-left text-[13px] text-red-400/75 hover:text-red-400 hover:bg-red-500/10 rounded-lg px-3 py-2 transition-colors duration-100"
              >
                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                Move to Trash
              </button>
            </div>
          )}
        </div>
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
        <p className="text-[12px] text-white/50 italic leading-snug">Empty note</p>
      )}

      <div className="flex items-end justify-between gap-2 mt-auto pt-1.5">
        <div className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pb-0.5">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] text-white/30 bg-white/[0.04] border border-white/[0.05] leading-none whitespace-nowrap shrink-0"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="text-[10px] text-white/50 leading-none self-center whitespace-nowrap shrink-0">
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
