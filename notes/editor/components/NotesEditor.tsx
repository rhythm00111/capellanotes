"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { type JSONContent } from '@tiptap/react';
import { type Note, useNotesStore, useNoteNavigation, validateJSONContent } from '@/notes';
import { useToast } from '@/notes/hooks/use-toast';
import { ToastAction } from '@/notes/components/ui/toast';
import { EditorCore } from './EditorCore';
import { EditorBody } from './EditorBody';
import { NoteHeader } from './NoteHeader';
import { TrashBanner } from './TrashBanner';
import { useEditor } from '../hooks/useEditor';

interface NotesEditorProps {
  note: Note;
  isFocusMode: boolean;
}

export function NotesEditor({ note, isFocusMode }: NotesEditorProps) {
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const restoreNote = useNotesStore((s) => s.restoreNote);
  const permanentDeleteNote = useNotesStore((s) => s.permanentDeleteNote);
  const togglePin = useNotesStore((s) => s.togglePin);

  const { toast } = useToast();
  const { navigateToNote, navigateToList } = useNoteNavigation();
  const [title, setTitle] = useState(note.title);
  // Stable flag: only true if the note was freshly created (title still
  // 'Untitled' AND content is an empty paragraph). Using a ref prevents the
  // focus effect from re-triggering after the initial mount, and the content
  // check ensures existing untitled notes aren't incorrectly treated as new
  // (which would auto-select their title on every open).
  const isNewNote = useRef(
    note.title === 'Untitled' &&
      (() => {
        const blocks = note.content?.content;
        return (
          !blocks ||
          blocks.length === 0 ||
          (blocks.length === 1 &&
            blocks[0]?.type === 'paragraph' &&
            !blocks[0]?.content?.length)
        );
      })()
  ).current;

  const handleSave = useCallback(
    (content: JSONContent) => {
      updateNote(note.id, { content });
    },
    [note.id, updateNote],
  );

  // Guard: Validate content before passing to editor
  const safeContent = note.content ?? { type: 'doc', content: [{ type: 'paragraph' }] };
  const { editor, saveStatus, flushPendingContent, wikiLinkState, wikiLinkKeyDownHandlerRef, closeWikiLink, slashMenuState, slashMenuKeyDownHandlerRef, closeSlashMenu } = useEditor({ 
    initialContent: safeContent, 
    onSave: handleSave 
  });

  // T12: local tags state — syncs from store on note switch, staged locally until save
  const [localTags, setLocalTags] = useState<string[]>(note.tags ?? []);

  // Sync tags when switching to a different note
  useEffect(() => {
    setLocalTags(note.tags ?? []);
    // Only re-sync on note id change, not on every tags update (would overwrite local edits)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]);

  const prevNoteId = useRef(note.id);
  const titleRef = useRef<HTMLTextAreaElement>(null);


  // Focus management and note switching stabilization
  useEffect(() => {
    let cancelled = false;
    // On mount: focus title if new note, else focus editor when ready
    if (isNewNote) {
      requestAnimationFrame(() => {
        if (!cancelled) {
          titleRef.current?.focus();
          titleRef.current?.select();
        }
      });
    } else if (editor) {
      requestAnimationFrame(() => {
        if (!cancelled) {
          editor.commands.focus('end');
        }
      });
    }
    return () => { cancelled = true; };
    // Only run on mount or when editor ref changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  // Sync content and focus when switching notes
  useEffect(() => {
    let cancelled = false;
    if (editor && note.id !== prevNoteId.current) {
      // Always flush before switching
      flushPendingContent();
      setTitle(note.title);
      // Validate content to prevent editor crashes from malformed JSON
      const validContent = validateJSONContent(note.content);
      // Pass false (boolean) — NOT an object. Passing a truthy object here would
      // fire onUpdate, trigger a redundant debounced save, and show a false
      // "saving—" indicator on every note switch.
      // The TipTap typings expect an options object for setContent; remove the
      // second param and pass the content only to match the types while
      // preserving runtime behavior.
      editor.commands.setContent(validContent as JSONContent);
      prevNoteId.current = note.id;
      const switchIsNew = note.title === 'Untitled';
      requestAnimationFrame(() => {
        if (!cancelled) {
          if (switchIsNew) {
            titleRef.current?.focus();
            titleRef.current?.select();
          } else {
            editor.commands.focus('end');
          }
        }
      });
    }
    return () => { cancelled = true; };
    // Only re-run when the note identity changes (id), when the title prop
    // changes (title sync), or when the editor instance changes.
    // note.content is intentionally excluded: reading it via the guard
    // `note.id !== prevNoteId.current` always captures the latest value at
    // switch time, and including it would re-run on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id, note.title, editor, flushPendingContent]);


  // Debounce title save, always clear on unmount
  useEffect(() => {
    if (title === note.title || note.isDeleted) return;
    const timeoutId = setTimeout(() => {
      updateNote(note.id, { title });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [title, note.id, note.title, note.isDeleted, updateNote]);

  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);


  // Enter / Tab in title ? move cursor to editor start
  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        editor?.commands.focus('start');
      }
    },
    [editor],
  );

  const handleDelete = useCallback(async () => {
    // Guard: Prevent double-delete
    if (note.isDeleted) return;

    const noteId = note.id;
    const noteTitle = title;
    
    try {
      await deleteNote(noteId);
      navigateToList();
      toast({
        title: `"${noteTitle || 'Untitled'}" moved to Trash`,
        duration: 4000,
        action: (
          <ToastAction
            altText="Undo delete"
            onClick={async () => {
              await restoreNote(noteId);
              navigateToNote(noteId);
            }}
          >
            Undo
          </ToastAction>
        ),
      });
    } catch (error) {
      console.error('[NotesEditor] Delete failed:', error);
      toast({
        title: 'Failed to delete note',
        variant: 'destructive',
        duration: 3000,
      });
    }
  }, [note.id, note.isDeleted, title, deleteNote, navigateToList, navigateToNote, toast, restoreNote]);

  const handleRestore = useCallback(async () => {
    await restoreNote(note.id);
    toast({ title: 'Note restored', duration: 2500 });
  }, [note.id, restoreNote, toast]);

  const handlePermanentDelete = useCallback(async () => {
    await permanentDeleteNote(note.id);
    navigateToList();
    toast({ title: 'Note permanently deleted', duration: 2500 });
  }, [note.id, permanentDeleteNote, navigateToList, toast]);

  // T12: persist tag changes (debounced via store)
  const handleTagsChange = useCallback((tags: string[]) => {
    setLocalTags(tags);
    updateNote(note.id, { tags });
  }, [note.id, updateNote]);

  // T14: add a tag from the BubbleMenu "Add as Tag" action
  const handleAddTag = useCallback((text: string) => {
    const normalised = text.toLowerCase().replace(/\s+/g, '-').slice(0, 32);
    if (normalised && !localTags.includes(normalised)) {
      handleTagsChange([...localTags, normalised]);
    }
  }, [localTags, handleTagsChange]);

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a]">
      {/* Trash banner for deleted notes */}
      {note.isDeleted && (
        <TrashBanner onRestore={handleRestore} onPermanentDelete={handlePermanentDelete} />
      )}

      {/* Centered Writing Column */}
      <EditorBody isFocusMode={isFocusMode}>
        <NoteHeader
          title={title}
          isPinned={note.isPinned}
          isDeleted={note.isDeleted}
          saveStatus={saveStatus}
          titleRef={titleRef}
          onTitleChange={setTitle}
          onTitleKeyDown={handleTitleKeyDown}
          onTogglePin={() => togglePin(note.id)}
          onDelete={handleDelete}
          tags={localTags}
          onTagsChange={handleTagsChange}
        />

        {/* Editor Body (TipTap) */}
        <EditorCore
          editor={note.isDeleted ? null : editor}
          wikiLinkState={wikiLinkState}
          wikiLinkKeyDownRef={wikiLinkKeyDownHandlerRef}
          closeWikiLink={closeWikiLink}
          slashMenuState={slashMenuState}
          slashMenuKeyDownRef={slashMenuKeyDownHandlerRef}
          closeSlashMenu={closeSlashMenu}
          onAddTag={handleAddTag}
        />
      </EditorBody>
    </div>
  );
}
