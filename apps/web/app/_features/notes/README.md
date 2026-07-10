# Notes Feature — README

Summary
- The `notes` feature is production-ready and stabilized. This folder contains the feature barrel, UI components, module facades, TipTap editor integration, actions, and Zustand store.

Quick checks (local)
```bash
# Typecheck
npx tsc --noEmit

# Circular export check (madge)
npx madge --circular apps/web/app/_features/notes

# Run Playwright smoke tests
npx playwright test --config=e2e/playwright.config.ts
```

Where to import from
- Canonical UI: `@features/notes/components` or `@features/notes/components/<sub>`
- Module façade: `@features/notes/modules` or `@features/notes/modules/<module>`
- Feature barrel: `@features/notes` (exposes named namespaces)
- State canonical: `@features/notes/store` — use `@features/notes/state` only for compatibility if needed.

Questions and next steps
- See `ARCHITECTURE.md` and `COMPATIBILITY_SHIMS.md` for details.
# Notes Feature

**Type**: Self-Contained Embedded Feature  
**Status**: Merge-Ready

This module implements the Notes capability for Capella Pro. It is designed to be dropped into the Dashboard shell with zero internal coupling.

## Integration Contract

To render this feature, the parent container MUST satisfy:

1.  **Height Constraint**: `h-full` (100% height)
2.  **Flex Behavior**: `flex-1` (if in a flex column)
3.  **Overflow**: `overflow-hidden` (Feature manages its own scroll)

```tsx
// Example Usage
<div className="flex-1 h-full overflow-hidden">
  <NotesShell />
</div>
```

## Isolation Rules

- **State**: Owns all UI state via internal Zustand store.
- **Data**: Uses server actions (stubbed — Supabase layer planned for Phase 4).
- **Styles**: Uses standard app tokens (`globals.css`).
- **Dependencies**: NO imports from `(dashboard)` or other shell components.
