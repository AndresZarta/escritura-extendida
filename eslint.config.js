import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: [
      'node_modules/',
      '.astro/',
      'dist/',
      'public/',
      '.cache/',
      '*.log'
    ]
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript rules for .ts/.tsx files
  ...tseslint.configs.recommended,

  // Astro plugin recommended config
  ...eslintPluginAstro.configs.recommended,

  // Custom rules
  {
    rules: {
      'no-console': 'warn',
      // Require explicit return types on exported functions/handlers so CI fails
      // when a module boundary lacks type annotations. This enforces clearer API
      // contracts and complements the TypeScript compiler checks.
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // Optionally require explicit return types for non-exported functions as well.
      // Enable if you want stricter checking across the codebase.
      // '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }]
    }
  },

  // TypeScript-specific overrides
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    }
  },

  // Astro files
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: eslintPluginAstro.parser,
      parserOptions: {
        parser: tseslint.parser,
        project: './tsconfig.json'
      }
    }
  }
];
