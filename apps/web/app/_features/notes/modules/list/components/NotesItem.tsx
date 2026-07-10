/**
 * Module-level shim — forward through the stable module barrel.
 * Non-destructive; canonical implementation remains in `components/list`.
 */
// Forward to canonical components/list implementation to avoid reciprocal shims
export * from '@features/notes/components/list';
