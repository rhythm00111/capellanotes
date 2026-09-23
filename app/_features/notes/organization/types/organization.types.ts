import { z } from 'zod';

// ─── Branded ID Types ────────────────────────────────────────────────────────

/**
 * Unique identifier for a Folder
 * The special value 'all-notes' is a virtual sentinel representing "All Notes"
 */
export type FolderId = string;

// ─── Core Domain Models ───────────────────────────────────────────────────────

/**
 * Represents a folder for organizing notes
 */
export type Folder = {
  id: FolderId;
  name: string;
  color: string;
  createdAt: string;
};

// ─── Zod Schema (runtime validation / Supabase mapping) ───────────────────────

export const FolderSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  createdAt: z.string(),
});

// ─── Folder Defaults ───────────────────────────────────────────────────────────

/**
 * Default color for newly created folders
 */
export const DEFAULT_FOLDER_COLOR = '#10B981';

// ─── Virtual "All Notes" sentinel ─────────────────────────────────────────────

/**
 * Special FolderId representing "All Notes" - a virtual folder containing every note
 * This is not a real folder in the data layer, but a UI construct
 */
export const ALL_NOTES_FOLDER_ID: FolderId = 'all-notes';

/**
 * Virtual folder object representing "All Notes"
 */
export const ALL_NOTES_FOLDER: Folder = {
  id: ALL_NOTES_FOLDER_ID,
  name: 'All Notes',
  color: '#10B981',
  createdAt: new Date(0).toISOString(),
};

// ─── Organization Input Types ─────────────────────────────────────────────────

export type CreateFolderInput = {
  name: string;
};

export type UpdateFolderInput = {
  name?: string;
  color?: string;
};
