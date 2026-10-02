'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { ViewToggle, type ViewMode } from './ViewToggle';
import { openCommandPalette } from '@/notes';

function getKeyboardShortcutHint(): string {
  if (typeof window === 'undefined') return '⌘K';
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform) || 
    (navigator.userAgent && /Mac/.test(navigator.userAgent));
  return isMac ? '⌘K' : 'Ctrl K';
}

interface NotesHeaderProps {
  viewTitle: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreate: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function NotesHeader({ viewTitle, searchQuery, onSearchChange, onCreate, viewMode, onViewModeChange }: NotesHeaderProps) {
  const [draft, setDraft] = useState(searchQuery);
  const [shortcutHint, setShortcutHint] = useState('⌘K');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShortcutHint(getKeyboardShortcutHint());
  }, []);

  useEffect(() => {
    setDraft(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (draft !== searchQuery) {
        onSearchChange(draft);
      }
    }, 150);
    return () => window.clearTimeout(id);
  }, [draft, onSearchChange, searchQuery]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Command palette: ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
      }
      // Search focus: ⌘/ or Ctrl+/
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleClear = () => {
    setDraft('');
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <header className="shrink-0 flex flex-col gap-3 px-4 py-3 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-white/[0.06] md:block hidden">
      <div className="flex items-center justify-between gap-3 min-w-0">
        <h1 className="text-[13px] font-semibold text-white/80 truncate min-w-0">{viewTitle}</h1>
        <div className="flex items-center gap-2 shrink-0">
          <ViewToggle value={viewMode} onChange={onViewModeChange} />
          <button
            onClick={onCreate}
            className="flex items-center gap-1 h-7 px-2.5 rounded-md text-[12px] font-medium text-teal-400 bg-teal-400/[0.08] hover:bg-teal-400/[0.15] border border-teal-400/[0.12] hover:border-teal-400/25 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50 whitespace-nowrap"
            title={`New note (${shortcutHint.startsWith('⌘') ? '⌘N' : 'Ctrl N'})`}
            aria-label="Create new note"
          >
            + New
          </button>
        </div>
      </div>

      <div className="relative min-w-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/45 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onDoubleClick={openCommandPalette}
          placeholder="Search notes, ideas, tasks..."
          aria-label="Search notes"
          className="w-full h-7 pl-8 pr-8 text-[12px] bg-white/[0.03] border border-white/[0.05] rounded-md text-white/80 placeholder:text-white/45 focus:outline-none focus:ring-1 focus:ring-teal-500/40 focus:border-teal-500/40 transition-colors duration-150"
        />
        {draft ? (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50 rounded"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        ) : (
          <button
            onClick={openCommandPalette}
            title={`Open command palette (${shortcutHint})`}
            aria-label="Open command palette"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <kbd className="inline-flex items-center px-1 py-0.5 rounded text-[9px] font-medium text-white/20 bg-white/[0.04] border border-white/[0.06] leading-none tracking-wide">
              {shortcutHint}
            </kbd>
          </button>
        )}
      </div>
    </header>
  );
}
