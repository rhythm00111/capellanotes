'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SLASH_COMMANDS, type SlashCommandItem } from '../extensions/SlashCommand';

const BLOCK_ICONS: Record<string, React.ElementType> = {
  text: Type,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  bullet: List,
  numbered: ListOrdered,
  quote: Quote,
  code: Code2,
  divider: Minus,
};

const GROUPS: Array<{ key: 'text' | 'structure'; label: string }> = [
  { key: 'text', label: 'Text' },
  { key: 'structure', label: 'Structure' },
];

// Only show text + structure groups (no AI placeholder entries)
const BLOCK_COMMANDS = SLASH_COMMANDS.filter((c) => c.group !== 'ai');

interface BlockMenuProps {
  /** Viewport coordinates to anchor the top-left corner of the menu */
  pos: { x: number; y: number };
  onSelect: (item: SlashCommandItem) => void;
  onClose: () => void;
}

export function BlockMenu({ pos, onSelect, onClose }: BlockMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Prevent editor focus loss when clicking inside the menu
  const handleMenuMouseDown = (e: React.MouseEvent) => e.preventDefault();

  // Close on outside click (delayed so the opening mousedown doesn't fire it)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handler);
    };
  }, [onClose]);

  // Keyboard navigation — attached to document so it works even with editor focus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % BLOCK_COMMANDS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + BLOCK_COMMANDS.length) % BLOCK_COMMANDS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = BLOCK_COMMANDS[selectedIndex];
        if (item) {
          onSelect(item);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [selectedIndex, onSelect, onClose]);

  // Scroll active item into view on keyboard navigation
  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Guard against viewport overflow: clamp left edge so menu doesn't clip
  const menuLeft = Math.min(pos.x, window.innerWidth - 232);

  return (
    <div
      ref={menuRef}
      onMouseDown={handleMenuMouseDown}
      data-testid="block-menu"
      style={{
        position: 'fixed',
        top: pos.y + 6,
        left: menuLeft,
        zIndex: 200,
      }}
      className="w-56 rounded-xl border border-white/[0.08] bg-[#0f0f0f] shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
    >
      <div className="max-h-[320px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {GROUPS.map(({ key, label }) => {
          const groupItems = BLOCK_COMMANDS.filter((i) => i.group === key);
          if (groupItems.length === 0) return null;

          return (
            <div key={key}>
              <div className="px-3 pt-2.5 pb-1 border-b border-white/[0.06]">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/25">
                  {label}
                </span>
              </div>
              <div className="p-1">
                {groupItems.map((item) => {
                  const flat = BLOCK_COMMANDS.indexOf(item);
                  const Icon = BLOCK_ICONS[item.id];
                  return (
                    <button
                      key={item.id}
                      ref={(el) => {
                        itemRefs.current[flat] = el;
                      }}
                      onMouseEnter={() => setSelectedIndex(flat)}
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className={cn(
                        'flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-sm text-left transition-colors duration-100',
                        flat === selectedIndex
                          ? 'bg-white/[0.07] text-white'
                          : 'text-white/60 hover:bg-white/[0.05] hover:text-white/75',
                      )}
                    >
                      {Icon ? (
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.06] shrink-0">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.06] text-[10px] font-mono shrink-0">
                          {item.icon}
                        </span>
                      )}
                      <div className="flex flex-col gap-0 min-w-0">
                        <span className="text-[13px] font-medium leading-snug truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-white/30 leading-snug">
                          {item.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
