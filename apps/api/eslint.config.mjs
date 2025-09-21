import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import prettierRecommended from "eslint-config-prettier";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
});

export default [
  tseslint.config(
    {
      ignores: ["eslint.config.mjs"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ),
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "prettier/prettier": "off",
    },
  },
];
