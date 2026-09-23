'use server';

import { type UpdateNoteInput } from '@features/notes';

export async function updateNoteAction(id: string, updates: UpdateNoteInput & { updatedAt?: string }): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 50));
}

export async function renameFolderAction(id: string, newName: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 50));
}
