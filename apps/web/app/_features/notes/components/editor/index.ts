// COMPATIBILITY / RE-EXPORT LAYER — components/editor
// This file intentionally re-exports the canonical module-level editor
// implementations. The canonical implementation surface for editor code
// is `modules/editor`. Prefer `@features/notes/modules/editor` for
// new imports. This file exists only for backwards compatibility and
// will be marked deprecated in documentation (P1 migration).
// Central re-exports for editor-related UI components
export * from '@features/notes/modules/editor';
