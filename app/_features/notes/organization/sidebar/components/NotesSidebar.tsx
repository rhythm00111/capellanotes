'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  CalendarRange,
  Files,
  FolderPlus,
  Inbox,
  Star,
  Trash2,
} from 'lucide-react';
import { cn } from '@web/lib/utils';
import { Button } from '@web/components/ui/button';
import { Input } from '@web/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@web/components/ui/dialog';
import { useSidebar, ALL_NOTES_FOLDER_ID, type Folder } from '@features/notes';
import { ROUTES } from '@web/lib/routes';
import { SidebarFolderItem } from './SidebarFolderItem';

function NavItem({ icon: Icon, label, count, active, onClick }: { icon: React.ElementType; label: string; count?: number; active?: boolean; onClick?: () => void; }) {
  return (
    <button onClick={onClick} className={cn('flex items-center justify-between w-full px-3 py-2 rounded-md text-[13px] transition-colors duration-150 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500/50', active ? 'bg-white/[0.08] text-white border-l-2 border-teal-400/90 pl-[12px] shadow-[inset_2px_0_0_0_rgba(45,212,191,0.7)]' : 'text-white/65 hover:bg-white/[0.05] hover:text-white/90')}>
      <span className="flex items-center gap-2">
        <Icon className={cn('h-3.5 w-3.5 shrink-0 transition-colors duration-150', active ? 'text-teal-400' : 'text-white/25')} />
        <span className="text-[13px]">{label}</span>
      </span>
      {count !== undefined && <span className="text-[11px] text-white/35 shrink-0 tabular-nums">{count}</span>}
    </button>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-3 pt-4 pb-1.5">
      <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider letter-spacing-[0.08em]">{label}</span>
    </div>
  );
}

export function NotesSidebar() {
  const {
    folders,
    activeFolderId,
    currentView,
    getNoteCount,
    createFolder,
    deleteFolder,
    renameFolder,
  } = useSidebar();

  const [newFolderName, setNewFolderName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleCreateFolder = useCallback(async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsDialogOpen(false);
    } catch (err) {
      console.warn('[NotesSidebar] createFolder failed', err);
    }
  }, [newFolderName, createFolder]);

  const handleDeleteFolder = useCallback(async (folderId: string) => {
    try {
      await deleteFolder(folderId);
      if (activeFolderId === folderId) {
        router.push(ROUTES.notes.list());
      }
    } catch (err) {
      console.warn('[NotesSidebar] deleteFolder failed', err);
    }
  }, [deleteFolder, activeFolderId, router]);

  const handleRenameFolder = useCallback(async (folderId: string, newName: string) => {
    try {
      await renameFolder(folderId, newName);
    } catch (err) {
      console.warn('[NotesSidebar] renameFolder failed', err);
    }
  }, [renameFolder]);

  const userFolders = folders.filter((f: Folder) => f.id !== ALL_NOTES_FOLDER_ID);

  return (
    <aside className="flex flex-col w-[220px] min-w-[220px] max-w-[220px] h-full overflow-hidden bg-[#111111] border-r border-white/[0.06] z-10">
      <div className="sidebar-nav flex-1 overflow-y-auto px-2">
        <div className="py-3 space-y-1">
          <NavItem
            icon={Files}
            label="All Notes"
            count={getNoteCount(ALL_NOTES_FOLDER_ID)}
            active={currentView === 'all'}
            onClick={() => router.push(ROUTES.notes.list())}
          />

          <SectionLabel label="Quick Access" />

          <NavItem icon={CalendarDays} label="Today" active={currentView === 'today'} onClick={() => router.push(ROUTES.notes.view('today'))} />
          <NavItem icon={Star} label="Pinned" active={currentView === 'favorites'} onClick={() => router.push(ROUTES.notes.view('favorites'))} />
          <NavItem icon={CalendarRange} label="This Week" active={currentView === 'week'} onClick={() => router.push(ROUTES.notes.view('week'))} />
          <NavItem icon={Inbox} label="Inbox" active={currentView === 'inbox'} onClick={() => router.push(ROUTES.notes.view('inbox'))} />

          <div className="pt-2">
            <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
              <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Projects</span>
              <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setNewFolderName(''); }}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon-sm" title="New project folder" aria-label="Create folder" className="p-0.5"><FolderPlus className="h-3 w-3" /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Folder</DialogTitle>
                  </DialogHeader>
                  <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Folder name..." onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()} autoFocus />
                  <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Create</Button>
                </DialogContent>
              </Dialog>
            </div>

            {userFolders.length === 0 ? (
              <p className="text-[12px] text-white/28 px-3 py-1">No projects yet</p>
            ) : (
              <div className="space-y-0.5">
                {userFolders.map((folder: Folder) => {
                  const isActive = activeFolderId === folder.id && currentView === 'folder';
                  return (
                    <SidebarFolderItem
                      key={folder.id}
                      folder={folder}
                      isActive={isActive}
                      noteCount={getNoteCount(folder.id)}
                      onNavigate={() => router.push(ROUTES.notes.folder(folder.id))}
                      onDelete={() => handleDeleteFolder(folder.id)}
                      onRename={(newName) => handleRenameFolder(folder.id, newName)}
                    />
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="shrink-0 px-2 py-2 border-t border-white/[0.06]">
        <NavItem icon={Trash2} label="Trash" active={currentView === 'trash'} onClick={() => router.push(ROUTES.notes.view('trash'))} />
      </div>
    </aside>
  );
}
 
