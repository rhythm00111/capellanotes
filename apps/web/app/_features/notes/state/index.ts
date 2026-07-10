// DEPRECATION / COMPATIBILITY SHIM — READ BEFORE EDITING
// This file is a compatibility barrel kept for backward compatibility.
// The canonical state implementation lives at `apps/web/app/_features/notes/store/`.
// Preferred import surfaces:
//  - `@features/notes` (preferred feature barrel)
//  - `@features/notes/store` (direct canonical store)
// DO NOT add new implementation code here. This file will be removed in a later
// migration phase (P1). Use it only as a temporary compatibility layer.
// State barrel: re-export the store and selectors from the compatibility layer
export * from './notes.store';
export * from './notes.selectors';
export * from '../types/notes.types';
