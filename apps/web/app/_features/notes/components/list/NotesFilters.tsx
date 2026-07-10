'use client';

import { cn } from '@/lib/utils';

export type ActiveFilter = 'all' | 'pinned' | 'recent' | string;

interface NotesFiltersProps {
  activeFilter: ActiveFilter;
  availableTags: string[];
  onChange: (filter: ActiveFilter) => void;
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50',
        active
          ? 'bg-teal-500/[0.12] text-teal-300 ring-1 ring-teal-500/20'
          : 'bg-white/[0.03] text-white/38 hover:bg-white/[0.06] hover:text-white/60',
      )}
    >
      {label}
    </button>
  );
}

export function NotesFilters({ activeFilter, availableTags, onChange }: NotesFiltersProps) {
  if (availableTags.length === 0) return null;

  const toggle = (filter: ActiveFilter) =>
    onChange(activeFilter === filter ? 'all' : filter);

  return (
    <div
      className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.04] overflow-x-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      {activeFilter !== 'all' && (
        <Chip label="All" active={true} onClick={() => onChange('all')} />
      )}

      {availableTags.map((tag) => (
        <Chip
          key={tag}
          label={`#${tag}`}
          active={activeFilter === tag}
          onClick={() => toggle(tag)}
        />
      ))}
    </div>
  );
}
 
