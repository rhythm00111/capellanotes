'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CalendarDays, CalendarRange, FileText, Files, Inbox, Plus, Search } from 'lucide-react';
import { cn } from '@/notes/utils/ui.utils';
import { useNotesStore, useNoteNavigation, useCommandPalette } from '@/notes';
import { ROUTES } from '@/notes/config';

const MAX_RESULTS = 6;

// --- Palette item model -------------------------------------------------------

type PaletteItemType = 'quick' | 'note' | 'create';

interface PaletteItem {
  type: PaletteItemType;
  id: string;
  label: string;
  icon: React.ElementType;
  /** Section heading shown above the FIRST item in a group */
  section?: string;
  onSelect: () => void;
}

// --- CommandPalette -----------------------------------------------------------

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const notes = useNotesStore((s) => s.notes);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigateToNote, createAndNavigate } = useNoteNavigation();
  const router = useRouter();

  // Prevent SSR/hydration issues - only render on client after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // CRITICAL: Close palette on unmount to prevent stuck backdrops
  useEffect(() => {
    return () => {
      close();
    };
  }, [close]);

  // Filtered + sorted note results
  const noteResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => !n.isDeleted && (q === '' || n.title.toLowerCase().includes(q)))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, MAX_RESULTS);
  }, [notes, query]);

  // Unified items list — structure changes when query is empty vs active
  const items = useMemo<PaletteItem[]>(() => {
    const list: PaletteItem[] = [];
    const hasQuery = query.trim() !== '';

    // Quick navigation actions — visible only when no query
    if (!hasQuery) {
      list.push(
        { type: 'quick', id: 'nav-all', label: 'All Notes', icon: Files, section: 'Navigate', onSelect: () => { router.push(ROUTES.notes.list()); close(); } },
        { type: 'quick', id: 'nav-today', label: 'Today', icon: CalendarDays, onSelect: () => { router.push(ROUTES.notes.view('today')); close(); } },
        { type: 'quick', id: 'nav-week', label: 'This Week', icon: CalendarRange, onSelect: () => { router.push(ROUTES.notes.view('week')); close(); } },
        { type: 'quick', id: 'nav-inbox', label: 'Inbox', icon: Inbox, onSelect: () => { router.push(ROUTES.notes.view('inbox')); close(); } },
      );
    }

    // Note results
    if (noteResults.length > 0) {
      noteResults.forEach((n, i) => {
        list.push({
          type: 'note',
          id: n.id,
          label: n.title || 'Untitled',
          icon: FileText,
          section: i === 0 ? (hasQuery ? 'Results' : 'Recent') : undefined,
          onSelect: () => { navigateToNote(n.id); close(); },
        });
      });
    }

    // Create action — always last
    list.push({
      type: 'create',
      id: 'create',
      label: hasQuery ? `Create "${query.trim()}"` : 'New note',
      icon: Plus,
      onSelect: () => { createAndNavigate(); close(); },
    });

    return list;
  }, [query, noteResults, router, close, navigateToNote, createAndNavigate]);

  // Reset state each time the palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      // Use setTimeout to ensure the dialog is fully rendered before focusing
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Close palette on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (isOpen) {
        close();
      }
    };
    // Listen for Next.js route changes via popstate and pushState
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isOpen, close]);

  // Reset selection when items change
  useEffect(() => { setSelectedIndex(0); }, [items]);

  // Keyboard navigation + focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Tab': {
          // Focus trap: prevent Tab from escaping the palette
          e.preventDefault();
          // Keep focus on the input field (simple but effective)
          if (document.activeElement !== inputRef.current) {
            inputRef.current?.focus();
          }
          break;
        }
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % items.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + items.length) % items.length);
          break;
        case 'Enter': {
          e.preventDefault();
          const item = items[selectedIndex];
          if (item) item.onSelect();
          break;
        }
        case 'Escape':
          e.preventDefault();
          close();
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, items, selectedIndex, close]);

  // Don't render anything until mounted on client
  if (!mounted) return null;
  // Don't render backdrop/panel if not open
  if (!isOpen) {
    console.log('[CommandPalette] Not rendering - isOpen =', isOpen);
    return null;
  }

  console.log('[CommandPalette] RENDERING BACKDROP - isOpen =', isOpen, 'mounted =', mounted);

  return (
    <>
      {/* Backdrop */}
      <div
        data-command-palette-open={isOpen ? 'true' : 'false'}
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-[2px] DATA-TEST-BACKDROP"
        onMouseDown={close}
        aria-hidden="true"
      />

      {/* Palette panel */}
      <div className="fixed top-[18vh] left-1/2 -translate-x-1/2 z-[201] w-full max-w-[560px] px-4 pointer-events-none">
        <div
          data-testid="command-palette"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="rounded-2xl border border-white/[0.08] bg-[#0f0f0f] shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150 pointer-events-auto"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 h-14 border-b border-white/[0.05]">
            <Search className="h-4 w-4 text-white/45 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              className="flex-1 bg-transparent text-[15px] text-white/90 placeholder:text-white/45 outline-none"
              placeholder="Search, create, or navigate—"
              aria-label="Command palette search"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[11px] text-white/20 border border-white/[0.08] font-mono">
              esc
            </kbd>
          </div>

          {/* Results */}
          <div className="py-1 max-h-[360px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {/* No results message */}
            {noteResults.length === 0 && query.trim() !== '' && (
              <div className="px-4 pt-6 pb-2 text-center">
                <p className="text-[13px] text-white/50">No notes match &ldquo;{query}&rdquo;</p>
              </div>
            )}

            {/* Unified item list */}
            {items.map((item, i) => {
              const isSelected = i === selectedIndex;
              const isCreate = item.type === 'create';
              return (
                <div key={item.id}>
                  {/* Section heading */}
                  {item.section && (
                    <div className="px-4 pt-3 pb-1 text-[10px] font-semibold text-white/50 uppercase tracking-widest">
                      {item.section}
                    </div>
                  )}
                  {/* Item row */}
                  <button
                    onMouseEnter={() => setSelectedIndex(i)}
                    onClick={item.onSelect}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors duration-75',
                      isCreate && 'border-t border-white/[0.04] mt-1',
                      isSelected ? 'bg-white/[0.06] text-white' : 'text-white/55 hover:bg-white/[0.03]',
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-3.5 w-3.5 shrink-0',
                        isSelected
                          ? item.type === 'quick' ? 'text-teal-400' : 'text-white/40'
                          : 'text-white/45',
                      )}
                    />
                    <span className="flex-1 text-[14px] truncate">{item.label}</span>
                    {item.type === 'note' && (
                      <ArrowRight
                        className={cn(
                          'h-3 w-3 shrink-0 transition-opacity',
                          isSelected ? 'opacity-30' : 'opacity-0',
                        )}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
