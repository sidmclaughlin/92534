const prettierConfig = require('./.prettierrc');

module.exports = {
  root: true,
  extends: ['@bcgov-elmsd/eslint-config'],
  parserOptions: { project: 'tsconfig.json', tsconfigRootDir: __dirname, sourceType: 'module' },
  rules: {
    'prettier/prettier': ['error', prettierConfig],
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/vite.config.ts', '**/*.e2e-spec.ts', '**/*.spec.ts'] },
    ],
    'import/prefer-default-export': 'off',
  },
  ignorePatterns: ['**/dist/**/*.js'],
};
