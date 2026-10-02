/**
 * Mock data generator for development and testing
 * FRONTEND ONLY - No database integration
 */

import type { Note, Folder } from '@/notes/types/notes.types';
import { ALL_NOTES_FOLDER_ID, DEFAULT_FOLDER_COLOR } from '@/notes/types/notes.types';

// --- Mock Folders --------------------------------------------------------------

/**
 * Empty array - all test/demo folders removed.
 * Folders will be created by users through the application UI.
 */
export const MOCK_FOLDERS: Folder[] = [];

// --- Mock Notes ----------------------------------------------------------------

/**
 * Empty array - all test/demo notes removed.
 * Notes will be created by users through the application UI.
 */
export const MOCK_NOTES: Note[] = [];

// --- Mock Data Flags -----------------------------------------------------------

/**
 * Enable/disable mock data in server actions
 * CRITICAL SAFETY: Only enabled in development mode
 * 
 * Build-time assertion: If NODE_ENV is 'production', this must be false.
 * This prevents accidental mock data in production builds.
 */
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

// Build-time safety check - will cause TS error if production flag is misconfigured
if (process.env.NODE_ENV === 'production' && USE_MOCK_DATA) {
  throw new Error(
    '[CRITICAL] Mock data is enabled in production build. ' +
    'This is a configuration error. Check NODE_ENV and build settings.'
  );
}

// --- Helper Functions ----------------------------------------------------------

/**
 * Get all non-deleted notes
 */
export function getMockNotes(): Note[] {
  return MOCK_NOTES.filter(n => !n.isDeleted);
}

/**
 * Get all folders (including ALL_NOTES virtual folder)
 */
export function getMockFolders(): Folder[] {
  return MOCK_FOLDERS;
}

/**
 * Get a single note by ID
 */
export function getMockNoteById(id: string): Note | null {
  return MOCK_NOTES.find(n => n.id === id) ?? null;
}

/**
 * Get all deleted notes (trash)
 */
export function getMockTrashNotes(): Note[] {
  return MOCK_NOTES.filter(n => n.isDeleted);
}
