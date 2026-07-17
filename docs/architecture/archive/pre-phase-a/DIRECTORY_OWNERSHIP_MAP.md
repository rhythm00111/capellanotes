# Directory Ownership Map — Notes Feature

**Generated**: 2026-07-16  
**Purpose**: Define clear ownership and responsibility for every directory  
**Status**: Canonical ownership reference

---

## Ownership Matrix

| Directory | Owner | Domain | Type | Status | Files |
|-----------|-------|--------|------|--------|-------|
| **Root** | Notes Feature Team | Feature | Root | ✅ Active | 7 |
| `ai/` | AI Team (future) | AI | Placeholder | ⚠️ Reserved | 1 |
| `collaboration/` | Collaboration Team (future) | Collaboration | Placeholder | ⚠️ Reserved | 1 |
| `constants/` | Notes Feature Team | Shared | Active | ✅ Active | 1 |
| `editor/` | Editor Domain Team | Editor | Subdomain | ✅ Active | 14 |
| `├─ components/` | Editor Domain Team | Editor | UI | ✅ Active | 10 |
| `├─ extensions/` | Editor Domain Team | Editor | Extensions | ✅ Active | 2 |
| `└─ hooks/` | Editor Domain Team | Editor | Behavior | ✅ Active | 1 |
| `hooks/` | Notes Feature Team | Shared | Mixed | ✅ Active | 8 |
| `notes/` | Notes Domain Team | Notes | Subdomain | ✅ Active | 12 |
| `├─ list/` | Notes Domain Team | Notes | Container | ✅ Active | 0 |
| `├─ list/components/` | Notes Domain Team | Notes | UI | ✅ Active | 8 |
| `└─ list/hooks/` | Notes Domain Team | Notes | Behavior | ✅ Active | 2 |
| `organization/` | Organization Domain Team | Organization | Subdomain | ✅ Active | 11 |
| `├─ services/` | Organization Domain Team | Organization | Business Logic | ✅ Active | 2 |
| `├─ sidebar/` | Organization Domain Team | Organization | Container | ✅ Active | 0 |
| `├─ sidebar/components/` | Organization Domain Team | Organization | UI | ✅ Active | 3 |
| `├─ sidebar/hooks/` | Organization Domain Team | Organization | Behavior | ✅ Active | 1 |
| `├─ types/` | Organization Domain Team | Organization | Types | ✅ Active | 2 |
| `└─ utils/` | Organization Domain Team | Organization | Utilities | ✅ Active | 2 |
| `providers/` | Notes Feature Team | Shared | Placeholder | ⚠️ Reserved | 1 |
| `search/` | Search Team (future) | Search | Placeholder | ⚠️ Reserved | 1 |
| `services/` | Notes Feature Team | Shared | Business Logic | ✅ Active | 7 |
| `├─ actions/` | Notes Feature Team | Shared | Server Actions | ✅ Active | 4 |
| `└─ utils/` | Notes Feature Team | Shared | Utilities | ✅ Active | 1 |
| `store/` | Notes Feature Team | Shared | State | ✅ Active | 3 |
| `styles/` | Notes Feature Team | Shared | Empty | ⚠️ Remove | 1 |
| `templates/` | Templates Team (future) | Templates | Placeholder | ⚠️ Reserved | 1 |
| `types/` | Notes Feature Team | Shared | Types | ✅ Active | 2 |
| `utils/` | Notes Feature Team | Shared | Utilities | ✅ Active | 2 |
| `widgets/` | Notes Feature Team | Shared | UI | ✅ Active | 4 |
| `└─ shared/` | Notes Feature Team | Shared | Barrel | ✅ Active | 1 |

---

## Domain Breakdown

### Editor Domain (14 files)

**Owner**: Editor Domain Team  
**Scope**: TipTap editor integration, formatting, extensions

| Directory | Responsibility | Files |
|-----------|----------------|-------|
| `editor/` | Editor subdomain root | 1 |
| `editor/components/` | Editor UI components | 10 |
| `editor/extensions/` | TipTap extensions | 2 |
| `editor/hooks/` | Editor state management | 1 |

**Key Files**:
- `EditorCore.tsx` → Main editor component
- `NotesEditor.tsx` → Editor orchestrator
- `useEditor.ts` → Editor state hook
- `WikiLink.ts` → Wiki link extension
- `SlashCommand.ts` → Slash command extension

**Boundaries**:
- ✅ Self-contained
- ✅ No dependencies on notes/ or organization/
- ✅ Only imports from store/, types/, utils/

---

### Notes Domain (12 files)

**Owner**: Notes Domain Team  
**Scope**: Note listing, detail views, CRUD operations

| Directory | Responsibility | Files |
|-----------|----------------|-------|
| `notes/` | Notes subdomain root | 2 |
| `notes/list/` | Container directory | 0 |
| `notes/list/components/` | List view UI | 8 |
| `notes/list/hooks/` | List behavior | 2 |

**Key Files**:
- `NoteEditorPage.tsx` → Note detail page
- `NotesList.tsx` → Main list component
- `NotesHeader.tsx` → List header
- `useNotesList.ts` → List state hook
- `useDiscovery.ts` → Visit tracking

**Boundaries**:
- ✅ Self-contained
- ✅ No dependencies on editor/ or organization/
- ✅ Only imports from store/, types/, utils/

---

### Organization Domain (11 files)

**Owner**: Organization Domain Team  
**Scope**: Folder management, sidebar navigation

| Directory | Responsibility | Files |
|-----------|----------------|-------|
| `organization/` | Organization subdomain root | 1 |
| `organization/services/` | Folder operations | 2 |
| `organization/sidebar/` | Container directory | 0 |
| `organization/sidebar/components/` | Sidebar UI | 3 |
| `organization/sidebar/hooks/` | Sidebar behavior | 1 |
| `organization/types/` | Folder types | 2 |
| `organization/utils/` | Folder utilities | 2 |

**Key Files**:
- `NotesSidebar.tsx` → Main sidebar
- `useSidebar.ts` → Sidebar state
- `organization.types.ts` → Folder types
- `folders.service.ts` → Folder CRUD

**Boundaries**:
- ✅ Self-contained
- ✅ Imports Note type from types/ (acceptable cross-domain)
- ✅ No dependencies on editor/ or notes/

---

### Store Domain (3 files)

**Owner**: Notes Feature Team  
**Scope**: Global state management (Zustand)

| Directory | Responsibility | Files |
|-----------|----------------|-------|
| `store/` | State management | 3 |

**Key Files**:
- `notes.store.ts` → Zustand store (14 actions)
- `notes.selectors.ts` → Selectors
- `index.ts` → Store barrel

**Boundaries**:
- ✅ Central state for all domains
- ✅ Imported by editor/, notes/, organization/
- ✅ No imports from domains (only types/, utils/)

---

### Services Domain (7 files)

**Owner**: Notes Feature Team  
**Scope**: Business logic, server actions

| Directory | Responsibility | Files |
|-----------|----------------|-------|
| `services/` | Services root | 2 |
| `services/actions/` | Server actions | 4 |
| `services/utils/` | Service utilities | 1 |

**Key Files**:
- `create-note.action.ts` → Create operations
- `get-notes.action.ts` → Read operations
- `update-note.action.ts` → Update operations
- `delete-note.action.ts` → Delete operations
- `notes.service.ts` → Service facade

**Boundaries**:
- ✅ Called by store/ only
- ✅ No dependencies on UI domains
- ✅ Server-side code ('use server')

---

### Shared Domains (26 files)

**Owner**: Notes Feature Team  
**Scope**: Cross-cutting concerns

| Directory | Responsibility | Files |
|-----------|----------------|-------|
| Root | Feature API | 7 |
| `hooks/` | Feature-level hooks | 8 |
| `widgets/` | Shared UI | 4 |
| `types/` | Core types | 2 |
| `utils/` | Utilities | 2 |
| `constants/` | Constants | 1 |
| Placeholders | Reserved namespaces | 5 |

**Key Files**:
- `index.ts` → Public feature API
- `useNoteNavigation.ts` → Navigation hook
- `useCommandPalette.ts` → Command palette
- `notes.types.ts` → Core types
- `notes.helpers.ts` → Utility functions

**Boundaries**:
- ✅ Imported by all domains
- ✅ No domain-specific logic
- ✅ Pure functions and types

---

## Responsibility Matrix

### UI Components (27 .tsx files)

| Domain | Count | Directories |
|--------|-------|-------------|
| Editor | 10 | `editor/components/` |
| Notes | 10 | `notes/`, `notes/list/components/` |
| Organization | 3 | `organization/sidebar/components/` |
| Shared | 4 | Root, `widgets/` |

### Hooks (13 .ts files)

| Domain | Count | Directories |
|--------|-------|-------------|
| Editor | 1 | `editor/hooks/` |
| Notes | 2 | `notes/list/hooks/` |
| Organization | 1 | `organization/sidebar/hooks/` |
| Shared | 8 | `hooks/` |
| Wrappers | 4 | `hooks/` (compatibility) |

### Business Logic (7 .ts files)

| Domain | Count | Directories |
|--------|-------|-------------|
| Services | 4 | `services/actions/` |
| Services | 2 | `services/` |
| Organization | 1 | `organization/services/` |

### State Management (3 .ts files)

| Domain | Count | Directories |
|--------|-------|-------------|
| Store | 3 | `store/` |

### Types (6 .ts files)

| Domain | Count | Directories |
|--------|-------|-------------|
| Core | 2 | `types/` |
| Organization | 2 | `organization/types/` |
| Editor | 2 | `editor/extensions/` (includes types) |

### Utilities (5 .ts files)

| Domain | Count | Directories |
|--------|-------|-------------|
| Core | 2 | `utils/` |
| Organization | 2 | `organization/utils/` |
| Services | 1 | `services/utils/` |

### Infrastructure (16 files)

| Type | Count | Purpose |
|------|-------|---------|
| Barrel exports | 15 | Public API surfaces |
| Documentation | 2 | README files |

---

## Ownership Rules

### Domain Isolation Rules

1. **Editor Domain**
   - ✅ Can import: `store/`, `types/`, `utils/`, `constants/`
   - ❌ Cannot import: `notes/`, `organization/`
   - ✅ Exported via: `editor/index.ts`

2. **Notes Domain**
   - ✅ Can import: `store/`, `types/`, `utils/`, `constants/`
   - ❌ Cannot import: `editor/`, `organization/`
   - ✅ Exported via: `notes/index.ts`

3. **Organization Domain**
   - ✅ Can import: `store/`, `types/`, `utils/`, `constants/`
   - ❌ Cannot import: `editor/`, `notes/`
   - ✅ Exported via: `organization/index.ts`

4. **Shared Domains**
   - ✅ Can be imported by all domains
   - ❌ Cannot import from domain-specific folders
   - ✅ Exported via feature-level `index.ts`

---

## Access Patterns

### Public API Access (External Consumers)

```typescript
// ✅ Correct - Use feature barrel
import { useNotesStore, NotesList, NotesEditor } from '@features/notes';

// ❌ Incorrect - Deep import bypasses barrel
import { useNotesStore } from '@features/notes/store/notes.store';
```

### Internal Domain Access

```typescript
// ✅ Correct - Use domain barrel
import { NotesEditor } from '@features/notes/editor';

// ✅ Also correct - Use specific subdomain
import { NotesEditor } from '@features/notes/editor/components/NotesEditor';
```

### Cross-Domain Access

```typescript
// ✅ Correct - Via store
import { useNotesStore } from '@features/notes/store';

// ❌ Incorrect - Direct domain import
import { something } from '@features/notes/editor/components/EditorCore';
```

---

## Compatibility Ownership

### Re-export Wrappers (4 files)

| File | Canonical Location | Reason | Phase Out |
|------|-------------------|--------|-----------|
| `hooks/useDiscovery.ts` | `notes/list/hooks/useDiscovery.ts` | API stability | Phase 5 |
| `hooks/useEditor.ts` | `editor/hooks/useEditor.ts` | API stability | Phase 5 |
| `hooks/useNotesList.ts` | `notes/list/hooks/useNotesList.ts` | API stability | Phase 5 |
| `hooks/useSidebar.ts` | `organization/sidebar/hooks/useSidebar.ts` | API stability | Phase 5 |

**Ownership**: Notes Feature Team  
**Purpose**: Maintain backward-compatible API surface  
**Status**: Keep until Phase 5

---

## Placeholder Ownership

### Reserved Namespaces (5 directories)

| Directory | Future Owner | Purpose | Timeline |
|-----------|-------------|---------|----------|
| `ai/` | AI Team | AI-powered features | Phase 6 (Q4 2026) |
| `collaboration/` | Collaboration Team | Real-time editing | Phase 7 (Q1 2027) |
| `search/` | Search Team | Advanced search | Phase 5 (Q3 2026) |
| `templates/` | Templates Team | Template library | Phase 5 (Q3 2026) |
| `providers/` | Notes Feature Team | Context providers | Future |

**Current Ownership**: Notes Feature Team (custodian)  
**Status**: Reserved for future implementation

---

## Change Management

### Adding New Files

**Rule**: Files must be added to the appropriate domain directory

| New File Type | Add To | Owner Approval |
|---------------|--------|----------------|
| Editor component | `editor/components/` | Editor Team |
| Notes component | `notes/list/components/` | Notes Team |
| Org component | `organization/sidebar/components/` | Org Team |
| Shared component | `widgets/` | Feature Team |
| Hook | Domain-specific `hooks/` | Domain Team |
| Service | `services/actions/` | Feature Team |
| Type | Domain-specific `types/` | Domain Team |
| Utility | Domain-specific `utils/` | Domain Team |

### Moving Files

**Rule**: File moves require:
1. Domain owner approval
2. Update all imports
3. Update barrel exports
4. Update documentation

### Deleting Files

**Rule**: File deletions require:
1. Verify no references (grep search)
2. Domain owner approval
3. Update barrel exports
4. Archive if uncertain

---

## Maintenance Responsibilities

### Daily
- **All Teams**: Keep code quality high, add tests

### Weekly
- **Domain Teams**: Review domain boundaries, check for drift

### Monthly
- **Feature Team**: Audit folder structure, identify cleanup opportunities

### Quarterly
- **Architecture Team**: Review ownership matrix, update documentation

---

## Escalation

### Ownership Disputes

1. Check this document
2. Consult domain team lead
3. Escalate to feature architect
4. Document decision

### Cross-Domain Changes

1. Propose change
2. Get approval from affected domain owners
3. Implement with all teams aware
4. Update documentation

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ Active | In production use |
| ⚠️ Reserved | Placeholder for future |
| ⚠️ Remove | Should be deleted |
| 🔄 Compatibility | Backward compatibility wrapper |

---

**Document Status**: ✅ **CANONICAL OWNERSHIP MAP**  
**Last Updated**: 2026-07-16  
**Next Review**: 2026-10-16 (Quarterly)  
**Owner**: Notes Feature Team Lead
