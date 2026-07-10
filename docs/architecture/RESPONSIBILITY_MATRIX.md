# Responsibility Matrix

## Method
Each major file was reviewed for purpose, responsibility, dependencies, consumers, complexity, and ownership fit.

## Matrix

| Path | Purpose | Responsibility | Dependencies | Consumers | Complexity | SRP fit | Future ownership |
|---|---|---|---|---|---|---|---|
| `src/app/layout.tsx` | Root app shell | Global layout, metadata, shared toast container | `./globals.css`, `next/font`, `@/components/ui/toaster` | App-wide | Low | Good | Shared app shell |
| `src/app/page.tsx` | Entry redirect | Redirects `/` to notes | `next/navigation` | Browser entry | Low | Good | App routing |
| `src/app/dashboard/notes/layout.tsx` | Notes route layout | Initializes store, handles keyboard shortcuts, renders command palette | feature hooks, feature components | Notes routes | Medium | Mixed | Notes feature |
| `src/app/dashboard/notes/page.tsx` | Notes list page | Composes header, sidebar, and list UI | feature hooks, feature components, Zustand | Route entry | Medium | Good | Notes feature |
| `src/app/dashboard/notes/[noteId]/page.tsx` | Note editor page | Validates note ID, records visits, renders editor page | feature hooks, feature components, route helpers | Route entry | Medium | Good | Notes feature |
| `apps/web/app/_features/notes/components/NoteEditorPage.tsx` | Editor page container | View state, navigation, focus mode, info panel | feature components, store, hooks | Editor route | High | Mixed | Notes feature |
| `apps/web/app/_features/notes/store/notes.store.ts` | State orchestration | Holds notes/folder state, optimistic updates, mutations | feature actions, helpers, toast hook | Feature-wide | High | Good | Notes domain store |
| `apps/web/app/_features/notes/modules/editor/components/NotesEditor.tsx` | Editor orchestration | Combines title, save, delete, restore, pin, tags, and editor UI | store, hooks, editor subcomponents | Editor route | High | Mixed | Editor domain |
| `apps/web/app/_features/notes/modules/editor/hooks/useEditor.ts` | Editor behavior | Creates editor instance, handles saves, menus, and content sync | TipTap, store, toast | Editor UI | High | Mixed | Editor domain |
| `apps/web/app/_features/notes/modules/editor/components/EditorCore.tsx` | TipTap surface | Renders editor UI and controls | editor modules, UI primitives | Notes editor | High | Mixed | Editor domain |
| `apps/web/app/_features/notes/modules/editor/extensions/WikiLink.ts` | Editor extension | Wiki-link suggestion behavior | injected note accessor | editor hook | Medium | Good | Editor domain |
| `apps/web/app/_features/notes/modules/editor/components/NoteHeader.tsx` | Editor header | Title, pin, delete, tags UI | UI primitives | Notes editor | Medium | Good | Editor domain |
| `apps/web/app/_features/notes/modules/editor/components/NoteInfoPanel.tsx` | Metadata panel | Displays note metadata and backlinks | helpers, UI primitives | Note editor page | Medium | Good | Editor domain |
| `apps/web/app/_features/notes/components/list/NotesList.tsx` | List surface | Renders notes list, filters, actions | hooks, store, list components | notes page | High | Mixed | Notes domain |
| `apps/web/app/_features/notes/components/sidebar/NotesSidebar.tsx` | Sidebar surface | Renders folders, folder actions, and sidebar workflow | store, hooks | notes page | Medium | Mixed | Organization domain |
| `apps/web/app/_features/notes/actions/get-notes.action.ts` | Data access | Returns notes and folders | types | store | Low | Good | Services |
| `apps/web/app/_features/notes/actions/create-note.action.ts` | Data mutation | Creates notes/folders | types, helpers | store | Low | Good | Services |
| `apps/web/app/_features/notes/actions/update-note.action.ts` | Data mutation | Updates note metadata/folders | types | store | Low | Good | Services |
| `apps/web/app/_features/notes/actions/delete-note.action.ts` | Data mutation | Delete/restore/permanent delete/trash | none | store | Low | Good | Services |
| `apps/web/app/_features/notes/types/notes.types.ts` | Domain model | Defines entity shapes and Zod schemas | zod, TipTap | feature-wide | Medium | Good | Types |
| `apps/web/app/_features/notes/lib/notes.helpers.ts` | Utility logic | Text extraction, formatting, filtering | TipTap types | multiple modules | Medium | Good | Utils |
| `apps/web/app/_features/notes/hooks/useNoteNavigation.ts` | Navigation logic | Route navigation and note creation | router, store, routes, helpers | feature-wide | Medium | Good | Hooks |
| `src/lib/routes.ts` | Routing helper | Central route builder | none | feature and app | Low | Good | Config |
| `src/lib/utils.ts` | General utilities | Class-name merging | external libs | UI components | Low | Good | Utils |
| `src/hooks/use-toast.ts` | Shared notification state | Toast state machine | UI toast components | app-wide | Medium | Good | Widgets |

## Ownership observations
- The strongest ownership fit is in the store, helper utilities, and route-level composition.
- The weakest ownership fit is in editor orchestration files, which currently combine rendering, state, and interaction behavior.
- The sidebar and list areas are moderate-quality ownership fits but could be further narrowed if future migration uses more explicit domain boundaries.
