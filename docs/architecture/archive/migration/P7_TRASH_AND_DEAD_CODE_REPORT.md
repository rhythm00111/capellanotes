# Phase 7 — Trash and Dead Code Report

## Summary

The repository is not littered with broken or obviously orphaned code, but it does contain a meaningful amount of migration-era dead weight in the form of wrappers, shims, duplicated barrels, and transitional folders.

## Obsolete wrappers and compatibility shims

- `apps/web/app/_features/notes/actions/`
- `apps/web/app/_features/notes/components/`
- `apps/web/app/_features/notes/components/list/`
- `apps/web/app/_features/notes/components/sidebar/`
- `apps/web/app/_features/notes/components/editor/`
- `apps/web/app/_features/notes/modules/`
- `apps/web/app/_features/notes/state/`
- `apps/web/app/_features/notes/services/utils/`
- `apps/web/app/_features/notes/notes/actions/`
- `apps/web/app/_features/notes/notes/types/`

## Dead barrels

- `apps/web/app/_features/notes/components/index.ts`
- `apps/web/app/_features/notes/components/shared/index.ts`
- `apps/web/app/_features/notes/components/list/index.ts`
- `apps/web/app/_features/notes/components/sidebar/index.ts`
- `apps/web/app/_features/notes/components/editor/index.ts`
- `apps/web/app/_features/notes/modules/index.ts`
- `apps/web/app/_features/notes/modules/editor/index.ts`
- `apps/web/app/_features/notes/modules/list/index.ts`
- `apps/web/app/_features/notes/modules/sidebar/index.ts`
- `apps/web/app/_features/notes/state/index.ts`

## Unused helpers and utilities

No helper currently appears to be completely unused by the running code path, but several are now duplicated across layers and should be treated as candidates for consolidation.

## Duplicate hooks

- `hooks/useNotesList.ts` and the canonical list hook under `notes/list/hooks/useNotesList.ts` are effectively two entry points to the same behavior.
- `hooks/useSidebar.ts` overlaps with the organization sidebar hook surface.

## Duplicate stores

- `store/notes.store.ts` is canonical.
- `state/notes.store.ts` is compatibility-only.

## Duplicate services

- The service layer is effectively centralised through `services/`, but the legacy `actions/` and `notes/actions/` surfaces still exist for compatibility.

## Duplicate components

- The list, editor, and sidebar UI are exposed via both `components/` and `modules/` and also through canonical domain folders.

## Orphan folders

- `apps/web/app/_features/notes/modules/editor/lib/` is empty and should be removed or archived.

## Empty directories

- `apps/web/app/_features/notes/modules/editor/lib/`

## Migration artifacts

- Several files are marked as compatibility shims in comments and remain in place for downstream imports.

## Classification

### SAFE REMOVE
- Empty directory `modules/editor/lib/`
- Any purely empty wrapper files that were only introduced for migration continuity and are no longer referenced

### KEEP
- Canonical store, services, utils, and domain folders
- The public feature barrel and route-facing components

### NEEDS REVIEW
- Anything in `components/`, `modules/`, `state/`, and `actions/` that still serves as a public import path
