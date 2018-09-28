module.exports = {
  extends: [require.resolve('eslint-config-fusion')],
  env: {
    node: true,
  },
  rules: {
    'flowtype/require-valid-file-annotation': false,
  },
  globals: {
    test: true,
    expect: true,
    jest: true,
    beforeEach: true,
  },
};
