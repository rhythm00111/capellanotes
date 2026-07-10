// COMPATIBILITY / NAMESPACED UI SURFACE — components/
// This namespace aggregates backwards-compatible UI re-exports. The
// canonical implementation surface is `modules/` (module-local components).
// Prefer importing from `@features/notes` (feature barrel) or the `modules/`
// surface directly. Avoid adding new implementation here.
export * as Editor from './editor';
export * as List from './list';
export * as Sidebar from './sidebar';
export * as Shared from './shared';
