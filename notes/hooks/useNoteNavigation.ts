// Shared navigation hook for note routing and creation flows.
'use client';

import { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useNotesStore } from '../store/notes.store';
import { isValidNoteId } from '@/notes';
import { ROUTES } from '@/notes/config';

/**
 * Shared hook for note navigation and creation
 * Eliminates duplicate "create + navigate" logic across components
 */
export function useNoteNavigation() {
  const router = useRouter();
  const createNote = useNotesStore((s) => s.createNote);
  const searchParams = useSearchParams();

  // Guard: Prevent navigation spam
  const navigationLockRef = useRef(false);

  const _lock = useCallback((fn: () => void) => {
    if (navigationLockRef.current) return;
    navigationLockRef.current = true;
    fn();
    // 300ms debounce prevents double-tap navigation for synchronous navigations.
    // createAndNavigate holds its own lock for the full async duration.
    setTimeout(() => { navigationLockRef.current = false; }, 300);
  }, []);

  const navigateToNote = useCallback(
    (noteId: string) => {
      if (!isValidNoteId(noteId)) {
        console.warn('[useNoteNavigation] Invalid noteId:', noteId);
        return;
      }
      _lock(() => router.push(ROUTES.notes.editor(noteId)));
    },
    [router, _lock]
  );

  const navigateToList = useCallback(
    () => { _lock(() => router.push(ROUTES.notes.list())); },
    [router, _lock]
  );

  const createAndNavigate = useCallback(
    async (folderId?: string | null) => {
      // Prevent duplicate note creation from rapid double-clicks.
      // Hold the lock for the full async duration rather than releasing after 300ms.
      if (navigationLockRef.current) return;
      navigationLockRef.current = true;
      // Use URL folder as fallback when no folderId explicitly given
      const urlFolderId = searchParams.get('folder');
      const effectiveFolderId = folderId !== undefined ? folderId : (urlFolderId ?? null);
      try {
        const created = await createNote(effectiveFolderId);
        if (created?.id && isValidNoteId(created.id)) {
          navigateToNote(created.id);
          return created;
        }
        // Fallback: should not happen since createNote always returns a valid UUID
        console.error('[useNoteNavigation] createNote returned an invalid ID');
      } catch (error) {
        // createNote handles its own error toast; only log here.
        console.error('[useNoteNavigation] Failed to create note:', error);
      } finally {
        navigationLockRef.current = false;
      }
    },
    [createNote, navigateToNote, searchParams]
  );

  return {
    navigateToNote,
    navigateToList,
    createAndNavigate,
  };
}
