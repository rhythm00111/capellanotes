// COMPATIBILITY SHIM — helper utilities
// This file is a thin forwarding layer kept for backward compatibility.
// The canonical helper implementations live at `lib/notes.helpers.ts`.
// Prefer importing helpers from the feature barrel: `@features/notes`.
// This shim will be deprecated in P1; do not add new helper code here.
export * from '@features/notes/lib/notes.helpers';
