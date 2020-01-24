/* eslint-env node */
module.exports = {
  extends: [require.resolve('eslint-config-fusion')],
  rules: {
    'baseui/deprecated-theme-api': 'warn',
    'baseui/deprecated-component-api': 'warn',
    'baseui/no-deep-imports': 'warn'
  },
  plugins: [
    'baseui'
  ]
};
