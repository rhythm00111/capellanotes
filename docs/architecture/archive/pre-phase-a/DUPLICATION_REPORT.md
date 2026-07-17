# Duplication Report

## Duplicate implementations
The most obvious duplication is the overlap between:
- `apps/web/app/_features/notes/components`
- `apps/web/app/_features/notes/modules`

These layers both contain UI and feature-facing implementations. This creates ambiguity about which surface is canonical.

## Compatibility shims
The repository explicitly contains compatibility shims in:
- `apps/web/app/_features/notes/state/index.ts`
- `apps/web/app/_features/notes/state/notes.store.ts`
- `apps/web/app/_features/notes/state/notes.selectors.ts`
- `apps/web/app/_features/notes/utils/notes.helpers.ts`
- `apps/web/app/_features/notes/components/index.ts`
- `apps/web/app/_features/notes/components/editor/index.ts`

These files are clearly intended as migration scaffolding, but they also create multiple sources of truth.

## Legacy folders
The older component-oriented surfaces appear to be legacy wrappers around the canonical module implementations. They are not fully obsolete, because some imports still rely on them, but the architecture is less clean than it should be.

## Multiple sources of truth
The main multiple-source-of-truth issues are:
- state vs store
- components vs modules
- lib vs utils
- feature barrel vs deep imports

## Duplicate hooks
Some hook responsibilities are duplicated conceptually through both feature hooks and module-local hooks. The implementation is not entirely redundant, but the boundaries are not sharply enforced.

## Duplicate state
The store and compatibility state re-exports create duplicate entry points for the same Zustand store. This is a structural duplication problem.

## Duplicate services
The service layer exists, but the actions layer is also a mutation surface. The service façade is thin and currently does not yet provide a meaningful second source of truth.

## Duplicate utilities
The helper utilities appear in both `lib/notes.helpers.ts` and `utils/notes.helpers.ts`. This is a clear duplication risk.

## Duplicate components
There is overlap between the legacy component surface and the module implementation surface. Some components are effectively re-export wrappers, while the implementations are elsewhere.

## Duplication conclusion
The repository is not suffering from accidental duplication alone; it is also suffering from intentional compatibility duplication. This is common during migration, but it is a real architectural burden for future work.
