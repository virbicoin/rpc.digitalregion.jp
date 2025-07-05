import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
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

  // Next.js推奨設定
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // プロジェクト全体に適用される設定
  {
    rules: {
      // 一般的なルール
      "no-console": "off", // console.logを許可
      "prefer-const": "error",
      "no-var": "error",

      // React固有のルール
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // Next.js固有のルール
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
    },
  },

  // TypeScript固有の設定
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "warn", // 警告レベルに変更
    },
  },
];

export default eslintConfig;
