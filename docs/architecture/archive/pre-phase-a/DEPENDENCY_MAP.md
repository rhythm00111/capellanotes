# Dependency Map

## Dependency categories

### Internal imports
The notes feature imports heavily from its own internal module surfaces, especially:
- `@features/notes` barrel exports
- `@features/notes/store/notes.store`
- `@features/notes/lib/notes.helpers`
- `@features/notes/modules/editor`
- `@features/notes/hooks`

### External imports
The notes feature consumes external libraries such as:
- `next/navigation`
- `react`
- `zustand`
- `@tiptap/react`
- `lucide-react`
- `zod`
- `class-variance-authority`
- `tailwind-merge`

## High-risk dependency paths

### Store to action dependency
`apps/web/app/_features/notes/store/notes.store.ts` depends on:
- `../actions/get-notes.action`
- `../actions/create-note.action`
- `../actions/delete-note.action`
- `../actions/update-note.action`

This is a central dependency hub and therefore a high-impact file.

### Editor to store dependency
The editor flow depends on the store for note updates, delete actions, restore actions, pinning, and navigation. This creates tight coupling between presentation and data concerns.

### Hook to route dependency
`apps/web/app/_features/notes/hooks/useNoteNavigation.ts` depends on the router, the store, and route helpers. This is acceptable for a small app, but it becomes a hotspot when the feature grows.

### Barrel-based dependency surface
`apps/web/app/_features/notes/index.ts` re-exports from multiple subdomains. This creates a broad public surface and can hide coupling.

## Cross-module dependencies
- Editor module depends on shared hook layer and store layer.
- List module depends on store, helpers, and list UI components.
- Sidebar module depends on store and folder-related helpers.
- App route layer depends on the feature barrel and feature hooks.

## Circular dependency observations
No explicit circular dependency graph was generated from the repository inspection. However, the repository’s own audit notes explicitly identify risk from re-export churning between components and modules, and between compatibility layers and canonical layers.

## Import hotspots
The following files are likely to be important import hotspots:
- `apps/web/app/_features/notes/index.ts`
- `apps/web/app/_features/notes/store/notes.store.ts`
- `apps/web/app/_features/notes/modules/editor/components/NotesEditor.tsx`
- `apps/web/app/_features/notes/modules/editor/hooks/useEditor.ts`
- `src/app/dashboard/notes/layout.tsx`

## Shared utilities
Shared utilities used across multiple modules:
- `apps/web/app/_features/notes/lib/notes.helpers.ts`
- `src/lib/routes.ts`
- `src/lib/utils.ts`
- `src/hooks/use-toast.ts`

## Dependency conclusion
The dependency structure is understandable and workable for a prototype, but it is not yet normalized enough to support a clean migration. The biggest issue is not the number of dependencies, but the number of overlapping surfaces exposing the same responsibility.
