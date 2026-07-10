'use server';

import { Note, CreateNoteInput, DEFAULT_FOLDER_COLOR } from '@features/notes/types/notes.types';
import { generateId } from '@features/notes/lib/notes.helpers';

export async function createNoteAction(input: CreateNoteInput & { id?: string }): Promise<Note> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return {
    id: input.id ?? generateId(),
    title: input.title ?? 'Untitled',
    content: input.content ?? { type: 'doc', content: [{ type: 'paragraph' }] },
    folderId: input.folderId ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDeleted: false,
    isPinned: false,
  };
}

export async function createFolderAction(name: string) {
  await new Promise(resolve => setTimeout(resolve, 50));
  return {
    id: generateId(),
    name,
    color: DEFAULT_FOLDER_COLOR,
    createdAt: new Date().toISOString(),
  };
}
