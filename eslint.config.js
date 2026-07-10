import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const base = tseslint.config(
  { ignores: ["dist", ".next", "node_modules", "out"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
);

// Restrict deep/compat imports FROM other features into the Notes feature internals.
const restrictExternalImports = tseslint.config(
  {},
  {
    // Apply import restrictions only to top-level app `src/` codepaths for now
    // (where cross-feature imports are most common). This avoids false
    // positives when linting the Notes feature itself.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "@features/notes/components/*",
            "@features/notes/state/*",
            "@features/notes/utils/*",
            "@features/notes/modules/*/components/*",
          ],
        },
      ],
    },
  }
);

// Inside the Notes feature, forbid imperative `useNotesStore.getState()` in non-React modules.
// NOTE: `modules/**` contains React hooks/components (initialization code) which
// are permitted to inject accessors for editor extensions. To avoid false
// positives we only target truly non-React folders here (lib/actions/services).
const notesInternalRestrictions = tseslint.config({}, {
  files: [
    "apps/web/app/_features/notes/lib/**",
    "apps/web/app/_features/notes/actions/**",
    "apps/web/app/_features/notes/services/**",
  ],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "CallExpression[callee.type='MemberExpression'][callee.object.name='useNotesStore'][callee.property.name='getState']",
        message:
          "Imperative 'useNotesStore.getState()' is forbidden in non-React modules. Inject accessors from React initialization layer or use selector hooks. See P0 ownership docs.",
      },
    ],
  },
});

const flatten = (c) => (Array.isArray(c) ? c : [c]);
export default [
  ...flatten(base),
  ...flatten(restrictExternalImports),
  ...flatten(notesInternalRestrictions),
];
