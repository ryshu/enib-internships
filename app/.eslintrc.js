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
    'space-before-function-paren': 'off',
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
    'vue/multiline-html-element-content-newline': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 4,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
    'vue/object-curly-spacing': ['error', 'always', { arraysInObjects: false }],
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
  ],
};
