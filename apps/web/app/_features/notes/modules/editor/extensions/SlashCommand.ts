import { Extension, type Editor } from '@tiptap/core';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import type { Plugin } from '@tiptap/pm/state';

const SlashCommandPluginKey = new PluginKey('slashCommand');

// ─── Command Item ─────────────────────────────────────────────────────────────

export type SlashCommandItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  group: 'text' | 'structure' | 'ai';
  command: (editor: Editor) => void;
};

// ─── Command Definitions ──────────────────────────────────────────────────────

export const SLASH_COMMANDS: SlashCommandItem[] = [
  // ── Text group ──────────────────────────────────────────────────────────────
  {
    id: 'text',
    title: 'Text',
    description: 'Plain paragraph',
    icon: 'T',
    group: 'text',
    command: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    id: 'h1',
    title: 'Heading 1',
    description: 'Large section header',
    icon: 'H1',
    group: 'text',
    // setHeading always sets the level; toggleHeading would remove the heading
    // if the block is already an H1, turning it into a paragraph — wrong for
    // a "set block type" command.
    command: (editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
  },
  {
    id: 'h2',
    title: 'Heading 2',
    description: 'Medium section header',
    icon: 'H2',
    group: 'text',
    command: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
  },
  {
    id: 'h3',
    title: 'Heading 3',
    description: 'Small section header',
    icon: 'H3',
    group: 'text',
    command: (editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
  },
  // ── Structure group ──────────────────────────────────────────────────────────
  {
    id: 'bullet',
    title: 'Bullet List',
    description: 'Unordered list',
    icon: '•',
    group: 'structure',
    // Guard: only toggle ON — never toggle off an already-active list.
    command: (editor) => { if (!editor.isActive('bulletList')) editor.chain().focus().toggleBulletList().run(); },
  },
  {
    id: 'numbered',
    title: 'Numbered List',
    description: 'Ordered list',
    icon: '1.',
    group: 'structure',
    command: (editor) => { if (!editor.isActive('orderedList')) editor.chain().focus().toggleOrderedList().run(); },
  },
  {
    id: 'quote',
    title: 'Quote',
    description: 'Blockquote',
    icon: '"',
    group: 'structure',
    command: (editor) => { if (!editor.isActive('blockquote')) editor.chain().focus().toggleBlockquote().run(); },
  },
  {
    id: 'code',
    title: 'Code Block',
    description: 'Code snippet',
    icon: '</>',
    group: 'structure',
    command: (editor) => { if (!editor.isActive('codeBlock')) editor.chain().focus().toggleCodeBlock().run(); },
  },
  {
    id: 'divider',
    title: 'Divider',
    description: 'Horizontal separator',
    icon: '—',
    group: 'structure',
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
];

// ─── Menu State (shared between extension + React) ────────────────────────────

export type SlashMenuState = {
  items: SlashCommandItem[];
  execute: (item: SlashCommandItem) => void;
  rect: DOMRect;
};

// ─── Extension ────────────────────────────────────────────────────────────────

type SlashCommandOptions = {
  suggestion: Partial<SuggestionOptions<SlashCommandItem>>;
};

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return { suggestion: {} };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashCommandItem>({
        pluginKey: SlashCommandPluginKey,
        editor: this.editor,
        char: '/',
        allowSpaces: false,
        startOfLine: false,
        items: ({ query }) =>
          SLASH_COMMANDS.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.id.toLowerCase().includes(query.toLowerCase()) ||
              item.description.toLowerCase().includes(query.toLowerCase()),
          ),
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run();
          props.command(editor);
        },
        ...this.options.suggestion,
      }) as unknown as Plugin,
    ];
  },
});
