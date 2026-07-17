'use server';

import { type Note, type Folder, ALL_NOTES_FOLDER } from '@features/notes';

export async function getNotesAction(): Promise<Note[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return [];
}

export async function getFoldersAction(): Promise<Folder[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return [ALL_NOTES_FOLDER];
}
