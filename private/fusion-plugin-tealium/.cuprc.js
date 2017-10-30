module.exports = {
  babel: {
    plugins: process.env.NODE_ENV === 'test' ? [require.resolve('babel-plugin-istanbul')] : [require.resolve('babel-plugin-transform-flow-strip-types')],
  },
};
