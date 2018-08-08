module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    'jest/globals': true
  },
  extends: [
    'standard',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  plugins: [
    'jest'
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs'] }
    }
  },
  rules: {
    // Enforce import order
    'import/order': 2,

    // Imports first
    'import/first': 2,

    // Other import rules
    "import/no-mutable-exports": 2,

    // Allow unresolved imports
    'import/no-unresolved': 0,


    // Allow async-await
    'generator-star-spacing': 0,

    // Allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

    // Do not allow console.logs etc...
    'no-console': 2,
    'space-before-function-paren': [2, {
      anonymous: 'always',
      named: 'never'
    }]
  },

  globals: {}
}