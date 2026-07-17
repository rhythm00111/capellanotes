import { type Note } from '@features/notes/types/notes.types';
import { ALL_NOTES_FOLDER_ID } from '../types/organization.types';

/**
 * Organization domain utilities
 * Owns folder and organization-related helper functions
 */

/**
 * Count the number of active (non-deleted) notes in a folder
 * For the virtual ALL_NOTES_FOLDER, returns total active notes
 * For specific folders, counts notes in that folder only
 */
export const getFolderNoteCount = (notes: Note[], folderId: string): number => {
  const active = notes.filter((n) => !n.isDeleted);
  if (folderId === ALL_NOTES_FOLDER_ID) return active.length;
  return active.filter((n) => n.folderId === folderId).length;
};
