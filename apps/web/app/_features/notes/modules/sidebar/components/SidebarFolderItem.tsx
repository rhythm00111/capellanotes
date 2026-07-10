// Thin re-export to canonical components/sidebar to remove duplicate implementations.
/**
 * Module-level shim — forward through the stable module barrel.
 * Non-destructive; canonical implementation remains in `components/sidebar`.
 */
// Forward to canonical components/sidebar implementation to avoid reciprocal shims
export * from '@features/notes/components/sidebar';
