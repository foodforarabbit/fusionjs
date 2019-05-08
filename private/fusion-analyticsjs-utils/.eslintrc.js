module.exports = {
  root: true,
  extends: [require.resolve('eslint-config-fusion')],
  rules: {
    'flowtype/require-valid-file-annotation': 'never',
  },
};