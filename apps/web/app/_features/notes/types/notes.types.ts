import { z } from 'zod';
import { type JSONContent } from '@tiptap/react';

// ─── Branded ID Types ────────────────────────────────────────────────────────

export type NoteId = string;
export type FolderId = string;

// ─── Core Domain Models ───────────────────────────────────────────────────────

export type Note = {
  id: NoteId;
  title: string;
  content: JSONContent;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isDeleted: boolean;
  folderId: FolderId | null;
  tags?: string[];
};

export type Folder = {
  id: FolderId;
  name: string;
  color: string;
  createdAt: string;
};

// ─── Input Types ──────────────────────────────────────────────────────────────

export type CreateNoteInput = {
  title?: string;
  content?: JSONContent;
  folderId?: FolderId | null;
};

export type UpdateNoteInput = {
  title?: string;
  content?: JSONContent;
  isPinned?: boolean;
  folderId?: FolderId | null;
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

export const FolderSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  createdAt: z.string(),
});

// ─── Folder Defaults ───────────────────────────────────────────────────────────

export const DEFAULT_FOLDER_COLOR = '#10B981';

// ─── Virtual "All Notes" sentinel ─────────────────────────────────────────────

export const ALL_NOTES_FOLDER_ID: FolderId = 'all-notes';

export const ALL_NOTES_FOLDER: Folder = {
  id: ALL_NOTES_FOLDER_ID,
  name: 'All Notes',
  color: '#10B981',
  createdAt: new Date(0).toISOString(),
};
