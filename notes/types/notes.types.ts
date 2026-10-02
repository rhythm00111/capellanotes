import { z } from 'zod';
import { type JSONContent } from '@tiptap/react';

// --- Import Organization Domain Types ------------------------------------------
// Organization owns all folder-related types
// (Folder, FolderId, DEFAULT_FOLDER_COLOR, ALL_NOTES_FOLDER_ID, ALL_NOTES_FOLDER)

export type {
  FolderId,
  Folder,
  CreateFolderInput,
  UpdateFolderInput,
} from '@/notes/organization/types/organization.types';

export {
  DEFAULT_FOLDER_COLOR,
  ALL_NOTES_FOLDER_ID,
  ALL_NOTES_FOLDER,
  FolderSchema,
} from '@/notes/organization/types/organization.types';

// --- Branded ID Types ---------------------------------------------------------

export type NoteId = string;

// --- Core Domain Models -------------------------------------------------------

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

// --- Input Types --------------------------------------------------------------

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

// --- View Enum ----------------------------------------------------------------

export type NotesView = 'all' | 'trash' | 'folder' | 'favorites' | 'today' | 'week' | 'inbox';

// --- Zod Schema (runtime validation / Supabase mapping) -----------------------

// JSONContent validator with fallback to empty document
const JSONContentSchema = z.custom<JSONContent>((val) => {
  if (!val || typeof val !== 'object') return false;
  // Must have type property
  if (!('type' in val) || typeof val.type !== 'string') return false;
  // If it has content, it must be an array
  if ('content' in val && !Array.isArray(val.content)) return false;
  return true;
});

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: JSONContentSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  isPinned: z.boolean(),
  isDeleted: z.boolean(),
  folderId: z.string().nullable(),
  tags: z.array(z.string()).optional(),
});

// Safe fallback for invalid JSON content
export const EMPTY_EDITOR_CONTENT: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

// Validate and sanitize JSONContent with fallback
export function validateJSONContent(content: unknown): JSONContent {
  try {
    if (!content || typeof content !== 'object') {
      console.warn('[validateJSONContent] Invalid content type, using fallback');
      return EMPTY_EDITOR_CONTENT;
    }
    
    const result = JSONContentSchema.safeParse(content);
    if (!result.success) {
      console.warn('[validateJSONContent] Validation failed, using fallback:', result.error);
      return EMPTY_EDITOR_CONTENT;
    }
    
    return result.data;
  } catch (error) {
    console.error('[validateJSONContent] Unexpected error, using fallback:', error);
    return EMPTY_EDITOR_CONTENT;
  }
}
