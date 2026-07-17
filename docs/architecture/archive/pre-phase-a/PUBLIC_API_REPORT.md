# Public API Report

## Current public API surface
The notes feature currently exposes a broad set of public exports via `apps/web/app/_features/notes/index.ts`.

### Export categories
- Feature barrel exports
- Component exports
- Hook exports
- State exports
- Type exports
- Utility exports

## Canonical entry points
The most important canonical entry points currently are:
- `apps/web/app/_features/notes/index.ts`
- `apps/web/app/_features/notes/store/notes.store.ts`
- `apps/web/app/_features/notes/lib/notes.helpers.ts`
- `apps/web/app/_features/notes/modules/editor/index.ts`

## Internal exports
The feature also uses internal re-export files such as:
- `apps/web/app/_features/notes/components/index.ts`
- `apps/web/app/_features/notes/hooks/index.ts`
- `apps/web/app/_features/notes/state/index.ts`
- `apps/web/app/_features/notes/utils/notes.helpers.ts`

## Deep imports
The repository contains deep imports into feature internals from app routes and components. While this is workable, it is an unstable pattern for a future migration because it couples consumers to internal structure.

## Barrel files
The current structure includes barrel files that aggregate exports in multiple places:
- `apps/web/app/_features/notes/index.ts`
- `apps/web/app/_features/notes/components/index.ts`
- `apps/web/app/_features/notes/hooks/index.ts`
- `apps/web/app/_features/notes/state/index.ts`

## Public API strengths
- The feature exposes a central barrel.
- Common helpers are re-exported at the feature root.
- The store is exposed through a stable feature-level surface.

## Public API weaknesses
- The public surface is broad and layered.
- Compatibility shims remain part of the export surface.
- Consumers may still rely on old or duplicate routes into the feature.

## Recommended future public API direction (non-implementing)
A future API should ideally be more strict:
- one feature-wide entry point,
- one canonical store entry point,
- one canonical utilities entry point,
- one canonical editor entry point,
- one canonical notes list entry point,
- no compatibility shims in the long-term public surface.

## Recommendation
The current public API is acceptable for a prototype, but it should be tightened before architecture migration. The future API should favor stable, intentional contracts over broad re-export churn.
