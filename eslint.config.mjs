import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import expoConfig from 'eslint-config-expo/flat.js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/.expo/**',
    '**/coverage/**',
    '**/dist/**',
    '**/build/**',
  ]),
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [eslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['apps/mobile/**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    extends: [expoConfig],
    settings: {
      'import/resolver': {
        typescript: {
          project: './apps/mobile/tsconfig.json',
        },
      },
    },
    rules: {
      'import/no-unresolved': ['error', { ignore: ['^@/global\\.css$'] }],
    },
  },
  {
    files: [
      'apps/mobile/src/{features,ui,theme,api,storage,services,config,providers}/**/*.{ts,tsx}',
    ],
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../**'],
              message:
                'Use the @/ alias when importing across ownership boundaries.',
            },
          ],
          paths: [
            {
              name: 'react',
              importNames: ['FC'],
              message:
                'Declare component props with a type and avoid React.FC.',
            },
            {
              name: 'react-native',
              importNames: ['StyleSheet'],
              message: 'Use React Native Unistyles for application styling.',
            },
            {
              name: 'styled-components',
              message: 'Use React Native Unistyles for application styling.',
            },
            {
              name: 'styled-components/native',
              message: 'Use React Native Unistyles for application styling.',
            },
            {
              name: 'nativewind',
              message: 'Use React Native Unistyles for application styling.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "TSTypeReference[typeName.object.name='React'][typeName.property.name='FC']",
          message: 'Declare component props with a type and avoid React.FC.',
        },
      ],
    },
  },
  {
    files: [
      'apps/mobile/src/features/*/{components,screens}/**/*.tsx',
      'apps/mobile/src/ui/components/**/*.tsx',
    ],
    rules: {
      'import/no-default-export': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
    },
  },
  {
    files: ['apps/mobile/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "TSTypeReference[typeName.object.name='React'][typeName.property.name='FC']",
          message: 'Declare component props with a type and avoid React.FC.',
        },
        {
          selector:
            "CallExpression[callee.name=/^(it|test)$/][arguments.0.type='Literal'][arguments.0.value=/\\bshould\\b/i]",
          message:
            'Write the test name as a natural continuation of it, without should.',
        },
      ],
    },
  },
  {
    files: ['apps/mobile/src/hooks/use-color-scheme.web.ts'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['apps/api/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
  {
    files: ['apps/api/**/*.spec.ts', 'apps/api/test/**/*.ts'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: globals.jest,
    },
  },
  eslintConfigPrettier,
]);
