'use client';

import { memo } from 'react';
import { List, LayoutGrid } from 'lucide-react';
import { cn } from '@/notes/utils/ui.utils';

export type ViewMode = 'list' | 'grid';

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewToggle = memo(function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div
      className="flex items-center gap-px p-px rounded-md bg-white/[0.04] border border-white/[0.06] h-7"
      role="group"
      aria-label="View mode"
    >
      <button
        onClick={() => onChange('list')}
        title="List view"
        aria-label="List view"
        aria-pressed={value === 'list'}
        className={cn(
          'flex items-center justify-center h-full w-6 rounded transition-all duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50',
          value === 'list'
            ? 'bg-white/[0.12] text-white/80'
            : 'text-white/45 hover:text-white/65',
        )}
      >
        <List className="h-3 w-3" />
      </button>
      <button
        onClick={() => onChange('grid')}
        title="Grid view"
        aria-label="Grid view"
        aria-pressed={value === 'grid'}
        className={cn(
          'flex items-center justify-center h-full w-6 rounded transition-all duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50',
          value === 'grid'
            ? 'bg-white/[0.12] text-white/80'
            : 'text-white/45 hover:text-white/65',
        )}
      >
        <LayoutGrid className="h-3 w-3" />
      </button>
    </div>
  );
});
