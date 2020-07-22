module.exports = {
  root: true,
  env: {
    'browser': true,
    'node': true,
    'jasmine': true,
    'jest': true,
    'es6': true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    'standard'
  ],
  'parserOptions': {
    'parser': 'babel-eslint'
  },
  'plugins': [],
  rules: {
    // no 规则
    'no-debugger': 'error',
    'no-extra-boolean-cast': 'off',
    'no-var': 'error',
    'no-console': ["error", { allow: ["error", "log", "warn"] }],
    'no-undef': 'off',
  
    // 格式化规则
    // 格式化不加分号
    'semi': ['warn', 'never'],
    // 格式化为单引号
    quotes: ['warn', 'single'],
    'comma-spacing': ['warn', { 'before': false, 'after': true }],
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'camelcase': 'off',
    eqeqeq: ["error", "smart"],
    'comma-dangle': ['error', {
      'arrays': 'never',
      'objects': 'always',
      'imports': 'always',
      'exports': 'always',
      'functions': 'never',
    }],
  
    // vue 规则
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-reserved-keys': 'off',
    'vue/prop-name-casing': 'off',
    'vue/max-attributes-per-line': [
      2,
      {
        'singleline': 20,
        'multiline': {
          'max': 1,
          'allowFirstLine': false
        }
      }
    ],
    'vue/this-in-template': 'off'
  },
}
