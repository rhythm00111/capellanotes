# Phase 7 — File Ownership Matrix

## Ownership model

Each file was classified by owner, responsibility, canonical status, and wrapper status.

## Core ownership

| File / path | Owner | Responsibility | Domain | Canonical? | Wrapper? | Duplicate? | Deprecated? | Dead? |
|---|---|---|---|---|---|---|---|---|
| `apps/web/app/_features/notes/index.ts` | Notes feature | Public feature barrel | notes | Yes | No | No | No | No |
| `apps/web/app/_features/notes/NotesLayout.tsx` | Notes feature | Lightweight layout wrapper | notes | Yes | No | No | No | No |
| `apps/web/app/_features/notes/NotesProvider.tsx` | Notes feature | Provider wrapper | notes | Yes | No | No | No | No |
| `apps/web/app/_features/notes/Notes.tsx` | Notes feature | Root feature entry re-export | notes | Yes | No | No | No | No |
| `apps/web/app/_features/notes/store/notes.store.ts` | Notes domain | Canonical Zustand store | notes | Yes | No | No | No | No |
| `apps/web/app/_features/notes/state/notes.store.ts` | Notes feature | Compatibility re-export | notes | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/store/notes.selectors.ts` | Notes domain | Canonical selectors | notes | Yes | No | No | No | No |
| `apps/web/app/_features/notes/state/notes.selectors.ts` | Notes feature | Compatibility re-export | notes | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/services/index.ts` | Services | Canonical service barrel | services | Yes | No | No | No | No |
| `apps/web/app/_features/notes/services/notes.service.ts` | Services | Service façade | services | Yes | No | No | No | No |
| `apps/web/app/_features/notes/actions/*.ts` | Services | Compatibility shims | services | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/notes/NoteEditorPage.tsx` | Notes domain | Canonical editor-page composition | notes | Yes | No | No | No | No |
| `apps/web/app/_features/notes/components/NoteEditorPage.tsx` | Notes feature | Compatibility re-export | notes | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/notes/list/components/NotesList.tsx` | Notes domain | Canonical list implementation | notes | Yes | No | No | No | No |
| `apps/web/app/_features/notes/modules/list/components/NotesList.tsx` | Notes feature | Module façade | notes | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/components/list/NotesList.tsx` | Notes feature | Compatibility barrel | notes | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/organization/sidebar/components/NotesSidebar.tsx` | Organization domain | Canonical sidebar implementation | organization | Yes | No | No | No | No |
| `apps/web/app/_features/notes/components/sidebar/NotesSidebar.tsx` | Notes feature | Compatibility re-export | organization | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/editor/components/NotesEditor.tsx` | Editor domain | Canonical editor UI | editor | Yes | No | No | No | No |
| `apps/web/app/_features/notes/modules/editor/components/NotesEditor.tsx` | Notes feature | Module façade | editor | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/utils/notes.helpers.ts` | Utils | Canonical helpers | utils | Yes | No | No | No | No |
| `apps/web/app/_features/notes/services/utils/notes.helpers.ts` | Services | Compatibility shim | utils | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/types/notes.types.ts` | Types | Canonical note model and schemas | types | Yes | No | No | No | No |
| `apps/web/app/_features/notes/notes/types/notes.types.ts` | Notes feature | Compatibility shim | types | No | Yes | Yes | Yes | No |
| `apps/web/app/_features/notes/hooks/useSidebar.ts` | Hooks | Sidebar hook | hooks | Yes | No | No | No | No |
| `apps/web/app/_features/notes/hooks/useNotesList.ts` | Hooks | Notes list hook | hooks | Yes | No | No | No | No |
| `apps/web/app/_features/notes/hooks/useDiscovery.ts` | Hooks | Discovery hook | hooks | Yes | No | No | No | No |

## Ownership conclusion

The repository now has a clear primary owner for the core note, editor, organization, services, and store responsibilities. The main issue is not ownership absence; it is the continued presence of layered compatibility paths that blur the canonical ownership story.
