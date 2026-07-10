/**
 * Compatibility forward — canonical source is in `@features/notes/components/sidebar`.
 *
 * This file is a thin, non-destructive re-export kept for backwards compatibility.
 * Prefer importing from `@features/notes/components/sidebar` (canonical) or
 * `@features/notes/modules/sidebar` (module surface) going forward.
 */
/**
 * Module-level shim — forward through the stable module barrel.
 * Non-destructive; canonical implementation remains in `components/sidebar`.
 */
// Forward to canonical components/sidebar implementation to avoid reciprocal shims
export * from '@features/notes/components/sidebar';

