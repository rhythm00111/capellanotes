'use client';

import { useState, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Folder } from '@features/notes/types/notes.types';

interface SidebarFolderItemProps {
  folder: Folder;
  isActive: boolean;
  noteCount: number;
  onNavigate: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

export function SidebarFolderItem({ folder, isActive, noteCount, onNavigate, onDelete, onRename }: SidebarFolderItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={cn('flex items-center justify-between px-3 py-2 rounded-md', isActive ? 'bg-white/[0.04] text-white' : 'text-white/65')}>
      <button onClick={onNavigate} className="text-left w-full truncate">
        <span className="truncate">{folder.name}</span>
      </button>
      <div className="ml-2 flex items-center gap-2">
        <span className="text-[11px] text-white/35 tabular-nums">{noteCount}</span>
        <button onClick={() => setIsRenaming(true)} className="opacity-60 hover:opacity-100">
          <MoreHorizontal className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
 
