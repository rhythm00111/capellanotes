'use client';

import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Star, Trash2, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/notes/components/ui/button';
import { cn } from '@/notes/utils/ui.utils';

interface NoteHeaderProps {
  title: string;
  isPinned: boolean;
  isDeleted: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
  titleRef: React.RefObject<HTMLTextAreaElement | null>;
  onTitleChange: (value: string) => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onTogglePin: () => void;
  onDelete: () => void;
  /** T12: Tag list for the note */
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

export const NoteHeader = memo(function NoteHeader({
  title,
  isPinned,
  isDeleted,
  saveStatus,
  titleRef,
  onTitleChange,
  onTitleKeyDown,
  onTogglePin,
  onDelete,
  tags = [],
  onTagsChange,
}: NoteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // T12: tag input toggle
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [tagDraft, setTagDraft] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const commitTag = useCallback(() => {
    const value = tagDraft.trim().toLowerCase().replace(/\s+/g, '-');
    if (value && !tags.includes(value) && onTagsChange) {
      onTagsChange([...tags, value]);
    }
    setTagDraft('');
    setTagInputVisible(false);
  }, [tagDraft, tags, onTagsChange]);

  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); commitTag(); }
    if (e.key === 'Escape') { setTagDraft(''); setTagInputVisible(false); }
  }, [commitTag]);

  const removeTag = useCallback((tag: string) => {
    onTagsChange?.(tags.filter((t) => t !== tag));
  }, [tags, onTagsChange]);

  useEffect(() => {
    if (tagInputVisible) tagInputRef.current?.focus();
  }, [tagInputVisible]);

  // Close overflow menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Close on Escape when open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handlePinClick = useCallback(() => {
    onTogglePin();
    setMenuOpen(false);
  }, [onTogglePin]);

  const handleDeleteClick = useCallback(() => {
    setMenuOpen(false);
    onDelete();
  }, [onDelete]);

  return (
    <div className="flex flex-col w-full gap-3">
      {/* Breadcrumb (if any) */}
      {/* <div className="text-[11px] text-white/40 font-medium mb-1">Home / Notes</div> */}

      {/* Title row + overflow actions */}
      <div className="flex items-end gap-3">
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={onTitleKeyDown}
          rows={1}
          disabled={isDeleted}
          aria-label="Note title"
          className="flex-1 resize-none overflow-hidden bg-transparent text-[30px] md:text-[32px] font-medium text-white/90 leading-[1.15] tracking-[-0.025em] border-none outline-none focus:outline-none placeholder:text-white/12 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-150"
          placeholder="Untitled"
          style={{ minHeight: 40, marginBottom: 0 }}
        />
        {!isDeleted && (
          <div className="relative pt-1 shrink-0" ref={menuRef}>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="More actions"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                'h-7 w-7 rounded-md flex items-center justify-center transition-all duration-150',
                menuOpen
                  ? 'bg-white/[0.07] text-white/60'
                  : 'text-white/20 hover:text-white/50 hover:bg-white/[0.05] opacity-0 group-hover:opacity-100',
              )}
              title="More actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-white/[0.08] bg-[#111111] shadow-2xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="p-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handlePinClick}
                    role="menuitem"
                    className="flex items-center gap-2.5 w-full text-[13px] text-left text-white/65 hover:bg-white/[0.06] hover:text-white/90"
                  >
                    <Star className={cn('h-3.5 w-3.5 shrink-0', isPinned ? 'fill-amber-400 text-amber-400' : 'text-white/35')} />
                    <span>{isPinned ? 'Unpin' : 'Pin note'}</span>
                  </Button>
                  <div className="h-px bg-white/[0.05] my-1 mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteClick}
                    role="menuitem"
                    className="flex items-center gap-2.5 w-full text-[13px] text-left text-red-400/70 hover:bg-red-500/[0.07] hover:text-red-400 focus-visible:ring-red-500/40"
                  >
                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Move to Trash</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-2 min-h-[20px] text-[11px] text-white/40 font-normal mb-1">
        {/* Example: Created date, status, etc. */}
        {/* <span>Created Apr 30</span> */}
        <span className={cn('flex items-center gap-1.5 transition-opacity duration-700', saveStatus === 'idle' ? 'opacity-0' : 'opacity-100')}>
          <span className={cn('w-1 h-1 rounded-full shrink-0 transition-colors duration-500', saveStatus === 'saving' ? 'bg-amber-400/45' : 'bg-emerald-500/40')} />
          <span className="text-[11px] text-white/30 tracking-wide">
            {saveStatus === 'saving' ? 'Saving' : 'Saved'}
          </span>
        </span>
      </div>

      {/* Tag row — always visible when not deleted */}
      {!isDeleted && (
        <div className="flex flex-wrap items-center gap-2 py-1 mb-2 border-b border-white/[0.04]">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-[12px] text-white/45 hover:text-white/65 hover:border-white/[0.12] transition-colors duration-100 group/tag"
              >
                <span className="text-white/30 mr-0.5">#</span>{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 opacity-0 group-hover/tag:opacity-100 hover:text-white/80 transition-opacity duration-100"
                  title={`Remove tag "${tag}"`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-[12px] text-white/50">No tags</span>
          )}

          {tagInputVisible ? (
            <input
              ref={tagInputRef}
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={commitTag}
              className="inline-block w-28 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.12] text-[12px] text-white/65 placeholder:text-white/20 outline-none focus:border-white/[0.25] transition-colors duration-100"
              placeholder="tag name"
              aria-label="Add tag"
            />
          ) : (
            <button
              onClick={() => setTagInputVisible(true)}
              className="text-[11px] text-white/20 hover:text-white/45 transition-colors duration-100 px-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50 rounded"
              aria-label="Add tag"
              disabled={!onTagsChange}
            >
              + Add tag
            </button>
          )}
        </div>
      )}
    </div>
  );
});
