/* eslint-env node */
module.exports = {
  extends: [require.resolve('eslint-config-fusion')], 
  rules: {
    "graphql/template-strings": ['error', {
      env: 'apollo',
      schemaJson: require('./.graphql/schema.json'),
    }]
  },
  plugins: [
    'graphql'
  ]
};
