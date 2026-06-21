import { defineConfig } from 'oxlint';
import typescript from 'oxlint-config-raccoon/typescript';

export default defineConfig({
  extends: [typescript],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  overrides: [
    {
      // `tester.run` from textlint-tester registers the test cases itself
      files: ['**/*.test.ts'],
      rules: {
        'vitest/require-hook': [
          'warn',
          { allowedFunctionCalls: ['tester.run'] },
        ],
      },
    },
  ],
  ignorePatterns: ['rules/*/*.js'],
});
