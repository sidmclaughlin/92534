const prettierConfig = require('./.prettierrc');

module.exports = {
  root: true,
  extends: ['@bcgov-elmsd/eslint-config'],
  parserOptions: { project: 'tsconfig.json', tsconfigRootDir: __dirname, sourceType: 'module' },
  rules: {
    'prettier/prettier': ['error', prettierConfig],
    '@typescript-eslint/no-shadow': 'off',
    camelcase: 'off',
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/vite.config.ts', '**/*.e2e-spec.ts', '**/*.spec.ts'] },
    ],
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'max-classes-per-file': 'off',
    'no-return-await': 'off',
    'no-underscore-dangle': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
  },
  ignorePatterns: ['**/dist/**/*.js'],
};
