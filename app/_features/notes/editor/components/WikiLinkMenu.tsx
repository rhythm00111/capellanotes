'use client';

import { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@web/lib/utils';
import { type WikiLinkItem, type WikiLinkMenuState } from '../extensions/WikiLink';

interface WikiLinkMenuProps {
  state: WikiLinkMenuState;
  keyDownRef: React.MutableRefObject<((e: KeyboardEvent) => boolean) | null>;
  onClose: () => void;
}

export function WikiLinkMenu({ state, keyDownRef, onClose }: WikiLinkMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setSelectedIndex(0);
    itemRefs.current = [];
  }, [state.items]);

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Bridge keyboard events from TipTap suggestion into this menu
  useEffect(() => {
    keyDownRef.current = (event: KeyboardEvent): boolean => {
      if (state.items.length === 0) return false;
      if (event.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % state.items.length);
        return true;
      }
      if (event.key === 'ArrowUp') {
        setSelectedIndex((i) => (i - 1 + state.items.length) % state.items.length);
        return true;
      }
      if (event.key === 'Enter') {
        const item = state.items[selectedIndex];
        if (item) { state.execute(item); onClose(); }
        return true;
      }
      if (event.key === 'Escape') { onClose(); return true; }
      return false;
    };
    return () => { keyDownRef.current = null; };
  }, [state, selectedIndex, keyDownRef, onClose]);

  const baseStyle = {
    position: 'fixed' as const,
    top: state.rect.bottom + 8,
    left: Math.min(state.rect.left, window.innerWidth - 232),
    zIndex: 200,
  };

  if (state.items.length === 0) {
    return (
      <div style={baseStyle} className="w-56 py-3 px-3 rounded-xl border border-white/[0.08] bg-[#0f0f0f] shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150">
        <p className="text-[12px] text-white/25 text-center">No notes found</p>
      </div>
    );
  }

  return (
    <div
      style={baseStyle}
      className="w-56 rounded-xl border border-white/[0.08] bg-[#0f0f0f] shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
    >
      <div className="px-3 pt-2 pb-1.5 border-b border-white/[0.05]">
        <span className="text-[10px] font-semibold text-white/20 uppercase tracking-widest">Link to note</span>
      </div>
      <div className="p-1 max-h-[200px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {state.items.map((item: WikiLinkItem, i: number) => (
          <button
            key={item.id}
            ref={(el) => { itemRefs.current[i] = el; }}
            onMouseEnter={() => setSelectedIndex(i)}
            onClick={() => { state.execute(item); onClose(); }}
            className={cn(
              'flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-sm text-left transition-colors duration-100',
              i === selectedIndex
                ? 'bg-white/[0.07] text-white'
                : 'text-white/60 hover:bg-white/[0.04] hover:text-white/85',
            )}
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-white/25" />
            <span className="truncate text-[13px]">{item.title || 'Untitled'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
