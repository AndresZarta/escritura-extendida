// eslint.config.js (flat)
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  { ignores: ['node_modules/','.astro/','dist/','public/','.cache/','*.log'] },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,                // or .recommendedTypeChecked (see below)
  ...eslintPluginAstro.configs.recommended,

  {
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',               // OK to keep for type-aware rules
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Astro files — DO NOT pass a TS "project" here
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: eslintPluginAstro.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],          // key fix
        // no "project" here
      },
    },
  },
];
