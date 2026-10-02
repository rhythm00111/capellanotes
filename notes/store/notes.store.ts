import { create } from 'zustand';
import { Note, Folder, UpdateNoteInput, ALL_NOTES_FOLDER_ID, DEFAULT_FOLDER_COLOR } from '../types/notes.types';
import { getNotesAction, getFoldersAction } from '../services/actions/get-notes.action';
import { createNoteAction, createFolderAction } from '../services/actions/create-note.action';
import { deleteNoteAction, restoreNoteAction, permanentDeleteNoteAction, emptyTrashAction, deleteFolderAction } from '../services/actions/delete-note.action';
import { updateNoteAction, renameFolderAction } from '../services/actions/update-note.action';
import { toast } from '@/notes/hooks/use-toast';
import { generateId, getErrorMessage } from '../utils/notes.helpers';

interface NotesState {
  notes: Note[];
  folders: Folder[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  searchQuery: string;
}

interface NotesActions {
  loadAll: () => Promise<void>;
  createNote: (folderId?: string | null) => Promise<Note>;
  updateNote: (id: string, updates: UpdateNoteInput) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  permanentDeleteNote: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  duplicateNote: (id: string) => Promise<Note | null>;
  togglePin: (id: string) => Promise<void>;
  createFolder: (name: string) => Promise<Folder>;
  deleteFolder: (id: string) => Promise<void>;
  renameFolder: (id: string, newName: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
}

export const useNotesStore = create<NotesState & NotesActions>((set, get) => ({
  notes: [],
  folders: [],
  isLoading: false,
  isInitialized: false,
  error: null,
  searchQuery: '',

  loadAll: async () => {
    // Guard: Prevent double initialization or concurrent loads
    const state = get();
    if (state.isInitialized || state.isLoading) return;
    
    set({ isLoading: true, error: null });
    try {
      const [notes, folders] = await Promise.all([
        getNotesAction(),
        getFoldersAction(),
      ]);
      set((s) => {
        // Merge: keep any notes optimistically created while this load was in-flight.
        // Server takes precedence for IDs it knows about; unknown IDs are preserved.
        const serverIds = new Set(notes.map((n) => n.id));
        const optimistic = s.notes.filter((n) => !serverIds.has(n.id));
        return { notes: [...notes, ...optimistic], folders, isLoading: false, isInitialized: true };
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to load notes';
      // isInitialized stays false so the guard allows a future retry,
      // but isLoading must also be false so the concurrent-load guard
      // doesn't block subsequent retry attempts.
      // Preserve any notes that were optimistically added before this load failed.
      set((s) => ({ notes: s.notes, error: errorMessage, isLoading: false, isInitialized: false }));
    }
  },

  createNote: async (folderId = null) => {
    // Guard: Ensure store is initialized before creating notes.
    // We wait only if not yet initialized and not currently loading.
    // If a load is already in-flight we still proceed — the optimistic
    // note will be reconciled once load completes.
    const s0 = get();
    if (!s0.isInitialized && !s0.isLoading) {
      await get().loadAll();
    }

    const targetFolderId = folderId ?? null;
    
    // Optimistic
    const tempId = generateId();
    const newNote: Note = {
      id: tempId,
      title: 'Untitled',
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      folderId: targetFolderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      isPinned: false,
    };

    set((s) => ({ notes: [newNote, ...s.notes] }));

    // Fire server action in background — pass tempId so the server assigns the same ID,
    // avoiding any mismatch between the URL (which navigates to tempId immediately) and
    // the store entry after reconciliation.

    createNoteAction({ id: tempId, title: newNote.title, content: newNote.content, folderId: newNote.folderId })
      .then((created) => {
        set((s) => ({
          notes: s.notes.some((n) => n.id === tempId)
            ? s.notes.map((n) => (n.id === tempId ? created : n))
            : s.notes,
        }));
      })
      .catch((error) => {
        // Rollback: Remove the optimistic note if server fails
        set((s) => ({ notes: s.notes.filter((n) => n.id !== tempId) }));
        toast({ title: 'Failed to create note', description: getErrorMessage(error), variant: 'destructive' });
      });

    // Return the optimistic note immediately so callers can navigate without waiting
    // for the server round-trip.
    return newNote;
  },

  updateNote: async (id, updates) => {
    // Guard: Validate note exists

    const original = get().notes.find((n) => n.id === id);
    if (!original) {
      toast({ title: 'Note not found', description: `Note ${id} not found in store`, variant: 'destructive' });
      return;
    }

    const updatedAt = new Date().toISOString();
    const updated = { ...original, ...updates, updatedAt };
    set((s) => ({ notes: s.notes.map((n) => (n.id === id ? updated : n)) }));

    try {
      await updateNoteAction(id, { ...updates, updatedAt });
    } catch (error) {
      set((s) => ({ notes: s.notes.map((n) => (n.id === id ? original : n)) }));
      toast({ title: 'Failed to update note', description: getErrorMessage(error), variant: 'destructive' });
    }
  },

  deleteNote: async (id) => {

    const original = get().notes.find((n) => n.id === id);
    if (!original) {
      toast({ title: 'Note not found', description: `Note ${id} not found in store`, variant: 'destructive' });
      return;
    }

    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, isDeleted: true } : n)),
    }));

    try {
      await deleteNoteAction(id);
    } catch (error) {
      set((s) => ({ notes: s.notes.map((n) => (n.id === id ? original : n)) }));
      toast({ title: 'Failed to delete note', description: getErrorMessage(error), variant: 'destructive' });
    }
  },

  restoreNote: async (id) => {

    const original = get().notes.find((n) => n.id === id);
    if (!original) {
      toast({ title: 'Note not found', description: `Note ${id} not found in store`, variant: 'destructive' });
      return;
    }

    set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, isDeleted: false } : n)) }));
    try {
      await restoreNoteAction(id);
    } catch (error) {
      set((s) => ({ notes: s.notes.map((n) => (n.id === id ? original : n)) }));
      toast({ title: 'Failed to restore note', description: getErrorMessage(error), variant: 'destructive' });
    }
  },

  permanentDeleteNote: async (id) => {
    const original = get().notes.find((n) => n.id === id);
    if (!original) {
      toast({ title: 'Note not found', description: `Note ${id} not found in store`, variant: 'destructive' });
      return;
    }
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
    try {
      await permanentDeleteNoteAction(id);
    } catch (error) {
      set((s) => ({ notes: [...s.notes, original] }));
      toast({ title: 'Failed to permanently delete note', description: getErrorMessage(error), variant: 'destructive' });
    }
  },

  emptyTrash: async () => {
    const deleted = get().notes.filter((n) => n.isDeleted);
    set((s) => ({ notes: s.notes.filter((n) => !n.isDeleted) }));
    try {
      await emptyTrashAction();
    } catch (error) {
      set((s) => ({ notes: [...s.notes, ...deleted] }));
      toast({ title: 'Failed to empty trash', description: getErrorMessage(error), variant: 'destructive' });
    }
  },

  duplicateNote: async (id) => {
    const original = get().notes.find((n) => n.id === id);

    if (!original) {
      toast({ title: 'Note not found', description: `Note ${id} not found in store`, variant: 'destructive' });
      return null;
    }

    const dupId = generateId();
    const duplicate: Note = {
      ...original,
      id: dupId,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((s) => ({ notes: [duplicate, ...s.notes] }));

    // Fire in background — same pattern as createNote for instant feedback.

    createNoteAction({ id: dupId, title: duplicate.title, content: duplicate.content, folderId: duplicate.folderId })
      .then((created) => {
        set((s) => ({
          notes: s.notes.some((n) => n.id === dupId)
            ? s.notes.map((n) => (n.id === dupId ? created : n))
            : s.notes,
        }));
      })
      .catch((error) => {
        set((s) => ({ notes: s.notes.filter((n) => n.id !== dupId) }));
        toast({ title: 'Failed to duplicate note', description: getErrorMessage(error), variant: 'destructive' });
      });

    return duplicate;
  },

  togglePin: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) {
      toast({ title: 'Note not found', description: `Note ${id} not found in store`, variant: 'destructive' });
      return;
    }
    const isPinned = !note.isPinned;
    
    set((s) => ({ notes: s.notes.map((n) => (n.id === id ? { ...n, isPinned } : n)) }));
    try {
      await updateNoteAction(id, { isPinned });
    } catch (error) {
      set((s) => ({ notes: s.notes.map((n) => (n.id === id ? note : n)) }));
      toast({ title: 'Failed to pin/unpin note', description: getErrorMessage(error), variant: 'destructive' });
    }
  },

  createFolder: async (name) => {
    const tempId = generateId();
    const newFolder: Folder = { id: tempId, name, color: DEFAULT_FOLDER_COLOR, createdAt: new Date().toISOString() };
    set((s) => ({ folders: [...s.folders, newFolder] }));

    try {
      const created = await createFolderAction(name);
      set((s) => ({ folders: s.folders.map((f) => (f.id === tempId ? created : f)) }));
      return created;
    } catch (error) {
      set((s) => ({ folders: s.folders.filter((f) => f.id !== tempId) }));
      toast({ title: 'Failed to create folder', description: getErrorMessage(error), variant: 'destructive' });
      throw error;
    }
  },

  deleteFolder: async (id) => {
    const original = get().folders.find((f) => f.id === id);
    if (!original) {
      toast({ title: 'Folder not found', description: `Folder ${id} not found in store`, variant: 'destructive' });
      return;
    }

    const affectedNotes = get().notes.filter((n) => n.folderId === id);

    set((s) => ({
      folders: s.folders.filter((f) => f.id !== id),
      notes: s.notes.map((n) => (n.folderId === id ? { ...n, folderId: null } : n)),
    }));

    try {
      await deleteFolderAction(id);
    } catch (error) {
      set((s) => ({
        folders: [...s.folders, original],
        notes: s.notes.map((n) => {
          const orig = affectedNotes.find((an) => an.id === n.id);
          return orig ?? n;
        }),
      }));
      toast({ title: 'Failed to delete folder', description: getErrorMessage(error), variant: 'destructive' });
    }
  },

  renameFolder: async (id, newName) => {
    const original = get().folders.find((f) => f.id === id);
    if (!original) return;
    set((s) => ({
      folders: s.folders.map((f) => (f.id === id ? { ...f, name: newName } : f)),
    }));
    try {
      await renameFolderAction(id, newName);
    } catch (error) {
      set((s) => ({
        folders: s.folders.map((f) => (f.id === id ? original : f)),
      }));
      toast({ title: 'Failed to rename folder', description: getErrorMessage(error), variant: 'destructive' });
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
}));
