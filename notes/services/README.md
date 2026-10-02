# Services Layer — Notes CRUD Operations

**Owner:** Notes Feature Team  
**Status:** Frontend-Only Implementation (In-Memory Store)

---

## Architecture Overview

The services layer provides the contract between the frontend (Zustand store) and data persistence. Currently implemented as **frontend-only with mock data** for development and testing.

```
┌─────────────────────────────────────────────────────────────┐
│  Zustand Store (notes.store.ts)                             │
│  - Optimistic updates                                       │
│  - Client-side state management                             │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ calls server actions
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Server Actions (actions/*.action.ts)                       │
│  - Marked with 'use server'                                 │
│  - Currently: in-memory simulation (50ms delay)             │
│  - Future: Real database operations                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ (dev only)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Mock Data (mock/notes.mock.ts)                             │
│  - USE_MOCK_DATA flag (NODE_ENV === 'development')          │
│  - Sample notes and folders for UI development              │
│  - Not used in server actions for mutations                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Current Implementation Status

### ✅ Implemented (Frontend-Only)

All CRUD operations are **client-side only** via Zustand store:

- **Create:** Notes and folders created with optimistic IDs
- **Read:** Initial load from mock data, then in-memory store
- **Update:** Optimistic updates in Zustand store
- **Delete:** Soft delete (isDeleted flag) in store
- **Restore:** Toggle isDeleted flag back to false
- **Permanent Delete:** Remove from store array
- **Empty Trash:** Filter out all deleted notes

### Server Actions (No-Op for Mutations)

Located in `actions/*.action.ts`:

```typescript
// actions/create-note.action.ts
export async function createNoteAction(input: CreateNoteInput): Promise<Note>

// actions/get-notes.action.ts
export async function getNotesAction(): Promise<Note[]>
export async function getFoldersAction(): Promise<Folder[]>

// actions/update-note.action.ts
export async function updateNoteAction(id: string, updates: UpdateNoteInput): Promise<void>
export async function renameFolderAction(id: string, newName: string): Promise<void>

// actions/delete-note.action.ts
export async function deleteNoteAction(id: string): Promise<void>
export async function restoreNoteAction(id: string): Promise<void>
export async function permanentDeleteNoteAction(id: string): Promise<void>
export async function emptyTrashAction(): Promise<void>
export async function deleteFolderAction(id: string): Promise<void>
```

**Current Behavior:**
- All mutations: 50ms simulated delay, then no-op
- Read operations: Return mock data if `USE_MOCK_DATA === true`
- Store holds all state; server actions are placeholders

---

## Mock Data System

### Purpose

`mock/notes.mock.ts` provides sample data for:
- UI development and testing
- Visual design verification
- Interaction flow validation
- Demo/preview environments

### What's Included

**11 Demo Notes:**
- Work folder: Q4 planning, architecture review, onboarding checklist
- Personal folder: Reading list, workout routine
- Ideas folder: App features, blog post ideas
- Projects folder: Capella Notes roadmap
- Inbox: Quick thoughts, draft notes
- Trash: Old project notes (soft-deleted)

**4 Demo Folders:**
- Work (blue)
- Personal (purple)
- Ideas (amber)
- Projects (green)

### Flag: USE_MOCK_DATA

```typescript
export const USE_MOCK_DATA = process.env.NODE_ENV === 'development';
```

**In Development:**
- `getNotesAction()` returns mock notes
- `getFoldersAction()` returns mock folders + ALL_NOTES virtual folder
- Store initializes with demo content

**In Production:**
- Mock data disabled
- Server actions would connect to real backend
- Store starts empty or loads from API

### Important Notes

🔴 **Mock data is READ-ONLY in server actions**
- Mutations (create, update, delete) do NOT modify mock arrays
- Store is the source of truth after initial load
- Mock data only provides initial seed

✅ **Store is the runtime source of truth**
- All mutations happen in Zustand store
- Optimistic updates for instant UI feedback
- Server actions fire in background (currently no-op)

---

## Migration Path: Frontend → Full Stack

### Step 1: Add Database Schema

Create schema for:
- `notes` table (id, title, content, folderId, createdAt, updatedAt, isDeleted, isPinned, tags)
- `folders` table (id, name, color, createdAt)

### Step 2: Implement Server Actions

Replace no-op implementations with real database queries:

```typescript
// actions/create-note.action.ts
'use server';
import { db } from '@/lib/db';

export async function createNoteAction(input: CreateNoteInput): Promise<Note> {
  // Insert into database
  const note = await db.notes.create({
    data: {
      title: input.title,
      content: input.content,
      folderId: input.folderId,
      // ...
    },
  });
  return note;
}
```

### Step 3: Update Store Reconciliation

Store already handles optimistic updates correctly:
- Creates optimistic note with temp ID
- Fires server action in background
- Reconciles when server responds with real ID

No changes needed to store logic — it's already designed for async backend.

### Step 4: Remove Mock Data

1. Set `USE_MOCK_DATA = false` in production
2. Keep mock data for tests and local development
3. Update `getNotesAction()` to query database instead

### Step 5: Add Authentication

Server actions will need user context:
```typescript
export async function getNotesAction(): Promise<Note[]> {
  const session = await getServerSession();
  return db.notes.findMany({ where: { userId: session.user.id } });
}
```

---

## Testing Strategy

### Current (Frontend-Only)

- **Unit tests:** Test store mutations in isolation
- **Integration tests:** Test UI → store → UI flow
- **E2E tests:** Use mock data for predictable scenarios

### Future (With Backend)

- **Unit tests:** Mock database calls in server actions
- **Integration tests:** Use test database
- **E2E tests:** Seed test data, verify persistence

---

## File Organization

```
services/
├── index.ts                      # Public API (barrel export)
├── README.md                     # This file
│
├── actions/                      # Server actions ('use server')
│   ├── create-note.action.ts    # Create notes/folders
│   ├── get-notes.action.ts      # Read notes/folders (uses mock in dev)
│   ├── update-note.action.ts    # Update notes/folders
│   └── delete-note.action.ts    # Delete/restore/empty trash
│
└── mock/                         # Development-only demo data
    ├── index.ts                  # Mock data exports
    └── notes.mock.ts             # Sample notes and folders
```

---

## Best Practices

### ✅ Do

- Use mock data for UI development and demos
- Write server actions with real database logic in mind
- Keep store as source of truth for runtime state
- Test optimistic updates thoroughly

### ❌ Don't

- Don't modify MOCK_NOTES/MOCK_FOLDERS arrays (they're read-only seeds)
- Don't put business logic in server actions (keep them thin)
- Don't assume mock data structure matches final database schema
- Don't commit real user data to mock files

---

## Summary

**Current State:** Frontend-only notes app with in-memory store and demo data  
**Server Actions:** Placeholder implementations (50ms delays, no persistence)  
**Mock Data:** Development-time seed data, not modified by mutations  
**Source of Truth:** Zustand store holds all runtime state  
**Migration Ready:** Architecture supports adding real backend without store changes
