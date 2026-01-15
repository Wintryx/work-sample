// // @ts-check
// const eslint = require("@eslint/js");
// const { defineConfig } = require("eslint/config");
// const tseslint = require("typescript-eslint");
// const angular = require("angular-eslint");
//
// module.exports = defineConfig([
//   {
//     files: ["**/*.ts"],
//     extends: [
//       eslint.configs.recommended,
//       tseslint.configs.recommended,
//       tseslint.configs.stylistic,
//       angular.configs.tsRecommended,
//     ],
//     processor: angular.processInlineTemplates,
//     rules: {
//       "@angular-eslint/directive-selector": [
//         "error",
//         {
//           type: "attribute",
//           prefix: "app",
//           style: "camelCase",
//         },
//       ],
//       "@angular-eslint/component-selector": [
//         "error",
//         {
//           type: "element",
//           prefix: "app",
//           style: "kebab-case",
//         },
//       ],
//     },
//   },
//   {
//     files: ["**/*.html"],
//     extends: [
//       angular.configs.templateRecommended,
//       angular.configs.templateAccessibility,
//     ],
//     rules: {},
//   }
// ]);


// @ts-check
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-config-prettier"); // Added this

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      ...angular.configs.tsRecommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      prettier, // Added at the end to disable conflicting rules
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": ["error", { type: "attribute", prefix: "app", style: "camelCase" }],
      "@angular-eslint/component-selector": ["error", { type: "element", prefix: "app", style: "kebab-case" }],
      // Senior Rule: Enforce OnPush for better performance
      "@angular-eslint/prefer-on-push-component-change-detection": "error"
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettier, // Added here too
    ],
    rules: {},
  }
);
