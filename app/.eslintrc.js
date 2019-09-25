module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },

  plugins: ['vue'],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': [2, 'never'],
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/block-spacing': 'error',
    'vue/brace-style': 'error',
    'vue/camelcase': 'error',
    'vue/comma-dangle': ['error', 'always-multiline'],
    'vue/component-name-in-template-casing': 'error',
    'vue/eqeqeq': 'error',
    'vue/key-spacing': 'error',
    'vue/match-component-file-name': 'error',
    'vue/object-curly-spacing': 'error',
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'array-bracket-spacing': ['error', 'never'],
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript',
    'prettier',
  ]
};
