# Repository Map

## Root structure
```text
capella-notes/
├── apps/
│   └── web/
│       └── app/
│           └── _features/
│               └── notes/
├── src/
│   └── app/
│       ├── dashboard/
│       │   └── notes/
│       └── page.tsx
├── components.json
├── eslint.config.js
├── next.config.mjs
├── package.json
├── playwright.config.ts
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── docs/
    └── architecture/
```

## Notes feature tree
```text
apps/web/app/_features/notes/
├── actions/
├── components/
├── constants/
├── hooks/
├── lib/
├── modules/
├── services/
├── state/
├── store/
├── types/
├── utils/
├── AUDIT.md
├── P0_OWNERSHIP.md
├── README.md
├── index.ts
```

## App route tree
```text
src/app/
├── dashboard/
│   └── notes/
│       ├── layout.tsx
│       ├── page.tsx
│       └── [noteId]/page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

## Shared UI tree
```text
src/components/ui/
├── button.tsx
├── context-menu.tsx
├── dialog.tsx
├── input.tsx
├── scroll-area.tsx
├── toast.tsx
├── toaster.tsx
```

## Shared utilities
```text
src/lib/
├── routes.ts
└── utils.ts
```

## Feature boundaries
- The main runtime feature boundary is the notes feature module under `apps/web/app/_features/notes`.
- Route composition is handled under `src/app/dashboard/notes`.
- Shared UI and route helpers exist outside the feature and are consumed by it.

## Entry points
- Feature barrel: `apps/web/app/_features/notes/index.ts`
- App route root: `src/app/page.tsx`
- Notes list route: `src/app/dashboard/notes/page.tsx`
- Note editor route: `src/app/dashboard/notes/[noteId]/page.tsx`

## Public APIs
- Feature-level exports are exposed from `apps/web/app/_features/notes/index.ts`.
- Shared app-level helpers are exposed from `src/lib/routes.ts` and `src/lib/utils.ts`.

## Internal modules
- Editor module: `apps/web/app/_features/notes/modules/editor`
- List module: `apps/web/app/_features/notes/modules/list`
- Sidebar module: `apps/web/app/_features/notes/modules/sidebar`

## External dependencies
- Next.js
- React
- Zustand
- TipTap
- Radix UI
- Tailwind CSS
- Playwright
- TypeScript
- ESLint
