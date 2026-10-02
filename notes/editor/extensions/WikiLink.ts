import { Extension, Mark, mergeAttributes } from '@tiptap/core';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import type { Plugin } from '@tiptap/pm/state';

const WikiLinkPluginKey = new PluginKey('wikiLink');
import type { Note } from '@/notes/types/notes.types';

// --- Wiki Link Mark ------------------------------------------------------------
// Renders as <span data-note-id="..." class="wiki-link-mark">title</span>.
// The mark is non-inclusive (typing next to it won't extend it).

export const WikiLinkMark = Mark.create({
  name: 'wikiLinkMark',
  priority: 1001,
  inclusive: false,
  excludes: '',

  addAttributes() {
    return {
      noteId: {
        default: null,
        parseHTML: (el) => (el as HTMLElement).getAttribute('data-note-id'),
        renderHTML: (attrs) => ({
          'data-note-id': attrs.noteId,
          class: 'wiki-link-mark',
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-note-id]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
});

// --- Types ---------------------------------------------------------------------

export type WikiLinkItem = { id: string; title: string };

export type WikiLinkMenuState = {
  items: WikiLinkItem[];
  execute: (item: WikiLinkItem) => void;
  rect: DOMRect;
};

// --- Extension -----------------------------------------------------------------
// Handles the [[ trigger using the Suggestion API.
// When a note is selected, it inserts the note title as text with WikiLinkMark.
// This extension no longer reads the global store directly. Instead it accepts
// an injected `getNotes` accessor (see WikiLinkOptions) which must be provided
// by the editor initialization layer. This decouples extension logic from the
// global Zustand implementation and makes the extension safe for reuse.

type WikiLinkOptions = {
  suggestion: Partial<SuggestionOptions<WikiLinkItem>>;
  /**
   * Optional injected accessor for retrieving the current notes snapshot.
   * When provided, the extension will use this instead of calling the
   * global store directly. This enables safe injection and decouples
   * editor extensions from the Zustand implementation.
   */
  getNotes?: () => Note[];
};

export const WikiLink = Extension.create<WikiLinkOptions>({
  name: 'wikiLink',

  addOptions() {
    return { suggestion: {} };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<WikiLinkItem>({
        pluginKey: WikiLinkPluginKey,
        editor: this.editor,
        char: '[[',  
        allowSpaces: false,
        startOfLine: false,
        items: ({ query }) => {
          // Prefer injected accessor when available (decouples from global store).
          const snapshot = typeof this.options.getNotes === 'function'
            ? this.options.getNotes()
            : (() => {
                // Missing injected accessor — fall back to an empty list and warn.
                // Extensions must be initialized with a `getNotes` accessor from
                // the React initialization layer to avoid direct store coupling.
                // This keeps the extension safe for P0 while encouraging migration.
                // NOTE: In production the editor initialization (useEditor) injects this.
                console.warn('[WikiLink] No getNotes accessor injected; returning empty suggestions.');
                return [] as Note[];
              })();
          return snapshot
            .filter(
              (n) =>
                !n.isDeleted &&
                (query === '' || n.title.toLowerCase().includes(query.toLowerCase())),
            )
            .slice(0, 8)
            .map((n) => ({ id: n.id, title: n.title }));
        },
        command: ({ editor, range, props }) => {
          // Replace the [[query trigger with styled link text + trailing space
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent([
              {
                type: 'text',
                text: props.title || 'Untitled',
                marks: [{ type: 'wikiLinkMark', attrs: { noteId: props.id } }],
              },
              { type: 'text', text: ' ' },
            ])
            .run();
        },
        ...this.options.suggestion,
      }) as unknown as Plugin,
    ];
  },
});
