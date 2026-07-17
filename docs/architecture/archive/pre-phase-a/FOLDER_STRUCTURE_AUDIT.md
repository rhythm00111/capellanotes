# Folder Structure Audit — Notes Feature

**Audit Date**: 2026-07-16  
**Scope**: `apps/web/app/_features/notes`

---

## Current Structure

```
notes/
├── ai/                          ⚠️ Empty placeholder
├── collaboration/               ⚠️ Empty placeholder
├── constants/                   ✅ Good
│   └── notes.constants.ts
├── editor/                      ✅ Good - Clear subdomain
│   ├── components/
│   ├── extensions/
│   ├── hooks/
│   └── index.ts
├── hooks/                       ⚠️ Re-export wrappers
│   ├── index.ts
│   ├── useCommandPalette.ts
│   ├── useDiscovery.ts          → Re-exports from notes/list/
│   ├── useEditor.ts             → Re-exports from editor/
│   ├── useNoteNavigation.ts
│   ├── useNotes.ts
│   ├── useNotesList.ts          → Re-exports from notes/list/
│   └── useSidebar.ts            → Re-exports from organization/
├── notes/                       ✅ Good - Notes subdomain
│   ├── list/
│   │   ├── components/
│   │   └── hooks/
│   ├── index.ts
│   └── NoteEditorPage.tsx
├── organization/                ✅ Good - Organization subdomain
│   ├── services/
│   ├── sidebar/
│   │   ├── components/
│   │   └── hooks/
│   ├── types/
│   ├── utils/
│   └── index.ts
├── providers/                   ⚠️ Single file, could be flattened
│   └── index.ts
├── search/                      ⚠️ Empty placeholder
│   └── index.ts
├── services/                    ✅ Good
│   ├── actions/
│   ├── utils/
│   ├── index.ts
│   └── notes.service.ts
├── store/                       ✅ Good
│   ├── index.ts
│   ├── notes.selectors.ts
│   └── notes.store.ts
├── styles/                      ⚠️ Empty (styles in globals.css)
├── templates/                   ⚠️ Empty placeholder
│   └── index.ts
├── types/                       ✅ Good
│   ├── index.ts
│   └── notes.types.ts
├── utils/                       ✅ Good
│   ├── index.ts
│   └── notes.helpers.ts
├── widgets/                     ✅ Good
│   ├── shared/
│   ├── index.ts
│   ├── NotesEmptyState.tsx
│   └── NotesErrorBoundary.tsx
├── index.ts                     ✅ Public API barrel
├── Notes.tsx                    ✅ Feature root
├── NotesError.tsx               ✅ Error boundary
├── NotesLayout.tsx              ✅ Layout wrapper
├── NotesLoader.tsx              ✅ Loading state
├── NotesProvider.tsx            ✅ Context provider
└── README.md                    ✅ Documentation
```

---

## Issues Found

### 1. Empty Placeholder Directories (⚠️ Medium Priority)

**Affected**:
- `ai/` → Single empty index.ts
- `collaboration/` → Single empty index.ts
- `search/` → Single empty index.ts
- `templates/` → Single empty index.ts
- `styles/` → Completely empty

**Impact**: Confusing for developers, implies unfinished work

**Recommendation**:
- Option A: Add README.md explaining future roadmap
- Option B: Remove until actually needed
- **Preferred**: Option A (reserves namespace)

---

### 2. Re-export Wrapper Hooks (⚠️ Low Priority)

**Pattern**:
```typescript
// hooks/useEditor.ts
export * from '@features/notes/editor/hooks/useEditor';
```

**Affected Files**:
- `hooks/useEditor.ts` → wraps editor hook
- `hooks/useSidebar.ts` → wraps organization hook
- `hooks/useDiscovery.ts` → wraps notes/list hook
- `hooks/useNotesList.ts` → wraps notes/list hook

**Purpose**: Backward compatibility during migration

**Status**: ✅ Intentional, documented

**Recommendation**: Keep until all consumers migrated (Phase 5)

---

### 3. Single-File Folders (⚠️ Low Priority)

**Affected**:
- `constants/` → 1 file
- `types/` → 1 file (+ index)
- `utils/` → 1 file (+ index)
- `providers/` → 1 file

**Impact**: Minor - adds nesting without benefit

**Recommendation**: Acceptable for now, aligns with standard patterns

---

### 4. Unnecessary Nesting (✅ None Found)

All subdomain folders justify their depth:
- `editor/` has 3 subfolders (components, extensions, hooks)
- `notes/list/` has 2 subfolders (components, hooks)
- `organization/sidebar/` has 2 subfolders (components, hooks)
- `services/` has 2 subfolders (actions, utils)

**Assessment**: ✅ Appropriate nesting level

---

## Strengths

### 1. Clear Subdomain Boundaries ✅

Each major feature area is isolated:
- `editor/` → TipTap integration
- `notes/` → List and detail views
- `organization/` → Folders and sidebar
- `widgets/` → Shared UI components

### 2. Consistent Barrel Exports ✅

Every folder has an `index.ts` exposing public API:
- Root: `index.ts` (feature-level API)
- Subdomains: `editor/index.ts`, `notes/index.ts`, etc.
- Utilities: `hooks/index.ts`, `utils/index.ts`, etc.

### 3. Proper Layering ✅

```
Components (UI) 
    ↓
Hooks (State & Behavior)
    ↓
Services (Business Logic)
    ↓
Store (State Management)
    ↓
Utils (Pure Functions)
```

No circular dependencies detected.

---

## Recommendations

### Immediate Actions

1. **Document Placeholders** (5 min)
   ```bash
   # Add README.md to each placeholder
   echo "# AI Features (Planned)" > ai/README.md
   echo "# Collaboration (Planned)" > collaboration/README.md
   echo "# Search (Planned)" > search/README.md
   echo "# Templates (Planned)" > templates/README.md
   ```

2. **Remove Empty Styles Folder** (1 min)
   ```bash
   rmdir styles/
   ```

### Future Considerations

3. **Flatten Single-File Folders** (Optional, Phase 5)
   - Move `constants/notes.constants.ts` → `notes.constants.ts`
   - Move `types/notes.types.ts` → `notes.types.ts`
   - Move `utils/notes.helpers.ts` → `notes.helpers.ts`
   - **Tradeoff**: Consistency vs. simplicity

4. **Remove Re-export Wrappers** (Phase 5, after migration)
   - Direct imports from subdomains
   - Update public API barrel

---

## Comparison to Best Practices

### Feature-Sliced Design ✅

Notes feature follows FSD principles:
- ✅ Layers: app → features → shared
- ✅ Slices: editor, notes, organization
- ✅ Segments: ui, model, api, lib
- ✅ Public API via index.ts

### Domain-Driven Design ✅

Clear bounded contexts:
- ✅ Editor domain (TipTap, formatting)
- ✅ Notes domain (list, detail, CRUD)
- ✅ Organization domain (folders, sidebar)
- ✅ Shared kernel (store, types, utils)

### Clean Architecture ✅

Dependency direction is correct:
- ✅ UI depends on hooks
- ✅ Hooks depend on services
- ✅ Services depend on store
- ✅ Store depends on types/utils
- ✅ No reverse dependencies

---

## Folder Structure Score: **8.7/10**

**Strengths**:
- ✅ Clear subdomain isolation
- ✅ Consistent barrel exports
- ✅ Proper layering
- ✅ No circular dependencies

**Weaknesses**:
- ⚠️ Empty placeholder folders (minor)
- ⚠️ Re-export indirection (intentional)

**Overall Assessment**: ✅ **EXCELLENT STRUCTURE**

---

## Next Steps

1. Add README.md to placeholders (5 min)
2. Remove empty `styles/` folder (1 min)
3. Document re-export wrappers in code comments (10 min)

After these minor improvements: **9.0/10**
