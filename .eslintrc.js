module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true,
    commonjs: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
  rules: {
    '@typescript-eslint/no-var-requires': 1,
    '@typescript-eslint/ban-ts-comment': 1,
    '@typescript-eslint/no-empty-function': 1,
  },
  globals: {
    // axios
    axios: true,
    // lodash
    _: true,
    // jquery
    $: true,
  },
};
