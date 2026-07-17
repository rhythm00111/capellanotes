# Providers Module

**Status**: Reserved Namespace  
**Owner**: Notes Feature Team  
**Timeline**: As Needed

---

## Purpose

This directory is reserved for React Context providers that manage cross-cutting concerns not handled by the Zustand store.

---

## When to Add Providers

Add a provider here when you need:

### 1. Non-State Context
- Theme/appearance settings (if not in global context)
- Feature flags
- User preferences
- Keyboard shortcuts registry

### 2. Third-Party Integrations
- Analytics provider wrappers
- Error tracking context
- Feature tour/onboarding state
- A/B testing context

### 3. Runtime Configuration
- Editor configuration provider
- Markdown rendering options
- Syntax highlighting themes
- Localization/i18n context

---

## What Should NOT Be Providers

The following should use **Zustand store** instead:
- ❌ Note data (already in `store/notes.store.ts`)
- ❌ Folder organization (already in store)
- ❌ UI state that affects data (search, filters, etc.)
- ❌ User actions and mutations

---

## Current Provider

### NotesProvider

Location: `../NotesProvider.tsx` (feature root)

Current implementation: Minimal passthrough wrapper

```typescript
export function NotesProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

**Status**: Placeholder for future initialization logic

**Potential Future Use**:
- Store initialization
- Feature flag checks
- Analytics setup
- Error boundary setup

---

## Architecture Guidelines

### Provider Hierarchy

```
App
└── NotesProvider (feature root)
    ├── [ThemeProvider] (if needed)
    ├── [KeyboardProvider] (if needed)
    └── Notes UI Tree
```

### Rules

1. **Avoid Provider Hell**
   - Maximum 3 providers in this module
   - Compose related concerns into single provider
   - Use hooks for isolated concerns

2. **Performance**
   - Split providers by update frequency
   - Memoize context values
   - Use selector patterns for subscriptions

3. **Testing**
   - All providers must have mock versions
   - Context consumers must be testable without full tree

---

## Example: When to Add a Provider

### ✅ Good Use Case

```typescript
// Keyboard shortcuts configuration
export function KeyboardShortcutsProvider({ children }) {
  const shortcuts = useKeyboardShortcuts();
  return (
    <KeyboardContext.Provider value={shortcuts}>
      {children}
    </KeyboardContext.Provider>
  );
}
```

### ❌ Bad Use Case (Use Store Instead)

```typescript
// This belongs in Zustand store
export function NotesDataProvider({ children }) {
  const [notes, setNotes] = useState([]);
  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  );
}
```

---

## Integration with Store

Providers can **read** from the store, but should not **write** to it:

```typescript
// ✅ Good - Reading from store in provider
export function FeatureFlagProvider({ children }) {
  const user = useNotesStore((s) => s.user);
  const flags = useFeatureFlags(user);
  return <FlagContext.Provider value={flags}>{children}</FlagContext.Provider>;
}

// ❌ Bad - Writing to store from provider
// Use store actions directly instead
```

---

## Current Implementation

Minimal placeholder at feature root: `../NotesProvider.tsx`

**Entry Point**: `index.ts` (placeholder barrel export)

---

## When to Expand This Module

Add providers here when:
- ✅ Feature complexity requires cross-cutting config
- ✅ Third-party libraries need React context
- ✅ Runtime settings affect multiple domains
- ✅ Context is read-heavy, write-light

**Do not** add providers prematurely. Most state belongs in Zustand.
