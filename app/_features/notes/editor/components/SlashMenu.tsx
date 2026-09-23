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
import { cn } from '@web/lib/utils';
import { type SlashCommandItem, type SlashMenuState } from '../extensions/SlashCommand';

const SLASH_ICONS: Record<string, React.ElementType> = {
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

// Group metadata: label and display order
const GROUP_META: Record<string, { label: string; order: number }> = {
  text: { label: 'Text', order: 0 },
  structure: { label: 'Structure', order: 1 },
  ai: { label: 'AI', order: 2 },
};

interface SlashMenuProps {
  state: SlashMenuState;
  keyDownRef: React.MutableRefObject<((e: KeyboardEvent) => boolean) | null>;
  onClose: () => void;
}

export function SlashMenu({ state, keyDownRef, onClose }: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset selection and clear stale item refs when the item list changes
  useEffect(() => {
    setSelectedIndex(0);
    itemRefs.current = [];
  }, [state.items]);

  // Scroll active item into view
  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Register keyboard handler into the extension's onKeyDown bridge
  useEffect(() => {
    keyDownRef.current = (event: KeyboardEvent): boolean => {
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
        if (item) {
          state.execute(item);
          onClose();
        }
        return true;
      }
      if (event.key === 'Escape') {
        onClose();
        return true;
      }
      return false;
    };

    return () => {
      keyDownRef.current = null;
    };
  }, [state, selectedIndex, keyDownRef, onClose]);

  if (state.items.length === 0) return null;

  // Group items by their group field, preserving flat indices for keyboard nav
  const groupKeys = Array.from(new Set(state.items.map((i) => i.group))).sort(
    (a, b) => (GROUP_META[a]?.order ?? 99) - (GROUP_META[b]?.order ?? 99),
  );

  const handleClick = (item: SlashCommandItem, flat: number) => {
    setSelectedIndex(flat);
    state.execute(item);
    onClose();
  };

  const { rect } = state;

  // Flip the menu above the cursor when there isn't enough space below it.
  // 320px = max-h from the scrollable list; 16px = safe margin.
  const spaceBelow = window.innerHeight - rect.bottom;
  const menuTop = spaceBelow >= 336
    ? rect.bottom + 8
    : Math.max(8, rect.top - 336 - 8);

  return (
    <div
      data-testid="slash-menu"
      style={{
        position: 'fixed',
        top: menuTop,
        left: Math.min(rect.left, window.innerWidth - 248),
        zIndex: 200,
      }}
      className="w-60 rounded-xl border border-white/[0.08] bg-[#0f0f0f] shadow-2xl overflow-hidden animate-in fade-in-0 slide-in-from-top-1 duration-150"
    >
      {/* Scrollable list area — caps at 320px so the menu never overflows viewport */}
      <div className="max-h-[320px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {groupKeys.map((groupKey) => {
          const groupItems = state.items.filter((i) => i.group === groupKey);
          if (groupItems.length === 0) return null;

          // Flat start index for this group within the full items array
          const groupStartFlat = state.items.indexOf(groupItems[0]);
          const isAi = groupKey === 'ai';

          return (
            <div key={groupKey}>
              <div className={cn(
                'px-3 pt-2.5 pb-1.5 border-b border-white/[0.06]',
                groupKey !== groupKeys[0] && 'border-t',
              )}>
                <span className={cn(
                  'text-[10px] font-semibold uppercase tracking-widest',
                  isAi ? 'text-teal-500/70' : 'text-white/25',
                )}>
                  {GROUP_META[groupKey]?.label ?? groupKey}
                </span>
              </div>
              <div className="p-1">
                {groupItems.map((item, i) => {
                  const flat = groupStartFlat + i;
                  const Icon = SLASH_ICONS[item.id];
                  return (
                    <button
                      key={item.id}
                      ref={(el) => { itemRefs.current[flat] = el; }}
                      onMouseEnter={() => setSelectedIndex(flat)}
                      onClick={() => handleClick(item, flat)}
                      className={cn(
                        'flex items-center gap-2.5 w-full px-2 py-2 rounded-lg text-[13px] text-left transition-colors duration-100',
                        flat === selectedIndex
                          ? isAi ? 'bg-teal-500/10 text-teal-400' : 'bg-white/[0.07] text-white'
                          : 'text-white/65 hover:bg-white/[0.04] hover:text-white/90',
                      )}
                    >
                      <span className={cn(
                        'shrink-0 w-7 h-7 rounded-md flex items-center justify-center',
                        isAi ? 'bg-teal-500/[0.08]' : 'bg-white/[0.05]',
                      )}>
                        {Icon
                          ? <Icon className={cn('h-3.5 w-3.5', isAi ? 'text-teal-400/70' : 'text-white/45')} />
                          : <span className={cn('text-[10px] font-bold', isAi ? 'text-teal-400/70' : 'text-white/40')}>{item.icon}</span>
                        }
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium text-[13px] leading-tight">{item.title}</div>
                        <div className="text-[11px] text-white/35 leading-tight mt-0.5">{item.description}</div>
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
