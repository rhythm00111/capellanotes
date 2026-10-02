import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNotesStore } from '../notes.store';
import * as getActions from '../../services/actions/get-notes.action';
import * as createActions from '../../services/actions/create-note.action';
import * as updateActions from '../../services/actions/update-note.action';
import * as deleteActions from '../../services/actions/delete-note.action';
import type { Note, Folder } from '../../types/notes.types';

// Mock the action modules
vi.mock('../../services/actions/get-notes.action');
vi.mock('../../services/actions/create-note.action');
vi.mock('../../services/actions/update-note.action');
vi.mock('../../services/actions/delete-note.action');
vi.mock('@/notes/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('Notes Store', () => {
  beforeEach(() => {
    // Reset store state
    useNotesStore.setState({
      notes: [],
      folders: [],
      isLoading: false,
      isInitialized: false,
      error: null,
      searchQuery: '',
    });
    vi.clearAllMocks();
  });

  describe('loadAll', () => {
    it('should load notes and folders successfully', async () => {
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Test Note',
          content: { type: 'doc', content: [] },
          folderId: null,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          isDeleted: false,
          isPinned: false,
        },
      ];
      const mockFolders: Folder[] = [
        { id: 'f1', name: 'Test Folder', color: '#blue', createdAt: '2024-01-01' },
      ];

      vi.mocked(getActions.getNotesAction).mockResolvedValue(mockNotes);
      vi.mocked(getActions.getFoldersAction).mockResolvedValue(mockFolders);

      await useNotesStore.getState().loadAll();

      const state = useNotesStore.getState();
      expect(state.notes).toEqual(mockNotes);
      expect(state.folders).toEqual(mockFolders);
      expect(state.isInitialized).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should prevent concurrent loads', async () => {
      vi.mocked(getActions.getNotesAction).mockResolvedValue([]);
      vi.mocked(getActions.getFoldersAction).mockResolvedValue([]);

      const promise1 = useNotesStore.getState().loadAll();
      const promise2 = useNotesStore.getState().loadAll();

      await Promise.all([promise1, promise2]);

      // Should only call once
      expect(getActions.getNotesAction).toHaveBeenCalledTimes(1);
      expect(getActions.getFoldersAction).toHaveBeenCalledTimes(1);
    });

    it('should preserve optimistic notes on load failure', async () => {
      const optimisticNote: Note = {
        id: 'temp-1',
        title: 'Optimistic',
        content: { type: 'doc', content: [] },
        folderId: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        isDeleted: false,
        isPinned: false,
      };

      useNotesStore.setState({ notes: [optimisticNote] });

      vi.mocked(getActions.getNotesAction).mockRejectedValue(new Error('Network error'));

      await useNotesStore.getState().loadAll();

      const state = useNotesStore.getState();
      expect(state.notes).toEqual([optimisticNote]);
      expect(state.error).toBe('Network error');
      expect(state.isInitialized).toBe(false);
    });
  });

  describe('createNote', () => {
    it('should create note optimistically', async () => {
      const mockCreated: Note = {
        id: 'temp-id',
        title: 'Untitled',
        content: { type: 'doc', content: [{ type: 'paragraph' }] },
        folderId: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        isDeleted: false,
        isPinned: false,
      };

      vi.mocked(createActions.createNoteAction).mockResolvedValue(mockCreated);
      useNotesStore.setState({ isInitialized: true });

      const result = await useNotesStore.getState().createNote();

      expect(result.title).toBe('Untitled');
      expect(useNotesStore.getState().notes).toHaveLength(1);
    });

    it('should rollback on create failure', async () => {
      vi.mocked(createActions.createNoteAction).mockRejectedValue(new Error('Failed'));
      useNotesStore.setState({ isInitialized: true });

      await useNotesStore.getState().createNote();

      // Wait for async rollback
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(useNotesStore.getState().notes).toHaveLength(0);
    });
  });

  describe('updateNote', () => {
    it('should update note optimistically', async () => {
      const note: Note = {
        id: '1',
        title: 'Original',
        content: { type: 'doc', content: [] },
        folderId: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        isDeleted: false,
        isPinned: false,
      };

      useNotesStore.setState({ notes: [note] });
      vi.mocked(updateActions.updateNoteAction).mockResolvedValue();

      await useNotesStore.getState().updateNote('1', { title: 'Updated' });

      expect(useNotesStore.getState().notes[0].title).toBe('Updated');
    });

    it('should rollback on update failure', async () => {
      const note: Note = {
        id: '1',
        title: 'Original',
        content: { type: 'doc', content: [] },
        folderId: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        isDeleted: false,
        isPinned: false,
      };

      useNotesStore.setState({ notes: [note] });
      vi.mocked(updateActions.updateNoteAction).mockRejectedValue(new Error('Failed'));

      await useNotesStore.getState().updateNote('1', { title: 'Updated' });

      expect(useNotesStore.getState().notes[0].title).toBe('Original');
    });
  });

  describe('deleteNote', () => {
    it('should soft delete note', async () => {
      const note: Note = {
        id: '1',
        title: 'Test',
        content: { type: 'doc', content: [] },
        folderId: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        isDeleted: false,
        isPinned: false,
      };

      useNotesStore.setState({ notes: [note] });
      vi.mocked(deleteActions.deleteNoteAction).mockResolvedValue();

      await useNotesStore.getState().deleteNote('1');

      expect(useNotesStore.getState().notes[0].isDeleted).toBe(true);
    });
  });

  describe('togglePin', () => {
    it('should toggle pin status', async () => {
      const note: Note = {
        id: '1',
        title: 'Test',
        content: { type: 'doc', content: [] },
        folderId: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        isDeleted: false,
        isPinned: false,
      };

      useNotesStore.setState({ notes: [note] });
      vi.mocked(updateActions.updateNoteAction).mockResolvedValue();

      await useNotesStore.getState().togglePin('1');

      expect(useNotesStore.getState().notes[0].isPinned).toBe(true);
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      useNotesStore.getState().setSearchQuery('test query');
      expect(useNotesStore.getState().searchQuery).toBe('test query');
    });
  });
});
