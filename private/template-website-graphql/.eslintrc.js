/* eslint-env node */
module.exports = {
  extends: [require.resolve('eslint-config-fusion')], 
  rules: {
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaJson: require('./.graphql/schema.json')
      }
    ],
    'baseui/deprecated-theme-api': 'warn',
    'baseui/deprecated-component-api': 'warn',
    'baseui/no-deep-imports': 'warn'
  },
  plugins: [
    'graphql',
    'baseui'
  ]
};
