import { z } from 'zod';
import { type JSONContent } from '@tiptap/react';

// ─── Import Organization Domain Types ──────────────────────────────────────────
// Organization owns all folder-related types
// (Folder, FolderId, DEFAULT_FOLDER_COLOR, ALL_NOTES_FOLDER_ID, ALL_NOTES_FOLDER)

export type {
  FolderId,
  Folder,
  CreateFolderInput,
  UpdateFolderInput,
} from '@features/notes/organization/types/organization.types';

export {
  DEFAULT_FOLDER_COLOR,
  ALL_NOTES_FOLDER_ID,
  ALL_NOTES_FOLDER,
  FolderSchema,
} from '@features/notes/organization/types/organization.types';

// ─── Branded ID Types ─────────────────────────────────────────────────────────

export type NoteId = string;

// ─── Core Domain Models ───────────────────────────────────────────────────────

export type Note = {
  id: NoteId;
  title: string;
  content: JSONContent;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isDeleted: boolean;
  folderId: string | null; // FolderId from organization domain
  tags?: string[];
};

// ─── Input Types ──────────────────────────────────────────────────────────────

export type CreateNoteInput = {
  title?: string;
  content?: JSONContent;
  folderId?: string | null; // FolderId from organization domain
};

export type UpdateNoteInput = {
  title?: string;
  content?: JSONContent;
  isPinned?: boolean;
  folderId?: string | null; // FolderId from organization domain
  tags?: string[];
};

// ─── View Enum ────────────────────────────────────────────────────────────────

export type NotesView = 'all' | 'trash' | 'folder' | 'favorites' | 'today' | 'week' | 'inbox';

// ─── Zod Schema (runtime validation / Supabase mapping) ───────────────────────

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.custom<JSONContent>(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isPinned: z.boolean(),
  isDeleted: z.boolean(),
  folderId: z.string().nullable(),
  tags: z.array(z.string()).optional(),
});
