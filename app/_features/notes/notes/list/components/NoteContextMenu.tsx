'use client';

import { useState } from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from '@web/components/ui/context-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@web/components/ui/dialog';
import { Input } from '@web/components/ui/input';
import { Button } from '@web/components/ui/button';
import { ArrowUpRight, Copy, Pencil, Pin, PinOff, RotateCcw, Star, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

interface NoteContextMenuProps {
  children: ReactNode;
  noteTitle?: string;
  onOpen: () => void;
  onDuplicate: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  onRestore?: () => void;
  onPermanentDelete?: () => void;
  onRename?: (newTitle: string) => void;
  isPinned: boolean;
  isDeleted?: boolean;
}

export function NoteContextMenu({
  children,
  noteTitle,
  onOpen,
  onDuplicate,
  onTogglePin,
  onDelete,
  onRestore,
  onPermanentDelete,
  onRename,
  isPinned,
  isDeleted,
}: NoteContextMenuProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const handleRenameOpen = () => {
    setRenameValue(noteTitle ?? '');
    setIsRenaming(true);
  };

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (trimmed) onRename?.(trimmed);
    setIsRenaming(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent
          collisionPadding={8}
          className="bg-[#141414] border-white/[0.09] min-w-[168px] p-1 rounded-xl shadow-2xl"
        >
          {isDeleted ? (
            <>
              <ContextMenuItem
                onClick={() => onRestore?.()}
                className="flex items-center gap-2.5 text-[13px] text-white/65 focus:text-white focus:bg-white/[0.06] rounded-lg px-3 py-2"
              >
                <RotateCcw className="h-3.5 w-3.5 text-white/35 shrink-0" />
                Restore
              </ContextMenuItem>
              <ContextMenuSeparator className="bg-white/[0.06] my-1" />
              <ContextMenuItem
                onClick={() => onPermanentDelete?.()}
                className="flex items-center gap-2.5 text-[13px] text-red-400/80 focus:text-red-400 focus:bg-red-500/10 rounded-lg px-3 py-2"
              >
                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                Delete Forever
              </ContextMenuItem>
            </>
          ) : (
            <>
              <ContextMenuItem
                onClick={onOpen}
                className="flex items-center gap-2.5 text-[13px] text-white/65 focus:text-white focus:bg-white/[0.06] rounded-lg px-3 py-2"
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-white/35 shrink-0" />
                Open
              </ContextMenuItem>
              <ContextMenuSeparator className="bg-white/[0.06] my-1" />
              <ContextMenuItem
                onClick={onTogglePin}
                className="flex items-center gap-2.5 text-[13px] text-white/65 focus:text-white focus:bg-white/[0.06] rounded-lg px-3 py-2"
              >
                {isPinned
                  ? <PinOff className="h-3.5 w-3.5 text-white/35 shrink-0" />
                  : <Star className="h-3.5 w-3.5 text-white/35 shrink-0" />}
                {isPinned ? 'Unpin' : 'Pin'}
              </ContextMenuItem>
              <ContextMenuItem
                onClick={onDuplicate}
                className="flex items-center gap-2.5 text-[13px] text-white/65 focus:text-white focus:bg-white/[0.06] rounded-lg px-3 py-2"
              >
                <Copy className="h-3.5 w-3.5 text-white/35 shrink-0" />
                Duplicate
              </ContextMenuItem>
              <ContextMenuItem
                onClick={handleRenameOpen}
                className="flex items-center gap-2.5 text-[13px] text-white/65 focus:text-white focus:bg-white/[0.06] rounded-lg px-3 py-2"
              >
                <Pencil className="h-3.5 w-3.5 text-white/35 shrink-0" />
                Rename
              </ContextMenuItem>
              <ContextMenuSeparator className="bg-white/[0.06] my-1" />
              <ContextMenuItem
                onClick={onDelete}
                className="flex items-center gap-2.5 text-[13px] text-red-400/75 focus:text-red-400 focus:bg-red-500/10 rounded-lg px-3 py-2"
              >
                <Trash2 className="h-3.5 w-3.5 shrink-0" />
                Move to Trash
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={isRenaming} onOpenChange={(open) => { if (!open) setIsRenaming(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Note</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Note title..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit();
              if (e.key === 'Escape') setIsRenaming(false);
            }}
            autoFocus
          />
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" onClick={() => setIsRenaming(false)}>Cancel</Button>
            <Button onClick={handleRenameSubmit} disabled={!renameValue.trim()}>Rename</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
 
