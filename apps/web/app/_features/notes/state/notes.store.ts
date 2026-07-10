// COMPATIBILITY SHIM — re-export canonical store implementation
// This file forwards to the canonical implementation in `store/`.
// Prefer importing from `@features/notes` (feature barrel) or
// `@features/notes/store` (direct canonical store). Do not add
// implementation here — this is a temporary compatibility shim.
export * from '@features/notes/store/notes.store';
