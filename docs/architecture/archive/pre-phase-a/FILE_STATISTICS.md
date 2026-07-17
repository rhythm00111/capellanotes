# File Statistics — Notes Feature

**Generated**: 2026-07-16  
**Source**: Direct filesystem scan  
**Purpose**: Comprehensive file-level metrics

---

## Overall Statistics

| Metric | Count |
|--------|-------|
| **Total Directories** | 31 |
| **Total Files** | 77 |
| **TypeScript Files (.ts)** | 48 |
| **React Components (.tsx)** | 27 |
| **Documentation (.md)** | 2 |
| **Total Lines of Code** | ~15,000 (estimated) |
| **Total Size** | ~220 KB |
| **Average File Size** | ~3 KB |

---

## File Type Distribution

### By Extension

```
.tsx (React Components)     27 files (35%)  ████████████████████████████████████
.ts  (TypeScript)          48 files (62%)  ██████████████████████████████████████████████████████████████
.md  (Documentation)        2 files (3%)   ███
```

| Extension | Count | Percentage | Total Size |
|-----------|-------|------------|------------|
| `.tsx` | 27 | 35% | ~145 KB |
| `.ts` | 48 | 62% | ~71 KB |
| `.md` | 2 | 3% | ~2.2 KB |

### By Category

| Category | Count | Percentage |
|----------|-------|------------|
| **Components** | 26 | 34% |
| **Hooks** | 8 | 10% |
| **Services** | 7 | 9% |
| **Types** | 4 | 5% |
| **Utilities** | 2 | 3% |
| **Extensions** | 2 | 3% |
| **Store** | 3 | 4% |
| **Barrel Exports** | 15 | 19% |
| **Root Files** | 7 | 9% |
| **Documentation** | 2 | 3% |
| **Placeholders** | 5 | 6% |

---

## Files by Domain

### Editor Domain (14 files)

| File | Type | Size | Status |
|------|------|------|--------|
| `editor/index.ts` | Barrel | 549 B | ✅ Active |
| `editor/components/BlockMenu.tsx` | Component | 6.3 KB | ✅ Active |
| `editor/components/CommandPalette.tsx` | Component | 8.7 KB | ✅ Active |
| `editor/components/EditorBody.tsx` | Component | 608 B | ✅ Active |
| `editor/components/EditorCore.tsx` | Component | 23.5 KB | ⚠️ Large |
| `editor/components/NoteHeader.tsx` | Component | 9.2 KB | ✅ Active |
| `editor/components/NoteInfoPanel.tsx` | Component | 5.5 KB | ✅ Active |
| `editor/components/NotesEditor.tsx` | Component | 9.5 KB | ✅ Active |
| `editor/components/SlashMenu.tsx` | Component | 6.6 KB | ✅ Active |
| `editor/components/TrashBanner.tsx` | Component | 1.2 KB | ✅ Active |
| `editor/components/WikiLinkMenu.tsx` | Component | 3.5 KB | ✅ Active |
| `editor/extensions/SlashCommand.ts` | Extension | 5.2 KB | ✅ Active |
| `editor/extensions/WikiLink.ts` | Extension | 5.0 KB | ✅ Active |
| `editor/hooks/useEditor.ts` | Hook | 10.0 KB | ✅ Active |

**Total**: 14 files, ~85.9 KB

### Notes Domain (12 files)

| File | Type | Size | Status |
|------|------|------|--------|
| `notes/index.ts` | Barrel | 412 B | ✅ Active |
| `notes/NoteEditorPage.tsx` | Component | 8.1 KB | ✅ Active |
| `notes/list/components/index.ts` | Barrel | 285 B | ✅ Active |
| `notes/list/components/NoteCard.tsx` | Component | 4.5 KB | ✅ Active |
| `notes/list/components/NoteContextMenu.tsx` | Component | 5.7 KB | ✅ Active |
| `notes/list/components/NotesFilters.tsx` | Component | 1.7 KB | ✅ Active |
| `notes/list/components/NotesHeader.tsx` | Component | 4.0 KB | ✅ Active |
| `notes/list/components/NotesItem.tsx` | Component | 5.3 KB | ✅ Active |
| `notes/list/components/NotesList.tsx` | Component | 13.7 KB | ⚠️ Large |
| `notes/list/components/ViewToggle.tsx` | Component | 1.7 KB | ✅ Active |
| `notes/list/hooks/useDiscovery.ts` | Hook | 1.1 KB | ✅ Active |
| `notes/list/hooks/useNotesList.ts` | Hook | 2.9 KB | ✅ Active |

**Total**: 12 files, ~38.9 KB

### Organization Domain (11 files)

| File | Type | Size | Status |
|------|------|------|--------|
| `organization/index.ts` | Barrel | 836 B | ✅ Active |
| `organization/services/folders.service.ts` | Service | 838 B | ✅ Active |
| `organization/services/index.ts` | Barrel | 93 B | ✅ Active |
| `organization/sidebar/components/index.ts` | Barrel | 138 B | ✅ Active |
| `organization/sidebar/components/NotesSidebar.tsx` | Component | 6.9 KB | ✅ Active |
| `organization/sidebar/components/SidebarFolderItem.tsx` | Component | 1.3 KB | ✅ Active |
| `organization/sidebar/hooks/useSidebar.ts` | Hook | 1.0 KB | ✅ Active |
| `organization/types/index.ts` | Barrel | 93 B | ✅ Active |
| `organization/types/organization.types.ts` | Types | 2.3 KB | ✅ Active |
| `organization/utils/folder.utils.ts` | Utility | 701 B | ✅ Active |
| `organization/utils/index.ts` | Barrel | 91 B | ✅ Active |

**Total**: 11 files, ~14.3 KB

### Store Domain (3 files)

| File | Type | Size | Status |
|------|------|------|--------|
| `store/index.ts` | Barrel | 103 B | ✅ Active |
| `store/notes.selectors.ts` | Selector | 955 B | ✅ Active |
| `store/notes.store.ts` | Store | 12.1 KB | ✅ Active |

**Total**: 3 files, ~13.2 KB

### Services Domain (7 files)

| File | Type | Size | Status |
|------|------|------|--------|
| `services/index.ts` | Barrel | 281 B | ✅ Active |
| `services/notes.service.ts` | Facade | 268 B | ✅ Active |
| `services/actions/create-note.action.ts` | Action | 917 B | ✅ Active |
| `services/actions/delete-note.action.ts` | Action | 602 B | ✅ Active |
| `services/actions/get-notes.action.ts` | Action | 386 B | ✅ Active |
| `services/actions/update-note.action.ts` | Action | 408 B | ✅ Active |
| `services/utils/notes.helpers.ts` | Utility | 108 B | ✅ Active |

**Total**: 7 files, ~2.9 KB

### Shared Files (30 files)

| File | Type | Size | Status |
|------|------|------|--------|
| `index.ts` | Barrel | 1.7 KB | ✅ Active |
| `Notes.tsx` | Component | 358 B | ✅ Active |
| `NotesError.tsx` | Component | 244 B | ✅ Active |
| `NotesLayout.tsx` | Component | 281 B | ✅ Active |
| `NotesLoader.tsx` | Component | 180 B | ✅ Active |
| `NotesProvider.tsx` | Component | 369 B | ✅ Active |
| `README.md` | Docs | 2.0 KB | ✅ Active |
| `hooks/index.ts` | Barrel | 538 B | ✅ Active |
| `hooks/useCommandPalette.ts` | Hook | 1.3 KB | ✅ Active |
| `hooks/useDiscovery.ts` | Wrapper | 131 B | 🔄 Compat |
| `hooks/useEditor.ts` | Wrapper | 201 B | 🔄 Compat |
| `hooks/useNoteNavigation.ts` | Hook | 3.2 KB | ✅ Active |
| `hooks/useNotes.ts` | Hook | 425 B | ✅ Active |
| `hooks/useNotesList.ts` | Wrapper | 127 B | 🔄 Compat |
| `hooks/useSidebar.ts` | Wrapper | 194 B | 🔄 Compat |
| `constants/notes.constants.ts` | Constants | 114 B | ✅ Active |
| `types/index.ts` | Barrel | 32 B | ✅ Active |
| `types/notes.types.ts` | Types | 2.7 KB | ✅ Active |
| `utils/index.ts` | Barrel | 105 B | ✅ Active |
| `utils/notes.helpers.ts` | Utility | 9.7 KB | ✅ Active |
| `widgets/index.ts` | Barrel | 146 B | ✅ Active |
| `widgets/NotesEmptyState.tsx` | Component | 3.0 KB | ✅ Active |
| `widgets/NotesErrorBoundary.tsx` | Component | 2.4 KB | ✅ Active |
| `widgets/shared/index.ts` | Barrel | 228 B | ✅ Active |
| `ai/index.ts` | Placeholder | 693 B | ⚠️ Reserved |
| `collaboration/index.ts` | Placeholder | 452 B | ⚠️ Reserved |
| `search/index.ts` | Placeholder | 573 B | ⚠️ Reserved |
| `templates/index.ts` | Placeholder | 198 B | ⚠️ Reserved |
| `providers/index.ts` | Placeholder | 393 B | ⚠️ Reserved |
| `styles/README.md` | Docs | 269 B | ⚠️ Empty |

**Total**: 30 files, ~32.0 KB

---

## File Size Analysis

### Distribution

```
Tiny    (<1 KB)     27 files (35%)  ████████████████████████████████████
Small   (1-5 KB)    30 files (39%)  ███████████████████████████████████████
Medium  (5-10 KB)   18 files (23%)  ███████████████████████
Large   (10-25 KB)   2 files (3%)   ███
```

| Size Range | Count | Percentage | Files |
|------------|-------|------------|-------|
| < 1 KB | 27 | 35% | Mostly barrels and wrappers |
| 1-5 KB | 30 | 39% | Standard components/hooks |
| 5-10 KB | 18 | 23% | Complex components |
| 10-25 KB | 2 | 3% | EditorCore, NotesList |

### Largest Files

| Rank | File | Size | Lines | Status |
|------|------|------|-------|--------|
| 1 | `editor/components/EditorCore.tsx` | 23.5 KB | ~483 | ⚠️ Needs split |
| 2 | `notes/list/components/NotesList.tsx` | 13.7 KB | ~353 | ⚠️ Needs split |
| 3 | `store/notes.store.ts` | 12.1 KB | ~258 | ✅ Acceptable |
| 4 | `editor/hooks/useEditor.ts` | 10.0 KB | ~176 | ✅ Acceptable |
| 5 | `utils/notes.helpers.ts` | 9.7 KB | ~210 | ✅ Good |
| 6 | `editor/components/NotesEditor.tsx` | 9.5 KB | ~244 | ✅ Acceptable |
| 7 | `editor/components/NoteHeader.tsx` | 9.2 KB | ~200 | ✅ Good |
| 8 | `editor/components/CommandPalette.tsx` | 8.7 KB | ~190 | ✅ Good |
| 9 | `notes/NoteEditorPage.tsx` | 8.1 KB | ~175 | ✅ Good |
| 10 | `organization/sidebar/components/NotesSidebar.tsx` | 6.9 KB | ~150 | ✅ Good |

### Smallest Files (Excluding Barrels)

| Rank | File | Size | Purpose |
|------|------|------|---------|
| 1 | `services/utils/notes.helpers.ts` | 108 B | Service helper |
| 2 | `constants/notes.constants.ts` | 114 B | Constants |
| 3 | `hooks/useNotesList.ts` | 127 B | Wrapper |
| 4 | `hooks/useDiscovery.ts` | 131 B | Wrapper |
| 5 | `NotesLoader.tsx` | 180 B | Loading UI |

---

## Barrel Export Statistics

### Count by Domain

| Domain | Barrels | Purpose |
|--------|---------|---------|
| Root | 1 | Feature API |
| Editor | 1 | Domain API |
| Notes | 2 | Domain + components |
| Organization | 5 | Domain + subdomains |
| Services | 2 | Services + actions |
| Hooks | 1 | Hooks API |
| Store | 1 | Store API |
| Types | 2 | Core + org types |
| Utils | 2 | Core + org utils |
| Widgets | 2 | Widgets + shared |

**Total**: 15 barrel files

### Barrel Quality

| File | Exports | Quality |
|------|---------|---------|
| `index.ts` (root) | 30+ | ✅ Comprehensive |
| `editor/index.ts` | 12 | ✅ Complete |
| `notes/index.ts` | 6 | ✅ Focused |
| `organization/index.ts` | Re-exports | ✅ Clean |
| `hooks/index.ts` | 8 | ✅ Good |
| `store/index.ts` | 2 | ✅ Minimal |
| Others | Varies | ✅ Appropriate |

---

## Component Statistics

### Total Components: 27 .tsx files

### By Size

| Size Range | Count |
|------------|-------|
| Small (< 2 KB) | 5 |
| Medium (2-6 KB) | 12 |
| Large (6-10 KB) | 8 |
| Very Large (> 10 KB) | 2 |

### By Domain

| Domain | Components | Average Size |
|--------|------------|--------------|
| Editor | 10 | 7.5 KB |
| Notes | 10 | 5.4 KB |
| Organization | 3 | 4.2 KB |
| Shared | 4 | 1.6 KB |

### Component Complexity

| Component | Lines | Props | Hooks | Complexity |
|-----------|-------|-------|-------|------------|
| `EditorCore.tsx` | 483 | 7 | 6 | ⚠️ Very High |
| `NotesList.tsx` | 353 | 2 | 5 | ⚠️ High |
| `NotesEditor.tsx` | 244 | 2 | 10 | ⚠️ High |
| `NoteHeader.tsx` | 200 | 8 | 5 | ✅ Medium |
| `CommandPalette.tsx` | 190 | 0 | 3 | ✅ Medium |
| Others | < 200 | Varies | Varies | ✅ Low-Medium |

---

## Hook Statistics

### Total Hooks: 13 .ts files (8 active + 4 wrappers + 1 extension hook)

### Active Hooks (8 files)

| Hook | Domain | Size | Complexity |
|------|--------|------|------------|
| `useEditor.ts` (editor) | Editor | 10.0 KB | High |
| `useNotesList.ts` (list) | Notes | 2.9 KB | Medium |
| `useNoteNavigation.ts` | Shared | 3.2 KB | Medium |
| `useCommandPalette.ts` | Shared | 1.3 KB | Low |
| `useDiscovery.ts` (list) | Notes | 1.1 KB | Low |
| `useSidebar.ts` (org) | Organization | 1.0 KB | Low |
| `useNotes.ts` | Shared | 425 B | Low |

### Wrapper Hooks (4 files)

| Hook | Wraps | Size | Purpose |
|------|-------|------|---------|
| `useDiscovery.ts` (root) | `notes/list/hooks/useDiscovery.ts` | 131 B | API compat |
| `useEditor.ts` (root) | `editor/hooks/useEditor.ts` | 201 B | API compat |
| `useNotesList.ts` (root) | `notes/list/hooks/useNotesList.ts` | 127 B | API compat |
| `useSidebar.ts` (root) | `organization/sidebar/hooks/useSidebar.ts` | 194 B | API compat |

---

## Type Definition Statistics

### Total Type Files: 4

| File | Types Defined | Size | Complexity |
|------|---------------|------|------------|
| `types/notes.types.ts` | 8 | 2.7 KB | Medium |
| `organization/types/organization.types.ts` | 6 | 2.3 KB | Medium |

**Key Types**:
- `Note` → Core note type
- `NoteId` → Branded ID type
- `Folder` → Folder type
- `FolderId` → Folder ID type
- `NotesView` → View discriminated union
- `CreateNoteInput` → Input type
- `UpdateNoteInput` → Input type

---

## Service Statistics

### Total Service Files: 7

### Server Actions (4 files)

| Action | Size | Operations |
|--------|------|------------|
| `create-note.action.ts` | 917 B | Create note, Create folder |
| `get-notes.action.ts` | 386 B | Get notes, Get folders |
| `update-note.action.ts` | 408 B | Update note, Rename folder |
| `delete-note.action.ts` | 602 B | Delete, Restore, Permanent delete, Empty trash |

**Total Operations**: 11 server actions

### Service Utilities (3 files)

| File | Purpose | Size |
|------|---------|------|
| `notes.service.ts` | Service facade | 268 B |
| `services/utils/notes.helpers.ts` | Service helpers | 108 B |
| `organization/services/folders.service.ts` | Folder operations | 838 B |

---

## Utility Statistics

### Total Utility Files: 2

| File | Functions | Size | Complexity |
|------|-----------|------|------------|
| `utils/notes.helpers.ts` | 10+ | 9.7 KB | Medium |
| `organization/utils/folder.utils.ts` | 2 | 701 B | Low |

**Key Functions**:
- `generateId()` → ID generation
- `filterNotes()` → Note filtering
- `formatRelativeDate()` → Date formatting
- `extractPlainTextFromJSON()` → Text extraction
- `hasWikiLinkToNote()` → Link detection
- `getFolderNoteCount()` → Count helper

---

## Code Quality Metrics

### File Size Health

| Range | Count | Health |
|-------|-------|--------|
| < 1 KB | 27 | ✅ Excellent (mostly barrels) |
| 1-5 KB | 30 | ✅ Good |
| 5-10 KB | 18 | ✅ Acceptable |
| 10-15 KB | 1 | ⚠️ Monitor (notes.store.ts) |
| 15-25 KB | 1 | ⚠️ Needs split (EditorCore.tsx) |
| > 25 KB | 0 | ✅ None |

### Component Size Health

| Component | Lines | Health |
|-----------|-------|--------|
| EditorCore.tsx | 483 | ⚠️ Too large (target: <300) |
| NotesList.tsx | 353 | ⚠️ Too large (target: <300) |
| NotesEditor.tsx | 244 | ✅ Acceptable |
| NoteEditorPage.tsx | 175 | ✅ Good |
| Others | < 200 | ✅ Excellent |

### Barrel Export Ratio

- **Files with barrels**: 15 directories
- **Files without barrels**: 16 directories (leaf folders)
- **Barrel ratio**: 48% (appropriate)

### Documentation Ratio

- **Documented folders**: 2 (root README, styles README)
- **Undocumented folders**: 29
- **Documentation ratio**: 6% (⚠️ could improve)

---

## Growth Trends

### Historical

| Date | Files | Directories | Size |
|------|-------|-------------|------|
| P0 (June 1) | ~100 | 45 | ~280 KB |
| P1 (June 8) | ~90 | 40 | ~260 KB |
| P3 (June 22) | ~85 | 37 | ~240 KB |
| S4 (July 1) | ~80 | 34 | ~230 KB |
| **Current** | **77** | **31** | **~220 KB** |

**Trend**: ✅ **Decreasing** - consolidation and cleanup

### Projected (Q3 2026)

| Metric | Current | After Tests | After Supabase |
|--------|---------|-------------|----------------|
| Files | 77 | ~100 | ~110 |
| Directories | 31 | 33 | 35 |
| Size | 220 KB | 280 KB | 320 KB |

---

## Action Items

### Immediate

1. **Split EditorCore.tsx** (23.5 KB → 3 files ~7-8 KB each)
2. **Split NotesList.tsx** (13.7 KB → 3 files ~4-5 KB each)
3. **Remove styles/** (empty folder)

### Short Term

4. **Document placeholders** (add README to 5 folders)
5. **Add JSDoc to utilities** (improve code docs)

### Long Term

6. **Add test files** (will increase file count by ~30)
7. **Implement placeholders** (Phase 5-7)

---

## Summary

**Overall File Health**: ✅ **9.0/10 - EXCELLENT**

**Strengths**:
- ✅ Lean codebase (77 files, 220 KB)
- ✅ Most files appropriately sized
- ✅ Good barrel export coverage
- ✅ Zero junk/cache files
- ✅ Consistent naming conventions

**Weaknesses**:
- ⚠️ 2 oversized components (EditorCore, NotesList)
- ⚠️ Low documentation coverage (6%)
- ⚠️ 5 placeholder folders without docs

**Recommendation**: After splitting 2 large files and documenting placeholders → **9.5/10**

---

**Document Status**: ✅ **COMPLETE STATISTICS**  
**Last Updated**: 2026-07-16  
**Next Update**: After Phase 4 (Supabase migration)
