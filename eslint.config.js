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
const boundaries = require("eslint-plugin-boundaries");
const prettier = require("eslint-config-prettier"); // Added this

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    plugins: { boundaries },
    extends: [
      ...angular.configs.tsRecommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      prettier, // Added at the end to disable conflicting rules
    ],
    processor: angular.processInlineTemplates,
    settings: {
      "boundaries/elements": [
        { type: "core", pattern: "src/app/core/**" },
        { type: "shared", pattern: "src/app/shared/**" },
        { type: "domain-model", pattern: "src/app/domains/*/domain/**", capture: ["domain"] },
        { type: "domain-app", pattern: "src/app/domains/*/application/**", capture: ["domain"] },
        { type: "domain-ui", pattern: "src/app/domains/*/presentation/**", capture: ["domain"] },
      ],
    },
    rules: {
      "@angular-eslint/directive-selector": ["error", { type: "attribute", prefix: "app", style: "camelCase" }],
      "@angular-eslint/component-selector": ["error", { type: "element", prefix: "app", style: "kebab-case" }],
      "@angular-eslint/prefer-on-push-component-change-detection": "error",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "boundaries/element-types": ["error", {
        "default": "disallow",
        "rules": [
          { "from": "core", "allow": ["core", "shared"] },
          { "from": "shared", "allow": ["shared"] },
          { "from": "domain-model", "allow": ["shared", ["domain-model", { "domain": "${from.domain}" }]] },
          { "from": "domain-app", "allow": ["shared", ["domain-model", { "domain": "${from.domain}" }], ["domain-app", { "domain": "${from.domain}" }]] },
          { "from": "domain-ui", "allow": ["shared", ["domain-model", { "domain": "${from.domain}" }], ["domain-app", { "domain": "${from.domain}" }], ["domain-ui", { "domain": "${from.domain}" }]] },
        ],
      }],
      "quotes": ["error", "double", { "avoidEscape": true,"allowTemplateLiterals": true }],
      "max-lines": ["error", {
        "max": 600,
        "skipBlankLines": true,
        "skipComments": true
      }],
    },
  },
  {
    files: ["src/app/**/*.ts"],
    ignores: ["src/app/domains/**"],
    rules: {
      "no-restricted-imports": ["error", {
        "patterns": [
          {
            "group": ["@domains/auth/**"],
            "message": "Use the @domains/auth barrel for cross-domain imports."
          },
          {
            "group": ["@domains/dashboard/**"],
            "message": "Use the @domains/dashboard barrel for cross-domain imports."
          },
          {
            "group": ["@domains/notifications/**"],
            "message": "Use the @domains/notifications barrel for cross-domain imports."
          },
          {
            "group": ["@domains/forms/**"],
            "message": "Use the @domains/forms barrel for cross-domain imports."
          }
        ]
      }],
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
