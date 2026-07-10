# Domain Ownership Matrix

## Domain taxonomy
The following domains are used for classification:
- editor
- notes
- organization
- widgets
- ai
- collaboration
- templates
- search
- services
- providers
- hooks
- config
- constants
- types
- utils
- styles

## Ownership by file

| Path | Primary domain | Notes |
|---|---|---|
| `apps/web/app/_features/notes/index.ts` | services | Feature surface and barrel |
| `apps/web/app/_features/notes/AUDIT.md` | config | Internal architecture audit artifact |
| `apps/web/app/_features/notes/P0_OWNERSHIP.md` | config | Ownership and migration notes |
| `apps/web/app/_features/notes/README.md` | config | Feature documentation |
| `apps/web/app/_features/notes/constants/notes.constants.ts` | constants | Shared note constants |
| `apps/web/app/_features/notes/types/notes.types.ts` | types | Domain models and Zod schemas |
| `apps/web/app/_features/notes/lib/notes.helpers.ts` | utils | Canonical helper implementations |
| `apps/web/app/_features/notes/utils/notes.helpers.ts` | utils | Compatibility shim |
| `apps/web/app/_features/notes/hooks/useEditor.ts` | hooks | Editor-specific behavior |
| `apps/web/app/_features/notes/hooks/useNotes.ts` | hooks | Notes state accessors |
| `apps/web/app/_features/notes/hooks/useNoteNavigation.ts` | hooks | Navigation and note creation |
| `apps/web/app/_features/notes/hooks/useCommandPalette.ts` | hooks | Command palette behavior |
| `apps/web/app/_features/notes/hooks/useNotesList.ts` | hooks | List-specific behavior |
| `apps/web/app/_features/notes/hooks/useDiscovery.ts` | hooks | Discovery and recommendation logic |
| `apps/web/app/_features/notes/hooks/useSidebar.ts` | hooks | Sidebar behavior |
| `apps/web/app/_features/notes/actions/create-note.action.ts` | services | Note creation actions |
| `apps/web/app/_features/notes/actions/delete-note.action.ts` | services | Delete/restore actions |
| `apps/web/app/_features/notes/actions/get-notes.action.ts` | services | Read actions |
| `apps/web/app/_features/notes/actions/update-note.action.ts` | services | Update actions |
| `apps/web/app/_features/notes/services/notes.service.ts` | services | Service façade |
| `apps/web/app/_features/notes/store/notes.store.ts` | notes | Canonical Zustand store |
| `apps/web/app/_features/notes/state/notes.store.ts` | notes | Compatibility shim |
| `apps/web/app/_features/notes/state/notes.selectors.ts` | notes | Compatibility shim |
| `apps/web/app/_features/notes/components/NoteEditorPage.tsx` | notes | Editor page composition |
| `apps/web/app/_features/notes/components/NotesEmptyState.tsx` | widgets | Empty-state widget |
| `apps/web/app/_features/notes/components/NotesErrorBoundary.tsx` | widgets | Error boundary UI |
| `apps/web/app/_features/notes/components/editor/*` | editor | Editor UI components |
| `apps/web/app/_features/notes/components/list/*` | notes | Notes list UI |
| `apps/web/app/_features/notes/components/sidebar/*` | organization | Sidebar organization UI |
| `apps/web/app/_features/notes/modules/editor/*` | editor | Canonical editor implementation |
| `apps/web/app/_features/notes/modules/list/*` | notes | Canonical list implementation |
| `apps/web/app/_features/notes/modules/sidebar/*` | organization | Canonical sidebar implementation |
| `src/app/layout.tsx` | config | Root layout and metadata |
| `src/app/page.tsx` | config | Root redirect |
| `src/app/dashboard/notes/layout.tsx` | notes | Notes route layout |
| `src/app/dashboard/notes/page.tsx` | notes | Notes list page |
| `src/app/dashboard/notes/[noteId]/page.tsx` | notes | Note detail page |
| `src/components/ui/*` | widgets | Shared UI primitives |
| `src/lib/routes.ts` | config | Route helpers |
| `src/lib/utils.ts` | utils | Shared utility helpers |
| `src/hooks/use-toast.ts` | widgets | Toast state hook |
| `playwright.config.ts` | config | Test runner config |
| `package.json` | config | Package manifest |
| `tsconfig.json` | config | TypeScript config |
| `next.config.mjs` | config | Next.js config |
| `tailwind.config.ts` | config | Tailwind config |
| `components.json` | config | UI component generator config |

## Architectural issue notes
Several files span multiple domains in practice, especially those that orchestrate UI and state together. The clearest example is the editor implementation in `apps/web/app/_features/notes/modules/editor/components/NotesEditor.tsx`, which mixes editor, notes, hooks, and services concerns. This is an architectural issue because it blurs ownership and makes future migrations harder.
