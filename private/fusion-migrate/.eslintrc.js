module.exports = {
  root: true,
  extends: [require.resolve('eslint-config-fusion')],
  env: {
    node: true,
  },
  rules: {
    'flowtype/require-valid-file-annotation': 0,
    'jest/no-disabled-tests': 0,
  },
  globals: {
    test: true,
    expect: true,
    jest: true,
    beforeEach: true,
  },
};
