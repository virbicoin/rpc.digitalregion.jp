import { dirname } from "path";
import { fileURLToPath } from "url";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  // グローバル設定
  {
    ignores: [
      "node_modules/",
      ".next/",
      "dist/",
      "coverage/",
      "build/",
      "public/",
      "docs/",
      "*.config.js",
      "*.config.mjs",
    ],
  },

  // TypeScript設定
  ...tseslint.configs.recommended,

  // プロジェクト全体に適用される設定
  {
    plugins: {
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      // 一般的なルール
      "no-console": "off", // console.logを許可
      "prefer-const": "error",
      "no-var": "error",

      // React固有のルール
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Next.js固有のルール
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
