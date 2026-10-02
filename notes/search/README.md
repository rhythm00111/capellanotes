# Search Features Module

**Status**: Reserved Namespace  
**Owner**: Search Team (Future)  
**Timeline**: Phase 5 (Q3 2026)

---

## Purpose

This directory is reserved for advanced search functionality that extends beyond the basic search currently implemented in the NotesHeader component.

---

## Planned Features

### 1. Fuzzy Search
- Typo tolerance
- Phonetic matching
- Relevance scoring
- Match highlighting

### 2. Full-Text Search
- Content-based search (not just titles)
- Search within note bodies
- Search in specific fields
- Boolean operators (AND, OR, NOT)

### 3. Advanced Filters
- Date range filters
- Tag-based queries
- Folder scoping
- Author filtering (for collaboration)

### 4. Search History
- Recent searches
- Saved searches
- Search suggestions
- Popular queries

---

## Architecture

The search module will integrate with:
- **Store**: Search index management
- **Services**: Search API layer
- **Notes Domain**: Search results UI
- **Editor Domain**: In-note search (Cmd+F)

---

## Technical Implementation

### Search Engine Options
1. **Client-side**: Fuse.js for fuzzy search (< 5000 notes)
2. **Server-side**: PostgreSQL full-text search (> 5000 notes)
3. **Hybrid**: Client fuzzy + server full-text

### Current Basic Search
Located in: `notes/list/components/NotesHeader.tsx`
- Simple substring matching
- Searches note titles only
- 150ms debounce
- Works inline with list rendering

---

## Migration Path

### Phase 5 Implementation Steps

1. **Extract search logic** from NotesHeader
2. **Implement fuzzy search** with Fuse.js
3. **Add full-text indexing** in Supabase
4. **Create search service** layer
5. **Build advanced search UI** components
6. **Add search history** tracking

---

## Extension Points

Future search features should:
- ✅ Maintain the current simple search as fallback
- ✅ Support both client and server search
- ✅ Index content asynchronously
- ✅ Respect folder permissions
- ✅ Work offline (client-side index)

---

## What Does NOT Belong Here

- ❌ AI-powered semantic search → Use `ai/`
- ❌ Basic title search → Already in NotesHeader
- ❌ Wiki link suggestions → Already in `editor/extensions/WikiLink`
- ❌ Command palette → Already in `hooks/useCommandPalette`

---

## Current Implementation

Basic search implemented in:
- `notes/list/components/NotesHeader.tsx` (search input UI)
- `store/notes.store.ts` (searchQuery state)
- `store/notes.selectors.ts` (filterNotes logic)
- `utils/notes.helpers.ts` (filterNotes implementation)

**Entry Point**: `index.ts` (placeholder barrel export)

---

## Dependencies

Requires:
- Phase 4 completion (Supabase for server-side search)
- Consider AI features (Phase 6) for semantic search
