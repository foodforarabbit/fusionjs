module.exports = {
  extends: [require.resolve('eslint-config-fusion')],
  env: {
    node: true,
  },
  rules: {
    'import/no-dynamic-require': 0,
  },
  globals: {
    test: true,
    expect: true,
  },
};
