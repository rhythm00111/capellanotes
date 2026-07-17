# Phase 7 — Folder Structure Report

## Overview

The Notes feature has a layered folder structure that reflects an in-progress migration from a broader legacy surface into a domain-oriented layout.

## Canonical folders

- `apps/web/app/_features/notes/notes/` — canonical notes-domain implementation surface for list and editor page composition
- `apps/web/app/_features/notes/organization/` — canonical organization-domain implementation surface for folders and sidebar behavior
- `apps/web/app/_features/notes/editor/` — canonical editor-domain implementation surface
- `apps/web/app/_features/notes/store/` — canonical state/store ownership
- `apps/web/app/_features/notes/services/` — canonical service-entry ownership
- `apps/web/app/_features/notes/utils/` — canonical utilities ownership
- `apps/web/app/_features/notes/types/` — canonical domain types ownership

## Compatibility folders

- `apps/web/app/_features/notes/components/` — compatibility/namespaced UI surface
- `apps/web/app/_features/notes/modules/` — module façade surface that re-exports canonical implementations
- `apps/web/app/_features/notes/state/` — compatibility re-export surface for state modules
- `apps/web/app/_features/notes/actions/` — compatibility shims for service action entry points
- `apps/web/app/_features/notes/notes/` — nested domain surface that duplicates the higher-level feature organization

## Legacy or transitional folders

- `apps/web/app/_features/notes/components/list/`
- `apps/web/app/_features/notes/components/sidebar/`
- `apps/web/app/_features/notes/components/editor/`
- `apps/web/app/_features/notes/modules/list/`
- `apps/web/app/_features/notes/modules/sidebar/`
- `apps/web/app/_features/notes/modules/editor/`

## Duplicate or overlapping folders

- `components/` and `modules/` both expose the same UI concepts through different entry points
- `store/` and `state/` both represent state ownership, with `state/` acting as a compatibility layer
- `notes/` contains its own list and action substructure that overlaps with the broader feature root

## Unused or low-value folders

- `apps/web/app/_features/notes/ai/` — present but not meaningfully implemented in the current codebase
- `apps/web/app/_features/notes/collaboration/` — present but not materially used in the current implementation
- `apps/web/app/_features/notes/templates/` — present but effectively inert in the current codebase
- `apps/web/app/_features/notes/search/` — present but not meaningfully wired
- `apps/web/app/_features/notes/providers/` — present but not providing a substantial runtime surface

## Empty folders

- `apps/web/app/_features/notes/modules/editor/lib/`

## Misplaced files

- The feature root contains several public UI and page components that are logically part of domain folders but are still surfaced at the root level.
- The list and editor page components are re-exported through multiple layers rather than being owned by one canonical path.

## Structure conclusion

The folder structure is no longer purely legacy, but it is not fully normalized either. The repository is in a transitional state with a good target architecture visible, but with several parallel surfaces still active.
