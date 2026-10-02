import { describe, it, expect } from 'vitest';
import { filterNotes, generateId } from '../notes.helpers';
import { ALL_NOTES_FOLDER_ID } from '../../types/notes.types';
import type { Note } from '../../types/notes.types';

describe('filterNotes', () => {
  const createNote = (overrides: Partial<Note> = {}): Note => ({
    id: generateId(),
    title: 'Test Note',
    content: { type: 'doc', content: [] },
    folderId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isDeleted: false,
    isPinned: false,
    ...overrides,
  });

  describe('trash view', () => {
    it('should show only deleted notes', () => {
      const notes = [
        createNote({ id: '1', isDeleted: false }),
        createNote({ id: '2', isDeleted: true }),
        createNote({ id: '3', isDeleted: true }),
      ];

      const result = filterNotes(notes, { view: 'trash', folderId: ALL_NOTES_FOLDER_ID, searchQuery: '' });

      expect(result).toHaveLength(2);
      expect(result.every((n) => n.isDeleted)).toBe(true);
    });
  });

  describe('favorites view', () => {
    it('should show only pinned notes', () => {
      const notes = [
        createNote({ id: '1', isPinned: false }),
        createNote({ id: '2', isPinned: true }),
        createNote({ id: '3', isPinned: true }),
      ];

      const result = filterNotes(notes, { view: 'favorites', folderId: ALL_NOTES_FOLDER_ID, searchQuery: '' });

      expect(result).toHaveLength(2);
      expect(result.every((n) => n.isPinned)).toBe(true);
    });

    it('should exclude deleted notes from favorites', () => {
      const notes = [
        createNote({ id: '1', isPinned: true, isDeleted: false }),
        createNote({ id: '2', isPinned: true, isDeleted: true }),
      ];

      const result = filterNotes(notes, { view: 'favorites', folderId: ALL_NOTES_FOLDER_ID, searchQuery: '' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('today view', () => {
    it('should show notes updated today', () => {
      const now = new Date();
      const today = now.toISOString();
      const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString();

      const notes = [
        createNote({ id: '1', updatedAt: today }),
        createNote({ id: '2', updatedAt: yesterday }),
      ];

      const result = filterNotes(notes, { view: 'today', folderId: ALL_NOTES_FOLDER_ID, searchQuery: '' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('week view', () => {
    it('should show notes updated in last 7 days', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
      const old = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();

      const notes = [
        createNote({ id: '1', updatedAt: recent }),
        createNote({ id: '2', updatedAt: old }),
      ];

      const result = filterNotes(notes, { view: 'week', folderId: ALL_NOTES_FOLDER_ID, searchQuery: '' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('inbox view', () => {
    it('should show only notes without folder', () => {
      const notes = [
        createNote({ id: '1', folderId: null }),
        createNote({ id: '2', folderId: 'folder-1' }),
        createNote({ id: '3', folderId: null }),
      ];

      const result = filterNotes(notes, { view: 'inbox', folderId: ALL_NOTES_FOLDER_ID, searchQuery: '' });

      expect(result).toHaveLength(2);
      expect(result.every((n) => n.folderId === null)).toBe(true);
    });
  });

  describe('folder filtering', () => {
    it('should filter by specific folder', () => {
      const notes = [
        createNote({ id: '1', folderId: 'folder-1' }),
        createNote({ id: '2', folderId: 'folder-2' }),
        createNote({ id: '3', folderId: 'folder-1' }),
      ];

      const result = filterNotes(notes, { view: 'folder', folderId: 'folder-1', searchQuery: '' });

      expect(result).toHaveLength(2);
      expect(result.every((n) => n.folderId === 'folder-1')).toBe(true);
    });
  });

  describe('search', () => {
    it('should filter by title', () => {
      const notes = [
        createNote({ id: '1', title: 'Meeting Notes', isDeleted: false }),
        createNote({ id: '2', title: 'Project Plan', isDeleted: false }),
        createNote({ id: '3', title: 'Meeting Summary', isDeleted: false }),
      ];

      const result = filterNotes(notes, { view: 'all', folderId: ALL_NOTES_FOLDER_ID, searchQuery: 'meeting' });

      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id).sort()).toEqual(['1', '3']);
    });

    it('should be case-insensitive', () => {
      const notes = [createNote({ id: '1', title: 'Important Task', isDeleted: false })];

      const result = filterNotes(notes, { view: 'all', folderId: ALL_NOTES_FOLDER_ID, searchQuery: 'IMPORTANT' });

      expect(result).toHaveLength(1);
    });

    it('should handle empty query', () => {
      const notes = [createNote({ id: '1', isDeleted: false }), createNote({ id: '2', isDeleted: false })];

      const result = filterNotes(notes, { view: 'all', folderId: ALL_NOTES_FOLDER_ID, searchQuery: '' });

      expect(result).toHaveLength(2);
    });
  });

  describe('null handling', () => {
    it('should filter out null entries', () => {
      const notes: Note[] = [createNote({ id: '1', isDeleted: false }), null, createNote({ id: '2', isDeleted: false }), undefined].filter((n): n is Note => n != null);

      const result = filterNotes(notes, { view: 'all', folderId: ALL_NOTES_FOLDER_ID, searchQuery: '' });

      expect(result).toHaveLength(2);
      expect(result.every((n) => n !== null && n !== undefined)).toBe(true);
    });
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });

  it('should generate valid UUID format', () => {
    const id = generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(id)).toBe(true);
  });
});


describe('generateId', () => {
  it('should generate unique IDs', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });

  it('should generate valid UUID format', () => {
    const id = generateId();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(id)).toBe(true);
  });
});
