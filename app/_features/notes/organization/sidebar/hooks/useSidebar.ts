'use client';

import { useSearchParams } from 'next/navigation';
import { useNotesStore } from '@features/notes/store';
import { getFolderNoteCount } from '@features/notes/utils';

export function useSidebar() {
  const folders = useNotesStore((s) => s.folders);
  const notes = useNotesStore((s) => s.notes);
  const createFolder = useNotesStore((s) => s.createFolder);
  const deleteFolder = useNotesStore((s) => s.deleteFolder);
  const renameFolder = useNotesStore((s) => s.renameFolder);

  const searchParams = useSearchParams();
  const folderParam = searchParams.get('folder');
  const viewParam = searchParams.get('view');

  const activeFolderId = folderParam ?? null;
  const currentView = folderParam ? 'folder' : (viewParam || 'all');

  const getNoteCount = (folderId: string) => getFolderNoteCount(notes, folderId);

  return {
    folders,
    activeFolderId,
    currentView,
    getNoteCount,
    createFolder,
    deleteFolder,
    renameFolder,
  };
}
