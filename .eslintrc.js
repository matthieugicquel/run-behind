module.exports = {
  root: true,
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "simple-import-sort"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/ban-ts-comment": ["error", {"ts-expect-error": false}],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-unused-vars": ["error", {"ignoreRestSiblings": true, varsIgnorePattern: "_"}],
    "sort-imports": "off",
    "import/order": "off",
    "simple-import-sort/imports": "error",
  },
  settings: {
    node: {
      tryExtensions: [".js", ".ts"],
    },
  },
  ignorePatterns: [".eslintrc.js"],
};
