'use client';

import { useEditor as useTiptap, type JSONContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import { useRef, useEffect, useState, useCallback } from 'react';
import { type SuggestionProps } from '@tiptap/suggestion';
import { WikiLinkMark, WikiLink, type WikiLinkItem, type WikiLinkMenuState } from '../extensions/WikiLink';
import { useNotesStore } from '@features/notes/store/notes.store';
import { SlashCommand, type SlashCommandItem, type SlashMenuState } from '../extensions/SlashCommand';

export interface UseEditorProps {
  initialContent: JSONContent;
  onSave: (content: JSONContent) => void;
}

export function useEditor({ initialContent, onSave }: UseEditorProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const onSaveRef = useRef(onSave);
  // Snapshot of the save function captured at debounce-schedule time.
  // This prevents cross-note save pollution on note switch:
  // when the user navigates from note A → B while a debounce is pending,
  // the onSaveRef update effect fires (pointing onSaveRef to note B's handler)
  // BEFORE the note-switch effect calls flushPendingContent. Without this
  // snapshot, flushPendingContent would call note B's handler with note A's
  // content, overwriting note B's content.
  const debouncedSaveRef = useRef(onSave);
  // Tracks the latest editor instance so the unmount cleanup can safely flush
  // pending saves. A plain [] effect closes over editor at mount time when it
  // may still be null (TipTap creates the editor asynchronously when
  // immediatelyRender: false). Using a ref avoids that stale-closure bug.
  const editorRef = useRef<Editor | null>(null);
  // Bridge ref: WikiLinkMenu sets this; the WikiLink extension's onKeyDown routes keyboard events.
  const wikiLinkKeyDownHandlerRef = useRef<((e: KeyboardEvent) => boolean) | null>(null);
  const [wikiLinkState, setWikiLinkState] = useState<WikiLinkMenuState | null>(null);
  // Bridge ref: SlashMenu sets this; the SlashCommand extension's onKeyDown routes keyboard events.
  const slashMenuKeyDownHandlerRef = useRef<((e: KeyboardEvent) => boolean) | null>(null);
  const [slashMenuState, setSlashMenuState] = useState<SlashMenuState | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Flush any pending debounced save immediately (used on note switch/unmount).
  // Uses debouncedSaveRef (snapshotted at debounce-schedule time) so the save
  // always targets the note that was being edited, even if onSaveRef has already
  // been updated to a different note's handler by the time flush is called.
  const flushPendingContent = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
      const latestEditor = editorRef.current;
      if (latestEditor && !latestEditor.isDestroyed) {
        try {
          debouncedSaveRef.current(latestEditor.getJSON());
        } catch (error) {
          console.error('[useEditor] Failed to flush pending content:', error);
        }
      }
    }
  }, []);

  const closeWikiLink = useCallback(() => setWikiLinkState(null), []);
  const closeSlashMenu = useCallback(() => setSlashMenuState(null), []);

  const editor = useTiptap({
    extensions: [
      // Explicit heading levels prevent accidental stripping by future StarterKit changes
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      // T8: Inline image support — allows base64 images from paste/drop
      Image.configure({ inline: false, allowBase64: true }),
      // T14: Text highlight mark (amber background)
      Highlight.configure({ multicolor: false }),
      // T10: Wiki-link mark renders [[Note Title]] as styled links
      WikiLinkMark,
      // Provide an injected accessor so the extension does not directly
      // access the global store. This keeps the extension decoupled from
      // Zustand while preserving runtime behavior via the fallback path.
      WikiLink.configure({
        // Snapshot accessor injected from React context/hook. Returns a
        // shallow copy to prevent consumers from mutating the store array
        // and guards against unexpected runtime errors.
        getNotes: () => {
          try {
            const notes = useNotesStore.getState().notes;
            return Array.isArray(notes) ? [...notes] : [];
          } catch (err) {
            console.warn('[useEditor] getNotes accessor failed:', err);
            return [];
          }
        },
        suggestion: {
          render: () => ({
            onStart: (props: SuggestionProps<WikiLinkItem>) => {
              const rect = props.clientRect?.();
              if (!rect) return;
              setWikiLinkState({ items: props.items, execute: (item: WikiLinkItem) => props.command(item), rect });
            },
            onUpdate: (props: SuggestionProps<WikiLinkItem>) => {
              const rect = props.clientRect?.();
              if (!rect) return;
              setWikiLinkState({ items: props.items, execute: (item: WikiLinkItem) => props.command(item), rect });
            },
            onExit: () => setWikiLinkState(null),
            onKeyDown: ({ event }: { event: KeyboardEvent }) => wikiLinkKeyDownHandlerRef.current?.(event) ?? false,
          }),
        },
      }),
      // Slash command menu — triggered by "/" in the editor
      SlashCommand.configure({
        suggestion: {
          render: () => ({
            onStart: (props: SuggestionProps<SlashCommandItem>) => {
              const rect = props.clientRect?.();
              if (!rect) return;
              setSlashMenuState({ items: props.items, execute: (item: SlashCommandItem) => props.command(item), rect });
            },
            onUpdate: (props: SuggestionProps<SlashCommandItem>) => {
              const rect = props.clientRect?.();
              if (!rect) return;
              setSlashMenuState({ items: props.items, execute: (item: SlashCommandItem) => props.command(item), rect });
            },
            onExit: () => setSlashMenuState(null),
            onKeyDown: ({ event }: { event: KeyboardEvent }) => slashMenuKeyDownHandlerRef.current?.(event) ?? false,
          }),
        },
      }),
      Placeholder.configure({
        placeholder: 'Press / to insert a block, or start typing…',
      }),
    ],
    immediatelyRender: false,
    content: initialContent,
    // T8: Handle image paste and drag-drop by reading files as base64 data URIs
    editorProps: {
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith('image/'));
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          if (src) editorRef.current?.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
        return true;
      },
      handleDrop: (view, event, slice, moved) => {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFile = files.find((f) => f.type.startsWith('image/'));
        if (!imageFile) return false;
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          if (src) editorRef.current?.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(imageFile);
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSaveStatus('saving');
      // Snapshot the save handler at schedule time so flushPendingContent (and
      // the timer itself) always saves to the note that triggered this update,
      // regardless of subsequent note switches that update onSaveRef.
      debouncedSaveRef.current = onSaveRef.current;
      debounceRef.current = setTimeout(() => {
        // Guard: Validate editor state before saving
        if (editor && !editor.isDestroyed) {
          try {
            debouncedSaveRef.current(editor.getJSON());
            setSaveStatus('saved');
            if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
            savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 1800);
          } catch (error) {
            console.error('[useEditor] Failed to save content:', error);
            setSaveStatus('idle');
          }
        } else {
          // Editor was destroyed while debounce was pending — reset status.
          setSaveStatus('idle');
        }
      }, 1000);
    },
  });

  // Assigning to a ref during render is explicitly allowed in React —
  // refs are mutable containers that do not trigger re-renders.
  editorRef.current = editor ?? null;

  // On unmount, always flush pending content and clear timers
  useEffect(() => {
    return () => {
      flushPendingContent();
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, [flushPendingContent]);

  return {
    editor,
    saveStatus,
    flushPendingContent,
    wikiLinkState,
    wikiLinkKeyDownHandlerRef,
    closeWikiLink,
    slashMenuState,
    slashMenuKeyDownHandlerRef,
    closeSlashMenu,
  };
}
