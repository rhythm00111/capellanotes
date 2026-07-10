'use client';

import { Suspense, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NoteEditorPage } from '@features/notes';
import { isValidNoteId } from '@features/notes/lib/notes.helpers';
import { recordVisit } from '@features/notes/hooks';
import { ROUTES } from '@/lib/routes';

/**
 * Full-screen note editor page
 * Back navigation handled by NoteEditorPage component
 */
export default function EditorPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = use(params);
  const router = useRouter();

  // Guard: Redirect must happen in an effect — calling router.replace() during
  // render is a React violation that produces "Cannot update a component while
  // rendering a different component" errors.
  useEffect(() => {
    if (!isValidNoteId(noteId)) {
      router.replace(ROUTES.notes.list());
    }
  }, [noteId, router]);

  // Track this visit so the "Continue Writing" discovery section stays current.
  // recordVisit was previously only called from NotesList (rendered on the list
  // page, where params.noteId is never set), making it dead code. This effect
  // runs on every note the user opens — via sidebar, command palette, or URL.
  useEffect(() => {
    if (isValidNoteId(noteId)) recordVisit(noteId);
  }, [noteId]);

  // Render the redirect UI immediately; the effect above performs the actual navigation.
  if (!isValidNoteId(noteId)) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-[#0a0a0a]">
        <div className="text-white/30 text-sm">Invalid note ID. Redirecting...</div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen w-full bg-[#0a0a0a]">
        <div className="text-white/30 text-sm animate-pulse">Loading…</div>
      </div>
    }>
      <NoteEditorPage noteId={noteId} />
    </Suspense>
  );
}
