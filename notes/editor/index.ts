// Editor domain public API - only components needed externally
export { CommandPalette } from './components/CommandPalette';
export { NotesEditor } from './components/NotesEditor';
export { NoteInfoPanel } from './components/NoteInfoPanel';

// Editor hook for external use
export { useEditor } from './hooks/useEditor';

// Editor extensions (for advanced customization)
export type { WikiLinkItem, WikiLinkMenuState } from './extensions/WikiLink';
export type { SlashCommandItem, SlashMenuState } from './extensions/SlashCommand';
